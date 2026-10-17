'use server'

import { leerConfiguracion, type Lugar } from '@/lib/datos'
import { charlarConLaIA, type RespuestaIA } from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'
import { INSTRUCCIONES_FAMILIA, lugaresParaLaIA } from './instrucciones'
import { guardarLugar, HERRAMIENTA_GUARDAR_LUGAR } from './lugares'

const MAXIMO_MENSAJES = 60
const MAXIMO_LETRAS = 2000

export interface MensajeCharla {
  role: 'user' | 'assistant'
  content: string
}

export type RespuestaFamilia = RespuestaIA & { lugares?: Lugar[] }

export async function responder(mensajes: MensajeCharla[]): Promise<RespuestaFamilia> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return { ok: false, error: 'Tenés que entrar como familiar' }
  if (!esCharlaValida(mensajes)) return { ok: false, error: 'La charla es demasiado larga o vino vacía' }

  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return { ok: false, error: 'No encontramos la configuración de tu familia' }

  // La IA ve los lugares que ya están guardados, así no los repite y puede corregirlos.
  const instrucciones = `${INSTRUCCIONES_FAMILIA}\n\n${lugaresParaLaIA(configuracion.lugares)}`
  const respuesta = await charlarConLaIA(instrucciones, mensajes, {
    tools: [HERRAMIENTA_GUARDAR_LUGAR],
    usarHerramienta: (bloque) =>
      bloque.name === HERRAMIENTA_GUARDAR_LUGAR.name
        ? guardarLugar(sesion.codigoFamilia, bloque.input)
        : `No existe la herramienta "${bloque.name}".`,
  })

  const actualizada = await leerConfiguracion(sesion.codigoFamilia)
  return { ...respuesta, lugares: actualizada?.lugares }
}

function esCharlaValida(mensajes: unknown): mensajes is MensajeCharla[] {
  return (
    Array.isArray(mensajes) &&
    mensajes.length > 0 &&
    mensajes.length <= MAXIMO_MENSAJES &&
    mensajes.every(
      (m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.length <= MAXIMO_LETRAS,
    ) &&
    mensajes.at(-1)?.role === 'user'
  )
}
