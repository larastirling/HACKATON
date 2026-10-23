import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { pedirPermiso } from './aprobaciones'
import {
  anotarEstacionamientoAbierto,
  cerrarEstacionamiento,
  formasDeViajarDe,
  leerEstacionamientoAbierto,
  primerNombre,
  ZONA_HORARIA,
  type ConfiguracionAbuelo,
  type FormaDeViajar,
  type QueSePidio,
} from './datos'
import {
  armarEmergencia,
  avisarDudaALaFamilia,
  avisarEmergenciaALaFamilia,
  avisarEstafaALaFamilia,
  avisarPedidoDePlata,
  contactosParaLlamar,
  type Emergencia,
  type Estafa,
} from './emergencia'
import {
  minutosDesde,
  mostrarMatricula,
  normalizarMatricula,
  pasoElTiempoDeAvisar,
  tarjetaParaEmpezar,
  tarjetaParaTerminar,
  textoDeMinutos,
  type EstacionamientoAbierto,
  type TarjetaDeEstacionamiento,
} from './estacionamiento'
import { instruccionesDelTrato, palabrasDelOtroTrato, tratoDe } from './trato'
import { buscarCoordenadas } from './mapas'
import { juntarNombres } from './texto'
import { armarViaje, nombresDeFormas, type Viaje } from './viajes'
import { armarPedido, type Pedido } from './whatsapp'

// ÚNICO lugar donde se habla con la IA. Solo corre en el servidor:
// la clave ANTHROPIC_API_KEY nunca llega al navegador.

// Haiku 5.5: el modelo más barato (0,10 / 0,50 dólares por millón de tokens de entrada / salida).
export const MODELO_IA = 'claude-haiku-5-5'

export type RespuestaIA = { ok: true; texto: string } | { ok: false; error: string }

/** Un mensaje de la charla, tal como lo ve la pantalla. */
export interface MensajeCharla {
  de: 'abuelo' | 'ia'
  texto: string
  /** Si la IA propuso un viaje, la tarjeta con el botón de Uber. */
  viaje?: Viaje
  /** Si la IA vio un posible problema de salud, los botones para llamar. */
  emergencia?: Emergencia
  /** Si la IA cree que le quieren hacer una estafa, el cartel rojo (y a quién se avisó). */
  estafa?: Estafa
  /** Si la IA propuso un pedido, la tarjeta con el botón de WhatsApp o de llamar. */
  pedido?: Pedido
  /** Si hizo falta permiso, a quién se le preguntó (la pantalla espera la respuesta). */
  aprobacion?: EsperaAprobacion
  /** Botón para llamar a un familiar (por ejemplo, si rechazó un pedido, o una duda peligrosa como el gas). */
  llamar?: { nombre: string; link: string }
  /** Estacionamiento: la tarjeta para empezar o terminar, con el botón de WhatsApp (y el SMS de respaldo). Lo manda él. */
  estacionamiento?: TarjetaDeEstacionamiento
}

/** Lo que necesita la pantalla del abuelo para esperar la respuesta de la familia. */
export interface EsperaAprobacion {
  id: string
  /** A quiénes se les preguntó (a todos a la vez). */
  familiares: string[]
}

export type { Emergencia, Estafa, Pedido, TarjetaDeEstacionamiento, Viaje }

/** Pregunta suelta, sin charla (la usa /prueba). */
export async function preguntarALaIA(pregunta: string): Promise<RespuestaIA> {
  return llamarALaIA({ messages: [{ role: 'user', content: pregunta }] })
}

/**
 * Charla de varios mensajes. `instrucciones` le dice a la IA quién es y cómo hablar;
 * `mensajes` es toda la charla hasta ahora (la API no recuerda nada entre pedidos).
 * La usa /familia.
 */
export async function charlarConLaIA(
  instrucciones: string | undefined,
  mensajes: Anthropic.MessageParam[],
  herramientas?: Pick<Parameters<typeof llamarALaIA>[0], 'tools' | 'usarHerramienta'>,
): Promise<RespuestaIA> {
  return llamarALaIA({ system: instrucciones, messages: mensajes, ...herramientas })
}

/**
 * Charla del abuelo: manda TODA la charla y las instrucciones armadas con su configuración.
 * Herramientas de la IA (el servidor arma todo con los datos guardados; la IA solo decide):
 * - proponer_viaje: elige el id del lugar (y cómo quiere ir) y el servidor arma los botones: Uber, caminando, colectivo.
 * - mostrar_emergencia: el servidor muestra los botones para llamar al 911 y al primer familiar.
 * - alertar_estafa: el servidor muestra un cartel rojo y les avisa a los familiares (mail y celular).
 * - consultar_a_la_familia: algo fuera de lo común (lugar no guardado, muy lejos, hora rara): en vez de decir
 *   que no, se le pide aprobación a la familia. Si es un viaje y el mapa encuentra el lugar, al aprobar sale el Uber.
 * - avisar_pedido_de_plata: quiere mandar plata. No se consulta ni se hace nada: solo se avisa a la familia.
 * - proponer_pedido: elige el id del comercio (y una aclaración, o lo distinto que pidió) y el servidor
 *   arma el link de WhatsApp (o, si se le pide llamando, el texto para leer y el link para llamar).
 * Si algo necesita permiso, lo decide el SERVIDOR (lib/aprobaciones.ts): en vez del botón, le pregunta
 * por mail al primer familiar y la pantalla del abuelo espera la respuesta.
 */
export async function conversarConElAbuelo(
  configuracion: ConfiguracionAbuelo,
  charla: MensajeCharla[],
  { urlApp }: { urlApp: string },
): Promise<
  RespuestaIA & {
    viaje?: Viaje
    emergencia?: Emergencia
    estafa?: Estafa
    pedido?: Pedido
    aprobacion?: EsperaAprobacion
    llamar?: { nombre: string; link: string }
    estacionamiento?: TarjetaDeEstacionamiento
  }
