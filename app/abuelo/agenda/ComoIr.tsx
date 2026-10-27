'use client'

import { useState } from 'react'
import type { Viaje } from '@/lib/ia'
import { TarjetaViaje } from '../Charla'

// "¿Cómo voy?" en una actividad con dirección: abre la tarjeta del viaje (Uber, caminando o colectivo con Moovit),
// la misma de la charla. Los links los arma el servidor con la ubicación guardada. (Mismo texto de usted y de vos.)
export default function ComoIr({ viaje }: { viaje: Viaje }) {
  const [abierto, setAbierto] = useState(false)
  if (!abierto) {
    return (
      <button type="button" className="boton boton-secundario" onClick={() => setAbierto(true)}>
        ¿Cómo voy?
      </button>
    )
  }
  return (
    <>
      <TarjetaViaje viaje={viaje} />
      <button type="button" className="boton boton-secundario" onClick={() => setAbierto(false)}>
        Cerrar
      </button>
    </>
  )
}
