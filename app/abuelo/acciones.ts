'use server'

import { headers } from 'next/headers'
import { leerAprobacion, leerConfiguracion } from '@/lib/datos'
import { armarEmergencia } from '@/lib/emergencia'
import {
  conversarConElAbuelo,
  type Emergencia,
  type EsperaAprobacion,
  type MensajeCharla,
  type Pedido,
  type Viaje,
} from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'

const MAXIMO_MENSAJES = 40
const MAXIMO_LETRAS = 2000

export type Respuesta =
  | { ok: true; texto: string; viaje?: Viaje; emergencia?: Emergencia; pedido?: Pedido; aprobacion?: EsperaAprobacion }
  | { ok: false }

/** Recibe TODA la charla y devuelve lo que contesta la IA. */
export async function responderAlAbuelo(charla: MensajeCharla[]): Promise<Respuesta> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'abuelo' || !esCharlaValida(charla)) return { ok: false }

  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return { ok: false }

  // Si es muy larga, se mandan los últimos mensajes, empezando siempre por uno del abuelo.
  let ultimos = charla.slice(-MAXIMO_MENSAJES)
  while (ultimos[0]?.de !== 'abuelo') ultimos = ultimos.slice(1)

  const respuesta = await conversarConElAbuelo(configuracion, ultimos, { urlApp: await urlDeLaApp() })
  if (!respuesta.ok || !respuesta.texto) {
    console.error('La IA no pudo responder al abuelo:', respuesta.ok ? 'respuesta vacía' : respuesta.error)
    return { ok: false }
  }
  const { texto, viaje, emergencia, pedido, aprobacion } = respuesta
  return { ok: true, texto, viaje, emergencia, pedido, aprobacion }
}

export type EstadoDeLaAprobacion =
  | { estado: 'esperando' }
  | { estado: 'aprobado'; viaje?: Viaje; pedido?: Pedido }
  | { estado: 'rechazado'; familiar: string; llamar?: string }
  | { estado: 'no-encontrado' }

/** La pantalla del abuelo pregunta esto cada pocos segundos mientras espera a la familia. */
export async function consultarAprobacion(id: string): Promise<EstadoDeLaAprobacion> {
  const sesion = await leerSesion()
  const aprobacion = typeof id === 'string' ? await leerAprobacion(id) : null
  // Solo el abuelo de esa familia puede ver su pedido.
  if (sesion?.rol !== 'abuelo' || !aprobacion || aprobacion.codigoFamilia !== sesion.codigoFamilia) {
    return { estado: 'no-encontrado' }
  }
  if (aprobacion.estado === 'esperando') return { estado: 'esperando' }
  if (aprobacion.estado === 'aprobado') {
    return aprobacion.que.tipo === 'viaje'
      ? { estado: 'aprobado', viaje: aprobacion.que.viaje }
      : { estado: 'aprobado', pedido: aprobacion.que.pedido }
  }
  // Rechazado: se le ofrece llamar al familiar al que se le preguntó.
  const nombre = aprobacion.preguntadoA.at(-1)?.nombre ?? ''
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  const familiar = configuracion?.familiares.find((f) => f.nombre === nombre)
  return { estado: 'rechazado', familiar: nombre, llamar: familiar && armarEmergencia([familiar]).familiar?.link }
}

/** Dirección de la app para los links del mail (URL_APP si está, o la dirección desde donde se abrió). */
async function urlDeLaApp(): Promise<string> {
  if (process.env.URL_APP) return process.env.URL_APP
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const protocolo = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${protocolo}://${host}`
}

function esCharlaValida(charla: unknown): charla is MensajeCharla[] {
  return (
    Array.isArray(charla) &&
    charla.length > 0 &&
    charla.every(
      (m) =>
        (m?.de === 'abuelo' || m?.de === 'ia') &&
        typeof m.texto === 'string' &&
        m.texto.trim() !== '' &&
        m.texto.length <= MAXIMO_LETRAS,
    ) &&
    charla.at(-1)?.de === 'abuelo'
  )
}
