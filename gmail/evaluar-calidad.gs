/**
 * Prueba de calidad de la IA: le pasa a la IA cada mail de la planilla de
 * prueba, compara lo que dice con la respuesta correcta del equipo y saca
 * el porcentaje de aciertos.
 *
 * Planilla (link o ID en Propiedades del script como PLANILLA_PRUEBA), hoja
 * "Mails de prueba", con una fila de títulos que incluya "Remitente",
 * "Asunto", "Texto del mail", "Respuesta correcta (equipo)" y
 * "Respuesta de la IA". Usa clasificarConIA (clasificar-mail.gs).
 */

// Hoja con los mails de prueba (si no existe, se usa la primera)
var HOJA_PRUEBA = 'Mails de prueba';

// Hoja donde se escribe el resumen (se reescribe cada vez)
var HOJA_RESULTADOS = 'Resultados IA';

// Título de la columna nueva con el motivo de la IA
var TITULO_MOTIVO = 'Motivo de la IA';

/**
 * Pasa a minúsculas y saca tildes y signos, para comparar textos.
 */
function normalizar(texto) {
  return String(texto || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!]/g, '').trim();
}

/**
 * Convierte "ESTAFA", "Dudoso", "legítimo"... en ESTAFA, DUDOSO o LEGITIMO.
 */
function categoriaDePlanilla(valor) {
  var limpio = normalizar(valor);
  if (limpio.indexOf('estafa') === 0) return 'ESTAFA';
  if (limpio.indexOf('dudoso') === 0) return 'DUDOSO';
  if (limpio.indexOf('legitimo') === 0) return 'LEGITIMO';
  return null;
}

/**
 * Busca en qué columna está cada dato (empezando en 0), según los títulos.
 */
function buscarColumnas(titulos) {
  var columnas = {};
  for (var i = 0; i < titulos.length; i++) {
    var t = normalizar(titulos[i]);
    if (t.indexOf('remitente') === 0) columnas.remitente = i;
    else if (t.indexOf('asunto') === 0) columnas.asunto = i;
    else if (t.indexOf('texto') === 0) columnas.texto = i;
    else if (t.indexOf('respuesta correcta') === 0 || t === 'esperado') columnas.esperado = i;
    else if (t.indexOf('respuesta de la ia') === 0) columnas.iaDijo = i;
    else if (t === normalizar(TITULO_MOTIVO)) columnas.motivo = i;
  }
  return columnas;
}

/**
 * Busca la fila de títulos (la primera que tenga "Texto" y "Respuesta correcta").
 * Devuelve su número (empezando en 0) o -1.
 */
function buscarFilaDeTitulos(filas) {
  for (var f = 0; f < Math.min(filas.length, 15); f++) {
    var columnas = buscarColumnas(filas[f]);
    if (columnas.texto !== undefined && columnas.esperado !== undefined) {
      return f;
    }
  }
  return -1;
}

/**
 * Corre la prueba de calidad con toda la planilla. Escribe la respuesta de la
 * IA en "Respuesta de la IA", el motivo en la columna de al lado, y el
 * resumen en la hoja "Resultados IA".
 */
