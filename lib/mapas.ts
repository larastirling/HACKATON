import 'server-only'
import { closeSync, mkdirSync, openSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Busca las coordenadas de una dirección. La IA NUNCA da coordenadas: salen de acá o quedan "PENDIENTE".
//   1. IDE Uruguay (direcciones.ide.uy, el Sistema Único de Direcciones Geográficas): las direcciones oficiales con
//      número de puerta. Solo vale la coincidencia EXACTA (misma calle y mismo número).
//   2. Si ahí no está, OpenStreetMap (Nominatim), como respaldo. Las búsquedas por nombre ("Hospital Británico") van
//      directo acá, porque IDE es un buscador de direcciones.
//   3. Si tampoco, en /familia la IA le ofrece al hijo pegar un link de Google Maps (coordenadasDeGoogleMaps).
// Reglas de uso (si no se cumplen, nos bloquean; ver https://operations.osmfoundation.org/policies/nominatim/):
//   - Máximo 1 pedido por segundo a cada servicio, contando TODOS los procesos de esta compu (la app y los scripts):
//     los pedidos van de a uno (en fila dentro del proceso, y con un candado en un archivo entre procesos)
//     y se anota en otro archivo cuándo fue el último pedido a cada servicio.
//   - Cada pedido dice quiénes somos (User-Agent con el nombre de la app).
//   - Lo ya buscado se guarda en caché (en un archivo) y no se vuelve a pedir.
//   - Si un servicio nos frena (429), no se le vuelve a pedir nada durante un minuto.

export interface UbicacionEncontrada {
  latitud: number
  longitud: number
  /** Cómo la llama el mapa, para que el hijo confirme que es el lugar correcto. Si se sabe, incluye el barrio. */
  direccionDelMapa: string
  /** De dónde salió la ubicación. */
  fuente: 'IDE Uruguay' | 'OpenStreetMap' | 'Google Maps'
}

type Servicio = 'osm' | 'ide'

const QUIENES_SOMOS = 'Contigo/0.1 (asistente para personas mayores y su familia; hackaton Build 101, Montevideo)'
const ESPERA_ENTRE_PEDIDOS_MS = 1100
const NOMBRE_DEL_SERVICIO: Record<Servicio, string> = { osm: 'OpenStreetMap', ide: 'IDE Uruguay' }

// Archivos compartidos entre procesos (en la carpeta temporal: también se puede escribir ahí en Vercel).
const CARPETA = join(tmpdir(), 'contigo-mapa')
const CANDADO = join(CARPETA, 'turno.lock')
const ultimoPedido = (servicio: Servicio) => join(CARPETA, servicio === 'osm' ? 'ultima-busqueda' : `ultima-busqueda-${servicio}`)
const CACHE = join(CARPETA, 'cache.json')
/** Si un proceso se cortó con el candado puesto, a los 30 s se considera suelto. */
const CANDADO_COLGADO_MS = 30_000
const ESPERA_MAXIMA_DEL_TURNO_MS = 120_000
/** Lo encontrado se guarda 30 días; lo que no encontró, 1 día (por si después lo agregan al mapa). */
const DURA_ENCONTRADO_MS = 30 * 24 * 60 * 60 * 1000
const DURA_NO_ENCONTRADO_MS = 24 * 60 * 60 * 1000
const MAXIMO_EN_CACHE = 5000
/** Si un servicio nos frena (429), no se le pide nada durante este tiempo. */
const PAUSA_SI_NOS_FRENA_MS = 60_000

interface ResultadoNominatim {
  lat: string
  lon: string
  category: string
  type: string
  name?: string
  display_name: string
  /** Solo si se pidió (buscarVarios con zona): quién lo atiende, la marca, etc. */
  extratags?: Record<string, string> | null
  address?: {
    house_number?: string
    road?: string
    suburb?: string
    neighbourhood?: string
    city_district?: string
    city?: string
    country_code?: string
  }
}

/** Lo que devuelve direcciones.ide.uy (api/v1/geocode/direcUnica). Solo los campos que se usan. */
interface ResultadoIde {
  type: string
  address: string
  portalNumber: number | null
  localidad: string | null
  departamento: string | null
  lat: number
  lng: number
  /** 1 = coincidencia exacta; 2 = "Aproximado" (otro número de la calle, u otra calle parecida). */
  state: number
}

let erroresDelMapa = 0

/** Cuántas veces un servicio no contestó bien (por ejemplo, si nos frenó por buscar demasiado). Lo usa el script del catálogo. */
export const cuantosErroresDelMapa = () => erroresDelMapa

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Caché ───────────────────────────────────────────────────
interface EnCache {
  cuando: number
  resultados: unknown[]
}

const normalizar = (texto: string) => texto.trim().replace(/\s+/g, ' ').toLowerCase()

function leerCacheDelDisco(): Record<string, EnCache> {
  try {
    return JSON.parse(readFileSync(CACHE, 'utf8')) as Record<string, EnCache>
  } catch {
    return {}
  }
}

function sigueValido({ cuando, resultados }: EnCache): boolean {
  return Date.now() - cuando < (resultados.length > 0 ? DURA_ENCONTRADO_MS : DURA_NO_ENCONTRADO_MS)
}

/** Se guarda leyendo de nuevo el archivo, así no se pierde lo que anotó otro proceso, y se reemplaza de una vez. */
function guardarEnCache(clave: string, valor: EnCache) {
  try {
    mkdirSync(CARPETA, { recursive: true })
    const cache = leerCacheDelDisco()
    cache[clave] = valor
    const vigentes = Object.entries(cache)
      .filter(([, v]) => sigueValido(v))
      .sort(([, a], [, b]) => b.cuando - a.cuando)
      .slice(0, MAXIMO_EN_CACHE)
    const provisorio = `${CACHE}.${process.pid}.tmp`
    writeFileSync(provisorio, JSON.stringify(Object.fromEntries(vigentes)))
    renameSync(provisorio, CACHE)
  } catch (error) {
    console.error('[mapas] no se pudo guardar la caché:', error)
  }
}

// ── Un pedido por vez, en toda la compu ─────────────────────
// Dentro del proceso, en fila: aunque lleguen dos a la vez, salen de a uno.
let fila: Promise<unknown> = Promise.resolve()
function enFila<T>(tarea: () => Promise<T>): Promise<T> {
  const resultado = fila.then(tarea, tarea)
  fila = resultado.catch(() => undefined)
  return resultado
}

/** Entre procesos: un candado en un archivo. Devuelve cómo soltarlo. */
async function tomarElTurno(): Promise<() => void> {
  try {
    mkdirSync(CARPETA, { recursive: true })
  } catch {
    return () => undefined // sin carpeta temporal: queda solo la fila del proceso
  }
  const hasta = Date.now() + ESPERA_MAXIMA_DEL_TURNO_MS
  for (;;) {
    try {
      closeSync(openSync(CANDADO, 'wx'))
      return () => {
        try {
          unlinkSync(CANDADO)
        } catch {}
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') return () => undefined
      try {
        if (Date.now() - statSync(CANDADO).mtimeMs > CANDADO_COLGADO_MS) unlinkSync(CANDADO)
      } catch {}
      if (Date.now() > hasta) throw new Error('Otro proceso está usando el mapa hace demasiado: no se busca para no pasarse del límite')
      await esperar(200)
    }
  }
}

function anotarUltimoPedido(servicio: Servicio, cuando: number) {
  try {
    writeFileSync(ultimoPedido(servicio), String(cuando))
  } catch {}
}

/**
 * Espera a que pase 1 segundo desde el último pedido de CUALQUIER proceso a ese servicio, y anota este.
 * Devuelve false si el servicio nos frenó hace poco: entonces no se pide (mejor "no encontrado" que insistir).
 */
async function esperarUnSegundo(servicio: Servicio): Promise<boolean> {
  let ultimo = 0
  try {
    ultimo = Number(readFileSync(ultimoPedido(servicio), 'utf8')) || 0
  } catch {}
  const espera = ultimo + ESPERA_ENTRE_PEDIDOS_MS - Date.now()
  if (espera > ESPERA_ENTRE_PEDIDOS_MS) return false // el "último pedido" está en el futuro: es la pausa por un 429
  if (espera > 0) await esperar(espera)
  anotarUltimoPedido(servicio, Date.now())
  return true
}

/** Hace un pedido a un servicio respetando las reglas (caché, de a uno, 1 por segundo, pausa si nos frena). */
async function pedir<T>(servicio: Servicio, clave: string, url: URL): Promise<T[]> {
  const guardado = leerCacheDelDisco()[clave]
  if (guardado && sigueValido(guardado)) return guardado.resultados as T[]

  return enFila(async () => {
    const soltar = await tomarElTurno()
    try {
      // Mientras esperaba el turno, otro proceso pudo haberlo buscado.
      const recien = leerCacheDelDisco()[clave]
      if (recien && sigueValido(recien)) return recien.resultados as T[]
      if (!(await esperarUnSegundo(servicio))) {
        erroresDelMapa++
        console.error(`[mapas] ${NOMBRE_DEL_SERVICIO[servicio]} nos frenó hace poco: no se pide "${clave}" todavía`)
        return []
      }
      const respuesta = await fetch(url, { headers: { 'User-Agent': QUIENES_SOMOS }, signal: AbortSignal.timeout(10000) })
      if (!respuesta.ok) {
        // Un error (por ejemplo 429, "demasiadas búsquedas") nunca se guarda en la caché: no es que no exista.
        erroresDelMapa++
        console.error(`[mapas] ${NOMBRE_DEL_SERVICIO[servicio]} contestó ${respuesta.status} pidiendo "${clave}"`)
        if (respuesta.status === 429) anotarUltimoPedido(servicio, Date.now() + PAUSA_SI_NOS_FRENA_MS)
        return []
      }
      const json = (await respuesta.json()) as unknown
      const resultados = (Array.isArray(json) ? json : json ? [json] : []) as T[]
      guardarEnCache(clave, { cuando: Date.now(), resultados })
      return resultados
    } catch (error) {
      erroresDelMapa++
      throw error
    } finally {
      soltar()
    }
  })
}

// ── OpenStreetMap (Nominatim) ───────────────────────────────
/** Una zona del mapa: oeste, norte, este, sur (grados). Con zona, se busca solo adentro de ella. */
export type Zona = readonly [oeste: number, norte: number, este: number, sur: number]

function buscarEnNominatim(texto: string, limite: number, zona?: Zona): Promise<ResultadoNominatim[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.search = new URLSearchParams({
    q: texto,
    format: 'jsonv2',
    addressdetails: '1',
    limit: String(limite),
    countrycodes: 'uy',
    ...(zona && { viewbox: zona.join(','), bounded: '1', extratags: '1' }),
  }).toString()
  // La clave de caché es la de antes (sin el servicio adelante), así sirve lo que ya está guardado.
  return pedir<ResultadoNominatim>('osm', `${limite}|${normalizar(texto)}${zona ? `|${zona.join(',')}` : ''}`, url)
}

/** Qué hay en un punto, según OpenStreetMap: el barrio (para la zona de envío de los comercios) y si es de Uruguay. */
async function queHayEn(latitud: number, longitud: number): Promise<{ barrio?: string; enUruguay: boolean } | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.search = new URLSearchParams({ lat: latitud.toFixed(6), lon: longitud.toFixed(6), format: 'jsonv2', addressdetails: '1', zoom: '16' }).toString()
  try {
    const [r] = await pedir<ResultadoNominatim>('osm', `reverse|${latitud.toFixed(5)},${longitud.toFixed(5)}`, url)
    if (!r?.address) return null
    return { barrio: r.address.suburb ?? r.address.neighbourhood ?? r.address.city_district, enUruguay: r.address.country_code === 'uy' }
  } catch {
    return null
  }
}

const barrioDe = async (latitud: number, longitud: number) => (await queHayEn(latitud, longitud))?.barrio

/** El barrio de un punto según el mapa (para armar catálogos). */
export const barrioEnElMapa = barrioDe

/** Un lugar tal cual lo tiene el mapa (para armar catálogos, ver scripts/verificar-catalogo.ts). */
export interface LugarDelMapa {
  nombre: string
  /** Qué es para el mapa, ej. "amenity/pharmacy" o "shop/supermarket". */
  categoria: string
  latitud: number
  longitud: number
  calle?: string
  numero?: string
  barrio?: string
  ciudad?: string
  /** Quién lo atiende (operator) o de qué marca es, si el mapa lo dice. Solo en las búsquedas con zona. */
  quienAtiende?: string
  /** Qué cocina, si el mapa lo dice (cuisine): "pizza;burger". Solo en las búsquedas con zona. */
  cocina?: string
  /** Lo que dice el mapa del baño (solo en las búsquedas con zona): toilets, toilets:access, access y fee. */
  bano?: { hay?: string; acceso?: string; accesoAlLugar?: string; seCobra?: string }
}

/**
 * Busca TODOS los lugares que el mapa tiene con ese nombre (hasta 40), por ejemplo las sucursales de una cadena.
 * Para armar catálogos desde un script, y en /familia con buscar_lugar_en_el_mapa (una búsqueda cuando el hijo nombra
 * un lugar, nunca mientras escribe: el mapa no permite autocompletar). Las dos van a la caché y respetan 1 por segundo.
 */
export async function buscarVarios(texto: string, zona?: Zona): Promise<LugarDelMapa[]> {
  const resultados = await buscarEnNominatim(texto, 40, zona)
  return resultados
    // Los baños públicos casi nunca tienen nombre en el mapa: se llaman "Baño público".
    .filter((r) => r.address?.country_code === 'uy' && (r.name || r.type === 'toilets'))
    .map((r) => ({
      nombre: r.name || 'Baño público',
      categoria: `${r.category}/${r.type}`,
      latitud: Number(r.lat),
      longitud: Number(r.lon),
      calle: r.address?.road,
      numero: r.address?.house_number?.split(/[,;]/)[0],
      barrio: r.address?.suburb ?? r.address?.neighbourhood ?? r.address?.city_district,
      ciudad: r.address?.city,
      ...((r.extratags?.operator ?? r.extratags?.brand) && { quienAtiende: r.extratags?.operator ?? r.extratags?.brand }),
      ...(r.extratags?.cuisine && { cocina: r.extratags.cuisine }),
      ...((r.type === 'toilets' || r.extratags?.toilets) && {
        bano: { hay: r.extratags?.toilets, acceso: r.extratags?.['toilets:access'], accesoAlLugar: r.extratags?.access, seCobra: r.extratags?.fee },
      }),
    }))
}

/** Formas de escribir la dirección que se prueban, en orden ("José Ellauri 407" no aparece, "Ellauri 407" sí). */
function variantes(direccion: string): string[] {
  const sinCodigoPostal = direccion.replace(/\b\d{5}\b/g, '').replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim()
  const conCiudad = /montevideo/i.test(sinCodigoPostal) ? sinCodigoPostal : `${sinCodigoPostal}, Montevideo`
  const [calle, ...resto] = conCiudad.split(',')
  const palabras = calle.trim().split(/\s+/)
  // Sin la primera palabra del nombre de la calle (nombres de pila, "Av.", "Calle", etc.)
  const calleCorta = palabras.length >= 3 ? [palabras.slice(1).join(' '), ...resto].join(',') : null
  return [...new Set([direccion, conCiudad, calleCorta].filter((v): v is string => Boolean(v)))]
}

/** El número de puerta es el ÚLTIMO número de la calle: en "18 de Julio 1300" es 1300, no 18. */
function numeroDePuerta(direccion: string): string | undefined {
  return direccion
    .split(',')[0]
    .match(/\b\d{1,5}\b(?!\d)/g)
    ?.filter((n) => n.length < 5)
    .at(-1)
}

/** Solo OpenStreetMap. Si la dirección tiene número de puerta, el resultado tiene que tener ese número. */
export async function buscarEnOpenStreetMap(direccion: string): Promise<UbicacionEncontrada | null> {
  const numero = numeroDePuerta(direccion)
  for (const texto of variantes(direccion)) {
    let resultado: ResultadoNominatim | null
    try {
      resultado = (await buscarEnNominatim(texto, 1))[0] ?? null
    } catch {
      return null // sin conexión con el mapa: mejor PENDIENTE que inventar
    }
    if (!resultado || resultado.address?.country_code !== 'uy') continue
    if (resultado.category === 'highway') continue // es la calle entera, no la casa
    if (numero && !resultado.address?.house_number?.split(/[,;]/).includes(numero)) continue
    return {
      latitud: Number(resultado.lat),
      longitud: Number(resultado.lon),
      direccionDelMapa: resultado.display_name,
      fuente: 'OpenStreetMap',
    }
  }
  return null
}

// ── IDE Uruguay (direcciones.ide.uy) ────────────────────────
const PALABRAS_CHICAS = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'e'])
/** "AVENIDA ALFREDO AROCENA 1644" → "Avenida Alfredo Arocena 1644"; "26 DE MARZO" → "26 de Marzo". */
const comoNombre = (texto: string) =>
  texto
    .toLowerCase()
    .split(/\s+/)
    .map((p, i) => (i > 0 && PALABRAS_CHICAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ')

/** Palabras que no ayudan a reconocer una calle ("Avenida Italia" es "Italia"; "Bulevar General Artigas" es "Artigas"). */
const PALABRAS_GENERICAS = new Set([
  'av', 'avda', 'avenida', 'bv', 'bvar', 'bulevar', 'boulevard', 'calle', 'camino', 'cno', 'pasaje', 'rambla', 'ruta',
  'dr', 'doctor', 'gral', 'general', 'ing', 'ingeniero', 'pres', 'presidente', 'cnel', 'coronel', 'prof', 'profesor', 'arq', 'arquitecto',
  'de', 'del', 'la', 'las', 'los', 'y', 'e', 'montevideo', 'uruguay',
])

/** Las palabras que identifican a la calle: sin tildes, sin números ni palabras genéricas. */
const palabrasDeLaCalle = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9ñ]+/)
    .filter((p) => p && !/^\d+$/.test(p) && !PALABRAS_GENERICAS.has(p))

