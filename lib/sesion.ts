import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Sesión guardada en una cookie firmada: nadie puede cambiarla sin el SESSION_SECRET.

export type Rol = 'abuelo' | 'familiar'

export interface Sesion {
  codigoFamilia: string
  rol: Rol
  /** Con qué mail entró el familiar (las sesiones de antes no lo tienen). */
  mail?: string
}

const NOMBRE_COOKIE = 'sesion'
const UN_ANIO_EN_SEGUNDOS = 60 * 60 * 24 * 365

export const paginaDeInicio: Record<Rol, string> = {
  abuelo: '/abuelo',
  familiar: '/familia',
}

function secreto(): string {
  const valor = process.env.SESSION_SECRET
  if (valor) return valor
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Falta la variable de entorno SESSION_SECRET')
  }
  return 'secreto-solo-para-desarrollo'
}

function firmar(texto: string): string {
  return createHmac('sha256', secreto()).update(texto).digest('base64url')
}

export async function iniciarSesion(sesion: Sesion): Promise<void> {
  const datos = Buffer.from(JSON.stringify(sesion)).toString('base64url')
  const almacen = await cookies()
  almacen.set(NOMBRE_COOKIE, `${datos}.${firmar(datos)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: UN_ANIO_EN_SEGUNDOS, // el abuelo no tiene que volver a entrar
  })
}

export async function cerrarSesion(): Promise<void> {
  const almacen = await cookies()
  almacen.delete(NOMBRE_COOKIE)
}

export async function leerSesion(): Promise<Sesion | null> {
  const valor = (await cookies()).get(NOMBRE_COOKIE)?.value
  if (!valor) return null
  const [datos, firma] = valor.split('.')
  if (!datos || !firma) return null

  const esperada = Buffer.from(firmar(datos))
  const recibida = Buffer.from(firma)
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null

  try {
    return JSON.parse(Buffer.from(datos, 'base64url').toString()) as Sesion
  } catch {
    return null
  }
}

/**
 * Usar al principio de cada página protegida.
 * Sin sesión → al login. Con el rol equivocado → a su propia página.
 */
export async function exigirSesion(rolPermitido?: Rol): Promise<Sesion> {
  const sesion = await leerSesion()
  if (!sesion) redirect('/')
  if (rolPermitido && sesion.rol !== rolPermitido) redirect(paginaDeInicio[sesion.rol])
  return sesion
}
