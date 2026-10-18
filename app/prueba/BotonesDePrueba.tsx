'use client'

import { useState, useTransition } from 'react'
import { probarDatos, probarIA } from './acciones'

type Resultado = { ok: boolean; texto: string } | null

export default function BotonesDePrueba() {
  const [datos, setDatos] = useState<Resultado>(null)
  const [ia, setIA] = useState<Resultado>(null)
  const [probandoDatos, empezarDatos] = useTransition()
  const [probandoIA, empezarIA] = useTransition()

  return (
    <>
      <section className="tarjeta">
        <h2>1. Base de datos</h2>
        <button
          className="boton boton-principal"
          disabled={probandoDatos}
          onClick={() => empezarDatos(async () => setDatos(await probarDatos()))}
        >
          {probandoDatos ? 'Probando…' : 'Guardar y leer un dato'}
        </button>
        <MostrarResultado resultado={datos} />
      </section>

      <section className="tarjeta">
        <h2>2. Inteligencia artificial</h2>
        <button
          className="boton boton-principal"
          disabled={probandoIA}
          onClick={() =>
            empezarIA(async () => {
              const r = await probarIA()
              setIA(r.ok ? { ok: true, texto: r.texto } : { ok: false, texto: r.error })
            })
          }
        >
          {probandoIA ? 'Preguntando…' : 'Hacerle una pregunta a la IA'}
        </button>
        <MostrarResultado resultado={ia} />
      </section>
    </>
  )
}

function MostrarResultado({ resultado }: { resultado: Resultado }) {
  if (!resultado) return null
  return (
    <p className={resultado.ok ? 'mensaje-ok' : 'mensaje-error'} role="status">
      {resultado.texto}
    </p>
  )
}
