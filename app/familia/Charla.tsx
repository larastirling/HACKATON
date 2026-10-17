'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { responder, type Guardado, type MensajeCharla } from './acciones'
import estilos from './charla.module.css'
import RecuadrosGuardado from './RecuadrosGuardado'
import TablaReglas from './TablaReglas'
import BotonConectarGmail from './BotonConectarGmail'

// Primer mensaje (no se muestra): la API necesita que la charla arranque del lado del usuario.
const INICIO: MensajeCharla = { role: 'user', content: '(Abrí la pantalla para registrar a mi papá o mamá.)' }

export default function Charla({ guardadoInicial }: { guardadoInicial: Guardado }) {
  const [mensajes, setMensajes] = useState<MensajeCharla[]>([INICIO])
  const [guardado, setGuardado] = useState(guardadoInicial)
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const finRef = useRef<HTMLDivElement>(null)
  const arrancado = useRef(false)

  async function pedirRespuesta(historial: MensajeCharla[]) {
    setPensando(true)
    setError(null)
    const r = await responder(historial).catch(() => ({ ok: false as const, error: 'No se pudo hablar con la IA' }))
    if ('guardado' in r && r.guardado) setGuardado(r.guardado)
    if (r.ok) {
      const extras = { ...('tabla' in r && r.tabla && { tabla: r.tabla }), ...('gmail' in r && r.gmail && { gmail: r.gmail }) }
      setMensajes([...historial, { role: 'assistant', content: r.texto, ...extras }])
    }
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
      <RecuadrosGuardado guardado={guardado} />

      <div className={estilos.mensajes}>
        {mensajes.slice(1).map((m, i) => (
          <Fragment key={i}>
            <p className={`${estilos.burbuja} ${m.role === 'user' ? estilos.yo : estilos.ia}`}>{m.content}</p>
            {m.tabla && <TablaReglas tabla={m.tabla} />}
            {m.gmail && <BotonConectarGmail texto={`Conectar Gmail de ${m.gmail.mail}`} mail={m.gmail.mail} />}
          </Fragment>
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
