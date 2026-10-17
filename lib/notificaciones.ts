import 'server-only'
import webpush from 'web-push'
import { leerSuscripciones, quitarSuscripcion, type SuscripcionPush } from './datos'

// Notificaciones en el celular de la familia (Web Push estándar con claves VAPID).
// Las claves van en variables de entorno: VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY.
// Si algo falla, no se rompe nada: quien llama manda el mail igual.

export interface Notificacion {
  titulo: string
  cuerpo: string
  /** Página que se abre al tocar la notificación (por ejemplo "/aprobacion/…" o "/emergencia"). */
  url: string
  /** Para que una notificación nueva reemplace a la anterior del mismo tipo. */
  etiqueta?: string
  /** Segundos que el servicio de notificaciones la guarda si el celular está apagado. */
  segundosDeVida?: number
}

/** Clave pública (la necesita el celular para activar los avisos). null si no está configurada. */
export function clavePublicaVapid(): string | null {
  return process.env.VAPID_PUBLIC_KEY || null
}

/** Servicios de notificaciones conocidos: solo se aceptan celulares suscriptos a estos. */
const SERVICIOS_DE_NOTIFICACIONES = [
  'fcm.googleapis.com', // Chrome y Android
  'android.googleapis.com',
  'push.apple.com', // iPhone y Safari
  'push.services.mozilla.com', // Firefox
  'notify.windows.com', // Edge
]

export function esSuscripcionValida(dato: unknown): dato is SuscripcionPush {
  const s = dato as SuscripcionPush | null
  if (!s || typeof s.endpoint !== 'string' || typeof s.keys?.p256dh !== 'string' || typeof s.keys?.auth !== 'string') {
    return false
  }
  try {
    const url = new URL(s.endpoint)
    return (
      url.protocol === 'https:' &&
      SERVICIOS_DE_NOTIFICACIONES.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))
    )
  } catch {
    return false
  }
}

function configurar(): boolean {
  const publica = process.env.VAPID_PUBLIC_KEY
  const privada = process.env.VAPID_PRIVATE_KEY
  if (!publica || !privada) return false
  const contacto = process.env.VAPID_SUBJECT || `mailto:${process.env.GMAIL_USUARIO || 'asistente@example.com'}`
  webpush.setVapidDetails(contacto, publica, privada)
  return true
}

/** Manda la notificación a UN celular. Devuelve si llegó al servicio de notificaciones. */
export async function notificarASuscripcion(suscripcion: SuscripcionPush, notificacion: Notificacion): Promise<'ok' | 'ya-no-existe' | 'error'> {
  if (!configurar()) return 'error'
  try {
    await webpush.sendNotification(
      suscripcion,
      JSON.stringify({ titulo: notificacion.titulo, cuerpo: notificacion.cuerpo, url: notificacion.url, etiqueta: notificacion.etiqueta }),
      { TTL: notificacion.segundosDeVida ?? 3600, urgency: 'high' },
    )
    return 'ok'
  } catch (error) {
    const estado = (error as { statusCode?: number }).statusCode
    if (estado === 404 || estado === 410) return 'ya-no-existe' // el celular ya no tiene los avisos activados
    console.error('No se pudo mandar la notificación:', estado ?? (error as Error).message)
    return 'error'
  }
}

/**
 * Manda la notificación a todos los celulares de un familiar. Devuelve true si llegó a alguno.
 * Nunca lanza errores: si falla, quien llama sigue igual (y el mail se manda igual).
 */
export async function notificarAFamiliar(codigoFamilia: string, familiar: string, notificacion: Notificacion): Promise<boolean> {
  try {
    const suscripciones = await leerSuscripciones(codigoFamilia, familiar)
    let llego = false
    for (const suscripcion of suscripciones) {
      const resultado = await notificarASuscripcion(suscripcion, notificacion)
      if (resultado === 'ok') llego = true
      if (resultado === 'ya-no-existe') await quitarSuscripcion(codigoFamilia, familiar, suscripcion.endpoint)
    }
    return llego
  } catch (error) {
    console.error('No se pudieron mandar las notificaciones:', error)
    return false
  }
}
