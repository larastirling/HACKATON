'use server'

import { timingSafeEqual } from 'node:crypto'
import { modoAlmacenamiento, probarAlmacenamiento, restaurarFamiliaDemo } from '@/lib/datos'
import { preguntarALaIA, type RespuestaIA } from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'

export async function probarDatos(): Promise<{ ok: boolean; texto: string }> {
  if (!(await leerSesion())) return { ok: false, texto: 'Tenés que iniciar sesión' }
  try {
    const leido = await probarAlmacenamiento()
    const donde = modoAlmacenamiento === 'redis' ? 'en Upstash Redis' : 'en memoria (temporal)'
    return { ok: true, texto: `Guardé y leí el dato ${donde}: ${leido}` }
  } catch (error) {
    return { ok: false, texto: `No se pudo usar la base de datos: ${(error as Error).message}` }
  }
}

export async function probarIA(): Promise<RespuestaIA> {
  if (!(await leerSesion())) return { ok: false, error: 'Tenés que iniciar sesión' }
  return preguntarALaIA('Saludá en una sola frase corta, en español, a una persona mayor.')
}

/**
 * Deja la familia DEMO como al principio (para usar antes de la demo).
 * Protegido con la clave CONFIG_API_TOKEN, aunque ya se haya iniciado sesión.
 */
export async function restaurarDemo(clave: string): Promise<{ ok: boolean; texto: string }> {
  if (!(await leerSesion())) return { ok: false, texto: 'Tenés que iniciar sesión' }
  const esperada = process.env.CONFIG_API_TOKEN
  if (!esperada) return { ok: false, texto: 'Falta configurar CONFIG_API_TOKEN en la app' }
  const a = Buffer.from(typeof clave === 'string' ? clave.trim() : '')
  const b = Buffer.from(esperada)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, texto: 'La clave no es correcta. No se cambió nada.' }

  const { pendientesBorrados } = await restaurarFamiliaDemo()
  const pedidos = pendientesBorrados === 1 ? '1 pedido de aprobación pendiente' : `${pendientesBorrados} pedidos de aprobación pendientes`
  return {
    ok: true,
    texto: `Listo: la familia DEMO volvió a sus datos originales (Carlos, Inés, Lara, la pizzería, el shopping con permiso y nivel Acompañado). Se borraron ${pedidos} y el aviso de emergencia quedó listo para salir.`,
  }
}
