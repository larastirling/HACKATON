/**
 * Prueba de calidad de la IA: le pasa a la IA cada mail de la planilla de
 * prueba, compara lo que dice con la respuesta correcta y saca el
 * porcentaje de aciertos.
 *
 * La planilla (Google Sheets) tiene que tener en la primera fila los títulos
 * "Remitente", "Asunto" (opcional), "Texto" y "Esperado" (ESTAFA, DUDOSO o
 * LEGITIMO). Su link o ID va en Propiedades del script como PLANILLA_PRUEBA.
 * Usa clasificarConIA (clasificar-mail.gs).
 */

// Nombre de la hoja donde se escriben los resultados (se reescribe cada vez)
var HOJA_RESULTADOS = 'Resultados IA';

// Títulos aceptados para cada columna (se comparan sin mayúsculas ni tildes)
var TITULOS = {
  remitente: ['remitente', 'de', 'from'],
  asunto: ['asunto', 'subject'],
  texto: ['texto', 'cuerpo', 'contenido', 'texto del mail'],
  esperado: ['esperado', 'categoria', 'clasificacion', 'etiqueta', 'respuesta correcta', 'tipo']
};

/**
 * Pasa a minúsculas y saca las tildes, para comparar textos.
 */
function normalizar(texto) {
  return String(texto || '').toLowerCase().trim()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Convierte lo que dice la planilla ("Estafa", "legítimo"...) en ESTAFA, DUDOSO o LEGITIMO.
 */
function categoriaDePlanilla(valor) {
  var limpio = normalizar(valor);
  if (limpio.indexOf('estafa') === 0) return 'ESTAFA';
  if (limpio.indexOf('dudoso') === 0) return 'DUDOSO';
  if (limpio.indexOf('legitimo') === 0) return 'LEGITIMO';
  return null;
}

/**
 * Busca en qué columna está cada dato, según los títulos de la primera fila.
 */
function buscarColumnas(titulos) {
  var columnas = {};
  for (var dato in TITULOS) {
    for (var i = 0; i < titulos.length; i++) {
      if (TITULOS[dato].indexOf(normalizar(titulos[i])) !== -1) {
        columnas[dato] = i;
        break;
      }
    }
  }
  return columnas;
}

/**
 * Corre la prueba de calidad con toda la planilla y escribe los resultados
 * en la hoja "Resultados IA" de la misma planilla.
 */
function evaluarCalidad() {
  var dondeEsta = PropertiesService.getScriptProperties().getProperty('PLANILLA_PRUEBA');
  if (!dondeEsta) {
    throw new Error('Falta PLANILLA_PRUEBA en Propiedades del script (el link o el ID de la planilla).');
  }
  var planilla = dondeEsta.indexOf('http') === 0
    ? SpreadsheetApp.openByUrl(dondeEsta)
    : SpreadsheetApp.openById(dondeEsta);

  // Los mails de prueba están en la primera hoja
  var filas = planilla.getSheets()[0].getDataRange().getValues();
  var columnas = buscarColumnas(filas[0]);
  if (columnas.texto === undefined || columnas.esperado === undefined) {
    throw new Error('No encontré las columnas "Texto" y "Esperado" en la primera fila. Títulos que hay: ' +
      filas[0].join(', '));
  }

  var inicio = Date.now();
  var resultados = [];
  var total = 0, aciertos = 0, errores = 0;
  var estafasTotal = 0, estafasDetectadas = 0, legitimosTotal = 0, falsasAlarmas = 0;

  for (var f = 1; f < filas.length; f++) {
    var fila = filas[f];
    var texto = String(fila[columnas.texto] || '');
    if (!texto.trim()) continue; // fila vacía

    // Google corta en 6 minutos: frenamos antes y lo decimos
    if (Date.now() - inicio > 5 * 60 * 1000) {
      console.log('Se acabó el tiempo en la fila ' + (f + 1) + ': los resultados son parciales.');
      break;
    }

    var remitente = columnas.remitente !== undefined ? String(fila[columnas.remitente] || '') : '';
    var asunto = columnas.asunto !== undefined ? String(fila[columnas.asunto] || '') : '';
    var esperado = categoriaDePlanilla(fila[columnas.esperado]);
    if (!esperado) {
      console.log('Fila ' + (f + 1) + ': "Esperado" dice "' + fila[columnas.esperado] + '", no sé si es ESTAFA, DUDOSO o LEGITIMO. La salteo.');
      continue;
    }

    var dijo, motivo;
    try {
      var resultado = clasificarConIA(remitente, asunto, texto);
      dijo = resultado.categoria;
      motivo = resultado.motivo;
    } catch (error) {
      errores++;
      resultados.push([f + 1, remitente, asunto, esperado, 'ERROR', '', error.message]);
      console.log('Fila ' + (f + 1) + ': FALLÓ (' + error.message + ').');
      continue;
    }

    total++;
    var acerto = dijo === esperado;
    if (acerto) aciertos++;
    if (esperado === 'ESTAFA') {
      estafasTotal++;
      if (dijo === 'ESTAFA') estafasDetectadas++;
    }
    if (esperado === 'LEGITIMO') {
      legitimosTotal++;
      if (dijo === 'ESTAFA') falsasAlarmas++;
    }

    resultados.push([f + 1, remitente, asunto, esperado, dijo, acerto ? 'SÍ' : 'NO', motivo]);
    console.log('Fila ' + (f + 1) + ': esperado ' + esperado + ', la IA dijo ' + dijo + (acerto ? ' ✅' : ' ❌'));
  }

  var porcentaje = total > 0 ? Math.round(aciertos * 100 / total) : 0;
  var resumen = [
    ['Aciertos', aciertos + ' de ' + total + ' (' + porcentaje + '%)'],
    ['Estafas detectadas', estafasDetectadas + ' de ' + estafasTotal],
    ['Mails legítimos marcados como ESTAFA', falsasAlarmas + ' de ' + legitimosTotal],
    ['Mails que fallaron (no cuentan)', String(errores)],
    ['Fecha', Utilities.formatDate(new Date(), 'America/Montevideo', 'dd/MM/yyyy HH:mm')]
  ];

  escribirResultados(planilla, resumen, resultados);

  console.log(
    '\nRESULTADO: ' + aciertos + ' de ' + total + ' aciertos (' + porcentaje + '%).\n' +
    'Estafas detectadas: ' + estafasDetectadas + ' de ' + estafasTotal + '.\n' +
    'Mails legítimos marcados como ESTAFA: ' + falsasAlarmas + ' de ' + legitimosTotal + '.\n' +
    (errores ? 'Fallaron ' + errores + ' mails (no cuentan en el porcentaje).\n' : '') +
    'El detalle está en la hoja "' + HOJA_RESULTADOS + '" de la planilla.'
  );
}

/**
 * Escribe el resumen y el detalle en la hoja "Resultados IA" (la crea o la limpia).
 */
function escribirResultados(planilla, resumen, resultados) {
  var hoja = planilla.getSheetByName(HOJA_RESULTADOS) || planilla.insertSheet(HOJA_RESULTADOS);
  hoja.clear();

  hoja.getRange(1, 1, resumen.length, 2).setValues(resumen);
  hoja.getRange(1, 1, resumen.length, 1).setFontWeight('bold');

  var filaTitulos = resumen.length + 2;
  var titulos = [['Fila', 'Remitente', 'Asunto', 'Esperado', 'La IA dijo', '¿Acertó?', 'Motivo de la IA']];
  hoja.getRange(filaTitulos, 1, 1, titulos[0].length).setValues(titulos).setFontWeight('bold');

  if (resultados.length > 0) {
    hoja.getRange(filaTitulos + 1, 1, resultados.length, titulos[0].length).setValues(resultados);
    // Pintamos de verde los aciertos y de rojo los errores
    for (var i = 0; i < resultados.length; i++) {
      var color = resultados[i][5] === 'SÍ' ? '#d9ead3' : '#f4cccc';
      hoja.getRange(filaTitulos + 1 + i, 1, 1, titulos[0].length).setBackground(color);
    }
  }
  hoja.autoResizeColumns(1, 6);
}
