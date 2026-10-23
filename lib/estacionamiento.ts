import { ESTACIONAMIENTO_POR_SMS } from './estacionamiento-config'

// Pagar el estacionamiento tarifado con un SMS (número y formato en lib/estacionamiento-config.ts).
// El servidor arma el mensaje con la matrícula guardada; el abuelo solo aprieta "Enviar". La app nunca lo manda sola.

/** Lo que ve el abuelo: la tarjeta con el mensaje y el botón que abre los mensajes del celular con todo escrito. */
export interface MensajeDeEstacionamiento {
  /** Como se muestra: "SBA 1234". */
  matricula: string
  minutos: number
  numero: string
  texto: string
  /** sms:… con el número y el texto: abre la app de mensajes, no manda nada. */
  link: string
}

/** Cuántos minutos se aceptan en un pedido (para no armar un mensaje con un número absurdo). */
export const MINUTOS_MAXIMOS = 600

/**
 * "sba 1234", "SBA-1234", "Sba1234" → "SBA1234". Una matrícula uruguaya: letras y números, sin espacios (de 6 a 7).
 * null si no parece una matrícula.
 */
export function normalizarMatricula(texto: string): string | null {
  const limpia = texto.toUpperCase().replace(/[\s.-]/g, '')
  return /^[A-Z]{2,3}\d[A-Z0-9]\d{1,3}$/.test(limpia) && limpia.length >= 6 && limpia.length <= 7 ? limpia : null
}

/** "SBA1234" → "SBA 1234" (las letras de adelante, un espacio, el resto). */
export const mostrarMatricula = (matricula: string) => matricula.replace(/^([A-Z]{2,3})(.*)$/, '$1 $2')

export function armarMensajeDeEstacionamiento(matricula: string, minutos: number): MensajeDeEstacionamiento | null {
  const normalizada = normalizarMatricula(matricula)
  if (!normalizada || !Number.isInteger(minutos) || minutos < 1 || minutos > MINUTOS_MAXIMOS) return null
  const { numero, formato } = ESTACIONAMIENTO_POR_SMS
  const texto = formato.replace('{MATRICULA}', normalizada).replace('{MINUTOS}', String(minutos))
  // "?&body=" anda en Android y en iPhone.
  return { matricula: mostrarMatricula(normalizada), minutos, numero, texto, link: `sms:${numero}?&body=${encodeURIComponent(texto)}` }
}
