import 'server-only'
import { timingSafeEqual } from 'node:crypto'

// Para las rutas que usa el script de Gmail (/api/configuracion y /api/mail-marcado), protegidas con CONFIG_API_TOKEN.

/** Compara la clave recibida con la esperada sin dar pistas por el tiempo que tarda (timingSafeEqual). */
export function clavesIguales(recibida: string, esperada: string): boolean {
  const a = Buffer.from(recibida)
  const b = Buffer.from(esperada)
  return a.length === b.length && timingSafeEqual(a, b)
}
