'use server'

import { revalidatePath } from 'next/cache'
import { borrarActividad } from '@/lib/agenda'
import { leerConfiguracion } from '@/lib/datos'
import { leerSesion } from '@/lib/sesion'
import { agregarComoFamiliar, type ResultadoAgenda } from './agregar'

// Lo que hace la familia en /familia/agenda (sin la IA).

export async function agregarALaAgenda(datos: { titulo: string; fecha: string; hora: string; lugar: string }): Promise<ResultadoAgenda> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return { ok: false, mensaje: 'Tenés que entrar como familiar.' }
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return { ok: false, mensaje: 'No encontré tu familia.' }
  const resultado = await agregarComoFamiliar(configuracion, sesion.mail, datos)
  if (resultado.ok) revalidatePath('/familia/agenda')
  return resultado
}

export async function borrarDeLaAgenda(id: string): Promise<boolean> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar' || typeof id !== 'string') return false
  const borrada = await borrarActividad(sesion.codigoFamilia, id)
  if (borrada) revalidatePath('/familia/agenda')
  return borrada
}
