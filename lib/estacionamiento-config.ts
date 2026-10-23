// Configuración del pago del estacionamiento tarifado de Montevideo por SMS (lo usa lib/estacionamiento.ts).
//
// FUENTE: A CONFIRMAR EN LA WEB DE LA INTENDENCIA DE MONTEVIDEO (montevideo.gub.uy, "Estacionamiento tarifado").
// El número y el formato de abajo NO están confirmados con la fuente oficial todavía. No los cambies ni agregues otros
// datos (precios, horarios, minutos permitidos) sin la fuente oficial: anotá acá el link y la fecha en que se revisó.
//
// Para que el SMS sirva, el auto tiene que estar registrado en el sistema de estacionamiento de la Intendencia
// (matrícula, padrón y el celular desde el que se manda). Eso lo hace la familia una vez, no la app.

export const ESTACIONAMIENTO_POR_SMS = {
  /** A dónde se manda el SMS. A CONFIRMAR en la web de la Intendencia de Montevideo. */
  numero: '466',
  /** Qué dice el SMS. {MATRICULA} y {MINUTOS} se reemplazan. A CONFIRMAR en la web de la Intendencia de Montevideo. */
  formato: 'E {MATRICULA} {MINUTOS}',
  /** Pasa a true recién cuando se revise en la fuente oficial (y se anote el link y la fecha). */
  confirmado: false,
  fuente: 'A confirmar en la web de la Intendencia de Montevideo',
} as const
