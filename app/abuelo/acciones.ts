'use server'

import { leerConfiguracion } from '@/lib/datos'
import { conversarConElAbuelo, type Emergencia, type MensajeCharla, type Pedido, type Viaje } from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'

const MAXIMO_MENSAJES = 40
const MAXIMO_LETRAS = 2000

export type Respuesta =
  | { ok: true; texto: string; viaje?: Viaje; emergencia?: Emergencia; pedido?: Pedido }
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

  const respuesta = await conversarConElAbuelo(configuracion, ultimos)
  if (!respuesta.ok || !respuesta.texto) {
    console.error('La IA no pudo responder al abuelo:', respuesta.ok ? 'respuesta vacía' : respuesta.error)
    return { ok: false }
  }
  const { texto, viaje, emergencia, pedido } = respuesta
  return { ok: true, texto, viaje, emergencia, pedido }
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
