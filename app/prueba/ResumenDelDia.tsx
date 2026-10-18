'use client'

import { useState, useTransition } from 'react'
import { mandarResumenAhora, verResumenDeHoy } from './acciones'

// Resumen del día: verlo antes (no manda nada) o mandárselo ya a la familia, sin esperar a la noche.
export default function ResumenDelDia() {
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null)
  const [ocupado, empezar] = useTransition()

  return (
    <section className="tarjeta">
      <h2>3. Resumen del día</h2>
      <p className="ayuda">Todas las noches les llega solo a la familia. Acá lo podés ver o mandar antes.</p>
      <button className="boton boton-principal" disabled={ocupado} onClick={() => empezar(async () => setResultado(await verResumenDeHoy()))}>
        {ocupado ? 'Escribiendo…' : 'Ver el resumen de hoy'}
      </button>
      <button className="boton boton-secundario" disabled={ocupado} onClick={() => empezar(async () => setResultado(await mandarResumenAhora()))}>
        Mandárselo ahora a la familia
      </button>
      {resultado && (
        <p className={resultado.ok ? 'resumen-texto' : 'mensaje-error'} role="status">
          {resultado.texto}
        </p>
      )}
    </section>
  )
}
