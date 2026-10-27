'use client'

import { useEffect } from 'react'
import { decirEnVozAlta } from '../voz'
import { marcarAgendaVista } from './acciones'

/** Al abrir la agenda, lo nuevo queda visto (ya no se muestra arriba de /abuelo como novedad). */
export function MarcarVista() {
  useEffect(() => {
    marcarAgendaVista().catch(() => {})
  }, [])
  return null
}

/** Lee la agenda en voz alta. */
export function EscucharAgenda({ texto }: { texto: string }) {
  return (
    <button type="button" className="boton boton-escuchar" onClick={() => decirEnVozAlta(texto, { enEsteToque: true })}>
      Escuchar
    </button>
  )
}