> {
  const lugares = configuracion.lugares.map((lugar, i) => ({ id: `lugar-${i + 1}`, ...lugar }))
  const formasActivas = formasDeViajarDe(configuracion)
  const comercios = configuracion.comercios.map((comercio, i) => ({ id: `comercio-${i + 1}`, ...comercio }))
  const nombreAbuelo = primerNombre(configuracion.abuelo.nombre)
  let viaje: Viaje | undefined
  let emergencia: Emergencia | undefined
  let estafa: Estafa | undefined
  let pedido: Pedido | undefined
  let aprobacion: EsperaAprobacion | undefined
  let llamar: { nombre: string; link: string } | undefined
  let estacionamiento: TarjetaDeEstacionamiento | undefined
  // Si ya tiene el estacionamiento abierto (lo anotó la app al empezar).
  let abierto = await leerEstacionamientoAbierto(configuracion.codigoFamilia)

  /** Pide permiso a la familia (una sola vez por respuesta) y le dice a la IA qué contestar. */
  async function pedirPermisoALaFamilia(descripcion: string, que: QueSePidio): Promise<string> {
    if (aprobacion) return `Ya le preguntaste a la familia por otra cosa en esta respuesta. No pidas otro permiso ahora.`
    const resultado = await pedirPermiso(configuracion, descripcion, que, urlApp)
    if (!resultado.ok) {
      return `Esto necesita permiso de la familia, pero NO se le pudo preguntar (${resultado.motivo}). No se muestra ningún botón. Decile con calma que no pudiste avisarle a la familia y que es mejor que los llame.`
    }
    aprobacion = { id: resultado.aprobacion.id, familiares: resultado.familiares }
    const aQuienes = juntarNombres(resultado.familiares)
    return `Esto necesita permiso de la familia, así que NO se muestra el botón todavía. Ya les pregunté a todos a la vez: a ${aQuienes}. Decile con calma, en una o dos frases, que le preguntaste a ${aQuienes} y que espere un momento: la pantalla le va a avisar sola cuando alguien conteste. No digas que está aprobado.`
  }

  async function proponerPedido(comercioId: unknown, aclaracion: unknown, pedidoDistinto: unknown): Promise<string> {
    const comercio = comercios.find((c) => c.id === comercioId)
    if (!comercio) return 'Ese id no corresponde a ningún comercio guardado. No inventes comercios.'
    if (comercio.numeroNoAnda) {
      return `NO se puede armar el pedido: la familia avisó que el número de "${comercio.nombre}" no anda. Decile con calma que ese número no funciona y que le pida a la familia el número nuevo (o usá consultar_a_la_familia).`
    }
    const distinto = typeof pedidoDistinto === 'string' ? pedidoDistinto.trim() : ''
    const propuesto = armarPedido(comercio, configuracion.abuelo, {
      aclaracion: typeof aclaracion === 'string' ? aclaracion : '',
      pedidoDistinto: distinto,
    })
    const porLlamada = comercio.pedidoPor === 'llamada'
    if (!propuesto) {
      return `NO se puede armar el pedido: a "${comercio.nombre}" le falta el número ${porLlamada ? 'de teléfono' : 'de WhatsApp'}. Decile que ese comercio no tiene el número anotado y que le pida a la familia que lo agregue.`
    }
    // Reglas del servidor: lo que no es el pedido habitual, o un comercio que necesita permiso, lo aprueba la familia.
    if (distinto || comercio.necesitaPermiso) {
      return pedirPermisoALaFamilia(`${nombreAbuelo} quiere pedir a ${comercio.nombre}: ${propuesto.pedido}`, {
        tipo: 'pedido',
        pedido: propuesto,
      })
    }
    pedido = propuesto
    const detalle = `${propuesto.pedido}${propuesto.aclaracion ? `; aclaración: ${propuesto.aclaracion}` : ''}`
    if (porLlamada) {
      return `Listo: debajo de tu respuesta, el abuelo ve una tarjeta con el pedido a "${comercio.nombre}" (${detalle}), el texto para leer cuando atiendan y un botón verde "Llamar a ${comercio.nombre}". NO se llamó: llama él cuando toca el botón. Contáselo en una o dos frases, sin escribir números, links ni precios.`
    }
    return `Listo: debajo de tu respuesta, el abuelo ve una tarjeta con el pedido a "${comercio.nombre}" (${detalle}) y un botón verde "Abrir WhatsApp". El mensaje NO está mandado: él toca el botón y después aprieta enviar en WhatsApp. Contáselo en una o dos frases, sin escribir números, links ni precios.`
  }

  async function mostrarEmergencia(): Promise<string> {
    if (emergencia) return 'Los botones de emergencia ya se están mostrando.'
    // Además de los botones, el servidor les avisa por mail a los familiares (como máximo uno cada 10 minutos).
    const loQueDijo = charla.findLast((mensaje) => mensaje.de === 'abuelo')?.texto ?? ''
    const avisados = await avisarEmergenciaALaFamilia(configuracion, loQueDijo)
    emergencia = { ...armarEmergencia(configuracion.familiares), ...(avisados.length > 0 && { avisados }) }
    const botones = emergencia.familiar
      ? `dos botones grandes: "Llamar al 911" (rojo) y "Llamar a ${emergencia.familiar.nombre}"`
      : 'un botón grande rojo "Llamar al 911" (no hay teléfono de la familia guardado)'
    const aviso = avisados.length > 0 ? ` Además, el sistema ya les avisó por mail a ${avisados.join(' y ')}.` : ''
    return `Listo: debajo de tu respuesta el abuelo ve ${botones}.${aviso} Decile en una o dos frases cortas y tranquilas que toque uno de los botones. No des consejos médicos, no nombres remedios y no escribas números de teléfono.`
  }

  async function alertarEstafa(motivo: unknown): Promise<string> {
    if (estafa) return 'El cartel de posible estafa ya se está mostrando.'
    const loQueDijo = charla.findLast((mensaje) => mensaje.de === 'abuelo')?.texto ?? ''
    estafa = await avisarEstafaALaFamilia(configuracion, loQueDijo, typeof motivo === 'string' ? motivo : '')
    const aviso = estafa.avisados?.length ? ` El sistema ya les avisó a ${juntarNombres(estafa.avisados)} para que lo llamen.` : ''
    return `Listo: debajo de tu respuesta el abuelo ve un cartel rojo grande que dice que puede ser una estafa.${aviso} Decile en dos o tres frases cortas y claras: que no dé ningún dato, clave ni código, que no mande plata y que corte. Si se avisó a la familia, contale que ya les avisaste. No escribas números de teléfono.`
  }

  /** Algo fuera de lo común: no se rechaza, se le consulta a la familia (igual que un lugar con permiso). */
  async function consultarALaFamilia(entrada: { descripcion?: unknown; destino?: unknown; lugar_id?: unknown }): Promise<string> {
    const descripcion = typeof entrada.descripcion === 'string' ? entrada.descripcion.trim().slice(0, 200) : ''
    if (!descripcion) return 'No se consultó: falta qué quiere hacer.'
    const lugar = lugares.find((l) => l.id === entrada.lugar_id)
    if (lugar) {
      const armado = await armarViaje(lugar, configuracion)
      if (armado.ok) return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ${descripcion}`, { tipo: 'viaje', viaje: armado.viaje })
    }
    const destino = typeof entrada.destino === 'string' ? entrada.destino.trim().slice(0, 120) : ''
    if (destino) {
      // El lugar no está guardado: si el mapa lo encuentra, al aprobar se le muestra cómo ir. Nunca se inventa.
      const ubicacion = await buscarCoordenadas(destino)
      const armado =
        ubicacion &&
        (await armarViaje(
          {
            nombre: destino,
            direccion: ubicacion.direccionDelMapa.split(',').slice(0, 3).join(',').trim(),
            latitud: ubicacion.latitud,
            longitud: ubicacion.longitud,
          },
          configuracion,
        ))
      if (armado && armado.ok) return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ${descripcion}`, { tipo: 'viaje', viaje: armado.viaje })
    }
    return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ${descripcion}`, { tipo: 'consulta', texto: descripcion })
  }

  async function avisarPlata(): Promise<string> {
    const loQueDijo = charla.findLast((mensaje) => mensaje.de === 'abuelo')?.texto ?? ''
    const avisados = await avisarPedidoDePlata(configuracion, loQueDijo)
    const aviso = avisados.length > 0 ? `El sistema ya les avisó a ${juntarNombres(avisados)}.` : 'No se le pudo avisar a nadie de la familia.'
    return `NO se mandó plata ni se le preguntó nada a la familia: el asistente nunca manda ni transfiere plata. ${aviso} Decile con calma, en una o dos frases, que eso no lo podés hacer y que ${avisados.length > 0 ? 'ya le avisaste a la familia para que lo llamen' : 'es mejor que lo hable con la familia'}.`
  }

  /** Estacionar: WhatsApp de la Intendencia con "estacionamiento" escrito, y se anota desde cuándo. */
  async function empezarEstacionamiento(entrada: { minutos?: unknown; matricula?: unknown }): Promise<string> {
    if (estacionamiento) return 'La tarjeta del estacionamiento ya se está mostrando.'
    if (abierto) {
      return `Ya tiene un estacionamiento abierto desde hace ${textoDeMinutos(minutosDesde(abierto.desde))}. Preguntale si se fue de ahí: si dice que sí, usá terminar_estacionamiento y después, si estacionó en otro lado, empezar_estacionamiento.`
    }
    const guardada = configuracion.abuelo.matricula
    const dicha = typeof entrada.matricula === 'string' ? normalizarMatricula(entrada.matricula) : null
    const matricula = guardada ?? dicha
    if (!matricula) {
      return 'NO se abrió nada: no hay ninguna matrícula guardada. Preguntale la matrícula del auto (letras y números, por ejemplo SBA 1234) y repetísela para que confirme; o sugerile que le pida a la familia que la cargue en la app. No la inventes.'
    }
    const minutos = typeof entrada.minutos === 'number' && entrada.minutos > 0 ? Math.round(entrada.minutos) : undefined
    const nuevo: EstacionamientoAbierto = { desde: new Date().toISOString(), matricula, ...(minutos && { minutos }) }
    await anotarEstacionamientoAbierto(configuracion.codigoFamilia, nuevo)
    abierto = nuevo
    estacionamiento = tarjetaParaEmpezar(nuevo)
    const respaldo = estacionamiento.sms
      ? ` Abajo hay también un botón más chico "Mandar SMS" (por si WhatsApp no anda) con "${estacionamiento.sms.texto}".`
      : ''
    const nota = guardada
      ? ''
      : ' Como esa matrícula no está guardada, recordale que el auto tiene que estar registrado en el sistema de estacionamiento de la Intendencia (eso lo hace la familia una vez) y que puede pedirle a la familia que la cargue en la app.'
    return `Listo: debajo de tu respuesta, el abuelo ve una tarjeta con su matrícula (${estacionamiento.matricula}) y un botón grande "Abrir WhatsApp", que abre el WhatsApp de la Intendencia con la palabra "estacionamiento" escrita. NO está mandado: él aprieta Enviar y sigue lo que le contesten (si le piden la matrícula, está en la tarjeta).${respaldo} Quedó anotado que estacionó ahora: cuando se vaya, que te diga "ya me voy" para terminarlo.${nota} Contáselo en dos o tres frases cortas.`
  }

  /** Irse: WhatsApp de la Intendencia con "fin" escrito, y se borra lo anotado. */
  async function terminarEstacionamiento(): Promise<string> {
    if (estacionamiento?.accion === 'terminar') return 'La tarjeta para terminar el estacionamiento ya se está mostrando.'
    const matricula = abierto?.matricula ?? configuracion.abuelo.matricula
    if (!matricula) return 'No hay ningún estacionamiento anotado ni matrícula guardada. Preguntale si estacionó con el WhatsApp de la Intendencia.'
    estacionamiento = tarjetaParaTerminar(abierto ?? { desde: new Date().toISOString(), matricula })
    const estuvo = abierto ? ` Estuvo estacionado ${textoDeMinutos(estacionamiento.estuvo ?? 0)}.` : ''
    await cerrarEstacionamiento(configuracion.codigoFamilia)
    abierto = null
    return `Listo: debajo de tu respuesta, el abuelo ve un botón grande "Abrir WhatsApp" que abre el WhatsApp de la Intendencia con la palabra "fin" escrita. NO está mandado: él aprieta Enviar.${estuvo} Contáselo en una o dos frases.`
  }

  /** Un botón para llamar al primer familiar con teléfono (por ejemplo, para algo peligroso como el gas). */
  function ofrecerLlamarALaFamilia(): string {
    const [primero] = contactosParaLlamar(configuracion.familiares)
    if (!primero) return 'No hay ningún familiar con teléfono guardado: no se muestra el botón. Decile que llame a un técnico o a alguien de confianza.'
    llamar = primero
    return `Listo: debajo de tu respuesta, el abuelo ve un botón grande "Llamar a ${primero.nombre}". No escribas números de teléfono.`
  }

  /** Una duda que no se pudo resolver por chat: con su OK, se la cuenta a la familia para que lo llamen. */
  async function preguntarleALaFamilia(duda: unknown): Promise<string> {
    const texto = typeof duda === 'string' ? duda.trim().slice(0, 200) : ''
    if (!texto) return 'No se le preguntó a nadie: falta la duda.'
    const avisados = await avisarDudaALaFamilia(configuracion, texto)
    const [primero] = contactosParaLlamar(configuracion.familiares)
    if (primero) llamar = primero
    if (avisados.length === 0) {
      return `No se le pudo avisar a nadie de la familia.${primero ? ` Debajo de tu respuesta ve un botón "Llamar a ${primero.nombre}".` : ''} Decíselo con calma.`
    }
    return `Listo: ya les conté la duda a ${juntarNombres(avisados)} para que lo llamen.${primero ? ` Además, debajo de tu respuesta ve un botón "Llamar a ${primero.nombre}" por si quiere llamar él.` : ''} Decíselo en una o dos frases. No escribas números de teléfono.`
  }

  async function proponerViaje(lugarId: unknown, forma: unknown): Promise<string> {
    const lugar = lugares.find((l) => l.id === lugarId)
    if (!lugar) return 'Ese id no corresponde a ningún lugar guardado. No inventes lugares.'
    const pidio = formasActivas.find((f) => f === forma)
    const armado = await armarViaje(lugar, configuracion, pidio)
    if (!armado.ok) {
      return armado.motivo === 'sin-ubicacion'
        ? `NO se puede armar el viaje: a "${lugar.nombre}" le falta la ubicación exacta. Decile que esa dirección no está completa y que le pida a la familia que la complete.`
        : `NO se puede armar el viaje a "${lugar.nombre}": la única forma activada es caminando y ${armado.caminandoNo ?? 'no se puede ir caminando'}. Decile con amabilidad que hasta ahí no conviene ir caminando y que le pida a la familia otra forma de viajar.`
    }
    const { viaje: propuesto, caminandoNo } = armado
    const nota = pidio && pidio !== propuesto.opciones[0].forma ? ` Pidió ir ${nombresDeFormas([pidio])}, pero no se puede: ${caminandoNo}. Decíselo con amabilidad.` : ''
    // Regla del servidor: los lugares con necesitaPermiso necesitan el OK de la familia (vaya como vaya).
    if (lugar.necesitaPermiso) {
      return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ir a ${lugar.nombre}`, { tipo: 'viaje', viaje: propuesto })
    }
    viaje = propuesto
    const botones = propuesto.opciones.map((o) => BOTON_DE_VIAJE[o.forma]).join(', ')
    return `Listo: debajo de tu respuesta, el abuelo ve una tarjeta con "${lugar.nombre}" (${lugar.direccion}) y estos botones grandes: ${botones}. Nada está pedido: elige él tocando un botón (Uber abre la app para pedir el auto; caminando y colectivo abren el mapa con el destino puesto).${nota} Contáselo en una o dos frases, sin escribir links ni coordenadas.`
  }

  const respuesta = await llamarALaIA({
    system: instruccionesParaElAbuelo(configuracion, lugares, comercios, abierto),
    messages: charla.map((mensaje) => ({
      role: mensaje.de === 'abuelo' ? ('user' as const) : ('assistant' as const),
      content: mensaje.texto,
    })),
    tools: [
      HERRAMIENTA_MOSTRAR_EMERGENCIA,
      HERRAMIENTA_ALERTAR_ESTAFA,
      herramientaConsultarALaFamilia(lugares.map((l) => l.id)),
      HERRAMIENTA_AVISAR_PEDIDO_DE_PLATA,
      ...(lugares.length > 0 && formasActivas.length > 0 ? [herramientaProponerViaje(lugares.map((l) => l.id), formasActivas)] : []),
      ...(comercios.length > 0 ? [herramientaProponerPedido(comercios.map((c) => c.id))] : []),
      herramientaEmpezarEstacionamiento(configuracion.abuelo.matricula),
      HERRAMIENTA_TERMINAR_ESTACIONAMIENTO,
      HERRAMIENTA_LLAMAR_A_LA_FAMILIA,
      HERRAMIENTA_PREGUNTARLE_A_LA_FAMILIA,
    ],
    usarHerramienta: (bloque) => {
      if (bloque.name === 'mostrar_emergencia') return mostrarEmergencia()
      if (bloque.name === 'alertar_estafa') return alertarEstafa((bloque.input as { motivo?: unknown }).motivo)
      if (bloque.name === 'consultar_a_la_familia') return consultarALaFamilia(bloque.input as Record<string, unknown>)
      if (bloque.name === 'avisar_pedido_de_plata') return avisarPlata()
      if (bloque.name === 'empezar_estacionamiento') return empezarEstacionamiento(bloque.input as Record<string, unknown>)
      if (bloque.name === 'terminar_estacionamiento') return terminarEstacionamiento()
      if (bloque.name === 'ofrecer_llamar_a_la_familia') return ofrecerLlamarALaFamilia()
      if (bloque.name === 'preguntarle_a_la_familia') return preguntarleALaFamilia((bloque.input as { duda?: unknown }).duda)
      if (bloque.name === 'proponer_viaje') {
        const entrada = bloque.input as { lugar_id?: unknown; forma?: unknown }
        return proponerViaje(entrada.lugar_id, entrada.forma)
      }
      if (bloque.name === 'proponer_pedido') {
        const entrada = bloque.input as { comercio_id?: unknown; aclaracion?: unknown; pedido_distinto?: unknown }
        return proponerPedido(entrada.comercio_id, entrada.aclaracion, entrada.pedido_distinto)
      }
      return `No existe la herramienta "${bloque.name}".`
    },
  })
  if (!respuesta.ok) return respuesta
  const texto = await conElTratoCorrecto(respuesta.texto, configuracion.abuelo.comoLeGustaQueLeHablen)
  return {
    ...respuesta,
    texto,
    ...(viaje && { viaje }),
    ...(emergencia && { emergencia }),
    ...(estafa && { estafa }),
    ...(pedido && { pedido }),
    ...(aprobacion && { aprobacion }),
    ...(llamar && { llamar }),
    ...(estacionamiento && { estacionamiento }),
  }
}

