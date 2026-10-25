import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import type { ConfiguracionAbuelo, Lugar } from '@/lib/datos'
import { CATALOGO_LUGARES, type LugarDelCatalogo } from './catalogo-lugares'
import { dondeVive, kmEntre, KM_MAXIMOS, textoDistancia } from './distancia'
import { cambiarConfiguracion, mismoNombre } from './guardar'

// Sugerencias de lugares comunes de Montevideo (catálogo verificado con el mapa).
// Solo los que quedan a menos de KM_MAXIMOS de la casa, del más cerca al más lejos (sin la casa ubicada, ninguno).
// Nada se guarda solo:
//   1. La IA muestra algunas sugerencias como botones (sugerir_lugares). Si el hijo no toca ninguna, no pasa nada.
//   2. Si toca una, el sistema le pregunta "¿Puede ir solo o necesita permiso?" (sin la IA, siempre igual).
//   3. Recién con esa respuesta se guarda. Nunca queda libre por defecto.

export interface LugarSugerido {
  id: string
  nombre: string
  tipo: string
  direccion: string
  /** El barrio según el mapa (para el buscador de "Ver todos"). */
  barrio?: string
  /** A cuánto queda de la casa ("a 1,2 km"), si se sabe. */
  distancia?: string
}

export const MAXIMO_SUGERENCIAS = 4

const yaGuardado = (c: ConfiguracionAbuelo, lugar: LugarDelCatalogo) => c.lugares.some((l) => mismoNombre(l.nombre, lugar.nombre))

export const buscarEnCatalogo = (id: unknown) => CATALOGO_LUGARES.find((l) => l.id === id)

const paraMostrar = ({ id, nombre, tipo, direccion, barrio }: LugarDelCatalogo, km?: number): LugarSugerido => ({
  id,
  nombre,
  tipo,
  direccion,
  barrio,
  ...(km !== undefined && { distancia: textoDistancia(km) }),
})

interface Disponible {
  lugar: LugarDelCatalogo
  km: number
}

/**
 * Los lugares del catálogo que se pueden sugerir: todavía no guardados y a menos de KM_MAXIMOS de la casa,
 * del más cerca al más lejos. null si no se sabe dónde vive (sin eso no se sugiere ninguno).
 */
async function disponibles(configuracion: ConfiguracionAbuelo): Promise<Disponible[] | null> {
  const casa = await dondeVive(configuracion)
  if (!casa) return null
  return CATALOGO_LUGARES.filter((l) => !yaGuardado(configuracion, l))
    .map((lugar) => ({ lugar, km: kmEntre(casa, lugar) }))
    .filter((d) => d.km <= KM_MAXIMOS)
    .sort((a, b) => a.km - b.km)
}

/** Para "Ver todos los cercanos": todos los del catálogo a menos de KM_MAXIMOS (no guardados), del más cerca al más lejos. */
export async function todosLosLugaresCercanos(configuracion: ConfiguracionAbuelo): Promise<LugarSugerido[]> {
  return ((await disponibles(configuracion)) ?? []).map((d) => paraMostrar(d.lugar, d.km))
}

/** Al elegir solos (sin la IA), los tipos que más le pueden servir van primero. */
const TIPOS_PRIMERO = [
  'Salud',
  'Farmacia',
  'Supermercado',
  'Pagos',
  'Banco',
  'Trámites',
  'Plaza',
  'Iglesia',
  'Club',
  'Centro de jubilados',
  'Café',
  'Shopping',
  'Correo',
  'Biblioteca',
  'Cine',
  'Teatro',
  'Mercado',
  'Paseo',
  'Cementerio',
]

/**
 * Las sugerencias que muestra el sistema solo (al llegar a los lugares o con el botón "Sugerirme lugares"):
 * el más cercano de cada tipo, los tipos más útiles primero, sin repetir los que ya vio en esta charla
 * (si ya vio todos, vuelve a empezar). Del más cerca al más lejos. null si no se sabe dónde vive.
 */
export async function lugaresCercanos(configuracion: ConfiguracionAbuelo, yaMostrados: string[]): Promise<LugarSugerido[] | null> {
  const lista = await disponibles(configuracion)
  if (!lista) return null
  const nuevos = lista.filter((d) => !yaMostrados.includes(d.lugar.id))
  const candidatos = nuevos.length > 0 ? nuevos : lista
  const prioridad = (tipo: string) => (TIPOS_PRIMERO.includes(tipo) ? TIPOS_PRIMERO.indexOf(tipo) : TIPOS_PRIMERO.length)
  const tipos = [...new Set(candidatos.map((d) => d.lugar.tipo))].sort((a, b) => prioridad(a) - prioridad(b))
  return tipos
    .slice(0, MAXIMO_SUGERENCIAS)
    .map((tipo) => candidatos.find((d) => d.lugar.tipo === tipo)!) // la lista ya viene del más cerca al más lejos
    .sort((a, b) => a.km - b.km)
    .map((d) => paraMostrar(d.lugar, d.km))
}

/**
 * Cuántos de cada tipo ve la IA (los más cercanos): con ~300 lugares, mandarlos todos haría cada mensaje mucho más caro.
 * El hijo igual ve todos en "Ver todos los cercanos".
 */
const POR_TIPO_PARA_LA_IA = 3

