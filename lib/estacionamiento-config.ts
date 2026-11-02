// Configuración del pago del estacionamiento tarifado de Montevideo (lo usa lib/estacionamiento.ts).
// No cambies estos datos ni agregues otros (precios, horarios, minutos permitidos) sin la fuente oficial:
// anotá acá el link y la fecha en que se revisó.
//
// Para que sirva por WhatsApp, el auto tiene que estar registrado una vez (por WhatsApp: matrícula y padrón).
// Eso lo hace la familia, no la app. El costo se carga en la cuenta de SUCIVE del dueño.
// Revisado en montevideo.gub.uy el 2026-11-02 (ver `fuente` de cada uno).

/**
 * La forma principal: el WhatsApp oficial de la Intendencia. Se abre WhatsApp con la palabra ya escrita; el abuelo
 * aprieta Enviar, espera la respuesta y elige "Con matrícula asociada" (opción 1). Se paga por minuto (mínimo 15) y
 * se termina con "fin". La Intendencia le recuerda cada 120 minutos que lo tiene abierto.
 */
export const ESTACIONAMIENTO_POR_WHATSAPP = {
  /** El WhatsApp de la Intendencia (099 019 500), con el código de Uruguay para el link de wa.me. */
  numero: '+598 99 019 500',
  /** Lo que se escribe para empezar a estacionar. */
  paraEmpezar: 'estacionamiento',
  /** La opción que hay que elegir cuando contestan (el auto ya registrado). */
  opcionParaEmpezar: '“Con matrícula asociada” (opción 1)',
  /** Lo que se escribe para terminar ("ya me voy"). */
  paraTerminar: 'fin',
  fuente:
    'https://montevideo.gub.uy/area-tematica/movilidad/estacionamiento-tarifado/estacionamiento-tarifado-por-whatsapp ' +
    '(última actualización de la página: 27/01/2026; revisado el 2026-11-02)',
} as const

/**
 * El respaldo, si WhatsApp no anda: un SMS al 466 con "E" + matrícula + minutos (ejemplo oficial: "E SZS1234 60").
 * Compra esos minutos desde que el sistema confirma: si no llega la confirmación, no está pagado y hay que repetirlo.
 * Solo se arma si el abuelo dijo cuántos minutos va a estar. Para usuarios de Antel, Movistar y Claro.
 * La página no dice si los minutos tienen que ser múltiplos de algo: se manda lo que dijo el abuelo.
 */
export const ESTACIONAMIENTO_POR_SMS = {
  /** A dónde se manda el SMS. */
  numero: '466',
  /** Qué dice el SMS. {MATRICULA} (sin espacio, como en el ejemplo oficial) y {MINUTOS} se reemplazan. */
  formato: 'E {MATRICULA} {MINUTOS}',
  /** Confirmado en la web de la Intendencia el 2026-11-02. */
  confirmado: true,
  fuente:
    'https://montevideo.gub.uy/areas-tematicas/movilidad/estacionamiento-tarifado/precio-del-ticket-y-como-pagarlo-0 ' +
    '(última actualización de la página: 09/01/2025; revisado el 2026-11-02)',
} as const

/**
 * A partir de cuántos minutos de estacionamiento abierto la APP le avisa al abuelo (por si se olvidó de terminarlo).
 * Es un aviso nuestro: el recordatorio de la Intendencia por WhatsApp es cada 120 minutos.
 */
export const MINUTOS_PARA_AVISAR = 60
