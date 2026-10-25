import { clavesIguales } from '@/lib/clave'
import { leerConfiguracion } from '@/lib/datos'

// Devuelve la configuración de un abuelo. La usa el Google Apps Script de Gmail.
//
//   GET /api/configuracion?codigo=DEMO
//   Header: Authorization: Bearer <CONFIG_API_TOKEN>

export async function GET(request: Request) {
  const tokenEsperado = process.env.CONFIG_API_TOKEN
  if (!tokenEsperado) {
    return Response.json({ error: 'Falta configurar CONFIG_API_TOKEN en el servidor' }, { status: 503 })
  }

  const tokenRecibido = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!clavesIguales(tokenRecibido, tokenEsperado)) {
    return Response.json({ error: 'Token inválido' }, { status: 401 })
  }

  const codigo = new URL(request.url).searchParams.get('codigo')
  if (!codigo) {
    return Response.json({ error: 'Falta el parámetro ?codigo=' }, { status: 400 })
  }

  const configuracion = await leerConfiguracion(codigo)
  if (!configuracion) {
    return Response.json({ error: 'No existe esa familia' }, { status: 404 })
  }
  return Response.json(configuracion)
}
