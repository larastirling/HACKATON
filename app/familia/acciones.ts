'use server'

import { charlarConLaIA, type RespuestaIA } from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'
import { INSTRUCCIONES_FAMILIA } from './instrucciones'

export interface MensajeCharla {
  role: 'user' | 'assistant'
  content: string
}

export async function responder(mensajes: MensajeCharla[]): Promise<RespuestaIA> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return { ok: false, error: 'Tenés que entrar como familiar' }
  return charlarConLaIA(INSTRUCCIONES_FAMILIA, mensajes)
}