// Las tres de abajo van sin strict: Haiku rechaza la charla si hay muchas herramientas strict. Lo que llega lo revisa
// el servidor igual (los minutos, la matrícula, la duda).

/**
 * Si la respuesta usó palabras del otro trato (por ejemplo "salí" o "enciende" cuando es de usted), se le pide a la IA
 * que la reescriba en el trato correcto. Si igual falla, queda la original (mejor eso que no contestar).
 */
async function conElTratoCorrecto(texto: string, comoLeGustaQueLeHablen: string): Promise<string> {
  const trato = tratoDe(comoLeGustaQueLeHablen)
  if (!trato || palabrasDelOtroTrato(texto, trato).length === 0) return texto
  console.log(`[abuelo] la respuesta no respetó el trato (${trato}): ${palabrasDelOtroTrato(texto, trato).join(', ')}. Se reescribe.`)
  const reescrita = await llamarALaIA({
    system:
      `Reescribí el texto que te paso tratando a la persona ${trato === 'usted' ? 'de USTED' : 'de VOS (rioplatense)'} en todas las frases. ` +
      'No cambies nada más: mismo contenido, mismo orden, mismo largo. Devolvé solo el texto reescrito.',
    messages: [{ role: 'user', content: texto }],
  })
  return reescrita.ok && reescrita.texto ? reescrita.texto : texto
}

