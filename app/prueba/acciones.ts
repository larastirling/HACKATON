'use server'

import { modoAlmacenamiento, probarAlmacenamiento } from '@/lib/datos'
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
