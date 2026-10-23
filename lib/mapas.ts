import 'server-only'
import { closeSync, mkdirSync, openSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Busca las coordenadas de una dirección en OpenStreetMap (Nominatim).
// La IA NUNCA da coordenadas: salen de acá o quedan "PENDIENTE".
// Reglas de uso de Nominatim (https://operations.osmfoundation.org/policies/nominatim/), que si no se cumplen nos bloquean:
//   - Máximo 1 búsqueda por segundo, contando TODOS los procesos de esta compu (la app y los scripts):
//     las búsquedas van de a una (en fila dentro del proceso, y con un candado en un archivo entre procesos)
//     y se anota en otro archivo cuándo fue la última.
//   - Cada pedido dice quiénes somos (User-Agent con el nombre de la app).
//   - Lo ya buscado se guarda en caché (en un archivo) y no se vuelve a pedir.

export interface UbicacionEncontrada {
  latitud: number
  longitud: number
  /** Cómo la llama el mapa, para que el hijo confirme que es el lugar correcto. */
  direccionDelMapa: string
}

const BUSCADOR = 'https://nominatim.openstreetmap.org/search'
const QUIENES_SOMOS = 'Contigo/0.1 (asistente para personas mayores y su familia; hackaton Build 101, Montevideo)'
const ESPERA_ENTRE_BUSQUEDAS_MS = 1100

// Archivos compartidos entre procesos (en la carpeta temporal: también se puede escribir ahí en Vercel).
const CARPETA = join(tmpdir(), 'contigo-mapa')
const CANDADO = join(CARPETA, 'turno.lock')
const ULTIMA_BUSQUEDA = join(CARPETA, 'ultima-busqueda')
const CACHE = join(CARPETA, 'cache.json')
/** Si un proceso se cortó con el candado puesto, a los 30 s se considera suelto. */
const CANDADO_COLGADO_MS = 30_000
const ESPERA_MAXIMA_DEL_TURNO_MS = 120_000
/** Lo encontrado se guarda 30 días; lo que no encontró, 1 día (por si después lo agregan al mapa). */
const DURA_ENCONTRADO_MS = 30 * 24 * 60 * 60 * 1000
const DURA_NO_ENCONTRADO_MS = 24 * 60 * 60 * 1000
const MAXIMO_EN_CACHE = 5000

interface ResultadoNominatim {
  lat: string
  lon: string
  category: string
  type: string
  name?: string
  display_name: string
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

let erroresDelMapa = 0

/** Cuántas veces el mapa no contestó bien (por ejemplo, si nos frenó por buscar demasiado). Lo usa el script del catálogo. */
export const cuantosErroresDelMapa = () => erroresDelMapa

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Caché ───────────────────────────────────────────────────
interface EnCache {
  cuando: number
  resultados: ResultadoNominatim[]
}

const claveDeCache = (texto: string, limite: number) => `${limite}|${texto.trim().replace(/\s+/g, ' ').toLowerCase()}`

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

// ── Una búsqueda por vez, en toda la compu ──────────────────
// Dentro del proceso, en fila: aunque lleguen dos a la vez, salen de a una.
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

/** Si el mapa nos frena (429), nadie (ningún proceso) vuelve a buscar durante este tiempo. */
const PAUSA_SI_NOS_FRENA_MS = 60_000

/**
 * Espera a que pase 1 segundo desde la última búsqueda de CUALQUIER proceso, y anota esta.
 * Devuelve false si el mapa nos frenó hace poco: entonces no se busca (mejor "no encontrado" que insistir).
 */
async function esperarUnSegundo(): Promise<boolean> {
  let ultima = 0
  try {
    ultima = Number(readFileSync(ULTIMA_BUSQUEDA, 'utf8')) || 0
  } catch {}
  const espera = ultima + ESPERA_ENTRE_BUSQUEDAS_MS - Date.now()
  if (espera > ESPERA_ENTRE_BUSQUEDAS_MS) return false // la "última búsqueda" está en el futuro: es la pausa por un 429
  if (espera > 0) await esperar(espera)
  anotarUltimaBusqueda(Date.now())
  return true
}

function anotarUltimaBusqueda(cuando: number) {
  try {
    writeFileSync(ULTIMA_BUSQUEDA, String(cuando))
  } catch {}
}

async function buscarEnElMapa(texto: string, limite: number): Promise<ResultadoNominatim[]> {
  const clave = claveDeCache(texto, limite)
  const guardado = leerCacheDelDisco()[clave]
  if (guardado && sigueValido(guardado)) return guardado.resultados

  return enFila(async () => {
    const soltar = await tomarElTurno()
    try {
      // Mientras esperaba el turno, otro proceso pudo haberlo buscado.
      const recien = leerCacheDelDisco()[clave]
      if (recien && sigueValido(recien)) return recien.resultados
      if (!(await esperarUnSegundo())) {
        erroresDelMapa++
        console.error(`[mapas] el mapa nos frenó hace poco: no se busca "${texto}" todavía`)
        return []
      }

      const url = new URL(BUSCADOR)
      url.search = new URLSearchParams({ q: texto, format: 'jsonv2', addressdetails: '1', limit: String(limite), countrycodes: 'uy' }).toString()
      const respuesta = await fetch(url, { headers: { 'User-Agent': QUIENES_SOMOS }, signal: AbortSignal.timeout(10000) })
      if (!respuesta.ok) {
        // Un error (por ejemplo 429, "demasiadas búsquedas") nunca se guarda en la caché: no es que no exista.
        erroresDelMapa++
        console.error(`[mapas] el mapa contestó ${respuesta.status} buscando "${texto}"`)
        if (respuesta.status === 429) anotarUltimaBusqueda(Date.now() + PAUSA_SI_NOS_FRENA_MS)
        return []
      }
      const resultados = (await respuesta.json()) as ResultadoNominatim[]
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

async function buscar(texto: string): Promise<ResultadoNominatim | null> {
  return (await buscarEnElMapa(texto, 1))[0] ?? null
}

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
}

/**
 * Busca TODOS los lugares que el mapa tiene con ese nombre (hasta 40), por ejemplo las sucursales de una cadena.
 * Solo para armar catálogos desde un script: nunca con lo que escribe el hijo.
 */
export async function buscarVarios(texto: string): Promise<LugarDelMapa[]> {
  const resultados = await buscarEnElMapa(texto, 40)
  return resultados
    .filter((r) => r.address?.country_code === 'uy' && r.name)
    .map((r) => ({
      nombre: r.name!,
      categoria: `${r.category}/${r.type}`,
      latitud: Number(r.lat),
      longitud: Number(r.lon),
      calle: r.address?.road,
      numero: r.address?.house_number?.split(/[,;]/)[0],
      barrio: r.address?.suburb ?? r.address?.neighbourhood ?? r.address?.city_district,
      ciudad: r.address?.city,
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

/**
 * Devuelve las coordenadas solo si el mapa encontró ESE lugar:
 * si la dirección tiene número de puerta, el resultado tiene que tener ese número.
 * Si solo encuentra la calle (o nada), devuelve null y las coordenadas quedan "PENDIENTE".
 */
export async function buscarCoordenadas(direccion: string): Promise<UbicacionEncontrada | null> {
  // El número de puerta es el ÚLTIMO número de la calle: en "18 de Julio 1300" es 1300, no 18.
  const numero = direccion
    .split(',')[0]
    .match(/\b\d{1,5}\b(?!\d)/g)
    ?.filter((n) => n.length < 5)
    .at(-1)
  for (const texto of variantes(direccion)) {
    let resultado: ResultadoNominatim | null
    try {
      resultado = await buscar(texto)
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
    }
  }
  return null
}
