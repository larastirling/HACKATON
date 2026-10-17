'use client'

import { useEffect, useRef, useState, useTransition, type FormEvent, type KeyboardEvent } from 'react'
import type { MensajeCharla } from '@/lib/ia'
import { responderAlAbuelo } from './acciones'

export default function Charla() {
  const [charla, setCharla] = useState<MensajeCharla[]>([])
  const [texto, setTexto] = useState('')
  const [hayError, setHayError] = useState(false)
  const [pensando, empezar] = useTransition()
  const final = useRef<HTMLDivElement>(null)

  // Siempre mostrar lo último de la charla
  useEffect(() => {
    final.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [charla, pensando, hayError])

  function enviar(e?: FormEvent) {
    e?.preventDefault()
    const mensaje = texto.trim()
    if (!mensaje || pensando) return

    const nuevaCharla: MensajeCharla[] = [...charla, { de: 'abuelo', texto: mensaje }]
    setCharla(nuevaCharla)
    setTexto('')
    setHayError(false)

    empezar(async () => {
      try {
        const respuesta = await responderAlAbuelo(nuevaCharla)
        if (respuesta.ok) setCharla([...nuevaCharla, { de: 'ia', texto: respuesta.texto }])
        else setHayError(true)
      } catch {
        setHayError(true)
      }
    })
  }

  // Enter envía. Shift + Enter hace un salto de línea.
  function alApretarTecla(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      enviar()
    }
  }

  return (
    <>
      <div className="charla" aria-live="polite">
        {charla.length === 0 && <p className="charla-vacia">Escriba abajo lo que necesita y toque Enviar.</p>}

        {charla.map((mensaje, i) => (
          <p key={i} className={`burbuja burbuja-${mensaje.de}`}>
            <span className="burbuja-quien">{mensaje.de === 'abuelo' ? 'Usted' : 'Asistente'}</span>
            {mensaje.texto}
          </p>
        ))}

        {pensando && (
          <p className="burbuja burbuja-ia burbuja-pensando" role="status">
            Pensando...
          </p>
        )}

        {hayError && (
          <p className="mensaje-error charla-error" role="alert">
            No pude responder, pruebe de nuevo.
          </p>
        )}
        <div ref={final} className="charla-fin" />
      </div>

      <form className="charla-formulario" onSubmit={enviar}>
        <label htmlFor="mensaje" className="sr-only">
          Escriba su mensaje
        </label>
        <textarea
          id="mensaje"
          className="charla-caja"
          rows={2}
          placeholder="Escriba acá…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={alApretarTecla}
          maxLength={2000}
          enterKeyHint="send"
        />
        <button type="submit" className="boton boton-principal" disabled={pensando || !texto.trim()}>
          Enviar
        </button>
      </form>
    </>
  )
}
