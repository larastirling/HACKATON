import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { PENDIENTE, type ConfiguracionAbuelo } from '@/lib/datos'
import { CATALOGO_COMERCIOS, type ComercioDelCatalogo } from './catalogo-comercios'
import { comercioConNumero, escribirComercio, propiedadesDelPermiso, textoDelPermiso } from './comercios'
import { dondeVive, kmEntre, KM_MAXIMOS, textoDistancia } from './distancia'
import { limpiarApodos, mismoNombre, normalizarTelefono, normalizarTelefonoParaLlamar } from './guardar'

// Sugerencias de comercios del catálogo (catalogo-comercios.ts). Igual que con los lugares, nada se guarda solo:
//   1. La IA muestra algunos como botones (sugerir_comercios). Solo los VERIFICADOS, que entregan donde vive la persona mayor:
//      a menos de KM_MAXIMOS de su casa y, si la fuente dice la zona de envío, dentro de esa zona. Del más cerca al más lejos.
//   2. Si el hijo toca uno, el sistema le cuenta de dónde salió el número y le pregunta qué le pide siempre (sin la IA).
//   3. La IA le pregunta si puede pedir solo o necesita permiso, y lo guarda (guardar_comercio_sugerido) con el número
//      del catálogo. El servidor verifica que el hijo haya dicho lo del permiso, igual que con los lugares.

export interface ComercioSugerido {
  id: string
  nombre: string
  tipo: string
  /** La dirección del local, o "Pedido a la central" si es una cadena. */
  direccion: string
  /** A cuánto queda el local de la casa ("a 1,2 km"). Las cadenas no tienen. */
  distancia?: string
}

export const MAXIMO_SUGERENCIAS_COMERCIOS = 4

/** Solo los verificados y con algún número para pedir. Los demás quedan en el catálogo pero no aparecen. */
const SUGERIBLES = CATALOGO_COMERCIOS.filter((c) => c.verificado && (c.whatsapp || c.llamada.length > 0))

const buscarSugerible = (id: unknown) => SUGERIBLES.find((c) => c.id === id)

const yaGuardado = (c: ConfiguracionAbuelo, comercio: ComercioDelCatalogo) => c.comercios.some((x) => mismoNombre(x.nombre, comercio.nombre))

/** Por WhatsApp si tiene; si no, llamando al primer teléfono. */
const comoSePide = (c: ComercioDelCatalogo) =>
  c.whatsapp ? { pedidoPor: 'whatsapp' as const, numero: c.whatsapp } : { pedidoPor: 'llamada' as const, numero: c.llamada[0] }

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

interface Disponible {
  comercio: ComercioDelCatalogo
  /** A cuántos km de la casa queda el local (null en las cadenas). */
  km: number | null
}

/**
 * Los comercios que se pueden sugerir ahora, del más cerca al más lejos (las cadenas, sin local, al final).
 * Con local: solo si se sabe dónde vive y el local queda a menos de KM_MAXIMOS. Con zona de envío: solo si vive en esa zona.
 */
async function disponibles(configuracion: ConfiguracionAbuelo): Promise<Disponible[]> {
  const candidatos = SUGERIBLES.filter((c) => !yaGuardado(configuracion, c))
  const hayQueUbicar = candidatos.some((c) => c.direccion || c.zonaDeEnvio)
  const casa = hayQueUbicar ? await dondeVive(configuracion) : null

  const lista: Disponible[] = []
  for (const comercio of candidatos) {
    if (comercio.zonaDeEnvio && !(casa && comercio.zonaDeEnvio.some((b) => sinTildes(casa.direccionDelMapa).includes(sinTildes(b))))) continue
    if (!comercio.direccion) {
      lista.push({ comercio, km: null })
      continue
    }
    if (!casa || comercio.latitud === null || comercio.longitud === null) continue // no se sabe a qué distancia queda
    const km = kmEntre(casa, { latitud: comercio.latitud, longitud: comercio.longitud })
    if (km <= KM_MAXIMOS) lista.push({ comercio, km })
  }
  return lista.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity))
}

const paraMostrar = ({ comercio, km }: Disponible): ComercioSugerido => ({
  id: comercio.id,
  nombre: comercio.nombre,
  tipo: comercio.tipo,
  direccion: comercio.direccion ?? 'Pedido a la central',
  ...(km !== null && { distancia: textoDistancia(km) }),
})

/**
 * Los que muestra el sistema solo (al llegar a los comercios o con el botón "Sugerirme comercios"):
 * los más cercanos que todavía no vio en esta charla (si ya vio todos, vuelve a empezar).
 */
