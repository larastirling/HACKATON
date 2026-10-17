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
  return mensaje.getFrom().toLowerCase().indexOf(miMail) !== -1 &&
    mensaje.getSubject().indexOf(ASUNTO_AVISO) === 0;
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

  // Lo mandamos como borrador para poder etiquetar el mail enviado
  var enviado = GmailApp.createDraft(miMail, ASUNTO_AVISO, textoPlano, {
    htmlBody: html,
    name: 'Asistente de confianza'
  }).send();

  var etiquetaAviso = GmailApp.getUserLabelByName(ETIQUETA_AVISO) || GmailApp.createLabel(ETIQUETA_AVISO);
  enviado.getThread().addLabel(etiquetaAviso);
}

/**
 * Hace todo con un hilo y devuelve una frase con lo que hizo.
 */
function protegerHilo(hilo) {
  var mensajes = hilo.getMessages();
  var ultimo = mensajes[mensajes.length - 1];

  if (esAvisoPropio(hilo, ultimo)) {
    return 'Es un aviso del asistente: no lo analicé.';
  }

  var resultado = clasificarConIA(ultimo.getFrom(), ultimo.getSubject(), ultimo.getPlainBody() || '');

  if (resultado.categoria === 'ESTAFA') {
    hilo.addLabel(obtenerEtiqueta(ETIQUETAS.ESTAFA));
    hilo.moveToArchive(); // Sale de la bandeja pero no se borra
    mandarExplicacion(ultimo.getFrom(), ultimo.getSubject(), resultado.motivo);
    return 'ESTAFA: etiquetado, sacado de la bandeja y aviso enviado.\nPor qué: ' + resultado.motivo;
  }

  if (resultado.categoria === 'DUDOSO') {
    hilo.addLabel(obtenerEtiqueta(ETIQUETAS.DUDOSO));
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

  for (var i = 0; i < hilos.length; i++) {
    var asunto = hilos[i].getFirstMessageSubject();
    try {
      console.log('Mail ' + (i + 1) + ': ' + asunto + '\n' + protegerHilo(hilos[i]));
    } catch (error) {
      console.log('Mail ' + (i + 1) + ': ' + asunto + '\nFALLÓ: ' + error.message + '. Sigo con el siguiente.');
    }
  }
}
