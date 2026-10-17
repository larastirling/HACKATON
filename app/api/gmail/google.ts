import 'server-only'

// Lo que hablamos con Google para conectar el Gmail del abuelo (docs/plan-gmail-oauth.md, 1.5 y 1.6).
// Pedidos directos con fetch, sin la librería de Google.

/** gmail.modify: leer, etiquetar, sacar de la bandeja y mandar (no borra para siempre). openid + email: saber qué Gmail es. */
export const PERMISO_GMAIL = 'https://www.googleapis.com/auth/gmail.modify'
const PERMISOS = [PERMISO_GMAIL, 'openid', 'email']

// Solo en la compu: GOOGLE_PRUEBA_URL apunta a un Google de mentira para probar sin credenciales reales.
const prueba = process.env.NODE_ENV !== 'production' ? process.env.GOOGLE_PRUEBA_URL : undefined
const DIRECCIONES = {
  permiso: prueba ? `${prueba}/auth` : 'https://accounts.google.com/o/oauth2/v2/auth',
  token: prueba ? `${prueba}/token` : 'https://oauth2.googleapis.com/token',
  cuenta: prueba ? `${prueba}/userinfo` : 'https://openidconnect.googleapis.com/v1/userinfo',
  sacar: prueba ? `${prueba}/revoke` : 'https://oauth2.googleapis.com/revoke',
}

function credenciales() {
  const id = process.env.GOOGLE_CLIENT_ID
  const secreto = process.env.GOOGLE_CLIENT_SECRET
  return id && secreto ? { id, secreto } : null
}

export const hayCredencialesDeGoogle = () => credenciales() !== null

/** Tiene que ser EXACTA a la que Lara cargó en Google Cloud: <URL_APP>/api/gmail/vuelta. */
export const direccionDeVuelta = (urlApp: string) => `${urlApp.replace(/\/$/, '')}/api/gmail/vuelta`

/** La pantalla de Google donde el abuelo elige su Gmail y toca "Permitir". */
export function linkDePermiso(estado: string, urlApp: string, mailEsperado?: string): string {
  const { id } = credenciales()!
  const parametros = new URLSearchParams({
    client_id: id,
    redirect_uri: direccionDeVuelta(urlApp),
    response_type: 'code',
    scope: PERMISOS.join(' '),
    access_type: 'offline', // sin esto Google no da el permiso guardable
    prompt: 'consent', // ídem: que lo dé aunque ya haya permitido antes
    include_granted_scopes: 'true',
    state: estado,
  })
  if (mailEsperado) parametros.set('login_hint', mailEsperado) // Google ya muestra ese Gmail elegido
  return `${DIRECCIONES.permiso}?${parametros}`
}

export type ResultadoPermiso =
  | { ok: true; permiso: string; acceso: string; permisosDados: string[] }
  | { ok: false; motivo: 'sin-permiso-guardable' | 'google-rechazo' }

/** Cambia el código que trae Google a la vuelta por el permiso guardable (refresh token). */
export async function cambiarCodigoPorPermiso(codigo: string, urlApp: string): Promise<ResultadoPermiso> {
  const { id, secreto } = credenciales()!
  const respuesta = await fetch(DIRECCIONES.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: codigo,
      client_id: id,
      client_secret: secreto,
      redirect_uri: direccionDeVuelta(urlApp),
      grant_type: 'authorization_code',
    }),
    signal: AbortSignal.timeout(15000),
  })
  const datos = (await respuesta.json().catch(() => ({}))) as { refresh_token?: string; access_token?: string; scope?: string; error?: string }
  if (!respuesta.ok || !datos.access_token) {
    console.error('[gmail] Google no aceptó el código:', respuesta.status, datos.error)
    return { ok: false, motivo: 'google-rechazo' }
  }
  if (!datos.refresh_token) return { ok: false, motivo: 'sin-permiso-guardable' }
  return { ok: true, permiso: datos.refresh_token, acceso: datos.access_token, permisosDados: (datos.scope ?? '').split(' ') }
}

/** El Gmail de la cuenta que dio el permiso. */
export async function mailDeLaCuenta(acceso: string): Promise<string | null> {
  const respuesta = await fetch(DIRECCIONES.cuenta, { headers: { Authorization: `Bearer ${acceso}` }, signal: AbortSignal.timeout(15000) })
  if (!respuesta.ok) return null
  const datos = (await respuesta.json()) as { email?: string; email_verified?: boolean }
  return datos.email && datos.email_verified !== false ? datos.email.toLowerCase() : null
}

/** Le avisa a Google que la app ya no usa el permiso. Si falla, se borra igual de nuestro lado. */
export async function sacarPermisoEnGoogle(permiso: string): Promise<boolean> {
  try {
    const respuesta = await fetch(DIRECCIONES.sacar, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: permiso }),
      signal: AbortSignal.timeout(15000),
    })
    return respuesta.ok
  } catch {
    return false
  }
}
