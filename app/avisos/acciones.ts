'use server'

import {
  buscarFamiliarDelCelular,
  guardarSuscripcion,
  leerConfiguracion,
  quitarSuscripcion,
  type ConfiguracionAbuelo,
} from '@/lib/datos'
import { esSuscripcionValida, notificarASuscripcion } from '@/lib/notificaciones'
import { leerSesion } from '@/lib/sesion'

/** Solo un familiar con sesión iniciada puede tocar los avisos de su familia. */
async function configuracionDelFamiliar(): Promise<ConfiguracionAbuelo | null> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return null
  return leerConfiguracion(sesion.codigoFamilia)
}

/** Guarda este celular para recibir los avisos de ese familiar. */
export async function activarAvisos(familiar: string, suscripcion: unknown): Promise<boolean> {
  const configuracion = await configuracionDelFamiliar()
  if (!configuracion || !configuracion.familiares.some((f) => f.nombre === familiar) || !esSuscripcionValida(suscripcion)) {
    return false
  }
  await guardarSuscripcion(configuracion, familiar, { endpoint: suscripcion.endpoint, keys: suscripcion.keys })
  return true
}

/** ¿Para qué familiar están activados los avisos en este celular? */
export async function quienEsEsteCelular(endpoint: string): Promise<string | null> {
  const configuracion = await configuracionDelFamiliar()
  if (!configuracion || typeof endpoint !== 'string') return null
  return buscarFamiliarDelCelular(configuracion, endpoint)
}

export async function desactivarAvisos(endpoint: string): Promise<void> {
  const configuracion = await configuracionDelFamiliar()
  if (!configuracion || typeof endpoint !== 'string') return
  for (const familiar of configuracion.familiares) await quitarSuscripcion(configuracion.codigoFamilia, familiar.nombre, endpoint)
}

/** Manda un aviso de prueba a este celular. */
export async function probarAviso(suscripcion: unknown): Promise<boolean> {
  const configuracion = await configuracionDelFamiliar()
  if (!configuracion || !esSuscripcionValida(suscripcion)) return false
  const familiar = await buscarFamiliarDelCelular(configuracion, suscripcion.endpoint)
  if (!familiar) return false
  const resultado = await notificarASuscripcion(suscripcion, {
    titulo: '✅ Avisos activados',
    cuerpo: `Hola ${familiar}: así te van a llegar los pedidos y los avisos del abuelo.`,
    url: '/avisos',
    etiqueta: 'prueba',
  })
  return resultado === 'ok'
}
