'use server'

import { actualizarSiVencio, MINUTOS_PARA_CONTESTAR, textoMinutos } from '@/lib/aprobaciones'
import { buscarAprobacionPorToken, cerrarAprobacion, type EstadoAprobacion } from '@/lib/datos'

export type ResultadoRespuesta =
  /** `fuisteVos`: si la respuesta guardada es de este mismo familiar (y no de otro). */
  | { ok: true; estado: EstadoAprobacion; cambio: boolean; respondidoPor?: string; fuisteVos: boolean }
  /** El link ya no sirve: pasó el tiempo y nadie contestó. */
  | { ok: true; vencido: true; tiempo: string }
  | { ok: false }

/**
 * Guarda la respuesta del familiar. Se les preguntó a todos a la vez: gana el PRIMERO que contesta.
 * Si después otro toca su link (o se venció el tiempo), no cambia nada.
 */
export async function responder(token: string, respuesta: 'aprobar' | 'rechazar'): Promise<ResultadoRespuesta> {
  if (typeof token !== 'string' || (respuesta !== 'aprobar' && respuesta !== 'rechazar')) return { ok: false }
  const encontrado = await buscarAprobacionPorToken(token)
  if (!encontrado) return { ok: false }

  // Antes de aceptar la respuesta, se revisa el reloj (por si ya se venció el tiempo).
  const actual = await actualizarSiVencio(encontrado.aprobacion)

  if (actual.estado === 'aprobado' || actual.estado === 'rechazado') {
    const fuisteVos = actual.respondidoPor === encontrado.pregunta.nombre
    return { ok: true, estado: actual.estado, cambio: false, respondidoPor: actual.respondidoPor, fuisteVos }
  }
  if (actual.estado === 'sin-respuesta') return { ok: true, vencido: true, tiempo: textoMinutos(MINUTOS_PARA_CONTESTAR) }

  const resultado = await cerrarAprobacion(actual.id, respuesta === 'aprobar' ? 'aprobado' : 'rechazado', encontrado.pregunta.nombre)
  if (!resultado) return { ok: false }
  const { estado, respondidoPor } = resultado.aprobacion
  return { ok: true, estado, cambio: resultado.cambio, respondidoPor, fuisteVos: respondidoPor === encontrado.pregunta.nombre }
}