/**
 * Que IDE haya encontrado LA MISMA calle, no otra con el mismo número: todas las palabras de la calle que escribió
 * el hijo tienen que estar en la que devolvió IDE ("Arocena 1644" → "Avenida Alfredo Arocena 1644" sí;
 * "San José 1084" → "Doctor José María Muñoz 1084" no, porque falta "san").
 */
function esLaMismaCalle(direccion: string, encontrada: string): boolean {
  const buscadas = palabrasDeLaCalle(direccion.split(',')[0])
  const enIde = new Set(palabrasDeLaCalle(encontrada))
  return buscadas.length > 0 && buscadas.every((p) => enIde.has(p))
}

/**
 * Solo IDE Uruguay. Vale únicamente la coincidencia EXACTA con el mismo número de puerta y la misma calle
 * ("Aproximado" puede ser otra puerta u otra calle parecida: mejor no encontrada que equivocada).
 * Sin número de puerta no se busca acá (IDE es para direcciones, no para nombres de lugares).
 */
export async function buscarEnIdeUruguay(direccion: string): Promise<UbicacionEncontrada | null> {
  const numero = numeroDePuerta(direccion)
  if (!numero) return null
  const texto = variantes(direccion)[1] ?? direccion // con ", Montevideo" si no decía la ciudad
  const url = new URL('https://direcciones.ide.uy/api/v1/geocode/direcUnica')
  url.search = new URLSearchParams({ q: texto, limit: '5' }).toString()
  let resultados: ResultadoIde[]
  try {
    resultados = await pedir<ResultadoIde>('ide', `ide|${normalizar(texto)}`, url)
  } catch {
    return null
  }
  const exacta = resultados.find(
    (r) =>
      r.state === 1 &&
      String(r.portalNumber) === numero &&
      esLaMismaCalle(direccion, r.address) &&
      Number.isFinite(r.lat) &&
      Number.isFinite(r.lng),
  )
  if (!exacta) return null
  const barrio = await barrioDe(exacta.lat, exacta.lng)
  const partes = [comoNombre(exacta.address), barrio, exacta.localidad && comoNombre(exacta.localidad)]
  if (exacta.departamento && exacta.departamento !== exacta.localidad) partes.push(comoNombre(exacta.departamento))
  return {
    latitud: exacta.lat,
    longitud: exacta.lng,
    direccionDelMapa: [...new Set(partes.filter(Boolean))].join(', '),
    fuente: 'IDE Uruguay',
  }
}