function herramientaEmpezarEstacionamiento(matriculaGuardada: string | undefined): Anthropic.Beta.BetaTool {
  return {
    name: 'empezar_estacionamiento',
    description:
      'Estacionamiento tarifado, al estacionar: le muestra al abuelo una tarjeta con su matrícula y un botón que abre el WhatsApp ' +
      'de la Intendencia con "estacionamiento" escrito (y, si dijo los minutos, un SMS de respaldo). NO manda nada: él aprieta Enviar. ' +
      'Usala recién cuando confirmó la matrícula. La app anota desde cuándo está estacionado.',
    input_schema: {
      type: 'object',
      properties: {
        minutos: { type: 'integer', description: 'Cuántos minutos dijo que va a estar (una hora = 60). 0 si no lo dijo.' },
        matricula: {
          type: 'string',
          description: matriculaGuardada
            ? 'Dejalo en "": se usa la matrícula guardada.'
            : 'No hay matrícula guardada: la que dijo el abuelo y confirmó, tal cual (ej. "SBA 1234"). Nunca la inventes.',
        },
      },
      required: ['minutos', 'matricula'],
      additionalProperties: false,
    },
    strict: false,
  }
}

const HERRAMIENTA_TERMINAR_ESTACIONAMIENTO: Anthropic.Beta.BetaTool = {
  name: 'terminar_estacionamiento',
  description:
    'Estacionamiento tarifado, al irse ("ya me voy", "me voy", "ya saqué el auto"): le muestra un botón que abre el WhatsApp ' +
    'de la Intendencia con "fin" escrito. NO manda nada: él aprieta Enviar. Borra lo anotado.',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
  strict: false,
}

