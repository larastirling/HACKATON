import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import type { ConfiguracionAbuelo, Lugar } from '@/lib/datos'
import { CATALOGO_LUGARES, type LugarDelCatalogo } from './catalogo-lugares'
import { cambiarConfiguracion, mismoNombre } from './guardar'

// Sugerencias de lugares comunes de Montevideo (catálogo verificado con el mapa).
// Nada se guarda solo:
//   1. La IA muestra algunas sugerencias como botones (sugerir_lugares). Si el hijo no toca ninguna, no pasa nada.
//   2. Si toca una, el sistema le pregunta "¿Puede ir solo o necesita permiso?" (sin la IA, siempre igual).
//   3. Recién con esa respuesta se guarda. Nunca queda libre por defecto.

export interface LugarSugerido {
  id: string
  nombre: string
  tipo: string
  direccion: string
}

export const MAXIMO_SUGERENCIAS = 4

const yaGuardado = (c: ConfiguracionAbuelo, lugar: LugarDelCatalogo) => c.lugares.some((l) => mismoNombre(l.nombre, lugar.nombre))

export const buscarEnCatalogo = (id: unknown) => CATALOGO_LUGARES.find((l) => l.id === id)

const paraMostrar = ({ id, nombre, tipo, direccion }: LugarDelCatalogo): LugarSugerido => ({ id, nombre, tipo, direccion })

/** La lista que ve la IA: solo puede sugerir estos (los que todavía no están guardados). */
export function catalogoParaLaIA(configuracion: ConfiguracionAbuelo): string {
  const disponibles = CATALOGO_LUGARES.filter((l) => !yaGuardado(configuracion, l))
  if (disponibles.length === 0) return 'CATÁLOGO DE LUGARES PARA SUGERIR: no queda ninguno para sugerir.'
  return [
    'CATÁLOGO DE LUGARES PARA SUGERIR (lugares reales de Montevideo, verificados en el mapa; son los ÚNICOS que podés sugerir):',
    ...disponibles.map((l) => `- ${l.id} | ${l.nombre} | ${l.tipo} | ${l.direccion}`),
  ].join('\n')
}

export function herramientaSugerirLugares(): Anthropic.Beta.BetaTool | null {
  if (CATALOGO_LUGARES.length === 0) return null
  return {
    name: 'sugerir_lugares',
    description:
      'Le muestra al hijo, debajo de tu mensaje, botones con lugares comunes de Montevideo del CATÁLOGO para que elija si su papá o mamá va a alguno. ' +
      'NO guarda nada: si el hijo toca uno, el sistema le pregunta si puede ir solo o necesita permiso antes de guardarlo.',
    input_schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string', enum: CATALOGO_LUGARES.map((l) => l.id) },
          description: `Entre 2 y ${MAXIMO_SUGERENCIAS} ids del catálogo, los que más le puedan servir según lo que contó el hijo.`,
        },
      },
      required: ['ids'],
      additionalProperties: false,
    },
    strict: true,
  }
}

/** Ejecuta sugerir_lugares: arma los botones (sin guardar nada) y le dice a la IA qué se muestra. */
export function sugerirLugares(configuracion: ConfiguracionAbuelo, dato: unknown): { texto: string; sugerencias?: LugarSugerido[] } {
  const ids = (dato as { ids?: unknown } | null)?.ids
  if (!Array.isArray(ids)) return { texto: 'No se mostró nada: faltan los ids del catálogo.' }
  const sugerencias = [...new Set(ids)]
    .map(buscarEnCatalogo)
    .filter((l): l is LugarDelCatalogo => !!l && !yaGuardado(configuracion, l))
    .slice(0, MAXIMO_SUGERENCIAS)
    .map(paraMostrar)
  if (sugerencias.length === 0) return { texto: 'No se mostró nada: esos lugares no están en el catálogo o ya están guardados.' }
  return {
    sugerencias,
    texto:
      `Listo: debajo de tu mensaje el hijo ve botones con ${sugerencias.map((s) => s.nombre).join(', ')} y uno de "Ninguno". ` +
      'NO se guardó nada. En tu mensaje preguntale, en una frase, si su papá o mamá va a alguno de estos (por ejemplo "¿Va a alguno de estos?"). No los listes: ya están en los botones.',
  }
}

/** El hijo tocó una sugerencia: antes de guardar, se le pregunta si puede ir solo o necesita permiso. */
export function preguntarPermiso(configuracion: ConfiguracionAbuelo, id: unknown): { texto: string; preguntaPermiso?: LugarSugerido } {
  const lugar = buscarEnCatalogo(id)
  if (!lugar) return { texto: 'Ese lugar no está en la lista. ¿Me contás a qué lugar va?' }
  if (yaGuardado(configuracion, lugar)) return { texto: `${lugar.nombre} ya está guardado. ¿Va seguido a algún otro lugar?` }
  return { texto: `Buenísimo: ${lugar.nombre} (${lugar.direccion}). ¿Puede ir solo o necesita permiso?`, preguntaPermiso: paraMostrar(lugar) }
}

/** Guarda un lugar del catálogo, con el permiso que eligió el hijo. Solo se llama después de preguntarle. */
export async function guardarLugarSugerido(codigoFamilia: string, id: unknown, necesitaPermiso: boolean): Promise<string> {
  const del = buscarEnCatalogo(id)
  if (!del) return 'No se guardó: ese lugar no está en el catálogo.'
  const lugar: Lugar = {
    nombre: del.nombre,
    apodos: [],
    direccion: del.direccion,
    latitud: del.latitud,
    longitud: del.longitud,
    necesitaPermiso,
  }
  let yaEstaba = false
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    yaEstaba = c.lugares.some((l) => mismoNombre(l.nombre, lugar.nombre))
    return yaEstaba ? c : { ...c, lugares: [...c.lugares, lugar] }
  })
  if (error) return error
  if (yaEstaba) return `"${lugar.nombre}" ya estaba guardado: no se cambió nada.`
  return `Guardado "${lugar.nombre}" (${lugar.direccion}) ${necesitaPermiso ? 'con permiso: la familia lo aprueba antes de que vaya' : 'como libre: puede ir solo'}.`
}

/** Para cuando el hijo contesta escribiendo (en vez de tocar el botón) la pregunta del permiso. */
export const HERRAMIENTA_GUARDAR_LUGAR_SUGERIDO: Anthropic.Beta.BetaTool = {
  name: 'guardar_lugar_sugerido',
  description:
    'Guarda un lugar del catálogo que el hijo eligió, SOLO después de que contestó si puede ir solo o necesita permiso ' +
    '(el mensaje anterior tuyo tiene que ser esa pregunta). Si no contestó eso, no la uses.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'El id del lugar del catálogo por el que se le preguntó.' },
      necesitaPermiso: { type: 'boolean', description: 'true si el hijo dijo que necesita permiso; false si dijo que puede ir solo.' },
    },
    required: ['id', 'necesitaPermiso'],
    additionalProperties: false,
  },
  strict: true,
}
