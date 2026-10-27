'use server'

import { marcarVistas } from '@/lib/agenda'
import { guardarSuscripcionDelAbuelo, leerConfiguracion, leerSuscripcionesDelAbuelo } from '@/lib/datos'
import { esSuscripcionValida, notificarASuscripcion } from '@/lib/notificaciones'
import { leerSesion } from '@/lib/sesion'
import { tratoDe } from '@/lib/trato'

// Lo que hace el abuelo en /abuelo/agenda: activar los avisos en su celular y dar por vistas las novedades.

async function familiaDelAbuelo() {
  const sesion = await leerSesion()
  return sesion?.rol === 'abuelo' ? leerConfiguracion(sesion.codigoFamilia) : null
}

export async function activarAvisosDelAbuelo(suscripcion: unknown): Promise<boolean> {
  const configuracion = await familiaDelAbuelo()
  if (!configuracion || !esSuscripcionValida(suscripcion)) return false
  await guardarSuscripcionDelAbuelo(configuracion, { endpoint: suscripcion.endpoint, keys: suscripcion.keys })
  return true
}

/** ¿Este celular ya tiene los avisos activados para el abuelo? */
export async function avisosActivadosEn(endpoint: string): Promise<boolean> {
  const configuracion = await familiaDelAbuelo()
  if (!configuracion || typeof endpoint !== 'string') return false
  return (await leerSuscripcionesDelAbuelo(configuracion.codigoFamilia)).some((s) => s.endpoint === endpoint)
}

export async function probarAvisoDelAbuelo(suscripcion: unknown): Promise<boolean> {
  const configuracion = await familiaDelAbuelo()
  if (!configuracion || !esSuscripcionValida(suscripcion)) return false
  if (!(await avisosActivadosEn(suscripcion.endpoint))) return false
  const deVos = tratoDe(configuracion.abuelo.comoLeGustaQueLeHablen) === 'vos'
  const resultado = await notificarASuscripcion(suscripcion, {
    titulo: 'Aviso de prueba',
    cuerpo: deVos ? 'Así te van a llegar los avisos de tu agenda.' : 'Así le van a llegar los avisos de su agenda.',
    url: '/abuelo/agenda',
    etiqueta: 'prueba-agenda',
  })
  return resultado === 'ok'
}

export async function marcarAgendaVista(): Promise<void> {
  const sesion = await leerSesion()
  if (sesion?.rol === 'abuelo') await marcarVistas(sesion.codigoFamilia)
}
