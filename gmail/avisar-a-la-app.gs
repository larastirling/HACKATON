/**
 * Le cuenta a la app que un mail se marcó como ESTAFA o DUDOSO, para que la
 * familia lo vea en /familia → "Lo que pasó" (POST /api/mail-marcado).
 *
 * Usa las mismas Propiedades del script que leer-configuracion.gs:
 *   URL_APP, CONFIG_API_TOKEN y CODIGO_FAMILIA (si falta, DEMO).
 *
 * Nunca manda links, mails ni teléfonos del mail: solo de quién decía venir
 * (el nombre), el asunto y por qué la IA cree que es falso o dudoso (y la app
 * igual los saca). Si algo falla, lo anota en el registro y sigue: la
 * protección del mail no depende de esto.
 */
function avisarALaApp(categoria, remitente, asunto, motivo) {
  try {
    var propiedades = PropertiesService.getScriptProperties();
    var url = (propiedades.getProperty('URL_APP') || '').trim().replace(/\/+$/, '');
    var token = (propiedades.getProperty('CONFIG_API_TOKEN') || '').trim();
    var codigo = (propiedades.getProperty('CODIGO_FAMILIA') || 'DEMO').trim();
    if (!url || !token) return 'No se le avisó a la app: faltan URL_APP o CONFIG_API_TOKEN.';

    var respuesta = UrlFetchApp.fetch(url + '/api/mail-marcado', {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify({
        codigo: codigo,
        categoria: categoria,
        de: nombreDelRemitente(remitente),
        asunto: quitarDatosDeContacto(asunto || ''),
        motivo: quitarDatosDeContacto(motivo || '')
      }),
      muteHttpExceptions: true
    });
    var codigoHttp = respuesta.getResponseCode();
    if (codigoHttp === 200) return 'Anotado en "Lo que pasó" de la app.';
    return 'La app no lo anotó (error ' + codigoHttp + ').';
  } catch (error) {
    return 'No se le pudo avisar a la app: ' + error.message;
  }
}
