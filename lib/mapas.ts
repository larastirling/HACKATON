import 'server-only'

// Busca las coordenadas de una dirección en OpenStreetMap (Nominatim).
// La IA NUNCA da coordenadas: salen de acá o quedan "PENDIENTE".
// Reglas de uso de Nominatim: máximo 1 búsqueda por segundo y un User-Agent que diga quiénes somos.

export interface UbicacionEncontrada {
  latitud: number
  longitud: number
  /** Cómo la llama el mapa, para que el hijo confirme que es el lugar correcto. */
  direccionDelMapa: string
}

const BUSCADOR = 'https://nominatim.openstreetmap.org/search'
const QUIENES_SOMOS = 'AsistenteDeConfianza/0.1 (hackaton Build 101, Montevideo)'
const ESPERA_ENTRE_BUSQUEDAS_MS = 1100

interface ResultadoNominatim {
  lat: string
  lon: string
  category: string
  display_name: string
  address?: { house_number?: string; country_code?: string }
}

let ultimaBusqueda = 0

async function buscar(texto: string): Promise<ResultadoNominatim | null> {
  const espera = ultimaBusqueda + ESPERA_ENTRE_BUSQUEDAS_MS - Date.now()
  if (espera > 0) await new Promise((r) => setTimeout(r, espera))
  ultimaBusqueda = Date.now()

  const url = new URL(BUSCADOR)
  url.search = new URLSearchParams({ q: texto, format: 'jsonv2', addressdetails: '1', limit: '1', countrycodes: 'uy' }).toString()
  const respuesta = await fetch(url, { headers: { 'User-Agent': QUIENES_SOMOS }, signal: AbortSignal.timeout(10000) })
  if (!respuesta.ok) return null
  const resultados = (await respuesta.json()) as ResultadoNominatim[]
  return resultados[0] ?? null
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
