'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { AvisoDeAgenda } from '@/lib/agenda'
import { decirEnVozAlta } from '../voz'
import { marcarAgendaVista } from './acciones'
import estilos from './agenda-abuelo.module.css'

// Arriba de /abuelo: lo nuevo que le agregaron a la agenda ("Tu hijo José agregó…") y lo que tiene en menos de un día.
export default function AvisosDeAgenda({ avisos }: { avisos: AvisoDeAgenda[] }) {
  const [vistas, setVistas] = useState(false)
  const quedan = vistas ? avisos.filter((a) => a.tipo !== 'nueva') : avisos
  if (quedan.length === 0) return null
  const hayNuevas = quedan.some((a) => a.tipo === 'nueva')
  return (
    <section className={estilos.avisosArriba} aria-label="Agenda">
      {quedan.map((a, i) => (
        <div key={i} className={estilos.aviso} role="status">
          <p>📅 {a.texto}</p>
        </div>
      ))}
      <div className={estilos.botonesAviso}>
        <button type="button" className="boton boton-escuchar" onClick={() => decirEnVozAlta(quedan.map((a) => a.texto).join(' '), { enEsteToque: true })}>
          Escuchar
        </button>
        {hayNuevas && (
          <button
            type="button"
            className="boton boton-principal"
            onClick={() => {
              setVistas(true)
              marcarAgendaVista().catch(() => {})
            }}
          >
            Entendido
          </button>
        )}
        <Link href="/abuelo/agenda" className="boton boton-secundario">
          Ver mi agenda
        </Link>
      </div>
    </section>
  )
}
