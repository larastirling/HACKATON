import { clavesIguales } from '@/lib/clave'
import { leerConfiguracion } from '@/lib/datos'
import { anotarMail, type CategoriaDeMail } from '@/lib/lo-que-paso'

// El script de Gmail (gmail/avisar-a-la-app.gs) avisa acá cuando marca un mail como ESTAFA o DUDOSO,
// para que la familia lo vea en /familia → "Lo que pasó".
//
//   POST /api/mail-marcado
//   Header: Authorization: Bearer <CONFIG_API_TOKEN>
//   Cuerpo: { "codigo": "DEMO", "categoria": "ESTAFA", "motivo": "Pide la clave del banco", "de": "Banco …", "asunto": "…" }
//
// No se guardan links, mails ni teléfonos del mail (lib/lo-que-paso.ts los saca).

const CATEGORIAS: readonly CategoriaDeMail[] = ['ESTAFA', 'DUDOSO']

export async function POST(request: Request) {
  const tokenEsperado = process.env.CONFIG_API_TOKEN
  if (!tokenEsperado) {
    return Response.json({ error: 'Falta configurar CONFIG_API_TOKEN en el servidor' }, { status: 503 })
  }
  const tokenRecibido = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!clavesIguales(tokenRecibido, tokenEsperado)) {
    return Response.json({ error: 'Token inválido' }, { status: 401 })
  }

  const dato = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const texto = (clave: string, max: number) => (typeof dato?.[clave] === 'string' ? (dato[clave] as string).trim().slice(0, max) : '')
  const codigo = texto('codigo', 20)
  const categoria = texto('categoria', 10).toUpperCase() as CategoriaDeMail
  const motivo = texto('motivo', 1000)
  if (!codigo) return Response.json({ error: 'Falta "codigo"' }, { status: 400 })
  if (!CATEGORIAS.includes(categoria)) return Response.json({ error: '"categoria" tiene que ser ESTAFA o DUDOSO' }, { status: 400 })
  if (!motivo) return Response.json({ error: 'Falta "motivo" (una frase de por qué)' }, { status: 400 })

  const configuracion = await leerConfiguracion(codigo)
  if (!configuracion) return Response.json({ error: 'No existe esa familia' }, { status: 404 })

  const de = texto('de', 200)
  const asunto = texto('asunto', 300)
  await anotarMail(configuracion.codigoFamilia, { categoria, motivo, ...(de && { de }), ...(asunto && { asunto }) })
  return Response.json({ ok: true })
}
