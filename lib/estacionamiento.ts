import { ESTACIONAMIENTO_POR_SMS, ESTACIONAMIENTO_POR_WHATSAPP, MINUTOS_PARA_AVISAR } from './estacionamiento-config'

// Pagar el estacionamiento tarifado (datos en lib/estacionamiento-config.ts):
//   - Lo principal: el WhatsApp oficial de la Intendencia. Se abre WhatsApp con "estacionamiento" escrito (al empezar)
//     o "fin" (al irse); el abuelo aprieta Enviar. La app nunca manda nada sola.
//   - El respaldo: un SMS ya escrito, si dijo cuántos minutos va a estar.
// La app anota cuándo empezó (lib/datos.ts) para recordarle terminarlo y avisarle si pasó más de una hora.

/** El SMS de respaldo: la tarjeta lo muestra con un botón que abre los mensajes del celular con todo escrito. */
export interface MensajeDeEstacionamiento {
  /** Como se muestra: "SBA 1234". */
  matricula: string
  minutos: number
  numero: string
  texto: string
  /** sms:… con el número y el texto: abre la app de mensajes, no manda nada. */
  link: string
}

/** Lo que queda anotado mientras el auto está estacionado. */
export interface EstacionamientoAbierto {
  /** Cuándo empezó (ISO). */
  desde: string
  /** Sin espacios: "SBA1234". */
  matricula: string
  /** Cuántos minutos dijo que iba a estar, si lo dijo. */
  minutos?: number
}

/** Lo que ve el abuelo: la tarjeta para empezar o terminar, con el botón de WhatsApp. */
export interface TarjetaDeEstacionamiento {
  accion: 'empezar' | 'terminar'
  /** Como se muestra: "SBA 1234". */
  matricula: string
  whatsapp: { numero: string; texto: string; link: string }
  /** Solo al empezar, si dijo los minutos: el SMS de respaldo. */
  sms?: MensajeDeEstacionamiento
  /** Cuándo empezó (ISO). */
  desde: string
  /** Al terminar: cuántos minutos estuvo. */
  estuvo?: number
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

/** El link que abre WhatsApp con el texto escrito, al número de la Intendencia (wa.me: solo números). */
function whatsappDeLaIntendencia(texto: string) {
  const { numero } = ESTACIONAMIENTO_POR_WHATSAPP
  return { numero, texto, link: `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}` }
}

/**
 * Al estacionar: WhatsApp con "estacionamiento" y, si dijo los minutos, el SMS de respaldo. El SMS se muestra recién
 * cuando el número y el formato estén confirmados con la Intendencia (ESTACIONAMIENTO_POR_SMS.confirmado).
 */
export function tarjetaParaEmpezar(abierto: EstacionamientoAbierto, smsConfirmado: boolean = ESTACIONAMIENTO_POR_SMS.confirmado): TarjetaDeEstacionamiento {
  const sms = smsConfirmado && abierto.minutos ? armarMensajeDeEstacionamiento(abierto.matricula, abierto.minutos) : null
  return {
    accion: 'empezar',
    matricula: mostrarMatricula(abierto.matricula),
    whatsapp: whatsappDeLaIntendencia(ESTACIONAMIENTO_POR_WHATSAPP.paraEmpezar),
    ...(sms && { sms }),
    desde: abierto.desde,
  }
}

/** Al irse: WhatsApp con "fin". */
export function tarjetaParaTerminar(abierto: EstacionamientoAbierto, ahora = Date.now()): TarjetaDeEstacionamiento {
  return {
    accion: 'terminar',
    matricula: mostrarMatricula(abierto.matricula),
    whatsapp: whatsappDeLaIntendencia(ESTACIONAMIENTO_POR_WHATSAPP.paraTerminar),
    desde: abierto.desde,
    estuvo: minutosDesde(abierto.desde, ahora),
  }
}

/** Cuántos minutos pasaron desde que estacionó. */
export const minutosDesde = (desde: string, ahora = Date.now()) => Math.max(0, Math.floor((ahora - Date.parse(desde)) / 60_000))

/** Si ya pasó más del tiempo para avisarle (una hora) desde que estacionó. */
export const pasoElTiempoDeAvisar = (desde: string, ahora = Date.now()) => minutosDesde(desde, ahora) >= MINUTOS_PARA_AVISAR

/** "45 minutos", "1 hora", "1 hora y 20 minutos", "2 horas". */
export function textoDeMinutos(minutos: number): string {
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  const deHoras = horas === 0 ? '' : horas === 1 ? '1 hora' : `${horas} horas`
  const deMinutos = resto === 0 ? '' : resto === 1 ? '1 minuto' : `${resto} minutos`
  return [deHoras, deMinutos].filter(Boolean).join(' y ') || 'menos de un minuto'
}
