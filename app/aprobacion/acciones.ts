'use server'

import { actualizarSiVencio, MINUTOS_PARA_CONTESTAR, textoMinutos } from '@/lib/aprobaciones'
import { buscarAprobacionPorToken, cerrarAprobacion, leerConfiguracion, type EstadoAprobacion } from '@/lib/datos'
import { urlDeLaApp } from '@/lib/url'

export type ResultadoRespuesta =
  /** `fuisteVos`: si la respuesta guardada es de este mismo familiar (y no de otro). */
  | { ok: true; estado: EstadoAprobacion; cambio: boolean; respondidoPor?: string; fuisteVos: boolean }
  /** El link ya no sirve: se venció el tiempo (y quizás ahora se le preguntó a otro familiar). */
  | { ok: true; vencido: true; tiempo: string; ahoraSeLePreguntaA?: string }
  | { ok: false }

/**
 * Guarda la respuesta del familiar. Solo vale la primera respuesta, y solo si su link sigue vigente:
 * si se le venció el tiempo y ya se le preguntó a otro familiar, no cambia nada.
 */
export async function responder(token: string, respuesta: 'aprobar' | 'rechazar'): Promise<ResultadoRespuesta> {
  if (typeof token !== 'string' || (respuesta !== 'aprobar' && respuesta !== 'rechazar')) return { ok: false }
  const encontrado = await buscarAprobacionPorToken(token)
  if (!encontrado) return { ok: false }

  // Antes de aceptar la respuesta, se revisa el reloj (por si ya le tocaba a otro familiar).
  const configuracion = await leerConfiguracion(encontrado.aprobacion.codigoFamilia)
  const actual = configuracion
    ? await actualizarSiVencio(encontrado.aprobacion, configuracion, await urlDeLaApp())
    : encontrado.aprobacion

  if (actual.estado === 'aprobado' || actual.estado === 'rechazado') {
    const fuisteVos = actual.respondidoPor === encontrado.pregunta.nombre
    return { ok: true, estado: actual.estado, cambio: false, respondidoPor: actual.respondidoPor, fuisteVos }
  }
  const vigente = actual.preguntadoA.at(-1)?.token === token
  if (actual.estado === 'sin-respuesta' || !vigente) {
    return {
      ok: true,
      vencido: true,
      tiempo: textoMinutos(MINUTOS_PARA_CONTESTAR),
      ...(actual.estado === 'esperando' && { ahoraSeLePreguntaA: actual.preguntadoA.at(-1)?.nombre }),
    }
  }

  const resultado = await cerrarAprobacion(actual.id, respuesta === 'aprobar' ? 'aprobado' : 'rechazado', encontrado.pregunta.nombre)
  if (!resultado) return { ok: false }
  const { estado, respondidoPor } = resultado.aprobacion
  return { ok: true, estado, cambio: resultado.cambio, respondidoPor, fuisteVos: respondidoPor === encontrado.pregunta.nombre }
}
