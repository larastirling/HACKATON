/**
 * Protección de mail: clasifica con la IA, etiqueta y, si es ESTAFA,
 * saca el mail de la bandeja (sin borrarlo) y le manda al abuelo un
 * mail con la explicación.
 *
 * Usa clasificarConIA (clasificar-mail.gs) y ETIQUETAS / obtenerEtiqueta
 * (etiquetar-mails.gs): los tres archivos van en el mismo proyecto.
 */

// Asunto de los mails de explicación que manda el propio script
var ASUNTO_AVISO = '⚠️ Cuidado: le llegó un mail falso';

// Asunto del aviso que se manda a los familiares
var ASUNTO_FAMILIA = '⚠️ Su familiar recibió un mail falso';

// Nombres de las Propiedades del script con los mails de los familiares
var PROPIEDADES_FAMILIARES = ['FAMILIAR_1', 'FAMILIAR_2'];

// Etiqueta que se le pone a esos mails para no analizarlos nunca
var ETIQUETA_AVISO = 'Avisos del asistente';

/**
 * Dice si un mail es uno de los avisos que mandó este mismo script,
 * para no analizarlo y no armar un círculo.
 */
function esAvisoPropio(hilo, mensaje) {
  var etiquetas = hilo.getLabels();
  for (var i = 0; i < etiquetas.length; i++) {
    if (etiquetas[i].getName() === ETIQUETA_AVISO) {
      return true;
    }
  }

  // Por las dudas, también lo reconocemos por remitente y asunto
  var miMail = Session.getEffectiveUser().getEmail().toLowerCase();
  var asunto = mensaje.getSubject();
  return mensaje.getFrom().toLowerCase().indexOf(miMail) !== -1 &&
    (asunto.indexOf(ASUNTO_AVISO) === 0 || asunto.indexOf(ASUNTO_FAMILIA) === 0);
}

/**
 * Del remitente "BROU Seguridad <avisos@algo.com>" se queda solo con el
 * nombre, para no mostrarle al abuelo la dirección del estafador.
 */
