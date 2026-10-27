'use server'

import { revalidatePath } from 'next/cache'
import { agregarActividad, borrarActividad, textoAgregada } from '@/lib/agenda'
import { leerConfiguracion } from '@/lib/datos'
import { leerSesion } from '@/lib/sesion'

// Lo que hace la familia en /familia/agenda (sin la IA).

export type ResultadoAgenda = { ok: true; mensaje: string } | { ok: false; mensaje: string }

export async function agregarALaAgenda(datos: { titulo: string; fecha: string; hora: string; lugar: string }): Promise<ResultadoAgenda> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return { ok: false, mensaje: 'Tenés que entrar como familiar.' }
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return { ok: false, mensaje: 'No encontré tu familia.' }
  const texto = (v: unknown) => (typeof v === 'string' ? v.slice(0, 200) : '')
  // Quién la agrega: el familiar que entró con ese mail (si no se encuentra, el primero).
  const yo =
    configuracion.familiares.find((f) => sesion.mail && f.mail.toLowerCase() === sesion.mail.toLowerCase()) ??
    [...configuracion.familiares].sort((a, b) => a.orden - b.orden)[0]
  const resultado = await agregarActividad(configuracion, yo?.nombre ?? 'Un familiar', {
    titulo: texto(datos?.titulo),
    fecha: texto(datos?.fecha),
    hora: texto(datos?.hora),
    lugar: texto(datos?.lugar),
  })
  if (!resultado.ok) return { ok: false, mensaje: resultado.problema }
  revalidatePath('/familia/agenda')
  const nombre = configuracion.abuelo.nombre.split(' ')[0]
  return {
    ok: true,
    mensaje: resultado.avisado
      ? `Listo. A ${nombre} le llegó al celular: "${textoAgregada(configuracion, resultado.actividad)}"`
      : `Listo, quedó en la agenda. ${nombre} todavía no activó los avisos en su celular: lo va a ver cuando abra la app.`,
  }
}

export async function borrarDeLaAgenda(id: string): Promise<boolean> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar' || typeof id !== 'string') return false
  const borrada = await borrarActividad(sesion.codigoFamilia, id)
  if (borrada) revalidatePath('/familia/agenda')
  return borrada
}
