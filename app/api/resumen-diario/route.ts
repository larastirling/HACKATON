import { timingSafeEqual } from 'node:crypto'
import { familiasConDiario, leerConfiguracion } from '@/lib/datos'
import { mandarResumenDelDia } from '@/lib/resumen'

// Manda el resumen del día a cada familia que usó el asistente hoy.
// Lo llama solo Vercel todas las noches (ver vercel.json), con el header:
//   Authorization: Bearer <CRON_SECRET>

export const maxDuration = 60

export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET
  if (!secreto) return Response.json({ error: 'Falta configurar CRON_SECRET en el servidor' }, { status: 503 })
  const recibido = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const a = Buffer.from(recibido)
  const b = Buffer.from(secreto)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return Response.json({ error: 'Token inválido' }, { status: 401 })

  const resultados: Record<string, string> = {}
  for (const codigo of await familiasConDiario()) {
    const configuracion = await leerConfiguracion(codigo)
    if (!configuracion) continue
    const resultado = await mandarResumenDelDia(configuracion, { unaVezPorDia: true })
    resultados[codigo] = resultado.ok ? `mandado a ${resultado.avisados.join(', ')}` : resultado.error
  }
  return Response.json({ resultados })
}
