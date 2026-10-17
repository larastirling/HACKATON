import 'server-only'
import type { Lugar } from './datos'

/** Lo que necesita la pantalla para mostrar la tarjeta del viaje. */
export interface Viaje {
  nombre: string
  direccion: string
  link: string
}

/**
 * Arma el link de Uber con las coordenadas GUARDADAS en la configuración.
 * Devuelve null si al lugar le faltan coordenadas.
 */
export function armarViajeUber(lugar: Lugar): Viaje | null {
  if (typeof lugar.latitud !== 'number' || typeof lugar.longitud !== 'number') return null

  const link =
    'https://m.uber.com/ul/?action=setPickup&pickup=my_location' +
    `&dropoff[latitude]=${lugar.latitud}` +
    `&dropoff[longitude]=${lugar.longitud}` +
    `&dropoff[nickname]=${encodeURIComponent(lugar.nombre)}` +
    `&dropoff[formatted_address]=${encodeURIComponent(lugar.direccion)}`

  return { nombre: lugar.nombre, direccion: lugar.direccion, link }
}