const HERRAMIENTA_LLAMAR_A_LA_FAMILIA: Anthropic.Beta.BetaTool = {
  name: 'ofrecer_llamar_a_la_familia',
  description:
    'Le muestra al abuelo un botón grande para llamar a su primer familiar (el teléfono lo pone el sistema). ' +
    'Usala cuando una duda es peligrosa (gas, electricidad, una pérdida de agua grande) o cuando conviene que hable con la familia.',
  input_schema: {
    type: 'object',
    properties: { motivo: { type: 'string', description: 'En pocas palabras, para qué (no se le muestra).' } },
    required: ['motivo'],
    additionalProperties: false,
  },
  strict: false,
}

const HERRAMIENTA_PREGUNTARLE_A_LA_FAMILIA: Anthropic.Beta.BetaTool = {
  name: 'preguntarle_a_la_familia',
  description:
    'Cuando una duda del día a día no se pudo resolver por chat y el abuelo DIJO QUE SÍ a "¿Querés que le pregunte a…?": ' +
    'les cuenta la duda a los familiares (mail y celular) para que lo llamen. No es un permiso. Nunca para salud, plata ni emergencias.',
  input_schema: {
    type: 'object',
    properties: { duda: { type: 'string', description: 'La duda en pocas palabras, para la familia. Ej. "no le anda la tele".' } },
    required: ['duda'],
    additionalProperties: false,
  },
  strict: false,
}

function herramientaProponerPedido(ids: string[]): Anthropic.Beta.BetaTool {
  return {
    name: 'proponer_pedido',
    description:
      'Le muestra al abuelo una tarjeta con su pedido a un comercio GUARDADO: un botón para abrir WhatsApp con el mensaje listo, ' +
      'o, si el comercio se pide llamando, el texto para leer y un botón para llamar. ' +
      'No manda ni llama nada: lo hace él tocando el botón. Si el pedido necesita permiso, el sistema le pregunta a la familia. ' +
      'Usala solo cuando esté claro a qué comercio guardado le quiere pedir.',
    input_schema: {
      type: 'object',
      properties: {
        comercio_id: { type: 'string', enum: ids, description: 'El id del comercio guardado (por ejemplo "comercio-1").' },
        aclaracion: {
          type: 'string',
          description:
            'Un detalle chico sobre su pedido habitual que no cambia qué se pide (por ejemplo "sin aceitunas"). Texto vacío si no hay.',
        },
        pedido_distinto: {
          type: 'string',
          description:
            'Si pide algo DISTINTO de su pedido habitual (otra comida u otra cantidad), qué pidió, tal como lo dijo (por ejemplo "tres empanadas de carne"). Texto vacío si es lo de siempre.',
        },
      },
      required: ['comercio_id', 'aclaracion', 'pedido_distinto'],
      additionalProperties: false,
    },
    strict: true,
  }
}

const HERRAMIENTA_MOSTRAR_EMERGENCIA: Anthropic.Beta.BetaTool = {
  name: 'mostrar_emergencia',
  description:
    'Muestra al abuelo dos botones grandes: "Llamar al 911" y "Llamar" a su primer familiar (los teléfonos los pone el sistema). ' +
    'Usala cuando lo que dice PUEDE ser un problema de salud o una emergencia. Ante la duda, usala.',
  input_schema: {
    type: 'object',
    properties: {
      motivo: { type: 'string', description: 'En pocas palabras, qué le pasa (no se le muestra al abuelo).' },
    },
    required: ['motivo'],
    additionalProperties: false,
  },
  strict: true,
}

