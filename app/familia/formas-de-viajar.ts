import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { FORMAS_DE_VIAJAR, type FormaDeViajar } from '@/lib/datos'
import { KM_MAXIMOS_CAMINANDO } from '@/lib/viajes'
import { cambiarConfiguracion } from './guardar'

// Herramienta "guardar_formas_de_viajar": cómo puede ir la persona mayor a los lugares (formasDeViajar,
// sección 7 de docs/formato-configuracion.md). En /abuelo el asistente solo ofrece las que se guardan acá.
// Las familias que nunca lo eligieron tienen solo Uber.

export const HERRAMIENTA_GUARDAR_FORMAS_DE_VIAJAR: Anthropic.Beta.BetaTool = {
  name: 'guardar_formas_de_viajar',
  description:
    'Guarda cómo puede ir la persona mayor a los lugares guardados: en Uber, caminando y/o en colectivo. ' +
    'Pasá TODAS las que el hijo quiere (reemplaza las anteriores). Usala solo con lo que dijo el hijo.',
  input_schema: {
    type: 'object',
    properties: {
      formas: {
        type: 'array',
        items: { type: 'string', enum: [...FORMAS_DE_VIAJAR] },
        description: 'Las formas que el hijo eligió, ej. ["uber", "colectivo"]. Puede ser [] si no quiere que se le ofrezca ninguna.',
      },
    },
    required: ['formas'],
    additionalProperties: false,
  },
  // Sin strict, como sugerir_lugares: Haiku rechaza la charla si hay muchas herramientas strict.
  // Lo que llega lo revisa el servidor igual.
  strict: false,
}

const COMO_VA: Record<FormaDeViajar, string> = { uber: 'en Uber', caminando: 'caminando', colectivo: 'en colectivo' }

/** "en Uber, caminando y en colectivo" */
export function comoPuedeIr(formas: FormaDeViajar[]): string {
  const lista = formas.map((f) => COMO_VA[f])
  return lista.length <= 1 ? (lista[0] ?? 'de ninguna forma') : `${lista.slice(0, -1).join(', ')} y ${lista.at(-1)}`
}

export async function guardarFormasDeViajar(codigoFamilia: string, dato: unknown): Promise<string> {
  console.log('[familia] la IA pidió guardar_formas_de_viajar:', JSON.stringify(dato))
  const formas = (dato as { formas?: unknown } | null)?.formas
  if (!Array.isArray(formas) || !formas.every((f) => FORMAS_DE_VIAJAR.includes(f))) {
    return `No se guardó: las formas tienen que ser una lista con ${FORMAS_DE_VIAJAR.join(', ')}.`
  }
  // Siempre en el mismo orden (Uber, caminando, colectivo) y sin repetir.
  const elegidas: FormaDeViajar[] = FORMAS_DE_VIAJAR.filter((f) => formas.includes(f))
  const error = await cambiarConfiguracion(codigoFamilia, (c) => ({ ...c, formasDeViajar: elegidas }))
  if (error) return error
  if (elegidas.length === 0) {
    return 'Guardado: no se le ofrece ninguna forma de viajar (el asistente no le va a armar viajes). Contáselo al hijo en una frase.'
  }
  return (
    `Guardado: puede ir ${comoPuedeIr(elegidas)}. Contáselo al hijo en una frase.` +
    (elegidas.includes('caminando') ? ` Aclarale que caminando solo se le ofrece a lugares a menos de ${String(KM_MAXIMOS_CAMINANDO).replace('.', ',')} km de su casa.` : '')
  )
}
