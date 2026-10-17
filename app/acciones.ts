'use server'

import { redirect } from 'next/navigation'
import { leerConfiguracion } from '@/lib/datos'
import { cerrarSesion, iniciarSesion, paginaDeInicio, type Rol } from '@/lib/sesion'

export async function entrar(_estadoAnterior: string | null, formulario: FormData): Promise<string | null> {
  const codigo = String(formulario.get('codigo') ?? '')
  const rol = formulario.get('rol') as Rol

  if (!codigo.trim()) return 'Escribí el código de tu familia'
  if (rol !== 'abuelo' && rol !== 'familiar') return 'Elegí "Soy el abuelo" o "Soy familiar"'

  const configuracion = await leerConfiguracion(codigo)
  if (!configuracion) return 'No encontramos ese código de familia'

  await iniciarSesion({ codigoFamilia: configuracion.codigoFamilia, rol })
  redirect(paginaDeInicio[rol])
}

export async function salir() {
  await cerrarSesion()
  redirect('/')
}
