/**
 * Revisión automática: cada minuto busca los mails nuevos de la bandeja
 * y de Spam que todavía no pasaron por la IA y los protege.
 *
 * Usa protegerMensaje (proteger-mails.gs): todos los archivos van en el
 * mismo proyecto. Necesita el servicio avanzado "Gmail API" activado.
 */

// Etiqueta oculta que marca los mails que ya pasaron por la IA
var ETIQUETA_REVISADO = 'IA-revisado';

// Cuántos mails revisa como máximo en cada corrida (los demás, en la siguiente)
var TOPE_POR_CORRIDA = 10;

// Si la corrida lleva más de esto, corta (Google permite 6 minutos por corrida)
var TIEMPO_MAXIMO_MS = 4 * 60 * 1000;

// Cuántas veces se reintenta un mail que falla antes de darlo por revisado
var MAXIMO_INTENTOS = 3;

// Función que corre el activador
var FUNCION_AUTOMATICA = 'revisarMailsNuevos';

/**
 * Instala el activador que corre revisarMailsNuevos cada minuto.
 * Si ya existe, no crea otro.
 */
function instalarActivador() {
  var activadores = ScriptApp.getProjectTriggers();
  for (var i = 0; i < activadores.length; i++) {
    if (activadores[i].getHandlerFunction() === FUNCION_AUTOMATICA) {
      console.log('El activador ya estaba instalado: no creé otro.');
      return;
    }
  }
  ScriptApp.newTrigger(FUNCION_AUTOMATICA).timeBased().everyMinutes(1).create();
  console.log('Activador instalado: ' + FUNCION_AUTOMATICA + ' va a correr cada minuto.');
}

/**
 * Saca el activador: el script deja de correr solo.
 */
function sacarActivador() {
  var activadores = ScriptApp.getProjectTriggers();
  var sacados = 0;
  for (var i = 0; i < activadores.length; i++) {
    if (activadores[i].getHandlerFunction() === FUNCION_AUTOMATICA) {
      ScriptApp.deleteTrigger(activadores[i]);
      sacados++;
    }
  }
  console.log(sacados > 0 ? 'Activador sacado.' : 'No había ningún activador instalado.');
}

/**
 * Devuelve el identificador de la etiqueta oculta "IA-revisado"; si no existe, la crea.
 * Es oculta: no aparece en la lista de etiquetas ni en los mails del abuelo.
 */
function idEtiquetaRevisado() {
  var todas = Gmail.Users.Labels.list('me').labels || [];
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].name === ETIQUETA_REVISADO) {
      return todas[i].id;
    }
  }
  var nueva = Gmail.Users.Labels.create({
    name: ETIQUETA_REVISADO,
    labelListVisibility: 'labelHide',
    messageListVisibility: 'hide'
  }, 'me');
  console.log('Creé la etiqueta oculta ' + ETIQUETA_REVISADO + '.');
  return nueva.id;
}

/**
 * Desde cuándo buscar mails (en segundos). La primera vez guarda "hace 24 horas"
 * y de ahí en adelante busca siempre desde esa fecha.
 */
function fechaDeInicio() {
  var propiedades = PropertiesService.getScriptProperties();
  var guardada = propiedades.getProperty('REVISAR_DESDE');
  if (!guardada) {
    guardada = String(Math.floor(Date.now() / 1000) - 24 * 60 * 60);
    propiedades.setProperty('REVISAR_DESDE', guardada);
    console.log('Primera corrida: reviso solo los mails de las últimas 24 horas.');
  }
  return guardada;
}

/**
 * Busca los mails de la bandeja y de Spam que todavía no pasaron por la IA.
 * Devuelve sus identificadores, del más viejo al más nuevo.
 */
function buscarMailsNuevos() {
  var consulta = '(in:inbox OR in:spam) after:' + fechaDeInicio() +
    ' -label:' + ETIQUETA_REVISADO +
    ' -label:' + ETIQUETA_AVISO.replace(/ /g, '-');

  var ids = [];
  var pagina = null;
  do {
    var opciones = { q: consulta, includeSpamTrash: true, maxResults: 100 };
    if (pagina) {
      opciones.pageToken = pagina;
    }
    var respuesta = Gmail.Users.Messages.list('me', opciones);
    var mensajes = respuesta.messages || [];
    for (var i = 0; i < mensajes.length; i++) {
      ids.push(mensajes[i].id);
    }
    pagina = respuesta.nextPageToken;
  } while (pagina);

  // Gmail los devuelve del más nuevo al más viejo: los damos vuelta
  return ids.reverse();
}

/**
 * Marca un mail como revisado (le pone la etiqueta oculta).
 */
function marcarRevisado(idMensaje, idEtiqueta) {
  Gmail.Users.Messages.modify({ addLabelIds: [idEtiqueta] }, 'me', idMensaje);
  PropertiesService.getScriptProperties().deleteProperty('FALLOS_' + idMensaje);
}

/**
 * Anota que un mail falló. Devuelve true si ya llegó al máximo de intentos.
 */
function anotarFallo(idMensaje) {
  var propiedades = PropertiesService.getScriptProperties();
  var fallos = Number(propiedades.getProperty('FALLOS_' + idMensaje) || 0) + 1;
  propiedades.setProperty('FALLOS_' + idMensaje, String(fallos));
  return fallos >= MAXIMO_INTENTOS;
}

/**
 * Lo que corre el activador cada minuto: revisa todos los mails nuevos,
 * hasta el tope por corrida. Los que quedan se revisan en la siguiente.
 */
function revisarMailsNuevos() {
  // Si otra corrida todavía está trabajando, esta no hace nada
  var candado = LockService.getScriptLock();
  if (!candado.tryLock(0)) {
    console.log('Otra corrida todavía está trabajando: esta no hace nada.');
    return;
  }

  try {
    var inicio = Date.now();
    var idEtiqueta = idEtiquetaRevisado();
    var ids = buscarMailsNuevos();

    console.log('Encontré ' + ids.length + ' mail(s) nuevo(s) sin revisar.');
    if (ids.length > TOPE_POR_CORRIDA) {
      console.log('Reviso ' + TOPE_POR_CORRIDA + ' ahora; los otros ' +
        (ids.length - TOPE_POR_CORRIDA) + ' quedan para la próxima corrida.');
    }

    for (var i = 0; i < ids.length && i < TOPE_POR_CORRIDA; i++) {
      if (Date.now() - inicio > TIEMPO_MAXIMO_MS) {
        console.log('Se está por acabar el tiempo: el resto queda para la próxima corrida.');
        break;
      }

      var asunto = '(sin asunto)';
      try {
        var mensaje = GmailApp.getMessageById(ids[i]);
        asunto = mensaje.getSubject() || asunto;
        console.log('Mail ' + (i + 1) + ': ' + asunto + '\n' + protegerMensaje(mensaje));
        marcarRevisado(ids[i], idEtiqueta);
      } catch (error) {
        if (anotarFallo(ids[i])) {
          marcarRevisado(ids[i], idEtiqueta);
          console.log('Mail ' + (i + 1) + ': ' + asunto + '\nFALLÓ ' + MAXIMO_INTENTOS +
            ' veces (' + error.message + '): lo doy por revisado y no lo intento más.');
        } else {
          console.log('Mail ' + (i + 1) + ': ' + asunto + '\nFALLÓ: ' + error.message +
            '. Lo vuelvo a intentar en la próxima corrida.');
        }
      }
    }
  } finally {
    candado.releaseLock();
  }
}
