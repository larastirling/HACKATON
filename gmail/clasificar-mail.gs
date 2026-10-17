/**
 * Le pasa un mail a la IA (Claude, de Anthropic) y muestra en el registro
 * si es ESTAFA, DUDOSO o LEGITIMO, y por qué.
 *
 * La clave de Anthropic NO va en este archivo: se guarda en
 * Configuración del proyecto > Propiedades del script, con el nombre
 * ANTHROPIC_API_KEY.
 */

// Instrucciones fijas para la IA: qué tiene que hacer y cómo responder
var INSTRUCCIONES_IA =
  'Sos un asistente que protege a personas mayores en Uruguay de estafas por mail. ' +
  'Vas a recibir un mail completo (remitente, asunto y texto). Leelo entero y razoná ' +
  'como lo haría una persona atenta: quién lo manda, qué pide, si mete apuro o miedo, ' +
  'si pide claves, códigos, datos de tarjeta o pagos, si los links o el remitente no ' +
  'coinciden con la empresa que dice ser. No te bases en palabras sueltas.\n\n' +
  'Estafas comunes en Uruguay: falso BROU u otro banco pidiendo clave o código, ' +
  'falsas facturas de UTE, OSE o Antel, falsa DGI o BPS, paquete retenido en aduana ' +
  'o el Correo Uruguayo que pide pagar un envío, premios o sorteos que piden pagar algo.\n\n' +
  'Clasificalo en una de tres categorías:\n' +
  '- ESTAFA: riesgo alto, casi seguro es un engaño.\n' +
  '- DUDOSO: tiene cosas raras pero podría ser real.\n' +
  '- LEGITIMO: un mail normal (familia, facturas reales, newsletters, etc.).\n\n' +
  'En "motivo" explicá en una o dos frases simples por qué, como si se lo contaras ' +
  'a una persona mayor que no sabe de tecnología.\n\n' +
  'Reglas para el "motivo", sin excepción:\n' +
  '- Tratá siempre de "usted", nunca de "vos" ni de "tú" (por ejemplo: "no haga clic", ' +
  '"llame", "usted").\n' +
  '- NUNCA des números de teléfono, direcciones web, mails ni ningún dato de contacto ' +
  'concreto, aunque aparezcan en el mail o los conozcas. Si hace falta contactar a alguien, ' +
  'decí "llame al número que figura en su factura o en su tarjeta" o "pregúntele a un familiar".';

// Formato exacto que le pedimos a la IA para su respuesta
var FORMATO_RESPUESTA = {
  type: 'object',
  properties: {
    categoria: { type: 'string', enum: ['ESTAFA', 'DUDOSO', 'LEGITIMO'] },
    motivo: { type: 'string' }
  },
  required: ['categoria', 'motivo'],
  additionalProperties: false
};

/**
 * Le pregunta a la IA por un mail y devuelve { categoria, motivo }.
 */
function clasificarConIA(remitente, asunto, texto) {
  var clave = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!clave) {
    throw new Error('Falta la clave: cargá ANTHROPIC_API_KEY en Propiedades del script.');
  }

  var mail =
    'Remitente: ' + remitente + '\n' +
    'Asunto: ' + asunto + '\n\n' +
    'Texto:\n' + texto;

  var pedido = {
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema: FORMATO_RESPUESTA }
    },
    // Si el modelo se niega a responder, la API reintenta sola con otro modelo
    fallbacks: 'default',
    system: INSTRUCCIONES_IA,
    messages: [{ role: 'user', content: mail }]
  };

  var respuesta = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': clave,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'server-side-fallback-2026-07-01'
    },
    payload: JSON.stringify(pedido),
    muteHttpExceptions: true
  });

  var codigo = respuesta.getResponseCode();
  var cuerpo = JSON.parse(respuesta.getContentText());
  if (codigo !== 200) {
    throw new Error('La IA respondió con error ' + codigo + ': ' + JSON.stringify(cuerpo.error));
  }
  if (cuerpo.stop_reason === 'refusal') {
    throw new Error('La IA no quiso analizar este mail.');
  }

  // La respuesta trae varios bloques; el de tipo "text" tiene el resultado en JSON
  for (var i = 0; i < cuerpo.content.length; i++) {
    if (cuerpo.content[i].type === 'text') {
      return JSON.parse(cuerpo.content[i].text);
    }
  }
  throw new Error('La IA no devolvió un resultado.');
}

/**
 * Clasifica el mail más reciente de la bandeja de entrada.
 */
function clasificarUltimoMail() {
  var hilos = GmailApp.getInboxThreads(0, 1);
  if (hilos.length === 0) {
    console.log('La bandeja de entrada está vacía. Probá con probarConMailTrucho.');
    return;
  }

  var mensajes = hilos[0].getMessages();
  var ultimo = mensajes[mensajes.length - 1];
  var resultado = clasificarConIA(ultimo.getFrom(), ultimo.getSubject(), ultimo.getPlainBody() || '');

  console.log(
    'Asunto: ' + ultimo.getSubject() + '\n' +
    'Remitente: ' + ultimo.getFrom() + '\n' +
    'Resultado: ' + resultado.categoria + '\n' +
    'Por qué: ' + resultado.motivo
  );
}

/**
 * Prueba sin tocar Gmail: le pasa a la IA un mail trucho escrito acá.
 */
function probarConMailTrucho() {
  var resultado = clasificarConIA(
    'BROU Seguridad <avisos@brou-seguridad-online.com>',
    'URGENTE: su cuenta será bloqueada hoy',
    'Estimado cliente, detectamos movimientos inusuales en su cuenta. ' +
    'Para evitar el bloqueo en las próximas 2 horas ingrese a ' +
    'http://brou-verificacion.xyz y confirme su usuario, clave y el código ' +
    'que le llegará por SMS.'
  );

  console.log(
    'Mail trucho de prueba (falso BROU)\n' +
    'Resultado: ' + resultado.categoria + '\n' +
    'Por qué: ' + resultado.motivo
  );
}