const HERRAMIENTA_ALERTAR_ESTAFA: Anthropic.Beta.BetaTool = {
  name: 'alertar_estafa',
  description:
    'Muestra al abuelo un cartel rojo grande de "posible estafa" y les avisa a los familiares (por mail y al celular) para que lo llamen. ' +
    'Usala cuando lo que cuenta PUEDE ser un intento de estafa: alguien que se hace pasar por un familiar, el banco o una empresa y pide plata, ' +
    'datos, claves o códigos; premios que hay que pagar para cobrar; urgencias de plata. Ante la duda, usala.',
  input_schema: {
    type: 'object',
    properties: {
      motivo: { type: 'string', description: 'En pocas palabras, por qué parece una estafa (lo lee la familia).' },
    },
    required: ['motivo'],
    additionalProperties: false,
  },
  strict: true,
}

function herramientaConsultarALaFamilia(idsDeLugares: string[]): Anthropic.Beta.BetaTool {
  return {
    name: 'consultar_a_la_familia',
    description:
      'Para pedidos fuera de lo común (un lugar que no está guardado, un viaje muy lejos, algo a una hora rara): en vez de decirle que no, ' +
      'le pide aprobación a la familia (por mail y al celular) y la pantalla espera la respuesta. ' +
      'NUNCA para plata (usá avisar_pedido_de_plata), emergencias (mostrar_emergencia) ni temas de salud.',
    input_schema: {
      type: 'object',
      properties: {
        descripcion: {
          type: 'string',
          description: 'Qué quiere, en pocas palabras y en tercera persona, para el mail a la familia. Ej. "ir a Punta del Este", "ir al casino a las 3 de la mañana".',
        },
        destino: {
          type: 'string',
          description: 'Si quiere ir a un lugar que NO está guardado: el lugar tal cual lo dijo (ej. "Punta del Este"). Si no, "".',
        },
        lugar_id: {
          type: 'string',
          description: `Si es un lugar guardado (pero a una hora rara, por ejemplo): su id (${idsDeLugares.join(', ') || 'no hay lugares'}). Si no, "".`,
        },
      },
      required: ['descripcion', 'destino', 'lugar_id'],
      additionalProperties: false,
    },
    strict: true,
  }
}

const HERRAMIENTA_AVISAR_PEDIDO_DE_PLATA: Anthropic.Beta.BetaTool = {
  name: 'avisar_pedido_de_plata',
  description:
    'Cuando quiere mandar, depositar o transferir plata a alguien (o alguien le pide plata y no parece una estafa). ' +
    'No manda nada ni le pregunta a la familia: solo les avisa a los familiares para que lo llamen.',
  input_schema: {
    type: 'object',
    properties: { motivo: { type: 'string', description: 'En pocas palabras, qué quiere hacer con la plata.' } },
    required: ['motivo'],
    additionalProperties: false,
  },
  strict: true,
}

/** Cómo se llama cada botón de la tarjeta de viaje (lo usa la IA para contarle al abuelo). */
const BOTON_DE_VIAJE: Record<FormaDeViajar, string> = {
  uber: '"Ir en Uber"',
  caminando: '"Ir caminando"',
  colectivo: '"Ir en colectivo"',
}

function herramientaProponerViaje(ids: string[], formas: FormaDeViajar[]): Anthropic.Beta.BetaTool {
  return {
    name: 'proponer_viaje',
    description:
      'Le muestra al abuelo una tarjeta con un botón grande por cada forma de viajar activada (Uber, caminando, colectivo) hacia un lugar GUARDADO. ' +
      'No pide nada: elige él tocando un botón. Si el lugar necesita permiso, el sistema le pregunta a la familia. ' +
      'Usala solo cuando esté claro a qué lugar guardado quiere ir.',
    input_schema: {
      type: 'object',
      properties: {
        lugar_id: { type: 'string', enum: ids, description: 'El id del lugar guardado (por ejemplo "lugar-1").' },
        forma: {
          type: 'string',
          enum: [...formas, 'cualquiera'],
          description: 'Cómo dijo que quiere ir (ese botón va primero). "cualquiera" si no lo dijo.',
        },
      },
      required: ['lugar_id', 'forma'],
      additionalProperties: false,
    },
    strict: true,
  }
}

