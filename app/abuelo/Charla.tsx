'use client'

import { Fragment, useEffect, useRef, useState, useTransition, type KeyboardEvent } from 'react'
import type { FormaDeViajar } from '@/lib/datos'
import { minutosDesde, pasoElTiempoDeAvisar, textoDeMinutos } from '@/lib/estacionamiento'
import type { Emergencia, EsperaAprobacion, Estafa, MensajeCharla, Pedido, TarjetaDeEstacionamiento, Viaje } from '@/lib/ia'
import { juntarNombres } from '@/lib/texto'
import { consultarAprobacion, responderAlAbuelo, terminarEstacionamientoAhora } from './acciones'
import { useTrato, type T } from './trato'
import { callar, decirEnVozAlta, desbloquearVoz, mensajeTeclado, prepararVoces, useDictado, useSilencio } from './voz'

export default function Charla({ inicial = [], estacionadoDesde = null }: { inicial?: MensajeCharla[]; estacionadoDesde?: string | null }) {
  const t = useTrato()
  const [charla, setCharla] = useState<MensajeCharla[]>(inicial)
  // Desde cuándo está estacionado (si lo está): para el aviso de arriba y "Ya me voy".
  const [estacionado, setEstacionado] = useState(estacionadoDesde)
  const [texto, setTexto] = useState('')
  const [hayError, setHayError] = useState(false)
  const [pensando, empezar] = useTransition()
  const final = useRef<HTMLDivElement>(null)

  // Freno para no mandar dos veces: se marca al instante (el estado de React tarda un momento en cambiar).
  const enviando = useRef(false)
  const ultimoEnvio = useRef({ texto: '', cuando: 0 })

  const [silenciada, setSilenciada] = useSilencio()
  const [puedeHablar, setPuedeHablar] = useState(false)
  const dictado = useDictado(setTexto, (dicho) => enviar(dicho))

  // Siempre mostrar lo último de la charla (sin charla todavía, no se mueve: lo de arriba, como la agenda, queda a la vista)
  useEffect(() => {
    if (charla.length === 0 && !pensando && !hayError) return
    final.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [charla, pensando, hayError])

  // iPhone: la voz se "destraba" con un toque de la persona en cualquier lugar de la pantalla.
  // (Safari cuenta como toque el click / soltar el dedo / una tecla, no el apoyar el dedo.)
  useEffect(() => {
    setPuedeHablar('speechSynthesis' in window)
    prepararVoces()
    const eventos = ['click', 'touchend', 'keydown'] as const
    for (const evento of eventos) document.addEventListener(evento, desbloquearVoz)
    return () => {
      for (const evento of eventos) document.removeEventListener(evento, desbloquearVoz)
    }
  }, [])

  // Cada respuesta nueva de la IA se lee sola en voz alta (salvo que la voz esté silenciada).
  const leidos = useRef(inicial.length)
  useEffect(() => {
    const nuevos = charla.slice(leidos.current)
    leidos.current = charla.length
    const ultimaDeLaIA = nuevos.findLast((mensaje) => mensaje.de === 'ia')
    if (ultimaDeLaIA && !silenciada) decirEnVozAlta(ultimaDeLaIA.texto)
  }, [charla, silenciada])

  function enviar(dicho?: string) {
    desbloquearVoz()
    const mensaje = (dicho ?? texto).trim()
    if (!mensaje || pensando || enviando.current) return
    // El mismo texto otra vez a los pocos segundos es un envío repetido (por ejemplo, el dictado avisando dos veces).
    if (mensaje === ultimoEnvio.current.texto && Date.now() - ultimoEnvio.current.cuando < 5000) return
    enviando.current = true
    ultimoEnvio.current = { texto: mensaje, cuando: Date.now() }

    const nuevaCharla: MensajeCharla[] = [...charla, { de: 'abuelo', texto: mensaje }]
    setCharla(nuevaCharla)
    setTexto('')
    setHayError(false)

    empezar(async () => {
      try {
        const respuesta = await responderAlAbuelo(nuevaCharla)
        if (respuesta.ok) {
          const { texto, viaje, emergencia, estafa, pedido, aprobacion, llamar, estacionamiento } = respuesta
          // Se agrega a lo que haya ahora (no a la charla de cuando se mandó): así no se pierde nada que se sumó mientras
          // tanto, por ejemplo la tarjeta de "Ya me voy".
          setCharla((antes) => [...antes, { de: 'ia', texto, viaje, emergencia, estafa, pedido, aprobacion, llamar, estacionamiento }])
          if (estacionamiento) setEstacionado(estacionamiento.accion === 'empezar' ? estacionamiento.desde : null)
        } else setHayError(true)
      } catch {
        setHayError(true)
      } finally {
        enviando.current = false
      }
    })
  }

  // Botón Hablar: si la IA está hablando, se calla; y empieza (o termina) de escuchar.
  function tocarHablar() {
    desbloquearVoz()
    callar()
    setHayError(false)
    dictado.tocar()
  }

  // Enter envía. Shift + Enter hace un salto de línea.
  function alApretarTecla(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      enviar()
    }
  }

  // "Ya me voy" del aviso: la tarjeta con "fin", sin la IA.
  function terminarEstacionamiento() {
    if (pensando || enviando.current) return // el asistente está contestando: el botón vuelve a andar al terminar
    empezar(async () => {
      try {
        const tarjeta = await terminarEstacionamientoAhora()
        setEstacionado(null)
        setCharla((antes) => [
          ...antes,
          { de: 'abuelo', texto: 'Ya me voy' },
          tarjeta
            ? {
                de: 'ia',
                texto: t(
                  'Toque “Abrir WhatsApp” y después apriete Enviar para terminar el estacionamiento.',
                  'Tocá “Abrir WhatsApp” y después apretá Enviar para terminar el estacionamiento.',
                ),
                estacionamiento: tarjeta,
              }
            : { de: 'ia', texto: 'No tenía ningún estacionamiento abierto.' },
        ])
      } catch {
        setHayError(true)
      }
    })
  }

  return (
    <>
      {puedeHablar && (
        <button type="button" className="boton-voz" onClick={() => setSilenciada(!silenciada)} aria-pressed={silenciada}>
          {silenciada ? 'Activar voz' : 'Silenciar'}
        </button>
      )}

      {estacionado && <AvisoEstacionamiento desde={estacionado} alTerminar={terminarEstacionamiento} esperando={pensando} />}

      <div className="charla" aria-live="polite">
        {charla.length === 0 && (
          <p className="charla-vacia">
            {dictado.disponible
              ? t('Toque “Hablar” y dígame lo que necesita, o escríbalo abajo.', 'Tocá “Hablar” y decime lo que necesitás, o escribilo abajo.')
              : t('Escriba abajo lo que necesita y toque Enviar.', 'Escribí abajo lo que necesitás y tocá Enviar.')}
          </p>
        )}

        {charla.map((mensaje, i) => (
          <Fragment key={i}>
            <p className={`burbuja burbuja-${mensaje.de}`}>
              <span className="burbuja-quien">{mensaje.de === 'abuelo' ? t('Usted', 'Vos') : 'Asistente'}</span>
              {mensaje.texto}
            </p>
            {mensaje.de === 'ia' && puedeHablar && (
              <button
                type="button"
                className="boton boton-escuchar"
                onClick={() => decirEnVozAlta(mensaje.texto, { enEsteToque: true })}
              >
                Escuchar
              </button>
            )}
            {mensaje.estafa && <CartelEstafa estafa={mensaje.estafa} />}
            {mensaje.emergencia && <BotonesEmergencia emergencia={mensaje.emergencia} />}
            {mensaje.viaje && <TarjetaViaje viaje={mensaje.viaje} />}
            {mensaje.pedido && <TarjetaPedido pedido={mensaje.pedido} />}
            {mensaje.estacionamiento && <TarjetaEstacionamiento estacionamiento={mensaje.estacionamiento} />}
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
            {t('No pude responder, pruebe de nuevo.', 'No pude responder, probá de nuevo.')}
          </p>
        )}
        <div ref={final} className="charla-fin" />
      </div>

      <form
        className="charla-formulario"
        onSubmit={(e) => {
          e.preventDefault()
          enviar()
        }}
      >
        <label htmlFor="mensaje" className="sr-only">
          {t('Escriba su mensaje', 'Escribí tu mensaje')}
        </label>
        <textarea
          id="mensaje"
          className="charla-caja"
          rows={2}
          placeholder={dictado.disponible ? t('Escriba acá o toque Hablar…', 'Escribí acá o tocá Hablar…') : t('Escriba acá…', 'Escribí acá…')}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={alApretarTecla}
          maxLength={2000}
          enterKeyHint="send"
        />
        <div className="charla-botones">
          {dictado.disponible && (
            <button
              type="button"
              className={`boton boton-hablar${dictado.escuchando ? ' escuchando' : ''}`}
              onClick={tocarHablar}
              aria-pressed={dictado.escuchando}
            >
              {dictado.escuchando ? t('Escuchando... toque para terminar', 'Escuchando... tocá para terminar') : 'Hablar'}
            </button>
          )}
          <button type="submit" className="boton boton-principal boton-enviar" disabled={pensando || !texto.trim()}>
            Enviar
          </button>
        </div>
        {(dictado.aviso || dictado.disponible === false) && (
          <p className="charla-aviso" role="status">
            {dictado.aviso ?? mensajeTeclado(t)}
          </p>
        )}
      </form>
    </>
  )
}

// Tarjeta con el destino y el botón de Uber. El auto lo pide el abuelo al tocar el botón.
const TEXTO_DEL_BOTON: Record<FormaDeViajar, string> = {
  uber: 'Ir en Uber',
  caminando: 'Ir caminando',
  colectivo: 'Ir en colectivo',
}

/** Lo que se le dice (y se le muestra) antes de abrir el mapa. */
const antesDeAbrirElMapa = (forma: Exclude<FormaDeViajar, 'uber'>, t: T, app?: 'moovit') =>
  app === 'moovit'
    ? t(
        'Le abro Moovit. Ahí le muestra qué colectivo tomar, dónde está la parada y dónde bajarse.',
        'Te abro Moovit. Ahí te muestra qué colectivo tomar, dónde está la parada y dónde bajarte.',
      )
    : forma === 'caminando'
    ? t(
        'Le abro el mapa para ir caminando. Cuando se abra, toque "Iniciar" y siga la flecha azul.',
        'Te abro el mapa para ir caminando. Cuando se abra, tocá "Iniciar" y seguí la flecha azul.',
      )
    : t(
        'Le abro el mapa con los colectivos. Ahí le muestra qué colectivo tomar, dónde está la parada y dónde bajarse.',
        'Te abro el mapa con los colectivos. Ahí te muestra qué colectivo tomar, dónde está la parada y dónde bajarte.',
      )

// Tarjeta del viaje: un botón grande por cada forma de viajar que activó la familia.
// Uber abre la app (el auto lo pide el abuelo). Caminando y colectivo primero le explican en voz alta
// qué va a pasar y después abren Google Maps (o Moovit, desde la agenda) con el destino puesto (en iPhone una app solo se abre con un toque).
// También la usa /abuelo/agenda ("¿Cómo voy?").
export function TarjetaViaje({ viaje }: { viaje: Viaje }) {
  const t = useTrato()
  const opciones = viaje.opciones ?? (viaje.link ? [{ forma: 'uber' as const, link: viaje.link }] : [])
  const [elegida, setElegida] = useState<(typeof opciones)[number] | null>(null)

  function elegir(opcion: (typeof opciones)[number]) {
    if (opcion.forma === 'uber') return
    setElegida(opcion)
    decirEnVozAlta(antesDeAbrirElMapa(opcion.forma, t, opcion.app), { enEsteToque: true })
  }

  return (
    <section className="tarjeta-viaje" aria-label={`Viaje a ${viaje.nombre}`}>
      <p className="tarjeta-viaje-titulo">Viaje a</p>
      <p className="tarjeta-viaje-destino">{viaje.nombre}</p>
      <p className="tarjeta-viaje-direccion">{viaje.direccion}</p>

      {elegida && elegida.forma !== 'uber' ? (
        <>
          <p className="tarjeta-viaje-explicacion" role="status">
            {antesDeAbrirElMapa(elegida.forma, t, elegida.app)}
          </p>
          <a className={`boton boton-${elegida.forma}`} href={elegida.link} target="_blank" rel="noopener noreferrer">
            {elegida.app === 'moovit' ? 'Abrir Moovit' : 'Abrir el mapa'}
          </a>
          <button type="button" className="boton boton-secundario" onClick={() => setElegida(null)}>
            Volver
          </button>
        </>
      ) : (
        opciones.map((opcion) =>
          opcion.forma === 'uber' ? (
            <a key={opcion.forma} className="boton boton-uber" href={opcion.link} target="_blank" rel="noopener noreferrer">
              {TEXTO_DEL_BOTON.uber}
            </a>
          ) : (
            <button key={opcion.forma} type="button" className={`boton boton-${opcion.forma}`} onClick={() => elegir(opcion)}>
              {TEXTO_DEL_BOTON[opcion.forma]}
            </button>
          ),
        )
      )}
    </section>
  )
}

// Botones para llamar. Los teléfonos salen de la configuración, nunca de la IA.
function BotonesEmergencia({ emergencia }: { emergencia: Emergencia }) {
  return (
    <section className="botones-emergencia" aria-label="Botones de emergencia">
      <a className="boton boton-emergencia boton-911" href="tel:911">
        Llamar al 911
      </a>
      {emergencia.familiar && (
        <a className="boton boton-emergencia boton-familiar" href={emergencia.familiar.link}>
          Llamar a {emergencia.familiar.nombre}
        </a>
      )}
      {emergencia.avisados && emergencia.avisados.length > 0 && (
        <p className="emergencia-avisados">Ya le avisé a {emergencia.avisados.join(' y a ')}.</p>
      )}
    </section>
  )
}

// Cartel rojo grande cuando la IA cree que le quieren hacer una estafa. La familia ya fue avisada.
function CartelEstafa({ estafa }: { estafa: Estafa }) {
  const t = useTrato()
  return (
    <section className="cartel-estafa" role="alert" aria-label="Cuidado: puede ser una estafa">
      <p className="cartel-estafa-titulo">Cuidado: puede ser una estafa</p>
      <ul>
        <li>{t('No dé ningún dato, clave ni código.', 'No des ningún dato, clave ni código.')}</li>
        <li>{t('No mande plata.', 'No mandes plata.')}</li>
        <li>{t('Corte y hable con su familia.', 'Cortá y hablá con tu familia.')}</li>
      </ul>
      {estafa.avisados && estafa.avisados.length > 0 && (
        <p className="cartel-estafa-avisados">Ya le avisé a {juntarNombres(estafa.avisados)}.</p>
      )}
      {estafa.familiar && (
        <a className="boton boton-emergencia boton-familiar" href={estafa.familiar.link}>
          Llamar a {estafa.familiar.nombre}
        </a>
      )}
    </section>
  )
}

// Tarjeta con el pedido y el botón de WhatsApp (o de llamar). El abuelo manda el mensaje o llama: nunca pasa solo.
function TarjetaPedido({ pedido }: { pedido: Pedido }) {
  const t = useTrato()
  if (pedido.por === 'llamada') {
    return (
      <section className="tarjeta-viaje" aria-label={`Pedido a ${pedido.comercio}`}>
        <p className="tarjeta-viaje-titulo">{t('Cuando atiendan, lea esto', 'Cuando atiendan, leé esto')}</p>
        <p className="tarjeta-para-leer">“{pedido.textoParaLeer}”</p>
        <a className="boton boton-uber boton-llamar-comercio" href={pedido.link}>
          Llamar a {pedido.comercio}
        </a>
      </section>
    )
  }
  return (
    <section className="tarjeta-viaje" aria-label={`Pedido a ${pedido.comercio}`}>
      <p className="tarjeta-viaje-titulo">Pedido a</p>
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
      <p className="tarjeta-viaje-ayuda">{t('Después toque “Enviar” en WhatsApp.', 'Después tocá “Enviar” en WhatsApp.')}</p>
    </section>
  )
}

// Estacionamiento tarifado: el WhatsApp de la Intendencia con "estacionamiento" (o "fin") escrito, y su matrícula.
// Lo manda él (aprieta Enviar): nunca pasa solo. Al empezar, si dijo los minutos, el SMS de respaldo.
function TarjetaEstacionamiento({ estacionamiento: e }: { estacionamiento: TarjetaDeEstacionamiento }) {
  const t = useTrato()
  const empezar = e.accion === 'empezar'
  return (
    <section className="tarjeta-viaje" aria-label={empezar ? 'Pagar el estacionamiento' : 'Terminar el estacionamiento'}>
      <p className="tarjeta-viaje-titulo">{empezar ? 'Pagar el estacionamiento' : 'Terminar el estacionamiento'}</p>
      <p className="tarjeta-viaje-destino">
        {t('Su auto', 'Tu auto')}: {e.matricula}
      </p>
      <p className="tarjeta-viaje-direccion">
        {empezar ? (
          <>
            WhatsApp de la Intendencia, con <strong>“{e.whatsapp.texto}”</strong> escrito. {t('Si le piden la matrícula', 'Si te piden la matrícula')}: <strong>{e.matricula}</strong>.
          </>
        ) : (
          <>
            WhatsApp de la Intendencia, con <strong>“{e.whatsapp.texto}”</strong> escrito.
            {e.estuvo !== undefined && <> Estuvo estacionado {textoDeMinutos(e.estuvo)}.</>}
          </>
        )}
      </p>
      <a className="boton boton-uber" href={e.whatsapp.link} target="_blank" rel="noopener noreferrer">
        Abrir WhatsApp
      </a>
      <p className="tarjeta-viaje-ayuda">{t('Después toque “Enviar”. El mensaje no se manda solo.', 'Después tocá “Enviar”. El mensaje no se manda solo.')}</p>
      {e.sms && (
        <a className="boton boton-secundario boton-sms" href={e.sms.link}>
          Si WhatsApp no anda: mandar SMS
        </a>
      )}
    </section>
  )
}

/**
 * Mientras está estacionado: un aviso arriba de la charla. Pasada una hora, avisa que ya pasó más de una hora
 * (por si se olvidó de terminarlo). "Ya me voy" arma el WhatsApp con "fin" sin la IA.
 */
function AvisoEstacionamiento({ desde, alTerminar, esperando }: { desde: string; alTerminar: () => void; esperando: boolean }) {
  const t = useTrato()
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const reloj = setInterval(() => setAhora(Date.now()), 30_000)
    return () => clearInterval(reloj)
  }, [])
  const pasoUnaHora = pasoElTiempoDeAvisar(desde, ahora)
  return (
    <div className={`aviso-estacionamiento ${pasoUnaHora ? 'aviso-estacionamiento-hora' : ''}`} role={pasoUnaHora ? 'alert' : 'status'}>
      <p>
        {pasoUnaHora
          ? t(
              `Ya pasó más de una hora desde que estacionó (${textoDeMinutos(minutosDesde(desde, ahora))}). ¿Ya se va?`,
              `Ya pasó más de una hora desde que estacionaste (${textoDeMinutos(minutosDesde(desde, ahora))}). ¿Ya te vas?`,
            )
          : t(`Está estacionado hace ${textoDeMinutos(minutosDesde(desde, ahora))}.`, `Estás estacionado hace ${textoDeMinutos(minutosDesde(desde, ahora))}.`)}
      </p>
      {/* Mientras el asistente piensa, espera: así la tarjeta con "fin" no se cruza con la respuesta. */}
      <button type="button" className="boton boton-principal" onClick={alTerminar} disabled={esperando}>
        Ya me voy
      </button>
    </div>
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
  const t = useTrato()
  const esperando = (familiares: string[]) =>
    t(`Le pregunté a ${juntarNombres(familiares)}, espere un momento...`, `Le pregunté a ${juntarNombres(familiares)}, esperá un momento...`)
  const [estado, setEstado] = useState<'esperando' | 'contestaron' | 'error'>('esperando')
  const [cartel, setCartel] = useState(esperando(aprobacion.familiares))
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
          return setCartel(esperando(resultado.familiares))
        }
        yaAvise.current = true
        if (resultado.estado === 'no-encontrado') return setEstado('error')
        setEstado('contestaron')
        if (resultado.estado === 'aprobado') {
          const quien = resultado.familiar
          avisar.current(
            resultado.viaje
              ? { de: 'ia', texto: `${quien} aprobó el viaje. ${t('Toque cómo quiere ir.', 'Tocá cómo querés ir.')}`, viaje: resultado.viaje }
              : resultado.pedido
                ? {
                    de: 'ia',
                    texto:
                      resultado.pedido.por === 'llamada'
                        ? `${quien} aprobó el pedido. ${t('Toque el botón verde para llamar y, cuando atiendan, lea el texto.', 'Tocá el botón verde para llamar y, cuando atiendan, leé el texto.')}`
                        : `${quien} aprobó el pedido. ${t('Toque el botón verde para abrir WhatsApp y después apriete enviar.', 'Tocá el botón verde para abrir WhatsApp y después apretá enviar.')}`,
                    pedido: resultado.pedido,
                  }
                : { de: 'ia', texto: `${quien} dijo que sí. ${t('Si quiere organizarlo, puede llamar a', 'Si querés organizarlo, podés llamar a')} ${quien}.` },
          )
        } else if (resultado.estado === 'rechazado') {
          const quien = resultado.familiar
          avisar.current({
            de: 'ia',
            texto: `${quien} dijo que esta vez no. ${t('Quédese tranquilo: si quiere, puede llamar a', 'Quedate tranquilo: si querés, podés llamar a')} ${quien} para hablarlo.`,
            ...(resultado.llamar && { llamar: { nombre: quien, link: resultado.llamar } }),
          })
        } else {
          // Nadie contestó a tiempo: no se hace el viaje ni el pedido.
          avisar.current({
            de: 'ia',
            texto: resultado.llamarA
              ? `Nadie pudo contestar ahora. ${t('¿Quiere llamar a', '¿Querés llamar a')} ${resultado.llamarA.nombre}?`
              : t('Nadie pudo contestar ahora. Pruebe de nuevo en un rato.', 'Nadie pudo contestar ahora. Probá de nuevo en un rato.'),
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
  if (estado === 'error') {
    return <p className="mensaje-error">{t('No pude saber si la familia contestó. Pruebe llamarlos.', 'No pude saber si la familia contestó. Probá llamarlos.')}</p>
  }
  return (
    <p className="esperando-aprobacion" role="status">
      {cartel}
    </p>
  )
}

function BotonLlamar({ nombre, link }: { nombre: string; link: string }) {
  return (
    <a className="boton boton-emergencia boton-familiar" href={link}>
      Llamar a {nombre}
    </a>
  )
}
