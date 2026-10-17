'use server'

import { buscarAprobacionPorToken, responderAprobacion, type EstadoAprobacion } from '@/lib/datos'

export type ResultadoRespuesta = { ok: true; estado: EstadoAprobacion; cambio: boolean } | { ok: false }

/** Guarda la respuesta del familiar. Solo vale la primera: tocar el link de nuevo no cambia nada. */
export async function responder(token: string, respuesta: 'aprobar' | 'rechazar'): Promise<ResultadoRespuesta> {
  if (typeof token !== 'string' || (respuesta !== 'aprobar' && respuesta !== 'rechazar')) return { ok: false }
  const aprobacion = await buscarAprobacionPorToken(token)
  if (!aprobacion) return { ok: false }
  const resultado = await responderAprobacion(aprobacion.id, respuesta === 'aprobar' ? 'aprobado' : 'rechazado')
  if (!resultado) return { ok: false }
  return { ok: true, estado: resultado.aprobacion.estado, cambio: resultado.cambio }
}
