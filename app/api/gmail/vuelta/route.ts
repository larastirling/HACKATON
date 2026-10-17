import { cifrarPermiso, descifrarPermiso, guardarConexionGmail, leerConexionGmail } from '@/app/familia/conexion-gmail'
import { normalizarCodigo, tomarEstadoConexionGmail } from '@/lib/datos'
import { leerSesion } from '@/lib/sesion'
import { urlDeLaApp } from '@/lib/url'
import { cambiarCodigoPorPermiso, mailDeLaCuenta, PERMISO_GMAIL, sacarPermisoEnGoogle } from '../google'

// GET /api/gmail/vuelta?code=…&state=…  (o ?error=access_denied si tocó "Cancelar")
// Google vuelve acá. Cambia el código por el permiso, averigua el Gmail, guarda la ConexionGmail y vuelve a /familia.

const UN_DIA_EN_SEGUNDOS = 24 * 60 * 60

export async function GET(request: Request) {
  const parametros = new URL(request.url).searchParams
  const volver = (resultado: string) => Response.redirect(new URL(`/familia?gmail=${resultado}`, request.url), 303)

  const datos = await tomarEstadoConexionGmail(parametros.get('state') ?? '')
  if (!datos) return volver('vencido') // no existe, ya se usó o pasaron los 10 minutos

  // Tiene que volver al mismo navegador, con la sesión de esa familia.
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar' || normalizarCodigo(sesion.codigoFamilia) !== datos.codigoFamilia) return volver('otra-sesion')

  if (parametros.get('error')) return volver('cancelado')
  const codigo = parametros.get('code')
  if (!codigo) return volver('error')

  const urlApp = await urlDeLaApp()
  const resultado = await cambiarCodigoPorPermiso(codigo, urlApp)
  if (!resultado.ok) return volver(resultado.motivo)

  // En la pantalla de Google se puede destildar el permiso de Gmail: sin él no se puede proteger nada.
  if (!resultado.permisosDados.includes(PERMISO_GMAIL)) {
    await sacarPermisoEnGoogle(resultado.permiso)
    return volver('sin-permiso-gmail')
  }
  const mailAbuelo = await mailDeLaCuenta(resultado.acceso)
  if (!mailAbuelo) {
    await sacarPermisoEnGoogle(resultado.permiso)
    return volver('error')
  }

  // Si ya había otro Gmail conectado, ese permiso viejo se le devuelve a Google.
  const anterior = await leerConexionGmail(datos.codigoFamilia)
  if (anterior) await sacarPermisoEnGoogle(descifrarPermisoSinFallar(anterior.permisoCifrado))

  await guardarConexionGmail(datos.codigoFamilia, {
    mailAbuelo,
    permisoCifrado: cifrarPermiso(resultado.permiso),
    conectadoEl: new Date().toISOString(),
    revisarDesde: Math.floor(Date.now() / 1000) - UN_DIA_EN_SEGUNDOS,
  })
  console.log(`[gmail] familia ${datos.codigoFamilia}: conectado ${mailAbuelo}`)
  return volver(datos.mailEsperado && datos.mailEsperado !== mailAbuelo ? 'conectado-otro' : 'conectado')
}

function descifrarPermisoSinFallar(cifrado: string): string {
  try {
    return descifrarPermiso(cifrado)
  } catch {
    return ''
  }
}