function evaluarCalidad() {
  var dondeEsta = PropertiesService.getScriptProperties().getProperty('PLANILLA_PRUEBA');
  if (!dondeEsta) {
    throw new Error('Falta PLANILLA_PRUEBA en Propiedades del script (el link o el ID de la planilla).');
  }
  var planilla = dondeEsta.indexOf('http') === 0
    ? SpreadsheetApp.openByUrl(dondeEsta)
    : SpreadsheetApp.openById(dondeEsta);
  var hoja = planilla.getSheetByName(HOJA_PRUEBA) || planilla.getSheets()[0];

  var filas = hoja.getDataRange().getValues();
  var filaTitulos = buscarFilaDeTitulos(filas);
  if (filaTitulos === -1) {
    throw new Error('No encontré la fila de títulos con "Texto del mail" y "Respuesta correcta" en la hoja "' +
      hoja.getName() + '".');
  }
  var columnas = buscarColumnas(filas[filaTitulos]);
  if (columnas.iaDijo === undefined) {
    throw new Error('No encontré la columna "Respuesta de la IA".');
  }

  // Si todavía no está la columna del motivo, la creamos al lado de "Respuesta de la IA".
  // Insertar una columna no borra las fórmulas: las de la derecha se corren un lugar.
  if (columnas.motivo === undefined) {
    hoja.insertColumnAfter(columnas.iaDijo + 1);
    hoja.getRange(filaTitulos + 1, columnas.iaDijo + 2).setValue(TITULO_MOTIVO).setFontWeight('bold');
    columnas.motivo = columnas.iaDijo + 1;
  }

  var inicio = Date.now();
  var detalle = [];
  var c = {
    total: 0, aciertos: 0, errores: 0,
    estafas: 0, estafasDetectadas: 0, estafasEscapadas: 0,
    estafaComoDudoso: 0, dudosoComoEstafa: 0,
    legitimos: 0, legitimosComoEstafa: 0,
    otras: 0
  };

  for (var f = filaTitulos + 1; f < filas.length; f++) {
    var fila = filas[f];
    var numeroFila = f + 1; // como se ve en la planilla
    var texto = String(fila[columnas.texto] || '');
    if (!texto.trim()) continue; // fila vacía

    // Google corta en 6 minutos: frenamos antes y lo decimos
    if (Date.now() - inicio > 5 * 60 * 1000) {
      console.log('Se acabó el tiempo en la fila ' + numeroFila + ': los resultados son parciales.');
      break;
    }

    var esperado = categoriaDePlanilla(fila[columnas.esperado]);
    if (!esperado) {
      console.log('Fila ' + numeroFila + ': la respuesta correcta dice "' + fila[columnas.esperado] +
        '", no sé si es ESTAFA, DUDOSO o LEGITIMO. La salteo.');
      continue;
    }

    var remitente = columnas.remitente !== undefined ? String(fila[columnas.remitente] || '') : '';
    var asunto = columnas.asunto !== undefined ? String(fila[columnas.asunto] || '') : '';

    var dijo, motivo;
    try {
      var resultado = clasificarConIA(remitente, asunto, texto);
      dijo = resultado.categoria;
      motivo = resultado.motivo;
    } catch (error) {
      c.errores++;
      hoja.getRange(numeroFila, columnas.iaDijo + 1).setValue('ERROR');
      hoja.getRange(numeroFila, columnas.motivo + 1).setValue(error.message);
      detalle.push([numeroFila, asunto, esperado, 'ERROR', '', error.message]);
      console.log('Fila ' + numeroFila + ': FALLÓ (' + error.message + ').');
      continue;
    }

    // Se escribe fila por fila: si se corta, lo hecho queda guardado
    hoja.getRange(numeroFila, columnas.iaDijo + 1).setValue(dijo);
    hoja.getRange(numeroFila, columnas.motivo + 1).setValue(motivo);

    c.total++;
    var acerto = dijo === esperado;
    if (acerto) c.aciertos++;

    if (esperado === 'ESTAFA') {
      c.estafas++;
      if (dijo === 'ESTAFA') c.estafasDetectadas++;
      if (dijo === 'LEGITIMO') c.estafasEscapadas++;
      if (dijo === 'DUDOSO') c.estafaComoDudoso++;
    } else if (esperado === 'DUDOSO') {
      if (dijo === 'ESTAFA') c.dudosoComoEstafa++;
      if (dijo === 'LEGITIMO') c.otras++;
    } else {
      c.legitimos++;
      if (dijo === 'ESTAFA') c.legitimosComoEstafa++;
      if (dijo === 'DUDOSO') c.otras++;
    }

    detalle.push([numeroFila, asunto, esperado, dijo, acerto ? 'SÍ' : 'NO', motivo]);
    console.log('Fila ' + numeroFila + ': esperado ' + esperado + ', la IA dijo ' + dijo + (acerto ? ' ✅' : ' ❌'));
  }

  var porcentaje = c.total > 0 ? Math.round(c.aciertos * 100 / c.total) : 0;
  var resumen = [
    ['Aciertos', c.aciertos + ' de ' + c.total + ' (' + porcentaje + '%)'],
    ['Estafas detectadas', c.estafasDetectadas + ' de ' + c.estafas],
    ['Estafas que se le escaparon (dijo LEGITIMO)', c.estafasEscapadas + ' de ' + c.estafas],
    ['Confusiones: era ESTAFA y dijo DUDOSO', String(c.estafaComoDudoso)],
    ['Confusiones: era DUDOSO y dijo ESTAFA', String(c.dudosoComoEstafa)],
    ['Legítimos marcados como ESTAFA', c.legitimosComoEstafa + ' de ' + c.legitimos],
    ['Otras confusiones (entre DUDOSO y LEGITIMO)', String(c.otras)],
    ['Mails que fallaron (no cuentan)', String(c.errores)],
    ['Fecha', Utilities.formatDate(new Date(), 'America/Montevideo', 'dd/MM/yyyy HH:mm')]
  ];

  escribirResultados(planilla, resumen, detalle);

  console.log('\nRESULTADO');
  for (var r = 0; r < resumen.length - 1; r++) {
    console.log(resumen[r][0] + ': ' + resumen[r][1]);
  }
  console.log('El detalle está en la hoja "' + HOJA_RESULTADOS + '" de la planilla.');
}

/**
 * Escribe el resumen y el detalle en la hoja "Resultados IA" (la crea o la limpia).
 */
function escribirResultados(planilla, resumen, detalle) {
  var hoja = planilla.getSheetByName(HOJA_RESULTADOS) || planilla.insertSheet(HOJA_RESULTADOS);
  hoja.clear();

  hoja.getRange(1, 1, resumen.length, 2).setValues(resumen);
  hoja.getRange(1, 1, resumen.length, 1).setFontWeight('bold');

  var filaTitulos = resumen.length + 2;
  var titulos = [['Fila', 'Asunto', 'Respuesta correcta', 'La IA dijo', '¿Acertó?', 'Motivo de la IA']];
  hoja.getRange(filaTitulos, 1, 1, titulos[0].length).setValues(titulos).setFontWeight('bold');

  if (detalle.length > 0) {
    hoja.getRange(filaTitulos + 1, 1, detalle.length, titulos[0].length).setValues(detalle);
    // Verde si acertó, rojo si no
    for (var i = 0; i < detalle.length; i++) {
      var color = detalle[i][4] === 'SÍ' ? '#d9ead3' : '#f4cccc';
      hoja.getRange(filaTitulos + 1 + i, 1, 1, titulos[0].length).setBackground(color);
    }
  }
  hoja.autoResizeColumns(1, 5);
}