function nombreDelRemitente(remitente) {
  var nombre = remitente.split('<')[0].replace(/"/g, '').trim();
  // Si no tiene nombre y solo viene la dirección, no la mostramos
  if (!nombre || nombre.indexOf('@') !== -1) {
    return 'un remitente desconocido';
  }
  return nombre;
}

/**
 * Saca de un texto links, mails y números de teléfono, por si se colaron.
 */
function quitarDatosDeContacto(texto) {
  return texto
    .replace(/(https?:\/\/|www\.)\S+/gi, '[dato quitado]')
    .replace(/\S+@\S+\.\S+/g, '[dato quitado]')
    .replace(/\+?\d[\d\s\-().]{6,}\d/g, '[dato quitado]');
}

/**
 * Evita que el texto se interprete como HTML dentro del mail.
 */
function escaparHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Le manda al abuelo (el dueño de esta cuenta) el mail con la explicación.
 */
function mandarExplicacion(remitenteFalso, asuntoFalso, motivo) {
  var miMail = Session.getEffectiveUser().getEmail();
  var deQuien = quitarDatosDeContacto(nombreDelRemitente(remitenteFalso));
  var asunto = quitarDatosDeContacto(asuntoFalso || '(sin asunto)');
  var porQue = quitarDatosDeContacto(motivo);

  var textoPlano =
    'Le llegó un mail falso.\n\n' +
    'Decía venir de: ' + deQuien + '\n' +
    'Asunto: ' + asunto + '\n\n' +
    'Por qué es falso: ' + porQue + '\n\n' +
    'Qué hacer:\n' +
    '- No toque nada de ese mail. No lo conteste.\n' +
    '- Ya lo sacamos de su bandeja para cuidarlo.\n' +
    '- Si tiene dudas, pregúntele a un familiar.';

  var html =
    '<div style="font-family: Arial, sans-serif; font-size: 22px; line-height: 1.5; color: #000000; max-width: 600px;">' +
    '<p style="font-size: 28px; font-weight: bold; color: #cc3a21; margin: 0 0 16px;">⚠️ Le llegó un mail falso</p>' +
    '<p style="margin: 0 0 8px;"><b>Decía venir de:</b> ' + escaparHtml(deQuien) + '</p>' +
    '<p style="margin: 0 0 16px;"><b>Asunto:</b> ' + escaparHtml(asunto) + '</p>' +
    '<p style="margin: 0 0 16px;"><b>Por qué es falso:</b> ' + escaparHtml(porQue) + '</p>' +
    '<p style="font-weight: bold; margin: 0 0 8px;">Qué hacer:</p>' +
    '<ul style="margin: 0; padding-left: 28px;">' +
    '<li>No toque nada de ese mail. No lo conteste.</li>' +
    '<li>Ya lo sacamos de su bandeja para cuidarlo.</li>' +
    '<li>Si tiene dudas, pregúntele a un familiar.</li>' +
    '</ul>' +
    '</div>';

  enviarAviso(miMail, ASUNTO_AVISO, textoPlano, html);
  return miMail;
}

/**
 * Manda un aviso del asistente y le pone la etiqueta "Avisos del asistente",
 * para que el script nunca lo analice.
 */
function enviarAviso(destinatario, asunto, textoPlano, html) {
  // Lo mandamos como borrador para poder etiquetar el mail enviado
  var enviado = GmailApp.createDraft(destinatario, asunto, textoPlano, {
    htmlBody: html,
    name: 'Asistente de confianza'
  }).send();

  var etiquetaAviso = GmailApp.getUserLabelByName(ETIQUETA_AVISO) || GmailApp.createLabel(ETIQUETA_AVISO);
  enviado.getThread().addLabel(etiquetaAviso);
}

/**
 * Lee los mails de los familiares de Propiedades del script.
 * Si falta alguno, lo anota en el registro y sigue con los que haya.
 */
function leerFamiliares() {
  var propiedades = PropertiesService.getScriptProperties();
  var familiares = [];
  for (var i = 0; i < PROPIEDADES_FAMILIARES.length; i++) {
    var mail = (propiedades.getProperty(PROPIEDADES_FAMILIARES[i]) || '').trim();
    if (mail) {
      familiares.push(mail);
    } else {
      console.log('Falta ' + PROPIEDADES_FAMILIARES[i] + ' en Propiedades del script: no le aviso a ese familiar.');
    }
  }
  return familiares;
}

/**
 * Les manda a los familiares el aviso de que llegó un mail falso.
 * Devuelve una línea por familiar diciendo si se le mandó o por qué falló.
 */
function avisarFamilia(remitenteFalso, asuntoFalso, motivo) {
  var familiares = leerFamiliares();
  if (familiares.length === 0) {
    return ['No avisé a ningún familiar: no hay ninguno cargado.'];
  }

  var deQuien = quitarDatosDeContacto(nombreDelRemitente(remitenteFalso));
  var asunto = quitarDatosDeContacto(asuntoFalso || '(sin asunto)');
  var porQue = quitarDatosDeContacto(motivo);

  var textoPlano =
    'Su familiar recibió un mail falso.\n\n' +
    'Decía venir de: ' + deQuien + '\n' +
    'Asunto: ' + asunto + '\n\n' +
    'Por qué creemos que es falso: ' + porQue + '\n\n' +
    'Ya sacamos ese mail de la bandeja de entrada de su familiar, y a su familiar ' +
    'ya le llegó otro mail explicándole por qué es falso.\n\n' +
    'Le sugerimos llamar a su familiar para ver si está bien y preguntarle si llegó a tocar ' +
    'algo del mail (un link, una respuesta o algún dato).';

  var html =
    '<div style="font-family: Arial, sans-serif; font-size: 18px; line-height: 1.5; color: #000000; max-width: 600px;">' +
    '<p style="font-size: 24px; font-weight: bold; color: #cc3a21; margin: 0 0 16px;">⚠️ Su familiar recibió un mail falso</p>' +
    '<p style="margin: 0 0 8px;"><b>Decía venir de:</b> ' + escaparHtml(deQuien) + '</p>' +
    '<p style="margin: 0 0 16px;"><b>Asunto:</b> ' + escaparHtml(asunto) + '</p>' +
    '<p style="margin: 0 0 16px;"><b>Por qué creemos que es falso:</b> ' + escaparHtml(porQue) + '</p>' +
    '<p style="margin: 0 0 16px;">Ya sacamos ese mail de la bandeja de entrada de su familiar, y a su familiar ya le llegó otro mail explicándole por qué es falso.</p>' +
    '<p style="font-weight: bold; margin: 0;">Le sugerimos llamar a su familiar para ver si está bien y preguntarle si llegó a tocar algo del mail (un link, una respuesta o algún dato).</p>' +
    '</div>';

  var resultados = [];
  for (var i = 0; i < familiares.length; i++) {
    try {
      enviarAviso(familiares[i], ASUNTO_FAMILIA, textoPlano, html);
      resultados.push('Aviso a la familia enviado a ' + familiares[i] + '.');
    } catch (error) {
      resultados.push('No pude avisar a ' + familiares[i] + ': ' + error.message);
    }
  }
  return resultados;
}

/**
 * Hace todo con un hilo y devuelve una frase con lo que hizo.
 */
function protegerHilo(hilo) {
  var mensajes = hilo.getMessages();
  return protegerMensaje(mensajes[mensajes.length - 1]);
}

/**
 * Hace todo con un mail (de la bandeja o de Spam) y devuelve una frase con lo que hizo.
 * En Spam: si es ESTAFA etiqueta y avisa pero lo deja ahí; si no, no hace nada.
 */
function protegerMensaje(mensaje) {
  var hilo = mensaje.getThread();

  if (esAvisoPropio(hilo, mensaje)) {
    return 'Es un aviso del asistente: no lo analicé.';
  }

  var enSpam = hilo.isInSpam();
  var resultado = clasificarConIA(mensaje.getFrom(), mensaje.getSubject(), mensaje.getPlainBody() || '');

  if (resultado.categoria === 'ESTAFA') {
    ponerEtiquetaUnica(hilo, 'ESTAFA');
    if (!enSpam) {
      hilo.moveToArchive(); // Sale de la bandeja pero no se borra
    }
    var abuelo = mandarExplicacion(mensaje.getFrom(), mensaje.getSubject(), resultado.motivo);
    var familia = avisarFamilia(mensaje.getFrom(), mensaje.getSubject(), resultado.motivo);
    return 'ESTAFA: etiquetado' + (enSpam ? ', queda en Spam.\n' : ' y sacado de la bandeja.\n') +
      'Explicación enviada al abuelo (' + abuelo + ').\n' +
      familia.join('\n') + '\n' +
      'Por qué: ' + resultado.motivo;
  }

  if (enSpam) {
    return resultado.categoria + ' (en Spam): no hice nada.\nPor qué: ' + resultado.motivo;
  }

  if (resultado.categoria === 'DUDOSO') {
    ponerEtiquetaUnica(hilo, 'DUDOSO');
    return 'DUDOSO: etiquetado, queda en la bandeja.\nPor qué: ' + resultado.motivo;
  }

  return 'LEGITIMO: no hice nada.\nPor qué: ' + resultado.motivo;
}

/**
 * Prueba: hace todo con los últimos 5 mails de la bandeja y anota en el
 * registro qué hizo con cada uno. Si uno falla, sigue con el siguiente.
 */
function protegerUltimosMails() {
  var hilos = GmailApp.getInboxThreads(0, 5);
  if (hilos.length === 0) {
    console.log('La bandeja de entrada está vacía.');
    return;
  }

  // Los marcamos como revisados para que la revisión automática no los repita
  var idEtiqueta = idEtiquetaRevisado();

  for (var i = 0; i < hilos.length; i++) {
    var asunto = hilos[i].getFirstMessageSubject();
    try {
      var mensajes = hilos[i].getMessages();
      console.log('Mail ' + (i + 1) + ': ' + asunto + '\n' + protegerHilo(hilos[i]));
      marcarRevisado(mensajes[mensajes.length - 1].getId(), idEtiqueta);
    } catch (error) {
      console.log('Mail ' + (i + 1) + ': ' + asunto + '\nFALLÓ: ' + error.message + '. Sigo con el siguiente.');
    }
  }
}
