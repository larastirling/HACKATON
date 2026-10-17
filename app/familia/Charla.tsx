'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Lugar } from '@/lib/datos'
import { responder, type MensajeCharla } from './acciones'
import estilos from './charla.module.css'

// Primer mensaje (no se muestra): la API necesita que la charla arranque del lado del usuario.
const INICIO: MensajeCharla = { role: 'user', content: '(Abrí la pantalla para registrar a mi papá o mamá.)' }

export default function Charla({ lugaresIniciales }: { lugaresIniciales: Lugar[] }) {
  const [mensajes, setMensajes] = useState<MensajeCharla[]>([INICIO])
  const [lugares, setLugares] = useState(lugaresIniciales)
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const finRef = useRef<HTMLDivElement>(null)
  const arrancado = useRef(false)

  async function pedirRespuesta(historial: MensajeCharla[]) {
    setPensando(true)
    setError(null)
    const r = await responder(historial).catch(() => ({ ok: false as const, error: 'No se pudo hablar con la IA' }))
    if ('lugares' in r && r.lugares) setLugares(r.lugares)
    if (r.ok) setMensajes([...historial, { role: 'assistant', content: r.texto }])
    else setError(r.error)
    setPensando(false)
  }

  useEffect(() => {
    if (arrancado.current) return
    arrancado.current = true
    pedirRespuesta([INICIO])
  }, [])

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, pensando])

  function enviar(e: FormEvent) {
    e.preventDefault()
    const limpio = texto.trim()
    if (!limpio || pensando) return
    const historial: MensajeCharla[] = [...mensajes, { role: 'user', content: limpio }]
    setMensajes(historial)
    setTexto('')
    pedirRespuesta(historial)
  }

  const ultimoEsDelUsuario = mensajes[mensajes.length - 1]?.role === 'user'

  return (
    <>
      <LugaresGuardados lugares={lugares} />

      <div className={estilos.mensajes}>
        {mensajes.slice(1).map((m, i) => (
          <p key={i} className={`${estilos.burbuja} ${m.role === 'user' ? estilos.yo : estilos.ia}`}>
            {m.content}
          </p>
        ))}
        {pensando && <p className={`${estilos.burbuja} ${estilos.ia} ${estilos.pensando}`}>Escribiendo…</p>}
        {error && (
          <div className="tarjeta">
            <p className="mensaje-error" role="alert">{error}</p>
            {ultimoEsDelUsuario && (
              <button className="boton boton-secundario" onClick={() => pedirRespuesta(mensajes)}>
                Reintentar
              </button>
            )}
          </div>
        )}
        <div ref={finRef} />
      </div>

      <form className={estilos.caja} onSubmit={enviar}>
        <input
          className={estilos.entrada}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí tu respuesta…"
          aria-label="Tu respuesta"
        />
        <button type="submit" className={`boton boton-principal ${estilos.enviar}`} disabled={!texto.trim() || pensando}>
          Enviar
        </button>
      </form>
    </>
  )
}

function LugaresGuardados({ lugares }: { lugares: Lugar[] }) {
  return (
    <details className={estilos.guardado}>
      <summary>📍 Lugares guardados ({lugares.length})</summary>
      {lugares.length === 0 ? (
        <p>Todavía ninguno.</p>
      ) : (
        <ul>
          {lugares.map((l) => (
            <li key={l.nombre}>
              <strong>{l.nombre}</strong>
              {l.apodos.length > 0 && <span> — le dice: {l.apodos.map((a) => `“${a}”`).join(', ')}</span>}
              <br />
              {l.direccion === 'PENDIENTE' ? 'Sin dirección todavía' : l.direccion}
              <br />
              <span className={typeof l.latitud === 'number' ? estilos.ok : estilos.falta}>
                {typeof l.latitud === 'number' ? '✅ Ubicado en el mapa' : '⚠️ Falta ubicarlo en el mapa (no se puede pedir Uber)'}
              </span>
              {l.necesitaPermiso && <span> · 🔒 Necesita permiso</span>}
            </li>
          ))}
        </ul>
      )}
    </details>
  )
}
