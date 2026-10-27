import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import type { ConfiguracionAbuelo } from '@/lib/datos'
import { agregarComoFamiliar } from './agenda/agregar'

// Herramienta "agregar_a_la_agenda": el hijo escribe en la charla algo para la agenda de su papá o mamá
// ("agregale el cumple de Sofi mañana a las 20"). Es lo mismo que el botón "Agenda de …" (/familia/agenda).

export const HERRAMIENTA_AGREGAR_A_LA_AGENDA: Anthropic.Beta.BetaTool = {
  name: 'agregar_a_la_agenda',
  description:
    'Agrega una actividad a la agenda de la persona mayor (le llega el aviso enseguida, y otro un día antes y 2 horas antes). ' +
    'Usala cuando el hijo pide agendar algo y ya dijo qué es, el día y la hora. Pasá el día a fecha con HOY Y LOS PRÓXIMOS DÍAS.',
  input_schema: {
    type: 'object',
    properties: {
      titulo: { type: 'string', description: 'Qué es, corto, como lo diría la familia: "Cumple de su sobrina Sofi", "Médico".' },
      fecha: { type: 'string', description: 'AAAA-MM-DD, ej. "2026-10-28".' },
      hora: { type: 'string', description: 'HH:MM en 24 horas, ej. "20:00".' },
      lugar: { type: 'string', description: 'Dónde, solo si el hijo lo dijo (ej. "lo de Laura"). Si no, "".' },
    },
    required: ['titulo', 'fecha', 'hora'],
    additionalProperties: false,
  },
  // Sin strict, como guardar_matricula: Haiku rechaza la charla si hay muchas herramientas strict. Lo revisa el servidor.
  strict: false,
}

export async function agregarALaAgendaDesdeLaCharla(configuracion: ConfiguracionAbuelo, mail: string | undefined, dato: unknown): Promise<string> {
  console.log('[familia] la IA pidió agregar_a_la_agenda:', JSON.stringify(dato))
  const resultado = await agregarComoFamiliar(configuracion, mail, (dato ?? {}) as Record<string, unknown>)
  if (!resultado.ok) return `No se agregó: ${resultado.mensaje} Pedile al hijo lo que falta. No lo inventes.`
  return `${resultado.mensaje} Contáselo al hijo en una o dos frases y decile que lo puede ver o borrar con el botón "Agenda de …" en /familia.`
}