export async function comerciosCercanos(configuracion: ConfiguracionAbuelo, yaMostrados: string[]): Promise<ComercioSugerido[]> {
  const lista = await disponibles(configuracion)
  const nuevos = lista.filter((d) => !yaMostrados.includes(d.comercio.id))
  return (nuevos.length > 0 ? nuevos : lista).slice(0, MAXIMO_SUGERENCIAS_COMERCIOS).map(paraMostrar)
}

/** La lista que ve la IA: solo puede sugerir estos (ya filtrados y ordenados del más cerca al más lejos). */
export async function catalogoComerciosParaLaIA(configuracion: ConfiguracionAbuelo): Promise<string> {
  const lista = await disponibles(configuracion)
  if (lista.length === 0) return 'CATÁLOGO DE COMERCIOS PARA SUGERIR: no hay ninguno para sugerir ahora.'
  return [
    'CATÁLOGO DE COMERCIOS PARA SUGERIR (comercios verificados que entregan donde vive, del más cerca al más lejos; son los ÚNICOS que podés sugerir):',
    ...lista.map((d) => {
      const { id, nombre, tipo } = d.comercio
      const { direccion, distancia } = paraMostrar(d)
      return `- ${id} | ${nombre} | ${tipo} | ${direccion}${distancia ? ` | ${distancia}` : ''} | se pide ${comoSePide(d.comercio).pedidoPor === 'whatsapp' ? 'por WhatsApp' : 'llamando'}`
    }),
  ].join('\n')
}

export function herramientaSugerirComercios(): Anthropic.Beta.BetaTool | null {
  if (SUGERIBLES.length === 0) return null
  return {
    name: 'sugerir_comercios',
    description:
      'Le muestra al hijo, debajo de tu mensaje, botones con comercios del CATÁLOGO DE COMERCIOS para que elija si su papá o mamá les pide algo. ' +
      'NO guarda nada: si el hijo toca uno, el sistema le pregunta qué le pide siempre. Solo se muestran los que entregan donde vive.',
    input_schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          // Sin "enum" con los ids, igual que sugerir_lugares: un catálogo grande hace que la API rechace las herramientas strict.
          // sugerirComercios descarta los ids que no están entre los que se pueden sugerir.
          items: { type: 'string' },
          description: `Entre 1 y ${MAXIMO_SUGERENCIAS_COMERCIOS} ids del CATÁLOGO DE COMERCIOS (tal cual aparecen en la lista), los que más le puedan servir según lo que contó el hijo.`,
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

/** Ejecuta sugerir_comercios: arma los botones (sin guardar nada), del más cerca al más lejos, y le dice a la IA qué se muestra. */
export async function sugerirComercios(configuracion: ConfiguracionAbuelo, dato: unknown): Promise<{ texto: string; comerciosSugeridos?: ComercioSugerido[] }> {
  const ids = (dato as { ids?: unknown } | null)?.ids
  if (!Array.isArray(ids)) return { texto: 'No se mostró nada: faltan los ids del catálogo de comercios.' }
  const lista = await disponibles(configuracion)
  const sugerencias = lista.filter((d) => ids.includes(d.comercio.id)).slice(0, MAXIMO_SUGERENCIAS_COMERCIOS).map(paraMostrar)
  if (sugerencias.length === 0) {
    return { texto: 'No se mostró nada: esos comercios no están en el catálogo para sugerir (no verificados, ya guardados, lejos o fuera de su zona de envío).' }
  }
  const noSeMostraron = ids.filter((id) => typeof id === 'string' && !sugerencias.some((s) => s.id === id))
  return {
    comerciosSugeridos: sugerencias,
    texto:
      `Listo: debajo de tu mensaje el hijo ve botones con ${sugerencias.map((s) => s.nombre).join(', ')} y uno de "Ninguno". NO se guardó nada.` +
      (noSeMostraron.length ? ` No se mostraron ${noSeMostraron.join(', ')}: no entregan donde vive o ya están guardados.` : '') +
      ' En tu mensaje preguntale, en una frase, si su papá o mamá le pide a alguno de estos. No los listes: ya están en los botones.',
  }
}

/** De dónde salió el número, para que el hijo sepa cuánto confiar. */
function origenDelNumero(c: ComercioDelCatalogo): string {
  if (c.fuente.tipo === 'prueba') return 'es un comercio de prueba: atiende alguien del equipo'
  const donde = { oficial: 'de su web oficial', redes: 'de sus redes', directorio: 'de una guía de internet' }[c.fuente.tipo]
  return `lo sacamos ${donde} y ya lo confirmamos`
}

/** El hijo tocó un comercio sugerido: el sistema le cuenta de dónde salió el número y le pregunta qué pide siempre. */
export function preguntarPedido(configuracion: ConfiguracionAbuelo, id: unknown): { texto: string; preguntaPedido?: ComercioSugerido } {
  const comercio = buscarSugerible(id)
  if (!comercio) return { texto: 'Ese comercio no está en la lista. ¿Me contás a qué comercio le pide?' }
  if (yaGuardado(configuracion, comercio)) return { texto: `${comercio.nombre} ya está guardado. ¿Le pide a algún otro comercio?` }
  const { pedidoPor, numero } = comoSePide(comercio)
  const como = pedidoPor === 'whatsapp' ? `El WhatsApp que tenemos es ${numero}` : `Se le pide llamando al ${numero}`
  return {
    texto: `Buenísimo: ${comercio.nombre}. ${como}: ${origenDelNumero(comercio)}. ¿Qué le pide siempre?`,
    preguntaPedido: { id: comercio.id, nombre: comercio.nombre, tipo: comercio.tipo, direccion: comercio.direccion ?? 'Pedido a la central' },
  }
}

/** Para guardar un comercio del catálogo después de que el hijo lo eligió, contó qué pide y si necesita permiso. */
export const HERRAMIENTA_GUARDAR_COMERCIO_SUGERIDO: Anthropic.Beta.BetaTool = {
  name: 'guardar_comercio_sugerido',
  description:
    'Guarda un comercio del catálogo que el hijo eligió tocando su botón, con el número del catálogo. ' +
    'Usala recién cuando el hijo te dijo qué le pide siempre Y si puede pedir solo o necesita permiso. Si no lo eligió con el botón, no la uses.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'El id del comercio del catálogo que eligió el hijo.' },
      apodos: {
        type: 'array',
        items: { type: 'string' },
        description: 'Cómo lo llama la persona mayor, tal cual lo dijo el hijo. Puede ser [].',
      },
      pedidoHabitual: { type: 'string', description: 'Lo que pide siempre, con las palabras del hijo.' },
      ...propiedadesDelPermiso,
    },
    required: ['id', 'apodos', 'pedidoHabitual', 'necesitaPermiso', 'fraseDelHijo'],
    additionalProperties: false,
  },
  // Sin strict: Haiku rechaza la charla si hay muchas herramientas strict ("The compiled grammar is too large").
  // Strict queda solo en las que guardan datos; lo que llega por acá lo revisa el servidor igual.
  strict: false,
}

