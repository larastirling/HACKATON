import 'server-only'
import { dondeVive, kmEntre } from '@/app/familia/distancia'
import { formasDeViajarDe, type ConfiguracionAbuelo, type FormaDeViajar, type Lugar } from './datos'

// Viajes: las formas de ir a un lugar (Uber, caminando, colectivo). El servidor arma todos los links
// con las coordenadas GUARDADAS; la IA nunca escribe links ni coordenadas.
//   - Uber: abre la app con el destino puesto. El auto lo pide el abuelo.
//   - Caminando y colectivo: abren Google Maps con el destino puesto (gratis, sin clave). Google Maps
//     guía caminando hasta el lugar, o hasta la parada, en el colectivo y dónde bajarse.

/** Caminando solo se ofrece si el lugar queda a menos de esto de su casa. */
export const KM_MAXIMOS_CAMINANDO = 1.5

export interface OpcionDeViaje {
  forma: FormaDeViajar
  link: string
}

/** Lo que necesita la pantalla para mostrar la tarjeta del viaje. */
export interface Viaje {
  nombre: string
  direccion: string
  /** Un botón por forma de viajar, en el orden en que se muestran (la que pidió el abuelo, primero). */
  opciones: OpcionDeViaje[]
  /** Solo en viajes guardados antes de que existieran las opciones: el link de Uber. */
  link?: string
}

type Destino = Pick<Lugar, 'nombre' | 'direccion' | 'latitud' | 'longitud'>

export type ResultadoViaje =
  | { ok: true; viaje: Viaje; caminandoNo?: string }
  | { ok: false; motivo: 'sin-ubicacion' }
  | { ok: false; motivo: 'sin-formas'; caminandoNo?: string }

/**
 * Arma el viaje con las formas de viajar activadas de la familia. Si el abuelo pidió una forma
 * (`preferida`), va primero. `caminandoNo` explica por qué no se ofrece caminando (si estaba activado).
 */
export async function armarViaje(
  destino: Destino,
  configuracion: Pick<ConfiguracionAbuelo, 'abuelo' | 'formasDeViajar'>,
  preferida?: FormaDeViajar,
): Promise<ResultadoViaje> {
  if (typeof destino.latitud !== 'number' || typeof destino.longitud !== 'number') return { ok: false, motivo: 'sin-ubicacion' }
  const punto = { latitud: destino.latitud, longitud: destino.longitud }

  let formas = formasDeViajarDe(configuracion)
  let caminandoNo: string | undefined
  if (formas.includes('caminando')) {
    const casa = await dondeVive(configuracion)
    const km = casa ? kmEntre(casa, punto) : null
    if (km === null) caminandoNo = 'no se sabe a cuánto queda de su casa'
    else if (km > KM_MAXIMOS_CAMINANDO) caminandoNo = `queda lejos para ir caminando (a ${km.toFixed(1).replace('.', ',')} km de su casa)`
    if (caminandoNo) formas = formas.filter((f) => f !== 'caminando')
  }
  if (formas.length === 0) return { ok: false, motivo: 'sin-formas', ...(caminandoNo && { caminandoNo }) }

  const enOrden = preferida && formas.includes(preferida) ? [preferida, ...formas.filter((f) => f !== preferida)] : formas
  return {
    ok: true,
    viaje: {
      nombre: destino.nombre,
      direccion: destino.direccion,
      opciones: enOrden.map((forma) => ({ forma, link: linkPara(forma, destino, punto) })),
    },
    ...(caminandoNo && { caminandoNo }),
  }
}

function linkPara(forma: FormaDeViajar, destino: Destino, punto: { latitud: number; longitud: number }): string {
  if (forma === 'uber') {
    return (
      'https://m.uber.com/ul/?action=setPickup&pickup=my_location' +
      `&dropoff[latitude]=${punto.latitud}` +
      `&dropoff[longitude]=${punto.longitud}` +
      `&dropoff[nickname]=${encodeURIComponent(destino.nombre)}` +
      `&dropoff[formatted_address]=${encodeURIComponent(destino.direccion)}`
    )
  }
  // Google Maps (link universal: abre la app si está instalada; si no, la web).
  const modo = forma === 'caminando' ? 'walking' : 'transit'
  return `https://www.google.com/maps/dir/?api=1&destination=${punto.latitud},${punto.longitud}&travelmode=${modo}`
}

/** "Uber, caminando o colectivo", para que la IA sepa qué ofrecer. */
export function nombresDeFormas(formas: FormaDeViajar[]): string {
  const nombres: Record<FormaDeViajar, string> = { uber: 'Uber', caminando: 'caminando', colectivo: 'colectivo' }
  const lista = formas.map((f) => nombres[f])
  return lista.length <= 1 ? (lista[0] ?? '') : `${lista.slice(0, -1).join(', ')} o ${lista.at(-1)}`
}
