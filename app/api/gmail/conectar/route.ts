import { randomBytes } from 'node:crypto'
import { FAMILIA_DEMO, guardarEstadoConexionGmail, normalizarCodigo, normalizarMail } from '@/lib/datos'
import { leerSesion } from '@/lib/sesion'
import { urlDeLaApp } from '@/lib/url'
import { hayCredencialesDeGoogle, linkDePermiso } from '../google'

// GET /api/gmail/conectar[?mail=<gmail del abuelo>]
// Exige sesión de familiar, anota de qué familia es el viaje y manda a la pantalla de permiso de Google.

export async function GET(request: Request) {
  const sesion = await leerSesion()
  const volver = (resultado: string) => Response.redirect(new URL(`/familia?gmail=${resultado}`, request.url), 303)
  if (sesion?.rol !== 'familiar') return Response.redirect(new URL('/', request.url), 303)
  // La DEMO la protege el script de Apps Script de Inés (gmail/): no se conecta por acá.
  if (normalizarCodigo(sesion.codigoFamilia) === FAMILIA_DEMO.codigoFamilia) return volver('demo')
  if (!hayCredencialesDeGoogle()) return volver('falta-configurar')

  const mail = normalizarMail(new URL(request.url).searchParams.get('mail') ?? '')
  const mailEsperado = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail) ? mail : undefined

  const estado = randomBytes(24).toString('base64url')
  await guardarEstadoConexionGmail(estado, { codigoFamilia: sesion.codigoFamilia, ...(mailEsperado && { mailEsperado }) })
  return Response.redirect(linkDePermiso(estado, await urlDeLaApp(), mailEsperado), 303)
}
