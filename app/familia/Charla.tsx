'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { responder, type Guardado, type MensajeCharla, type RespuestaFamilia } from './acciones'
import estilos from './charla.module.css'
import RecuadrosGuardado from './RecuadrosGuardado'
import TablaReglas from './TablaReglas'

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
      const { texto, tabla, sugerencias, preguntaPermiso, comerciosSugeridos, preguntaPedido, pedidoBorrar } = r as Extract<RespuestaFamilia, { ok: true }>
      setMensajes([
        ...historial,
        {
          role: 'assistant',
          content: texto,
          ...(tabla && { tabla }),
          ...(sugerencias && { sugerencias }),
          ...(preguntaPermiso && { preguntaPermiso }),
          ...(comerciosSugeridos && { comerciosSugeridos }),
          ...(preguntaPedido && { preguntaPedido }),
          ...(pedidoBorrar && { pedidoBorrar }),
        },
      ])
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

  function mandar(mensaje: MensajeCharla) {
    if (pensando) return
    const historial: MensajeCharla[] = [...mensajes, mensaje]
    setMensajes(historial)
    pedirRespuesta(historial)
  }

  function enviar(e: FormEvent) {
    e.preventDefault()
    const limpio = texto.trim()
    if (!limpio || pensando) return
    setTexto('')
    mandar({ role: 'user', content: limpio })
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
            {/* Los botones solo sirven en el último mensaje: si el hijo escribe otra cosa, quedan atrás sin hacer nada. */}
            {i === mensajes.length - 2 && !pensando && <Botones mensaje={m} mandar={mandar} />}
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
        {/* Siempre a mano: el sistema muestra los lugares y comercios cercanos a la casa, sin la IA. */}
        <div className={estilos.atajos}>
          <button type="button" className={estilos.atajo} disabled={pensando} onClick={() => mandar({ role: 'user', content: 'Sugerime lugares', pidio: 'lugares' })}>
            Sugerirme lugares
          </button>
          <button type="button" className={estilos.atajo} disabled={pensando} onClick={() => mandar({ role: 'user', content: 'Sugerime comercios', pidio: 'comercios' })}>
            Sugerirme comercios
          </button>
        </div>
        <div className={estilos.fila}>
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
        </div>
      </form>
    </>
  )
}

// Botones debajo del último mensaje de la IA: sugerencias de lugares, "¿solo o con permiso?" y "¿Seguro?".
function Botones({ mensaje, mandar }: { mensaje: MensajeCharla; mandar: (m: MensajeCharla) => void }) {
  if (mensaje.sugerencias?.length) {
    return (
      <div className={estilos.botones} role="group" aria-label="Lugares sugeridos">
        <p className={estilos.tituloBotones}>{mensaje.sugerencias[0].id.startsWith('mapa:') ? 'Lo que encontró el mapa' : 'Lugares cerca de su casa'}</p>
        {mensaje.sugerencias.map((l) => (
          <button key={l.id} type="button" className={estilos.sugerencia} onClick={() => mandar({ role: 'user', content: `Va a ${l.nombre}`, eligio: l.id })}>
            <strong>{l.nombre}</strong>
            <span>{l.tipo} · {l.direccion}{l.distancia && ` · ${l.distancia}`}</span>
          </button>
        ))}
        <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'Ninguno de esos' })}>
          Ninguno
        </button>
      </div>
    )
  }
  if (mensaje.comerciosSugeridos?.length) {
    return (
      <div className={estilos.botones} role="group" aria-label="Comercios sugeridos">
        <p className={estilos.tituloBotones}>Comercios confirmados cerca de su casa</p>
        {mensaje.comerciosSugeridos.map((c) => (
          <button key={c.id} type="button" className={estilos.sugerencia} onClick={() => mandar({ role: 'user', content: `Le pide a ${c.nombre}`, eligioComercio: c.id })}>
            <strong>{c.nombre}</strong>
            <span>{c.tipo} · {c.direccion}{c.distancia && ` · ${c.distancia}`}</span>
          </button>
        ))}
        <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'Ninguno de esos' })}>
          Ninguno
        </button>
      </div>
    )
  }
  if (mensaje.preguntaPermiso) {
    const { id } = mensaje.preguntaPermiso
    return (
      <div className={estilos.botones} role="group" aria-label="¿Puede ir solo o necesita permiso?">
        {/* Los dos botones iguales: ninguno es "la opción recomendada" (nunca libre por defecto). */}
        <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'Puede ir solo', permiso: { id, necesitaPermiso: false } })}>
          Puede ir solo
        </button>
        <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'Necesita permiso', permiso: { id, necesitaPermiso: true } })}>
          Necesita permiso
        </button>
      </div>
    )
  }
  if (mensaje.pedidoBorrar) {
    return (
      <div className={estilos.botones} role="group" aria-label="¿Seguro que lo borro?">
        <button type="button" className="boton boton-emergencia boton-911" onClick={() => mandar({ role: 'user', content: 'Sí, borrar', confirmaBorrar: true })}>
          Sí, borrar
        </button>
        <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'No, dejarlo', confirmaBorrar: false })}>
          No, dejarlo
        </button>
      </div>
    )
  }
  return null
}
