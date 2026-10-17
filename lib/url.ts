import 'server-only'
import { headers } from 'next/headers'

/** Dirección de la app para los links de los mails (URL_APP si está, o la dirección desde donde se abrió). */
export async function urlDeLaApp(): Promise<string> {
  if (process.env.URL_APP) return process.env.URL_APP
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const protocolo = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${protocolo}://${host}`
}
