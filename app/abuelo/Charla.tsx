'use client'

import { Fragment, useEffect, useRef, useState, useTransition, type FormEvent, type KeyboardEvent } from 'react'
import type { Emergencia, EsperaAprobacion, MensajeCharla, Pedido, Viaje } from '@/lib/ia'
import { juntarNombres } from '@/lib/texto'
import { consultarAprobacion, responderAlAbuelo } from './acciones'

export default function Charla({ inicial = [] }: { inicial?: MensajeCharla[] }) {
  const [charla, setCharla] = useState<MensajeCharla[]>(inicial)
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
        if (respuesta.ok) {
          const { texto, viaje, emergencia, pedido, aprobacion } = respuesta
          setCharla([...nuevaCharla, { de: 'ia', texto, viaje, emergencia, pedido, aprobacion }])
        } else setHayError(true)
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
          <Fragment key={i}>
            <p className={`burbuja burbuja-${mensaje.de}`}>
              <span className="burbuja-quien">{mensaje.de === 'abuelo' ? 'Usted' : 'Asistente'}</span>
              {mensaje.texto}
            </p>
            {mensaje.emergencia && <BotonesEmergencia emergencia={mensaje.emergencia} />}
            {mensaje.viaje && <TarjetaViaje viaje={mensaje.viaje} />}
            {mensaje.pedido && <TarjetaPedido pedido={mensaje.pedido} />}
            {mensaje.llamar && <BotonLlamar {...mensaje.llamar} />}
            {mensaje.aprobacion && (
              <EsperandoAprobacion
                aprobacion={mensaje.aprobacion}
                alContestar={(respuesta) => setCharla((anterior) => [...anterior, respuesta])}
              />
            )}
          </Fragment>
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

// Tarjeta con el destino y el botón de Uber. El auto lo pide el abuelo al tocar el botón.
function TarjetaViaje({ viaje }: { viaje: Viaje }) {
  return (
    <section className="tarjeta-viaje" aria-label={`Viaje a ${viaje.nombre}`}>
      <p className="tarjeta-viaje-titulo">🚗 Viaje a</p>
      <p className="tarjeta-viaje-destino">{viaje.nombre}</p>
      <p className="tarjeta-viaje-direccion">{viaje.direccion}</p>
      <a className="boton boton-uber" href={viaje.link} target="_blank" rel="noopener noreferrer">
        Abrir Uber
      </a>
    </section>
  )
}

// Botones para llamar. Los teléfonos salen de la configuración, nunca de la IA.
function BotonesEmergencia({ emergencia }: { emergencia: Emergencia }) {
  return (
    <section className="botones-emergencia" aria-label="Botones de emergencia">
      <a className="boton boton-emergencia boton-911" href="tel:911">
        📞 Llamar al 911
      </a>
      {emergencia.familiar && (
        <a className="boton boton-emergencia boton-familiar" href={emergencia.familiar.link}>
          📞 Llamar a {emergencia.familiar.nombre}
        </a>
      )}
      {emergencia.avisados && emergencia.avisados.length > 0 && (
        <p className="emergencia-avisados">Ya le avisé a {emergencia.avisados.join(' y a ')}.</p>
      )}
    </section>
  )
}

// Tarjeta con el pedido y el botón de WhatsApp. El mensaje lo manda el abuelo, nunca se manda solo.
function TarjetaPedido({ pedido }: { pedido: Pedido }) {
  return (
    <section className="tarjeta-viaje" aria-label={`Pedido a ${pedido.comercio}`}>
      <p className="tarjeta-viaje-titulo">🛵 Pedido a</p>
      <p className="tarjeta-viaje-destino">{pedido.comercio}</p>
      <p className="tarjeta-viaje-direccion">
        {pedido.pedido}
        {pedido.aclaracion && (
          <>
            <br />
            <strong>Aclaración:</strong> {pedido.aclaracion}
          </>
        )}
      </p>
      <a className="boton boton-uber" href={pedido.link} target="_blank" rel="noopener noreferrer">
        Abrir WhatsApp
      </a>
      <p className="tarjeta-viaje-ayuda">Después toque “Enviar” en WhatsApp.</p>
    </section>
  )
}

const CADA_CUANTO_CONSULTAR_MS = 4000

// Mientras la familia no contesta, consulta sola cada pocos segundos. Cuando contestan, agrega el mensaje.
// (El servidor se fija en cada consulta si se venció el tiempo sin que nadie conteste.)
function EsperandoAprobacion({
  aprobacion,
  alContestar,
}: {
  aprobacion: EsperaAprobacion
  alContestar: (respuesta: MensajeCharla) => void
}) {
  const [estado, setEstado] = useState<'esperando' | 'contestaron' | 'error'>('esperando')
  const [cartel, setCartel] = useState(`Le pregunté a ${juntarNombres(aprobacion.familiares)}, espere un momento...`)
  const yaAvise = useRef(false)
  // Se guarda en una referencia para que escribir en la caja no reinicie el reloj de las consultas.
  const avisar = useRef(alContestar)
  avisar.current = alContestar

  useEffect(() => {
    if (estado !== 'esperando') return
    const intervalo = setInterval(async () => {
      try {
        const resultado = await consultarAprobacion(aprobacion.id)
        if (yaAvise.current) return
        if (resultado.estado === 'esperando') {
          return setCartel(`Le pregunté a ${juntarNombres(resultado.familiares)}, espere un momento...`)
        }
        yaAvise.current = true
        if (resultado.estado === 'no-encontrado') return setEstado('error')
        setEstado('contestaron')
        if (resultado.estado === 'aprobado') {
          const quien = resultado.familiar
          avisar.current(
            resultado.viaje
              ? { de: 'ia', texto: `${quien} aprobó el viaje. Toque el botón verde para abrir Uber.`, viaje: resultado.viaje }
              : { de: 'ia', texto: `${quien} aprobó el pedido. Toque el botón verde para abrir WhatsApp y después apriete enviar.`, pedido: resultado.pedido },
          )
        } else if (resultado.estado === 'rechazado') {
          const quien = resultado.familiar
          avisar.current({
            de: 'ia',
            texto: `${quien} dijo que esta vez no. Quédese tranquilo: si quiere, puede llamar a ${quien} para hablarlo.`,
            ...(resultado.llamar && { llamar: { nombre: quien, link: resultado.llamar } }),
          })
        } else {
          // Nadie contestó a tiempo: no se hace el viaje ni el pedido.
          avisar.current({
            de: 'ia',
            texto: resultado.llamarA
              ? `Nadie pudo contestar ahora. ¿Quiere llamar a ${resultado.llamarA.nombre}?`
              : 'Nadie pudo contestar ahora. Pruebe de nuevo en un rato.',
            ...(resultado.llamarA && { llamar: resultado.llamarA }),
          })
        }
      } catch {
        // Si falla una consulta (por ejemplo, sin internet), se vuelve a probar en la próxima vuelta.
      }
    }, CADA_CUANTO_CONSULTAR_MS)
    return () => clearInterval(intervalo)
  }, [aprobacion, estado])

  if (estado === 'contestaron') return null
  if (estado === 'error') return <p className="mensaje-error">No pude saber si la familia contestó. Pruebe llamarlos.</p>
  return (
    <p className="esperando-aprobacion" role="status">
      ⏳ {cartel}
    </p>
  )
}

function BotonLlamar({ nombre, link }: { nombre: string; link: string }) {
  return (
    <a className="boton boton-emergencia boton-familiar" href={link}>
      📞 Llamar a {nombre}
    </a>
  )
}
