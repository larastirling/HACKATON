'use server'

import { actualizarSiVencio } from '@/lib/aprobaciones'
import { leerAprobacion, leerConfiguracion, marcarAvisadoAlAbuelo } from '@/lib/datos'
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
import { urlDeLaApp } from '@/lib/url'

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
  | { estado: 'esperando'; familiares: string[] }
  | { estado: 'aprobado'; familiar: string; viaje?: Viaje; pedido?: Pedido }
  | { estado: 'rechazado'; familiar: string; llamar?: string }
  | { estado: 'sin-respuesta'; llamarA?: { nombre: string; link: string } }
  | { estado: 'no-encontrado' }

/**
 * La pantalla del abuelo pregunta esto cada pocos segundos mientras espera a la familia.
 * Cada consulta revisa el reloj: si se venció el tiempo y nadie contestó, queda "sin-respuesta".
 */
export async function consultarAprobacion(id: string): Promise<EstadoDeLaAprobacion> {
  const sesion = await leerSesion()
  const guardada = typeof id === 'string' ? await leerAprobacion(id) : null
  // Solo el abuelo de esa familia puede ver su pedido.
  if (sesion?.rol !== 'abuelo' || !guardada || guardada.codigoFamilia !== sesion.codigoFamilia) {
    return { estado: 'no-encontrado' }
  }
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return { estado: 'no-encontrado' }
  const aprobacion = await actualizarSiVencio(guardada)
  const nombres = aprobacion.preguntadoA.map((p) => p.nombre)

  if (aprobacion.estado === 'esperando') return { estado: 'esperando', familiares: nombres }
  await marcarAvisadoAlAbuelo(aprobacion.id)
  const quien = aprobacion.respondidoPor ?? ''

  if (aprobacion.estado === 'aprobado') {
    return aprobacion.que.tipo === 'viaje'
      ? { estado: 'aprobado', familiar: quien, viaje: aprobacion.que.viaje }
      : { estado: 'aprobado', familiar: quien, pedido: aprobacion.que.pedido }
  }
  if (aprobacion.estado === 'rechazado') {
    // Se le ofrece llamar al familiar que contestó.
    const familiar = configuracion.familiares.find((f) => f.nombre === quien)
    return { estado: 'rechazado', familiar: quien, llamar: familiar && armarEmergencia([familiar]).familiar?.link }
  }
  // Nadie contestó a tiempo: se le ofrece llamar al primer familiar.
  return { estado: 'sin-respuesta', llamarA: armarEmergencia(configuracion.familiares).familiar }
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
