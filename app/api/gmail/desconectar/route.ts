import { borrarConexionGmail, descifrarPermiso, leerConexionGmail } from '@/app/familia/conexion-gmail'
import { leerSesion } from '@/lib/sesion'
import { sacarPermisoEnGoogle } from '../google'

// POST /api/gmail/desconectar (el botón "Desconectar" de /familia)
// Le avisa a Google que se saca el permiso y borra la conexión de esta familia.

export async function POST(request: Request) {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return Response.redirect(new URL('/', request.url), 303)

  const conexion = await leerConexionGmail(sesion.codigoFamilia)
  if (conexion) {
    try {
      await sacarPermisoEnGoogle(descifrarPermiso(conexion.permisoCifrado))
    } catch {
      // Si no se puede descifrar o Google no contesta, se borra igual de nuestro lado.
    }
    await borrarConexionGmail(sesion.codigoFamilia)
    console.log(`[gmail] familia ${sesion.codigoFamilia}: desconectado ${conexion.mailAbuelo}`)
  }
  return Response.redirect(new URL('/familia?gmail=desconectado', request.url), 303)
}
