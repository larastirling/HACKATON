import 'server-only'
import { PENDIENTE, type ConfiguracionAbuelo } from '@/lib/datos'
import { buscarCoordenadas, type UbicacionEncontrada } from '@/lib/mapas'

// Distancia desde la casa de la persona mayor, para las sugerencias de lugares y de comercios:
// solo se sugiere lo que queda a menos de KM_MAXIMOS, del más cerca al más lejos.

/** Distancia máxima entre la casa y lo que se sugiere. Se puede bajar a 5. */
export const KM_MAXIMOS = 10

interface Punto {
  latitud: number
  longitud: number
}

export function kmEntre(a: Punto, b: Punto): number {
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.latitud - a.latitud)
  const dLon = rad(b.longitud - a.longitud)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitud)) * Math.cos(rad(b.latitud)) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

/** "a 1,2 km" */
export const textoDistancia = (km: number) => `a ${km.toFixed(1).replace('.', ',')} km`

// La casa se busca en el mapa una sola vez por dirección (el mapa permite 1 búsqueda por segundo).
// Si no la encuentra (o no hay conexión), se vuelve a probar recién después de un rato.
const casasYaBuscadas = new Map<string, { buscada: Promise<UbicacionEncontrada | null>; cuando: number }>()
const REINTENTAR_SI_NO_LA_ENCONTRO_MS = 10 * 60 * 1000

/**
 * Dónde vive la persona mayor: la ubicación guardada (del mapa o de un link de Google Maps) o, si no hay,
 * la que encuentra el mapa con la dirección. null si no tiene dirección o no se la encuentra.
 */
export async function dondeVive({ abuelo }: Pick<ConfiguracionAbuelo, 'abuelo'>): Promise<UbicacionEncontrada | null> {
  if (abuelo.ubicacion) return { ...abuelo.ubicacion, fuente: abuelo.ubicacion.fuente as UbicacionEncontrada['fuente'] }
  const direccion = abuelo.direccion?.trim()
  if (!direccion || direccion === PENDIENTE) return null
  const anterior = casasYaBuscadas.get(direccion)
  if (anterior) {
    const ubicacion = await anterior.buscada
    if (ubicacion || Date.now() - anterior.cuando < REINTENTAR_SI_NO_LA_ENCONTRO_MS) return ubicacion
  }
  const buscada = buscarCoordenadas(direccion)
  casasYaBuscadas.set(direccion, { buscada, cuando: Date.now() })
  return buscada
}