/**
 * Guarda un comercio del catálogo. `elegidos`: los ids que el hijo tocó en esta charla (solo esos se pueden guardar).
 * `loQueEscribioElHijo`: para verificar que dijo si puede pedir solo o necesita permiso.
 */
export async function guardarComercioSugerido(
  codigoFamilia: string,
  dato: unknown,
  elegidos: string[],
  loQueEscribioElHijo: string[],
): Promise<string> {
  console.log('[familia] la IA pidió guardar_comercio_sugerido:', JSON.stringify(dato))
  const { id, apodos, pedidoHabitual, necesitaPermiso, fraseDelHijo } = (dato ?? {}) as Record<string, unknown>
  const del = buscarSugerible(id)
  if (!del) return 'No se guardó: ese comercio no está entre los que se pueden sugerir.'
  if (!elegidos.includes(del.id)) {
    return 'No se guardó: el hijo no eligió ese comercio con el botón. Si querés ofrecérselo, sugerilo con sugerir_comercios.'
  }
  const pedido = typeof pedidoHabitual === 'string' ? pedidoHabitual.trim() : ''
  if (!pedido || pedido.toUpperCase() === PENDIENTE) return 'No se guardó: falta el pedido habitual. Preguntale al hijo qué pide siempre.'
  if (typeof necesitaPermiso !== 'boolean' || typeof fraseDelHijo !== 'string') {
    return 'No se guardó: falta si puede pedir solo o necesita permiso. Preguntáselo al hijo.'
  }

  const { pedidoPor, numero } = comoSePide(del)
  const normalizado = (pedidoPor === 'llamada' ? normalizarTelefonoParaLlamar(numero) : normalizarTelefono(numero)) ?? PENDIENTE
  const comercio = comercioConNumero(
    {
      nombre: del.nombre,
      apodos: Array.isArray(apodos) ? limpiarApodos(apodos.filter((a): a is string => typeof a === 'string')) : [],
      pedidoHabitual: pedido,
      necesitaPermiso,
    },
    pedidoPor,
    normalizado,
  )
  const resultado = await escribirComercio(codigoFamilia, comercio, fraseDelHijo, loQueEscribioElHijo)
  if ('error' in resultado) return resultado.error
  const como = pedidoPor === 'llamada' ? `para pedir llamando al ${normalizado}` : `con el WhatsApp ${normalizado}`
  return (
    `${resultado.yaExistia ? 'Actualizado' : 'Guardado'} "${comercio.nombre}" ${como}, el pedido "${pedido}" y ${textoDelPermiso(resultado.necesitaPermiso)}. ` +
    'Contáselo en una frase y preguntale si le pide a algún otro comercio.'
  )
}
