'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import type { MensajeCharla } from './acciones'
import estilos from './charla.module.css'
import type { RespuestaDeTarjeta, Tarjeta } from './pasos'
import TablaReglas from './TablaReglas'

// Las tarjetas de los pasos para cargar a la persona mayor (app/familia/pasos.ts).
// Todo se completa con botones y campos; al tocar "Listo" va todo junto al servidor, sin la IA.

type Mandar = (mensaje: MensajeCharla) => void

const responder = (mandar: Mandar, content: string, respuesta: RespuestaDeTarjeta) => mandar({ role: 'user', content, respuesta })

export default function TarjetaDelPaso({
  tarjeta,
  opcional,
  mandar,
  quererCambiar,
}: {
  tarjeta: Tarjeta
  /** Si el paso se puede dejar para después (muestra "Completar después"). */
  opcional: boolean
  mandar: Mandar
  /** "Quiero cambiar algo": lleva al hijo a escribir. */
  quererCambiar: () => void
}) {
  const despues = opcional ? (
    <button type="button" className={estilos.despues} onClick={() => responder(mandar, 'Lo completo después', { tipo: 'despues' })}>
      Completar después
    </button>
  ) : null
  switch (tarjeta.tipo) {
    case 'datos':
      return <TarjetaDatos t={tarjeta} mandar={mandar} />
    case 'como-es':
      return <TarjetaComoEs t={tarjeta} mandar={mandar} despues={despues} />
    case 'lugares':
    case 'comercios':
      return <TarjetaElegir t={tarjeta} mandar={mandar} despues={despues} />
    case 'familiares':
      return <TarjetaFamiliares t={tarjeta} mandar={mandar} />
    case 'reglas':
      return (
        <section className={estilos.tarjetaPaso} aria-label="Reglas">
          <TablaReglas tabla={tarjeta.tabla} />
          <button type="button" className="boton boton-principal" onClick={() => responder(mandar, 'Guardar así', { tipo: 'reglas' })}>
            Guardar así
          </button>
          <button type="button" className="boton boton-secundario" onClick={quererCambiar}>
            Quiero cambiar algo
          </button>
          {despues}
        </section>
      )
    case 'falta':
      return (
        <section className={estilos.tarjetaPaso} aria-label="Lo que falta">
          <button type="button" className="boton boton-principal" onClick={() => responder(mandar, 'Completar lo que falta', { tipo: 'seguir' })}>
            Completar {tarjeta.pasos.length === 1 ? tarjeta.pasos[0] : 'lo que falta'}
          </button>
        </section>
      )
  }
}

// ── Botones de opciones (uno elegido a la vez) ──────────────