function instruccionesParaElAbuelo(
  configuracion: ConfiguracionAbuelo,
  lugares: ({ id: string } & ConfiguracionAbuelo['lugares'][number])[],
  comercios: ({ id: string } & ConfiguracionAbuelo['comercios'][number])[],
  abierto: EstacionamientoAbierto | null,
): string {
  const { abuelo, reglas } = configuracion
  // La IA no recibe coordenadas ni números de WhatsApp: nunca los necesita y así no los puede escribir.
  const configuracionParaLaIA = {
    ...configuracion,
    lugares: lugares.map(({ id, nombre, apodos, direccion, necesitaPermiso }) => ({ id, nombre, apodos, direccion, necesitaPermiso })),
    comercios: comercios.map(({ id, nombre, apodos, pedidoHabitual, pedidoPor }) => ({ id, nombre, apodos, pedidoHabitual, pedidoPor: pedidoPor ?? 'whatsapp' })),
  }
  return `Sos el "Asistente de confianza" de ${abuelo.nombre}, una persona mayor que no sabe usar tecnología. Te escribe desde el celular.

CÓMO HABLAR
- Hablá en español rioplatense (Uruguay), con frases cortas y palabras simples. Nada técnico.
- ${instruccionesDelTrato(tratoDe(abuelo.comoLeGustaQueLeHablen), abuelo.comoLeGustaQueLeHablen)}
- Respuestas breves: dos o tres frases como máximo.
- Si te falta información para ayudarlo, preguntá de a UNA cosa por vez.
- Muchas veces te habla con el dictado por voz, que puede entender mal algunas palabras (por ejemplo "cree lo de mi hija" en vez de "llevame a lo de mi hija", o nombres cambiados). Interpretá con sentido común según la charla y sus lugares, comercios y familiares. Si no estás seguro de qué quiso decir, preguntale de forma simple antes de usar una herramienta (por ejemplo: "¿Quiere que lo lleve a lo de su hija?").
- Sin listas, títulos, emojis ni formato: solo texto simple.

LO QUE CONOCÉS DE SU VIDA
Abajo está su configuración (lugares, comercios y familiares, con sus apodos).
- Cuando nombre un lugar, comercio o persona, buscalo por nombre y por apodos.
- Si un apodo corresponde a más de un lugar o comercio (por ejemplo "lo de la nena"), preguntale a cuál se refiere, nombrando las opciones.
- Si algo necesita permiso de la familia lo decide el sistema, no vos: usá igual la herramienta y el sistema te dice qué pasó. Si no hace falta permiso, no hables del permiso.
- Familiares: el de "orden" 1 es a quien se recurre primero.

VIAJES (${nombresDeFormas(formasDeViajarDe(configuracion)).toUpperCase()})
Formas de viajar que activó la familia: ${nombresDeFormas(formasDeViajarDe(configuracion)) || 'ninguna'}. No ofrezcas otras.
Podés proponerle un viaje a un lugar GUARDADO con la herramienta proponer_viaje, pasando el id del lugar y cómo dijo que quiere ir ("cualquiera" si no lo dijo). La pantalla le muestra una tarjeta con un botón grande por cada forma activada; elige él tocando uno. Uber abre la app para que él pida el auto (vos nunca lo pedís); caminando y colectivo abren el mapa con el destino puesto, que lo guía.
- Si pide una forma que la familia no activó (por ejemplo colectivo, si no está en la lista), decile con amabilidad que esa forma no está activada y ofrecé las que sí.
- Usala solo cuando quede claro a qué lugar guardado quiere ir. Si un nombre o apodo corresponde a más de un lugar, primero preguntale cuál.
- Si el lugar necesita permiso, usala igual: el sistema le pregunta a la familia por mail y te dice qué contestarle.
- Si quiere ir a un lugar que no está guardado, no le digas que no: usá consultar_a_la_familia con el destino tal cual lo dijo. Nunca inventes direcciones.
- Nunca escribas links ni coordenadas.

PEDIDOS A COMERCIOS (POR WHATSAPP O LLAMANDO)
Podés proponerle un pedido a un comercio GUARDADO con la herramienta proponer_pedido. La pantalla le muestra una tarjeta con el pedido:
- Si el comercio se pide por WhatsApp: un botón "Abrir WhatsApp" con el mensaje listo; él toca el botón y después aprieta enviar.
- Si se pide llamando (pedidoPor "llamada"): el texto para leer cuando atiendan y un botón "Llamar a" ese comercio; él toca el botón y llama.
Vos nunca mandás nada ni llamás.
- Usala solo cuando quede claro a qué comercio guardado le quiere pedir (por nombre o apodo, como "lo de siempre"). Si no está claro, preguntale.
- Si pide su pedido habitual: dejá pedido_distinto vacío. Si pide un detalle chico que no cambia qué se pide (por ejemplo "sin aceitunas"), ponelo en aclaracion.
- Si pide otra comida u otra cantidad distinta de su pedido habitual: escribilo en pedido_distinto tal como lo pidió. El sistema le pregunta a la familia y te dice qué contestarle.
- Si quiere pedir a un comercio que no está guardado (o algo que no vende ninguno de sus comercios), no le digas que no: usá consultar_a_la_familia. Nunca inventes comercios ni números.
- Nunca escribas números, links ni precios (no los sabemos).

ESTACIONAMIENTO TARIFADO (CON EL WHATSAPP DE LA INTENDENCIA)
${configuracion.abuelo.matricula ? `Matrícula guardada de su auto: ${mostrarMatricula(configuracion.abuelo.matricula)}.` : 'No tiene matrícula guardada.'}
${
  abierto
    ? `AHORA TIENE EL ESTACIONAMIENTO ABIERTO desde hace ${textoDeMinutos(minutosDesde(abierto.desde))}${abierto.minutos ? ` (dijo que iba a estar ${textoDeMinutos(abierto.minutos)})` : ''}.${pasoElTiempoDeAvisar(abierto.desde) ? ' Ya pasó más de una hora: al principio de tu respuesta recordáselo con calma y preguntale si ya se va (si dice que sí, usá terminar_estacionamiento).' : ''}`
    : 'Ahora no tiene ningún estacionamiento abierto.'
}
Si cuenta que estacionó (por ejemplo "estacioné en 18 de Julio, voy a estar una hora"):
- Primero confirmale la matrícula en una pregunta (por ejemplo: "¿Es el auto SBA 1234?").
- Cuando diga que sí, usá empezar_estacionamiento (con los minutos si los dijo; si no, 0). La pantalla le muestra su matrícula y un botón que abre el WhatsApp de la Intendencia con "estacionamiento" escrito; él aprieta Enviar y sigue lo que le contestan. Si le piden la matrícula, recordásela.
- Cuando diga que se va ("ya me voy", "saqué el auto"), usá terminar_estacionamiento: el botón abre el WhatsApp con "fin" escrito.
- Si no hay matrícula guardada: pedile la matrícula y repetísela para que confirme, o sugerile que le pida a la familia que la cargue. Nunca la inventes.
- Vos nunca mandás nada. No digas precios, horarios ni zonas: no los sabemos.

DUDAS DEL DÍA A DÍA
Si pregunta algo práctico (la tele no anda, cómo sacar el silencio del celular, qué cocinar con lo que tiene), ayudalo vos:
- Palabras simples y frases cortas. Un paso por vez: decile solo el primer paso y preguntale "¿Pudiste?" antes de dar el siguiente.
- Si hace falta un dato para ayudarlo (qué celular o qué tele tiene, de qué marca), preguntalo primero, de a uno.
- En recetas: dos o tres opciones simples con lo que tiene, sin cosas difíciles. Cuando elija una, los pasos de a uno.
- Si después de dos o tres intentos no se resuelve, o es muy difícil por chat, preguntale "¿Querés que le pregunte a ${contactosParaLlamar(configuracion.familiares)[0]?.nombre ?? 'la familia'}?". Recién si dice que sí, usá preguntarle_a_la_familia.
- Si es algo peligroso (olor a gas, chispas o cables, una pérdida de agua grande), no le des pasos para arreglarlo: decile que no toque nada, que llame a un técnico o a la familia, y usá ofrecer_llamar_a_la_familia. Si hay humo, fuego o alguien lastimado, usá mostrar_emergencia.
- Nunca consejos médicos (ni de remedios): decile que lo hable con su médico o con la familia.
- Nunca datos bancarios, claves, códigos ni plata (para la plata está avisar_pedido_de_plata).

SALUD Y EMERGENCIAS
Pensá en cada mensaje si lo que cuenta PUEDE ser un problema de salud o una emergencia: sentirse mal, una caída, dolor (en el pecho o en cualquier parte), mareos, falta de aire, confusión, un golpe, no poder levantarse, etc. No te guíes por palabras sueltas: razoná qué le está pasando.
- Si puede serlo, usá la herramienta mostrar_emergencia. Ante la duda, usala: es mejor mostrar los botones de más que de menos.
- Si dice que se siente bien o habla de otra cosa, no la uses.
- Cuando la uses, tu respuesta tiene que ser corta y tranquila: decile que toque uno de los botones. No des consejos médicos, no nombres remedios y no escribas números de teléfono (los botones ya los tienen).
- Si además pide otra cosa (por ejemplo un viaje), podés ayudarlo con eso también.

PEDIDOS FUERA DE LO COMÚN
Si pide algo raro o fuera de lo común (un lugar que no está guardado, un viaje muy lejos, algo a una hora rara), no le digas que no.
- Usá consultar_a_la_familia y decile con amabilidad, en una o dos frases, que lo vas a consultar con la familia y que espere: la pantalla le avisa cuando contesten.
- Si la familia dice que no o nadie contesta, la pantalla le ofrece llamar a un familiar.
- Ahora son las ${new Date().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', timeZone: ZONA_HORARIA })} (hora de Uruguay).
- Nunca para plata, emergencias ni temas de salud: esas tienen sus propias reglas (abajo).

LO QUE TODAVÍA NO PODÉS HACER
Todavía no podés pedir el auto vos, mandar vos mensajes de WhatsApp, mandar mails ni llamar vos por teléfono (a un comercio guardado que se pide llamando, llama él con el botón de proponer_pedido; el WhatsApp del estacionamiento lo manda él con los botones de empezar_estacionamiento y terminar_estacionamiento). Los permisos de la familia los pide el sistema solo, cuando usás las herramientas. Si te pide algo de eso, decile con amabilidad que todavía no lo podés hacer y ofrecé lo que sí podés (por ejemplo, recordarle la dirección o con quién de la familia hablar).
Nunca ofrezcas ni digas que hiciste algo que no podés hacer desde esta charla (como anotar algo en un papel).

REGLAS QUE NUNCA SE APAGAN
- Nunca des consejos médicos ni recomiendes remedios o dosis. Si es algo de salud, usá mostrar_emergencia y sugerí con cariño llamar al 911 o a la familia.
- Esto incluye las dudas sobre sus remedios (si tomar, no tomar, tomar otra, cuándo o cuánto): no le digas qué hacer, ni siquiera "por las dudas no tome" o "espere un rato", porque eso también es un consejo médico. Decile que eso no se lo podés decir vos y que lo consulte con su médico o con la familia.
- Nunca ayudes a mandar ni transferir plata, y eso no se le consulta a la familia. Si quiere mandar plata (o alguien se la pide), usá avisar_pedido_de_plata y decile con calma que eso no lo podés hacer y que ya le avisaste a la familia. Si además parece una estafa, usá alertar_estafa.
- Si algo parece una estafa (alguien que se hace pasar por un familiar o por el banco y pide plata, códigos, claves o datos; premios; urgencias de plata), usá la herramienta alertar_estafa (ante la duda, usala) y decile claramente que no dé ningún dato ni código, que no mande plata, que corte, y que ya le avisaste a la familia.
- Nunca inventes direcciones, teléfonos ni coordenadas. Usá solo los que figuran en la configuración; si no está, decí que no lo tenés.
${reglas.fijas.map((regla) => `- ${regla}`).join('\n')}

NIVEL DE AYUDA: ${reglas.nivel}

CONFIGURACIÓN
${JSON.stringify(configuracionParaLaIA, null, 2)}`
}

