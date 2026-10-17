'use server'

import { redirect } from 'next/navigation'
import { buscarFamiliaPorMail, crearFamilia, estaSinConfigurar, leerConfiguracion, normalizarMail } from '@/lib/datos'
import { cerrarSesion, iniciarSesion, paginaDeInicio } from '@/lib/sesion'

/** Lo que vuelve a la pantalla de inicio: un error, o el mail que todavía no tiene familia. */
export type EstadoLogin = { error?: string; mailSinFamilia?: string } | null

const pareceMail = (mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)

/** El abuelo entra con el código de su familia. */
export async function entrarAbuelo(_anterior: EstadoLogin, formulario: FormData): Promise<EstadoLogin> {
  const codigo = String(formulario.get('codigo') ?? '')
  if (!codigo.trim()) return { error: 'Escriba el código de su familia' }

  const configuracion = await leerConfiguracion(codigo)
  if (!configuracion) return { error: 'No encontramos ese código de familia' }
  if (estaSinConfigurar(configuracion)) return { error: 'Su familia todavía está preparando el asistente. Pruebe en un rato.' }

  await iniciarSesion({ codigoFamilia: configuracion.codigoFamilia, rol: 'abuelo' })
  redirect(paginaDeInicio.abuelo)
}

/** El familiar entra con su mail. Si no está en ninguna familia, la pantalla le ofrece crear una. */
export async function entrarFamiliar(_anterior: EstadoLogin, formulario: FormData): Promise<EstadoLogin> {
  const mail = normalizarMail(String(formulario.get('mail') ?? ''))
  if (!pareceMail(mail)) return { error: 'Escribí tu mail, por ejemplo nombre@gmail.com' }

  const configuracion = await buscarFamiliaPorMail(mail)
  if (!configuracion) return { mailSinFamilia: mail }

  await iniciarSesion({ codigoFamilia: configuracion.codigoFamilia, rol: 'familiar', mail })
  redirect(paginaDeInicio.familiar)
}

/** Crea una familia nueva con este familiar como el primero, y lo lleva a /familia a configurarla charlando. */
export async function crearFamiliaNueva(_anterior: EstadoLogin, formulario: FormData): Promise<EstadoLogin> {
  const mail = normalizarMail(String(formulario.get('mail') ?? ''))
  const nombre = String(formulario.get('nombre') ?? '').trim()
  if (!pareceMail(mail)) return { error: 'Escribí tu mail, por ejemplo nombre@gmail.com' }
  if (nombre.replace(/[^\p{L}]/gu, '').length < 2) return { error: 'Escribí tu nombre', mailSinFamilia: mail }

  // Si mientras tanto alguien lo sumó a una familia, entra a esa en vez de crear otra.
  const existente = await buscarFamiliaPorMail(mail)
  const configuracion = existente ?? (await crearFamilia({ nombre, mail }))

  await iniciarSesion({ codigoFamilia: configuracion.codigoFamilia, rol: 'familiar', mail })
  redirect(paginaDeInicio.familiar)
}

export async function salir() {
  await cerrarSesion()
  redirect('/')
}