function Opciones({ titulo, opciones, elegida, elegir }: { titulo: string; opciones: readonly string[]; elegida: string; elegir: (o: string) => void }) {
  return (
    <fieldset className={estilos.grupo}>
      <legend>{titulo}</legend>
      <div className={estilos.opciones}>
        {opciones.map((o) => (
          <button key={o} type="button" className={estilos.opcion} aria-pressed={elegida === o} onClick={() => elegir(o)}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Campo({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className={estilos.campo}>
      <span>{titulo}</span>
      {children}
      {ayuda && <small>{ayuda}</small>}
    </label>
  )
}

// ── Paso 1: sus datos ───────────────────────────────────────

function TarjetaDatos({ t, mandar }: { t: Extract<Tarjeta, { tipo: 'datos' }>; mandar: Mandar }) {
  const [nombre, setNombre] = useState(t.nombre)
  const [apodo, setApodo] = useState(t.apodo)
  const [trato, setTrato] = useState(t.trato)
  const [telefono, setTelefono] = useState(t.telefono)
  const [direccion, setDireccion] = useState(t.direccion)
  const falta = !nombre.trim() ? 'el nombre' : !trato ? 'si le hablamos de usted o de vos' : !direccion.trim() ? 'la dirección' : ''

  function listo(e: FormEvent) {
    e.preventDefault()
    if (falta || (trato !== 'usted' && trato !== 'vos')) return
    responder(mandar, `${nombre.trim()}, de ${trato}, vive en ${direccion.trim()}`, { tipo: 'datos', nombre, apodo, trato, telefono, direccion })
  }

  return (
    <form className={estilos.tarjetaPaso} onSubmit={listo} aria-label="Sus datos">
      <Campo titulo="Nombre y apellido">
        <input className={estilos.entradaTarjeta} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="off" placeholder="Carlos Pérez" />
      </Campo>
      <Campo titulo="¿Cómo le dicen?" ayuda="Así lo va a llamar el asistente. Si lo dejás vacío, usa su nombre.">
        <input className={estilos.entradaTarjeta} value={apodo} onChange={(e) => setApodo(e.target.value)} autoComplete="off" placeholder="Don Carlos" />
      </Campo>
      <Opciones titulo="¿Cómo le hablamos?" opciones={['De usted', 'De vos']} elegida={trato === 'usted' ? 'De usted' : trato === 'vos' ? 'De vos' : ''} elegir={(o) => setTrato(o === 'De usted' ? 'usted' : 'vos')} />
      <Campo titulo="Su teléfono (si querés)">
        <input className={estilos.entradaTarjeta} value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" autoComplete="off" placeholder="099 123 456" />
      </Campo>
      <Campo titulo="Dirección de su casa" ayuda="Calle, número y barrio. Va en los pedidos y sirve para sugerir lugares cerca.">
        <input className={estilos.entradaTarjeta} value={direccion} onChange={(e) => setDireccion(e.target.value)} autoComplete="off" placeholder="Juan Benito Blanco 780, Pocitos" />
      </Campo>
      {falta && <p className={estilos.falta}>Falta {falta}.</p>}
      <button type="submit" className="boton boton-principal" disabled={!!falta}>
        Listo
      </button>
    </form>
  )
}

// ── Paso 2: cómo se maneja ──────────────────────────────────

function TarjetaComoEs({ t, mandar, despues }: { t: Extract<Tarjeta, { tipo: 'como-es' }>; mandar: Mandar; despues: ReactNode }) {
  const [tecnologia, setTecnologia] = useState('')
  const [plata, setPlata] = useState('')
  return (
    <section className={estilos.tarjetaPaso} aria-label="Cómo se maneja">
      <Opciones titulo="Con el celular y la tecnología" opciones={t.tecnologia} elegida={tecnologia} elegir={setTecnologia} />
      <Opciones titulo="Con la plata" opciones={t.plata} elegida={plata} elegir={setPlata} />
      <button
        type="button"
        className="boton boton-principal"
        disabled={!tecnologia || !plata}
        onClick={() => responder(mandar, `${tecnologia}. ${plata}.`, { tipo: 'como-es', tecnologia, plata })}
      >
        Listo
      </button>
      {despues}
    </section>
  )
}

// ── Pasos 3 y 4: lugares y comercios (marcar varios) ────────

interface Marcado {
  vaSolo: boolean
  pedido: string
  funciona: boolean
}

function TarjetaElegir({ t, mandar, despues }: { t: Extract<Tarjeta, { tipo: 'lugares' | 'comercios' }>; mandar: Mandar; despues: ReactNode }) {
  const esComercio = t.tipo === 'comercios'
  const [marcados, setMarcados] = useState<Record<string, Marcado>>({})
  const [verTodos, setVerTodos] = useState(false)
  // Solo en lugares: "¿Cómo puede ir?" (varias a la vez), arranca con lo ya guardado.
  const [formas, setFormas] = useState(() => (t.tipo === 'lugares' ? t.formas.filter((f) => f.marcada).map((f) => f.id) : []))
  const lista = verTodos ? t.todos : t.primeros
  const hayMas = t.todos.some((x) => !t.primeros.some((p) => p.id === x.id))
  const elegidos = Object.entries(marcados)
  const porId = (id: string) => t.todos.find((x) => x.id === id) ?? t.primeros.find((x) => x.id === id)

  const cambiar = (id: string, cambio: Partial<Marcado> | null) =>
    setMarcados((antes) => {
      const despues = { ...antes }
      if (cambio === null) delete despues[id]
      else despues[id] = { ...(antes[id] ?? { vaSolo: false, pedido: '', funciona: false }), ...cambio }
      return despues
    })

  // Comercios: cada uno necesita qué pide; los sin confirmar, que ya le pidieron y funciona.
  const faltan = esComercio
    ? elegidos.flatMap(([id, m]) => {
        const c = porId(id)
        if (!c) return []
        if (!m.pedido.trim()) return [`qué le pide a ${c.nombre}`]
        if ('sinConfirmar' in c && c.sinConfirmar && !m.funciona) return [`confirmar el número de ${c.nombre}`]
        return []
      })
    : []

  function listo() {
    const nombres = elegidos.map(([id, m]) => `${porId(id)?.nombre ?? id} (${m.vaSolo ? (esComercio ? 'pide solo' : 'va solo') : 'con permiso'})`)
    const content = nombres.length ? `Elegí: ${nombres.join(', ')}` : esComercio ? 'No le pide a ninguno de estos' : 'No va a ninguno de estos'
    if (esComercio) {
      responder(mandar, content, { tipo: 'comercios', elegidos: elegidos.map(([id, m]) => ({ id, pedido: m.pedido, vaSolo: m.vaSolo, funciona: m.funciona })) })
    } else if (t.tipo === 'lugares') {
      const comoVa = formas.length ? `Puede ir: ${t.formas.filter((f) => formas.includes(f.id)).map((f) => f.nombre).join(', ')}` : 'No se le ofrecen viajes'
      responder(mandar, `${content}. ${comoVa}`, { tipo: 'lugares', elegidos: elegidos.map(([id, m]) => ({ id, vaSolo: m.vaSolo })), formas })
    }
  }

  return (
    <section className={estilos.tarjetaPaso} aria-label={esComercio ? 'Comercios cerca de su casa' : 'Lugares cerca de su casa'}>
      {lista.length > 0 && (
        <ul className={estilos.elegibles}>
          {lista.map((x) => {
            const m = marcados[x.id]
            const sinConfirmar = 'sinConfirmar' in x && x.sinConfirmar === true
            return (
              <li key={x.id} className={`${estilos.elegible} ${m ? estilos.elegibleMarcado : ''}`}>
                <button type="button" className={estilos.marcar} aria-pressed={!!m} onClick={() => cambiar(x.id, m ? null : {})}>
                  <span className={estilos.casilla} aria-hidden="true" />
                  <span className={estilos.marcarTexto}>
                    <strong>{x.nombre}</strong>
                    <span>
                      {x.tipo} · {x.direccion}
                      {x.distancia && ` · ${x.distancia}`}
                    </span>
                    {sinConfirmar && <em className={estilos.sinConfirmar}>Número sin confirmar</em>}
                  </span>
                </button>
                {m && (
                  <div className={estilos.detalleMarcado}>
                    {esComercio && (
                      <input
                        className={estilos.entradaTarjeta}
                        value={m.pedido}
                        onChange={(e) => cambiar(x.id, { pedido: e.target.value })}
                        placeholder="¿Qué le pide siempre?"
                        aria-label={`Qué le pide siempre a ${x.nombre}`}
                      />
                    )}
                    {/* Por defecto "Con permiso": "Va solo" solo si el hijo lo toca (nunca libre por defecto). */}
                    <div className={estilos.permiso} role="group" aria-label={`Permiso para ${x.nombre}`}>
                      <button type="button" aria-pressed={m.vaSolo} onClick={() => cambiar(x.id, { vaSolo: true })}>
                        {esComercio ? 'Pide solo' : 'Va solo'}
                      </button>
                      <button type="button" aria-pressed={!m.vaSolo} onClick={() => cambiar(x.id, { vaSolo: false })}>
                        Con permiso
                      </button>
                    </div>
                    {sinConfirmar && (
                      <button type="button" className={estilos.confirmarNumero} aria-pressed={m.funciona} onClick={() => cambiar(x.id, { funciona: !m.funciona })}>
                        <span className={estilos.casilla} aria-hidden="true" />
                        Ya le pedimos por este número y funciona
                      </button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {hayMas && !verTodos && (
        <button type="button" className={estilos.verTodos} onClick={() => setVerTodos(true)}>
          Ver todos los cercanos ({t.todos.length})
        </button>
      )}
      <p className={estilos.ayudaTarjeta}>¿Falta alguno? Escribilo abajo.</p>
      {t.tipo === 'lugares' && (
        <fieldset className={estilos.grupo}>
          <legend>¿Cómo puede ir?</legend>
          <div className={estilos.opciones}>
            {t.formas.map((f) => (
              <button
                key={f.id}
                type="button"
                className={estilos.opcion}
                aria-pressed={formas.includes(f.id)}
                onClick={() => setFormas((antes) => (antes.includes(f.id) ? antes.filter((x) => x !== f.id) : [...antes, f.id]))}
              >
                {f.nombre}
              </button>
            ))}
          </div>
          <small className={estilos.ayudaTarjeta}>
            {formas.length ? 'Podés marcar varias. El asistente solo le arma viajes de estas formas.' : 'Sin ninguna marcada, el asistente no le arma viajes.'}
          </small>
        </fieldset>
      )}
      {faltan.length > 0 && <p className={estilos.falta}>Falta {faltan.join(' y ')}.</p>}
      <button type="button" className="boton boton-principal" disabled={faltan.length > 0} onClick={listo}>
        {elegidos.length ? `Listo (${elegidos.length} ${elegidos.length === 1 ? 'marcado' : 'marcados'})` : 'Listo, no usa ninguno'}
      </button>
      {despues}
    </section>
  )
}

// ── Paso 5: familiares ──────────────────────────────────────

const PARENTESCOS = ['Hijo', 'Hija', 'Nieto', 'Nieta', 'Sobrino/a', 'Otro']

function Parentesco({ titulo, valor, cambiar }: { titulo: string; valor: string; cambiar: (v: string) => void }) {
  const esOtro = !!valor && !PARENTESCOS.slice(0, -1).includes(valor)
  return (
    <>
      <Opciones titulo={titulo} opciones={PARENTESCOS} elegida={esOtro ? 'Otro' : valor} elegir={(o) => cambiar(o === 'Otro' ? ' ' : o)} />
      {esOtro && (
        <input className={estilos.entradaTarjeta} value={valor.trim()} onChange={(e) => cambiar(e.target.value || ' ')} placeholder="Por ejemplo: vecina, cuidadora" aria-label="Qué es de la persona mayor" />
      )}
    </>
  )
}

function TarjetaFamiliares({ t, mandar }: { t: Extract<Tarjeta, { tipo: 'familiares' }>; mandar: Mandar }) {
  const [relacion, setRelacion] = useState(t.vos.relacion)
  const [telefono, setTelefono] = useState(t.vos.telefono)
  const [otro, setOtro] = useState({ nombre: '', relacion: '', mail: '', telefono: '' })
  const falta = !relacion.trim() ? 'qué sos de la persona mayor' : !telefono.trim() ? 'tu teléfono' : ''

  function listo(e: FormEvent) {
    e.preventDefault()
    if (falta) return
    const conOtro = otro.nombre.trim() ? { otro: { ...otro, relacion: otro.relacion.trim() } } : {}
    responder(mandar, `Soy ${relacion.trim().toLowerCase()}${otro.nombre.trim() ? `; también ${otro.nombre.trim()}` : ''}`, {
      tipo: 'familiares',
      relacion: relacion.trim(),
      telefono,
      ...conOtro,
    })
  }

  return (
    <form className={estilos.tarjetaPaso} onSubmit={listo} aria-label="Familiares">
      <h3 className={estilos.subtitulo}>Vos{t.vos.nombre ? ` (${t.vos.nombre})` : ''}</h3>
      <Parentesco titulo="¿Qué sos de la persona mayor?" valor={relacion} cambiar={setRelacion} />
      <Campo titulo="Tu teléfono" ayuda="El botón de emergencia de su celular te llama a vos primero.">
        <input className={estilos.entradaTarjeta} value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="099 123 456" />
      </Campo>
      <h3 className={estilos.subtitulo}>Otro familiar (recomendado)</h3>
      <p className={estilos.ayudaTarjeta}>Así, si vos no contestás, le llega a otra persona. Podés dejarlo vacío.</p>
      <Campo titulo="Nombre">
        <input className={estilos.entradaTarjeta} value={otro.nombre} onChange={(e) => setOtro({ ...otro, nombre: e.target.value })} autoComplete="off" placeholder="Laura" />
      </Campo>
      {otro.nombre.trim() && (
        <>
          <Parentesco titulo={`¿Qué es ${otro.nombre.trim()} de la persona mayor?`} valor={otro.relacion} cambiar={(v) => setOtro({ ...otro, relacion: v })} />
          <Campo titulo="Su mail">
            <input className={estilos.entradaTarjeta} value={otro.mail} onChange={(e) => setOtro({ ...otro, mail: e.target.value })} inputMode="email" autoComplete="off" placeholder="laura@gmail.com" />
          </Campo>
          <Campo titulo="Su teléfono">
            <input className={estilos.entradaTarjeta} value={otro.telefono} onChange={(e) => setOtro({ ...otro, telefono: e.target.value })} inputMode="tel" autoComplete="off" placeholder="099 123 456" />
          </Campo>
        </>
      )}
      {falta && <p className={estilos.falta}>Falta {falta}.</p>}
      <button type="submit" className="boton boton-principal" disabled={!!falta}>
        Listo
      </button>
    </form>
  )
}