/**
 * Devuelve las coordenadas solo si se encontró ESE lugar: primero en IDE Uruguay (direcciones oficiales),
 * y si no, en OpenStreetMap. Si la dirección tiene número de puerta, el resultado tiene que tener ese número.
 * Si ninguno lo encuentra, devuelve null y las coordenadas quedan "PENDIENTE".
 */
export async function buscarCoordenadas(direccion: string): Promise<UbicacionEncontrada | null> {
  return (await buscarEnIdeUruguay(direccion)) ?? (await buscarEnOpenStreetMap(direccion))
}

// ── Link de Google Maps ─────────────────────────────────────
// Cuando ningún servicio encuentra la dirección, el hijo puede pegar el link de Google Maps del lugar.
// Las coordenadas salen del link (nunca de la IA). Solo se aceptan si OpenStreetMap confirma que el punto es de Uruguay.

/** Primer filtro, sin pedir nada: el rectángulo que contiene a Uruguay (también agarra un poco de Argentina y Brasil). */
const CERCA_DE_URUGUAY = (latitud: number, longitud: number) => latitud > -35.2 && latitud < -30 && longitud > -58.6 && longitud < -53

/** El primer link de Google Maps que aparece en un texto (largo o corto). */
export function linkDeGoogleMaps(texto: string): string | null {
  const links = texto.match(/https?:\/\/[^\s<>"]+/g) ?? []
  return (
    links.find((l) => /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|(www\.|maps\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+)/i.test(l)) ?? null
  )
}

/** Lee las coordenadas escritas en un link largo de Google Maps. El pin del lugar (!3d…!4d…) vale más que el centro del mapa (@…). */
export function coordenadasEnElLink(link: string): { latitud: number; longitud: number } | null {
  let texto = link
  try {
    texto = decodeURIComponent(link)
  } catch {}
  const numero = String.raw`(-?\d{1,2}\.\d+)`
  const patrones = [
    new RegExp(String.raw`!3d${numero}!4d${numero}`),
    new RegExp(String.raw`[?&](?:q|query|ll|center|destination|daddr)=(?:loc:)?${numero}\s*,\s*${numero}`),
    new RegExp(String.raw`/@${numero},${numero}`),
    new RegExp(String.raw`/maps/(?:place|search|dir)/${numero},\s*${numero}`),
  ]
  for (const patron of patrones) {
    const m = texto.match(patron)
    if (!m) continue
    const latitud = Number(m[1])
    const longitud = Number(m[2])
    if (CERCA_DE_URUGUAY(latitud, longitud)) return { latitud, longitud }
  }
  return null
}

/** Los links cortos (maps.app.goo.gl) redirigen al link largo, que es el que tiene las coordenadas. */
async function abrirLinkCorto(link: string): Promise<string> {
  let actual = link
  for (let saltos = 0; saltos < 4 && !coordenadasEnElLink(actual); saltos++) {
    const respuesta = await fetch(actual, { redirect: 'manual', headers: { 'User-Agent': QUIENES_SOMOS }, signal: AbortSignal.timeout(10000) })
    const destino = respuesta.headers.get('location')
    if (!destino) break
    const siguiente = new URL(destino, actual)
    // A veces pasa por una página de "consentimiento" que trae el link de verdad en ?continue=
    actual = siguiente.searchParams.get('continue') ?? siguiente.toString()
  }
  return actual
}

/**
 * Las coordenadas de un link de Google Maps que pegó el hijo. null si el link no tiene coordenadas
 * o no caen en Uruguay (entonces hay que pedir otro link o la dirección de nuevo).
 */
export async function coordenadasDeGoogleMaps(link: string): Promise<UbicacionEncontrada | null> {
  let largo = link
  try {
    if (!coordenadasEnElLink(link)) largo = await abrirLinkCorto(link)
  } catch {
    return null
  }
  const punto = coordenadasEnElLink(largo)
  if (!punto) return null
  // OpenStreetMap confirma que el punto es de Uruguay (si no contesta, no se acepta: mejor pendiente que equivocado).
  const lugar = await queHayEn(punto.latitud, punto.longitud)
  if (!lugar?.enUruguay) return null
  return {
    ...punto,
    direccionDelMapa: `${lugar.barrio ?? 'Uruguay'} (punto marcado en Google Maps)`,
    fuente: 'Google Maps',
  }
}
