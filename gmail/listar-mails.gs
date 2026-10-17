/**
 * Lista los 5 hilos más recientes de la bandeja de entrada
 * y muestra en el registro los datos del último mensaje de cada uno.
 */
function listarUltimosMails() {
  // Traemos los 5 hilos más recientes de la bandeja de entrada
  var hilos = GmailApp.getInboxThreads(0, 5);

  // Si no hay hilos, avisamos y terminamos
  if (hilos.length === 0) {
    console.log('La bandeja de entrada está vacía.');
    return;
  }

  // Recorremos cada hilo
  for (var i = 0; i < hilos.length; i++) {
    var mensajes = hilos[i].getMessages();

    // Nos quedamos con el último mensaje del hilo
    var ultimo = mensajes[mensajes.length - 1];

    // Tomamos el texto plano y nos quedamos con los primeros 200 caracteres
    var texto = ultimo.getPlainBody() || '';
    var resumen = texto.substring(0, 200);

    // Mostramos los datos en el registro
    console.log(
      'Mail ' + (i + 1) + '\n' +
      'Remitente: ' + ultimo.getFrom() + '\n' +
      'Asunto: ' + ultimo.getSubject() + '\n' +
      'Fecha: ' + ultimo.getDate() + '\n' +
      'Texto: ' + resumen
    );
  }
}
