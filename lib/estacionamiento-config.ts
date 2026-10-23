// Configuración del pago del estacionamiento tarifado de Montevideo (lo usa lib/estacionamiento.ts).
// No cambies estos datos ni agregues otros (precios, horarios, minutos permitidos) sin la fuente oficial:
// anotá acá el link y la fecha en que se revisó.
//
// Para que sirva, el auto tiene que estar registrado en el sistema de estacionamiento de la Intendencia
// (matrícula, padrón y el celular desde el que se escribe). Eso lo hace la familia una vez, no la app.

/**
 * La forma principal: el WhatsApp oficial de la Intendencia. Se abre WhatsApp con la palabra ya escrita; el abuelo
 * aprieta Enviar y sigue lo que le contestan (ahí puede que le pidan la matrícula: la app se la recuerda).
 * FUENTE: lo indicó Felipe (equipo) el 2026-10-23 como el WhatsApp oficial de la Intendencia de Montevideo.
 * A revisar en la web de la Intendencia (montevideo.gub.uy) y anotar el link.
 */
export const ESTACIONAMIENTO_POR_WHATSAPP = {
  /** El WhatsApp de la Intendencia (099 019 500), con el código de Uruguay para el link de wa.me. */
  numero: '+598 99 019 500',
  /** Lo que se escribe para empezar a estacionar. */
  paraEmpezar: 'estacionamiento',
  /** Lo que se escribe para terminar ("ya me voy"). */
  paraTerminar: 'fin',
  fuente: 'Lo indicó Felipe (equipo) el 2026-10-23. A revisar en la web de la Intendencia de Montevideo',
} as const

/**
 * El respaldo, si WhatsApp no anda: un SMS. Solo se arma si el abuelo dijo cuántos minutos va a estar.
 * FUENTE: A CONFIRMAR EN LA WEB DE LA INTENDENCIA DE MONTEVIDEO (montevideo.gub.uy, "Estacionamiento tarifado").
 */
export const ESTACIONAMIENTO_POR_SMS = {
  /** A dónde se manda el SMS. A CONFIRMAR en la web de la Intendencia de Montevideo. */
  numero: '466',
  /** Qué dice el SMS. {MATRICULA} y {MINUTOS} se reemplazan. A CONFIRMAR en la web de la Intendencia de Montevideo. */
  formato: 'E {MATRICULA} {MINUTOS}',
  /** Pasa a true recién cuando se revise en la fuente oficial (y se anote el link y la fecha). */
  confirmado: false,
  fuente: 'A confirmar en la web de la Intendencia de Montevideo',
} as const

/** A partir de cuántos minutos de estacionamiento abierto se le avisa al abuelo (por si se olvidó de terminarlo). */
export const MINUTOS_PARA_AVISAR = 60
