/**
 * Lee los familiares desde la configuración de la app (/api/configuracion),
 * la que la familia completa en /familia.
 *
 * Necesita en Propiedades del script:
 *   URL_APP          dirección pública de la app (ej. https://algo.vercel.app)
 *   CONFIG_API_TOKEN la contraseña de /api/configuracion (la pasa quien publicó la app)
 *   CODIGO_FAMILIA   el código de la familia (si falta, se usa DEMO)
 */

// Cuántos familiares se avisan como máximo (los primeros según "orden")
var MAXIMO_FAMILIARES = 2;

/**
 * Dice si un mail de la configuración sirve (no está vacío ni es "PENDIENTE").
 */
function esMailValido(mail) {
  var limpio = String(mail || '').trim();
  return limpio !== '' && limpio.toUpperCase() !== 'PENDIENTE' && limpio.indexOf('@') > 0;
}

/**
 * Le pide a la app la configuración y devuelve los mails de los familiares,
 * ordenados por "orden" (como mucho MAXIMO_FAMILIARES).
 * Si algo falla, lanza un error que explica por qué.
 */
function leerFamiliaresDeLaApp() {
  var propiedades = PropertiesService.getScriptProperties();
  var url = (propiedades.getProperty('URL_APP') || '').trim().replace(/\/+$/, '');
  var token = (propiedades.getProperty('CONFIG_API_TOKEN') || '').trim();
  var codigo = (propiedades.getProperty('CODIGO_FAMILIA') || 'DEMO').trim();

  if (!url || !token) {
    throw new Error('faltan URL_APP o CONFIG_API_TOKEN en Propiedades del script');
  }

  var respuesta = UrlFetchApp.fetch(url + '/api/configuracion?codigo=' + encodeURIComponent(codigo), {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });

  var codigoHttp = respuesta.getResponseCode();
  if (codigoHttp === 401) throw new Error('la app dice que CONFIG_API_TOKEN está mal');
  if (codigoHttp === 404) throw new Error('la app no tiene ninguna familia con el código ' + codigo);
  if (codigoHttp !== 200) throw new Error('la app respondió con error ' + codigoHttp);

  var configuracion = JSON.parse(respuesta.getContentText());
  var familiares = (configuracion.familiares || []).filter(function (f) {
    return esMailValido(f.mail);
  });
  if (familiares.length === 0) {
    throw new Error('la configuración no tiene ningún familiar con mail cargado');
  }

  familiares.sort(function (a, b) {
    return (Number(a.orden) || 99) - (Number(b.orden) || 99);
  });
  return familiares.slice(0, MAXIMO_FAMILIARES).map(function (f) {
    return String(f.mail).trim();
  });
}

/**
 * Prueba sin mandar mails: muestra en el registro a quién se avisaría
 * y si salió de la app o del respaldo.
 */
function probarLeerFamiliares() {
  var familiares = leerFamiliares();
  console.log(
    'Fuente: ' + familiares.fuente + '\n' +
    'Se avisaría a: ' + (familiares.mails.length ? familiares.mails.join(', ') : 'nadie')
  );
}
