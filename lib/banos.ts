import 'server-only'
import { CATALOGO_LUGARES, type LugarDelCatalogo } from '@/app/familia/catalogo-lugares'
import { dondeVive, kmEntre } from '@/app/familia/distancia'
import type { ConfiguracionAbuelo } from './datos'

// Baños cerca de la casa del abuelo ("quiero ir al baño"): los del catálogo de lugares con tipo "Baño"
// (scripts/verificar-catalogo.ts). Cada uno dice de dónde sale el dato, y los que el mapa no confirma
// que sean públicos (el de un shopping o una terminal) vienen marcados "sin confirmar".
// Se calcula desde la casa: la app no sabe dónde está el abuelo en este momento.

/** Más lejos que esto, no se sugiere. */
export const KM_MAXIMOS_BANO = 3
const CUANTOS = 3

export interface BanoCercano {
  lugar: LugarDelCatalogo
  km: number
}

/** Los baños más cercanos a la casa (null si no se sabe dónde vive). Los confirmados van primero si quedan casi igual de cerca. */
export async function banosCercanos(configuracion: Pick<ConfiguracionAbuelo, 'abuelo'>): Promise<BanoCercano[] | null> {
  const casa = await dondeVive(configuracion)
  if (!casa) return null
  // 300 m de ventaja para los confirmados: mejor uno seguro un poco más lejos que uno que quizás no lo dejan usar.
  const orden = (b: BanoCercano) => b.km + (b.lugar.sinConfirmar ? 0.3 : 0)
  return CATALOGO_LUGARES.filter((l) => l.tipo === 'Baño')
    .map((lugar) => ({ lugar, km: kmEntre(casa, lugar) }))
    .filter((b) => b.km <= KM_MAXIMOS_BANO)
    .sort((a, b) => orden(a) - orden(b))
    .slice(0, CUANTOS)
}

/** "a 400 metros" / "a 1,2 km" */
export const textoDistanciaBano = (km: number) => (km < 1 ? `a ${Math.max(100, Math.round((km * 1000) / 100) * 100)} metros` : `a ${km.toFixed(1).replace('.', ',')} km`)