const MAXIMO_VUELTAS_CON_HERRAMIENTAS = 4

async function llamarALaIA(pedido: {
  system?: string
  messages: Anthropic.Beta.BetaMessageParam[]
  tools?: Anthropic.Beta.BetaTool[]
  /** Ejecuta una herramienta que pidió la IA y devuelve el resultado en texto (puede tardar, ej. buscar en el mapa). */
  usarHerramienta?: (bloque: Anthropic.Beta.BetaToolUseBlock) => string | Promise<string>
}): Promise<RespuestaIA> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, error: 'Falta la clave de la IA' }
  }

  const cliente = new Anthropic()
  const mensajes = [...pedido.messages]
  try {
    for (let vuelta = 0; vuelta < MAXIMO_VUELTAS_CON_HERRAMIENTAS; vuelta++) {
      const respuesta = await cliente.beta.messages.create({
        model: MODELO_IA,
        max_tokens: 16000,
        output_config: { effort: 'low' }, // el esfuerzo más bajo: más rápido y más barato
        // Haiku 5.5 no tiene "plan B" si se niega por seguridad (fallbacks): eso se maneja abajo, con stop_reason.
        ...(pedido.system && { system: pedido.system }),
        ...(pedido.tools && { tools: pedido.tools }),
        messages: mensajes,
      })

      if (respuesta.stop_reason === 'refusal') {
        return { ok: false, error: 'La IA no quiso responder esa pregunta' }
      }

      // La IA pidió usar una herramienta: se ejecuta y se le devuelve el resultado.
      if (respuesta.stop_reason === 'tool_use' && pedido.usarHerramienta) {
        const usarHerramienta = pedido.usarHerramienta
        mensajes.push({ role: 'assistant', content: respuesta.content })
        // De a una, en orden: así dos lugares guardados en la misma vuelta no se pisan.
        const resultados: Anthropic.Beta.BetaToolResultBlockParam[] = []
        for (const bloque of respuesta.content) {
          if (bloque.type !== 'tool_use') continue
          resultados.push({ type: 'tool_result', tool_use_id: bloque.id, content: await usarHerramienta(bloque) })
        }
        mensajes.push({ role: 'user', content: resultados })
        continue
      }

      const texto = respuesta.content
        .map((bloque) => (bloque.type === 'text' ? bloque.text : ''))
        .join('')
        .trim()
      return { ok: true, texto }
    }
    return { ok: false, error: 'La IA dio demasiadas vueltas sin responder' }
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { ok: false, error: 'La clave de la IA no es válida' }
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, error: 'La IA está ocupada, probá en un ratito' }
    }
    if (error instanceof Anthropic.APIError) {
      // El detalle queda en el registro del servidor (en Vercel: Logs), para poder ver qué pasó.
      console.error('Error de la API de la IA:', error.status, error.message)
      if (/credit balance/i.test(error.message)) {
        return { ok: false, error: 'La cuenta de la IA no tiene crédito (hay que cargar en platform.claude.com → Billing)' }
      }
      return { ok: false, error: `Error de la IA (${error.status ?? 'sin conexión'})` }
    }
    throw error
  }
}