/**
 * La lista que ve la IA: solo puede sugerir estos. Va agrupada por tipo (primero el tipo que tiene el más cercano)
 * y, dentro de cada tipo, del más cerca al más lejos: así, de varias farmacias, la primera es la más cercana.
 */
export async function catalogoParaLaIA(configuracion: ConfiguracionAbuelo): Promise<string> {
  const lista = await disponibles(configuracion)
  if (!lista) {
    return 'CATÁLOGO DE LUGARES PARA SUGERIR: todavía no se puede sugerir ninguno, porque la dirección de la casa no está ubicada en el mapa (hace falta para saber qué le queda cerca). No uses sugerir_lugares.'
  }
  if (lista.length === 0) return `CATÁLOGO DE LUGARES PARA SUGERIR: no queda ninguno a menos de ${KM_MAXIMOS} km de su casa. No uses sugerir_lugares.`
  const tipos = [...new Set(lista.map((d) => d.lugar.tipo))]
  return [
    `CATÁLOGO DE LUGARES PARA SUGERIR (lugares reales, verificados en el mapa, a menos de ${KM_MAXIMOS} km de su casa; son los ÚNICOS que podés sugerir). ` +
      `Por tipo, los ${POR_TIPO_PARA_LA_IA} más cercanos de cada uno, del más cerca al más lejos:`,
    ...tipos.flatMap((tipo) => [
      `${tipo}:`,
      ...lista
        .filter((d) => d.lugar.tipo === tipo)
        .slice(0, POR_TIPO_PARA_LA_IA)
        .map((d) => `- ${d.lugar.id} | ${d.lugar.nombre} | ${d.lugar.direccion} | ${textoDistancia(d.km)}`),
    ]),
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
          // Sin "enum" con los ids: con el catálogo grande (más de 100), la API rechaza las herramientas strict
          // ("The compiled grammar is too large"). sugerirLugares descarta los ids que no están en el catálogo.
          items: { type: 'string' },
          description:
            `Entre 1 y ${MAXIMO_SUGERENCIAS} ids del CATÁLOGO (tal cual aparecen en la lista), los que más le puedan servir según lo que contó el hijo. ` +
            'De cada tipo, el más cercano (el primero de su grupo), salvo que el hijo haya nombrado otro.',
        },
      },
      required: ['ids'],
      additionalProperties: false,
    },
    // Sin strict: Haiku rechaza la charla si hay muchas herramientas strict ("The compiled grammar is too large").
    // Strict queda solo en las que guardan datos; lo que llega por acá lo revisa el servidor igual.
    strict: false,
  }
}

/** Ejecuta sugerir_lugares: arma los botones (sin guardar nada), del más cerca al más lejos, y le dice a la IA qué se muestra. */
export async function sugerirLugares(configuracion: ConfiguracionAbuelo, dato: unknown): Promise<{ texto: string; sugerencias?: LugarSugerido[] }> {
  const ids = (dato as { ids?: unknown } | null)?.ids
  if (!Array.isArray(ids)) return { texto: 'No se mostró nada: faltan los ids del catálogo.' }
  const lista = await disponibles(configuracion)
  if (!lista) return { texto: 'No se mostró nada: la dirección de la casa no está ubicada en el mapa, así que no se sabe qué le queda cerca.' }
  const sugerencias = lista
    .filter((d) => ids.includes(d.lugar.id))
    .slice(0, MAXIMO_SUGERENCIAS)
    .map((d) => paraMostrar(d.lugar, d.km))
  if (sugerencias.length === 0) {
    return { texto: `No se mostró nada: esos lugares no están en el catálogo, ya están guardados o quedan a más de ${KM_MAXIMOS} km de su casa.` }
  }
  const noSeMostraron = ids.filter((id) => typeof id === 'string' && !sugerencias.some((s) => s.id === id))
  return {
    sugerencias,
    texto:
      `Listo: debajo de tu mensaje el hijo ve botones con ${sugerencias.map((s) => `${s.nombre} (${s.distancia})`).join(', ')} y uno de "Ninguno". NO se guardó nada.` +
      (noSeMostraron.length ? ` No se mostraron ${noSeMostraron.join(', ')}: quedan a más de ${KM_MAXIMOS} km o ya están guardados.` : '') +
      ' En tu mensaje preguntale, en una frase, si su papá o mamá va a alguno de estos (por ejemplo "¿Va a alguno de estos?"). No los listes: ya están en los botones.',
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
    'Guarda un lugar del catálogo (o uno que encontró buscar_lugar_en_el_mapa) que el hijo eligió, SOLO después de que contestó si puede ir solo o necesita permiso ' +
    '(el mensaje anterior tuyo tiene que ser esa pregunta). Si no contestó eso, no la uses.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'El id del lugar por el que se le preguntó (del catálogo, o "mapa:…" si lo encontró el mapa).' },
      necesitaPermiso: { type: 'boolean', description: 'true si el hijo dijo que necesita permiso; false si dijo que puede ir solo.' },
    },
    required: ['id', 'necesitaPermiso'],
    additionalProperties: false,
  },
  // Sin strict: Haiku rechaza la charla si hay muchas herramientas strict ("The compiled grammar is too large").
  // Strict queda solo en las que guardan datos; lo que llega por acá lo revisa el servidor igual.
  strict: false,
}
