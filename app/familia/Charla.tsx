'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { responder, type Guardado, type MensajeCharla, type RespuestaFamilia } from './acciones'
import estilos from './charla.module.css'
import type { EstadoDelArmado, Tarjeta } from './pasos'
import RecuadrosGuardado from './RecuadrosGuardado'
import TablaReglas from './TablaReglas'
import TarjetaDelPaso from './Tarjetas'

// Primer mensaje (no se muestra): la API necesita que la charla arranque del lado del usuario.
const INICIO: MensajeCharla = { role: 'user', content: '(Abrí la pantalla para registrar a mi papá o mamá.)' }

export default function Charla({ guardadoInicial }: { guardadoInicial: Guardado }) {
  const [mensajes, setMensajes] = useState<MensajeCharla[]>([INICIO])
  const [guardado, setGuardado] = useState(guardadoInicial)
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paso, setPaso] = useState<EstadoDelArmado | null>(null)
  const finRef = useRef<HTMLDivElement>(null)
  const ultimoRef = useRef<HTMLDivElement>(null)
  const entradaRef = useRef<HTMLInputElement>(null)
  const arrancado = useRef(false)

  async function pedirRespuesta(historial: MensajeCharla[]) {
    setPensando(true)
    setError(null)
    // Las listas de "Ver todos" y el contenido de las tarjetas se quedan en la pantalla: no se mandan de vuelta
    // (son largas y el servidor no los usa; de la tarjeta solo va de qué paso era).
    const paraMandar = historial.map(({ todosLosLugares: _lugares, todosLosComercios: _comercios, tarjeta, ...m }) =>
      tarjeta ? { ...m, tarjeta: { tipo: tarjeta.tipo } } : m,
    )
    const r = await responder(paraMandar).catch(() => ({ ok: false as const, error: 'No se pudo hablar con la IA' }))
    if ('guardado' in r && r.guardado) setGuardado(r.guardado)
    if (r.ok) {
      const { texto, tabla, sugerencias, todosLosLugares, preguntaPermiso, comerciosSugeridos, todosLosComercios, preguntaPedido, preguntaNumero, pedidoBorrar, tarjeta, paso } =
        r as Extract<RespuestaFamilia, { ok: true }>
      if (paso) setPaso(paso)
      setMensajes([
        ...historial,
        {
          role: 'assistant',
          content: texto,
          ...(tabla && { tabla }),
          ...(sugerencias && { sugerencias }),
          ...(todosLosLugares && { todosLosLugares }),
          ...(preguntaPermiso && { preguntaPermiso }),
          ...(comerciosSugeridos && { comerciosSugeridos }),
          ...(todosLosComercios && { todosLosComercios }),
          ...(preguntaPedido && { preguntaPedido }),
          ...(preguntaNumero && { preguntaNumero }),
          ...(pedidoBorrar && { pedidoBorrar }),
          ...(tarjeta && { tarjeta }),
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

  // Al llegar una respuesta, se ve desde su principio (si trae una tarjeta larga, que no quede cortada arriba).
  useEffect(() => {
    const ultimo = mensajes[mensajes.length - 1]
    if (!pensando && ultimo?.role === 'assistant') ultimoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else finRef.current?.scrollIntoView({ behavior: 'smooth' })
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
  const ultimo = mensajes[mensajes.length - 1]
  const cargando = !!paso?.actual
  // "Quiero cambiar algo": a escribir.
  const quererCambiar = () => {
    entradaRef.current?.focus()
    entradaRef.current?.setAttribute('placeholder', 'Escribí qué querés cambiar…')
  }

  return (
    <>
      <RecuadrosGuardado guardado={guardado} />

      {paso && (
        <Encabezado
          paso={paso}
          tarjetaALaVista={ultimo?.role === 'assistant' && !!ultimo.tarjeta && !pensando}
          pensando={pensando}
          seguir={() => mandar({ role: 'user', content: paso.actual ? 'Seguir' : 'Completar lo que falta', respuesta: { tipo: 'seguir' } })}
        />
      )}

      <div className={`${estilos.mensajes} ${cargando ? '' : estilos.mensajesConAtajos}`}>
        {mensajes.slice(1).map((m, i) => {
          const esElUltimo = i === mensajes.length - 2
          return (
            <Fragment key={i}>
              <div ref={esElUltimo ? ultimoRef : undefined} className={estilos.anclaMensaje} />
              <p className={`${estilos.burbuja} ${m.role === 'user' ? estilos.yo : estilos.ia}`}>{m.content}</p>
              {m.tabla && <TablaReglas tabla={m.tabla} />}
              {/* Los botones y las tarjetas solo sirven en el último mensaje: si el hijo escribe otra cosa, quedan atrás. */}
              {esElUltimo && !pensando && m.tarjeta && esTarjetaCompleta(m.tarjeta) && (
                <TarjetaDelPaso tarjeta={m.tarjeta} opcional={!!paso && !paso.obligatorio && !!paso.actual} mandar={mandar} quererCambiar={quererCambiar} />
              )}
              {esElUltimo && !pensando && !m.tarjeta && <Botones mensaje={m} mandar={mandar} />}
            </Fragment>
          )
        })}
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
        {/* Con el perfil cargado: los lugares y comercios cercanos, para marcar más (sin la IA). Mientras se carga, los muestran los pasos. */}
        {!cargando && (
          <div className={estilos.atajos}>
            <button type="button" className={estilos.atajo} disabled={pensando} onClick={() => mandar({ role: 'user', content: 'Sugerime lugares', pidio: 'lugares' })}>
              Sugerirme lugares
            </button>
            <button type="button" className={estilos.atajo} disabled={pensando} onClick={() => mandar({ role: 'user', content: 'Sugerime comercios', pidio: 'comercios' })}>
              Sugerirme comercios
            </button>
          </div>
        )}
        <div className={estilos.fila}>
          <input
            ref={entradaRef}
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

/** La tarjeta con todo su contenido (en la pantalla); la que vuelve del historial solo trae el tipo. */
const esTarjetaCompleta = (t: NonNullable<MensajeCharla['tarjeta']>): t is Tarjeta => Object.keys(t).length > 1

/** Arriba: "Paso 3 de 6 · Lugares", una barrita de avance y "Seguir" (vuelve a mostrar la tarjeta del paso). */
function Encabezado({ paso, tarjetaALaVista, pensando, seguir }: { paso: EstadoDelArmado; tarjetaALaVista: boolean; pensando: boolean; seguir: () => void }) {
  if (!paso.actual && paso.paraDespues.length === 0) return null
  const hechos = paso.actual ? paso.numero - 1 : paso.total
  return (
    <div className={estilos.encabezado} role="status">
      <div className={estilos.encabezadoFila}>
        <strong>
          {paso.actual
            ? `Paso ${paso.numero} de ${paso.total} · ${paso.titulo}`
            : `Te ${paso.paraDespues.length === 1 ? 'queda 1 paso' : `quedan ${paso.paraDespues.length} pasos`} para después`}
        </strong>
        {(!tarjetaALaVista || !paso.actual) && (
          <button type="button" className={estilos.seguir} disabled={pensando} onClick={seguir}>
            {paso.actual ? 'Seguir' : 'Completar lo que falta'}
          </button>
        )}
      </div>
      <div className={estilos.avance} aria-hidden="true">
        {Array.from({ length: paso.total }, (_, i) => (
          <span key={i} className={i < hechos ? estilos.avanceHecho : i === hechos && paso.actual ? estilos.avanceActual : ''} />
        ))}
      </div>
    </div>
  )
}

interface Sugerido {
  id: string
  nombre: string
  tipo: string
  direccion: string
  distancia?: string
  sinConfirmar?: boolean
}

/**
 * Las sugerencias: primero las del mensaje (hasta 4) y, si hay más cerca, el botón "Ver todos los cercanos",
 * que despliega la lista completa ahí mismo (ya vino con el mensaje: no se le pregunta nada a nadie).
 */
function ListaDeSugerencias({
  titulo,
  primeros,
  todos,
  alElegir,
}: {
  titulo: string
  primeros: Sugerido[]
  todos?: Sugerido[]
  alElegir: (s: Sugerido) => void
}) {
  const [verTodos, setVerTodos] = useState(false)
  const hayMas = !!todos && todos.some((t) => !primeros.some((p) => p.id === t.id))
  const Opcion = ({ s, compacta }: { s: Sugerido; compacta?: boolean }) => (
    <button type="button" className={`${estilos.sugerencia} ${compacta ? estilos.sugerenciaCompacta : ''}`} onClick={() => alElegir(s)}>
      <strong>{s.nombre}</strong>
      <span>
        {s.tipo} · {s.direccion}
        {s.distancia && ` · ${s.distancia}`}
      </span>
      {s.sinConfirmar && <em className={estilos.sinConfirmar}>Número sin confirmar</em>}
    </button>
  )
  return (
    <>
      <p className={estilos.tituloBotones}>{titulo}</p>
      {!verTodos && primeros.map((s) => <Opcion key={s.id} s={s} />)}
      {verTodos && todos && (
        <div className={estilos.listaTodos} role="list" aria-label={`Todos los cercanos (${todos.length})`}>
          {todos.map((s) => (
            <Opcion key={s.id} s={s} compacta />
          ))}
        </div>
      )}
      {hayMas && !verTodos && (
        <button type="button" className={estilos.verTodos} onClick={() => setVerTodos(true)}>
          Ver todos los cercanos ({todos!.length})
        </button>
      )}
    </>
  )
}

// Botones debajo del último mensaje de la IA: sugerencias, "¿funciona el número?", "¿solo o con permiso?" y "¿Seguro?".
function Botones({ mensaje, mandar }: { mensaje: MensajeCharla; mandar: (m: MensajeCharla) => void }) {
  const ninguno = (
    <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'Ninguno de esos' })}>
      Ninguno
    </button>
  )
  if (mensaje.sugerencias?.length) {
    return (
      <div className={estilos.botones} role="group" aria-label="Lugares sugeridos">
        <ListaDeSugerencias
          titulo={mensaje.sugerencias[0].id.startsWith('mapa:') ? 'Lo que encontró el mapa' : 'Lugares cerca de su casa'}
          primeros={mensaje.sugerencias}
          todos={mensaje.todosLosLugares}
          alElegir={(l) => mandar({ role: 'user', content: `Va a ${l.nombre}`, eligio: l.id })}
        />
        {ninguno}
      </div>
    )
  }
  if (mensaje.comerciosSugeridos?.length) {
    return (
      <div className={estilos.botones} role="group" aria-label="Comercios sugeridos">
        <ListaDeSugerencias
          titulo="Comercios cerca de su casa"
          primeros={mensaje.comerciosSugeridos}
          todos={mensaje.todosLosComercios}
          alElegir={(c) => mandar({ role: 'user', content: `Le pide a ${c.nombre}`, eligioComercio: c.id })}
        />
        {ninguno}
      </div>
    )
  }
  if (mensaje.preguntaNumero) {
    const { id } = mensaje.preguntaNumero
    return (
      <div className={estilos.botones} role="group" aria-label="¿Ya le pidieron por este número y funciona?">
        <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'Sí, funciona', confirmaNumero: { id, funciona: true } })}>
          Sí, ya le pedimos y funciona
        </button>
        <button type="button" className="boton boton-secundario" onClick={() => mandar({ role: 'user', content: 'No, o no sé', confirmaNumero: { id, funciona: false } })}>
          No, o no sé
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
