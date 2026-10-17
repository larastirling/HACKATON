/**
 * Crea las etiquetas ESTAFA (roja) y DUDOSO (amarilla) y se las pone
 * a los mails según lo que diga la IA.
 *
 * Usa clasificarConIA, que está en clasificar-mail.gs (mismo proyecto).
 * Para que las etiquetas tengan color hay que activar el servicio
 * avanzado "Gmail API" en el editor (Servicios > + > Gmail API).
 */

// Nombre y colores de cada etiqueta (colores de la paleta que acepta Gmail)
var ETIQUETAS = {
  ESTAFA: { nombre: 'ESTAFA', fondo: '#cc3a21', texto: '#ffffff' },
  DUDOSO: { nombre: 'DUDOSO', fondo: '#fad165', texto: '#000000' }
};

/**
 * Devuelve la etiqueta de Gmail con ese nombre; si no existe, la crea.
 */
function obtenerEtiqueta(datos) {
  var etiqueta = GmailApp.getUserLabelByName(datos.nombre);
  if (etiqueta) {
    return etiqueta;
  }
  console.log('Creé la etiqueta ' + datos.nombre + '.');
  return GmailApp.createLabel(datos.nombre);
}

/**
 * Le pone a la etiqueta su color, exista de antes o no.
 * Escribe en el registro si pudo o por qué falló.
 */
function colorearEtiqueta(datos) {
  // El color solo se puede cambiar con el servicio avanzado de Gmail
  if (typeof Gmail === 'undefined') {
    console.log(
      'No pude poner el color a ' + datos.nombre + ': falta activar el servicio ' +
      '"Gmail API" (Servicios > + > Gmail API).'
    );
    return;
  }

  try {
    // Buscamos el identificador interno de la etiqueta por su nombre
    var todas = Gmail.Users.Labels.list('me').labels || [];
    var id = null;
    for (var i = 0; i < todas.length; i++) {
      if (todas[i].name === datos.nombre) {
        id = todas[i].id;
      }
    }
    if (!id) {
      console.log('No pude poner el color a ' + datos.nombre + ': no encontré la etiqueta.');
      return;
    }

    Gmail.Users.Labels.patch(
      { color: { backgroundColor: datos.fondo, textColor: datos.texto } },
      'me',
      id
    );

    // Le preguntamos a Gmail qué color quedó guardado, para estar seguros
    var guardada = Gmail.Users.Labels.get('me', id);
    var colorGuardado = guardada.color ? guardada.color.backgroundColor : 'ninguno';
    if (colorGuardado === datos.fondo) {
      console.log('Color puesto a ' + datos.nombre + ' (' + datos.fondo + '). Recargá Gmail para verlo.');
    } else {
      console.log(
        'No pude poner el color a ' + datos.nombre + ': Gmail dice que quedó con color ' +
        colorGuardado + ' en vez de ' + datos.fondo + '.'
      );
    }
  } catch (error) {
    console.log('No pude poner el color a ' + datos.nombre + ': ' + error.message);
  }
}

/**
 * Le pone al hilo la etiqueta de esa categoría (ESTAFA o DUDOSO) y le saca
 * la otra, para que nunca tenga las dos a la vez.
 */
function ponerEtiquetaUnica(hilo, categoria) {
  var otra = categoria === 'ESTAFA' ? 'DUDOSO' : 'ESTAFA';
  var etiquetaOtra = GmailApp.getUserLabelByName(ETIQUETAS[otra].nombre);
  if (etiquetaOtra) {
    hilo.removeLabel(etiquetaOtra);
  }
  hilo.addLabel(obtenerEtiqueta(ETIQUETAS[categoria]));
}

/**
 * Crea las dos etiquetas (si no existen) y les pone su color.
 */
function crearEtiquetas() {
  obtenerEtiqueta(ETIQUETAS.ESTAFA);
  obtenerEtiqueta(ETIQUETAS.DUDOSO);
  colorearEtiqueta(ETIQUETAS.ESTAFA);
  colorearEtiqueta(ETIQUETAS.DUDOSO);
  console.log('Etiquetas ESTAFA y DUDOSO listas.');
}

/**
 * Clasifica los últimos 5 mails de la bandeja con la IA y les pone la
 * etiqueta que corresponde. Los legítimos quedan sin etiqueta.
 */
function etiquetarUltimosMails() {
  var hilos = GmailApp.getInboxThreads(0, 5);
  if (hilos.length === 0) {
    console.log('La bandeja de entrada está vacía.');
    return;
  }

  for (var i = 0; i < hilos.length; i++) {
    var mensajes = hilos[i].getMessages();
    var ultimo = mensajes[mensajes.length - 1];
    var resultado = clasificarConIA(ultimo.getFrom(), ultimo.getSubject(), ultimo.getPlainBody() || '');

    // ESTAFA y DUDOSO llevan etiqueta; LEGITIMO no
    var datos = ETIQUETAS[resultado.categoria];
    if (datos) {
      ponerEtiquetaUnica(hilos[i], resultado.categoria);
    }

    console.log(
      'Mail ' + (i + 1) + ': ' + ultimo.getSubject() + '\n' +
      'Resultado: ' + resultado.categoria + (datos ? ' (etiquetado)' : ' (sin etiqueta)') + '\n' +
      'Por qué: ' + resultado.motivo
    );
  }
}
