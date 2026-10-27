import { mandarRecordatorios } from '@/lib/agenda'
import { clavesIguales } from '@/lib/clave'

// Manda los recordatorios de la agenda que tocan (un día antes y 2 horas antes; ver lib/agenda.ts).
// Lo llama cron-job.org cada 10 minutos (el plan gratis de Vercel solo permite tareas una vez por día), con el header:
//   Authorization: Bearer <CRON_SECRET>
// Cómo configurarlo: docs/pendientes-catalogo-comercios.md.

export const maxDuration = 60

export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET
  if (!secreto) return Response.json({ error: 'Falta configurar CRON_SECRET en el servidor' }, { status: 503 })
  const recibido = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!clavesIguales(recibido, secreto)) return Response.json({ error: 'Token inválido' }, { status: 401 })
  return Response.json(await mandarRecordatorios())
}
