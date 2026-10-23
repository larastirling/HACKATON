import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { pedirPermiso } from './aprobaciones'
import { primerNombre, ZONA_HORARIA, type ConfiguracionAbuelo, type QueSePidio } from './datos'
import { armarEmergencia, avisarEmergenciaALaFamilia, avisarEstafaALaFamilia, avisarPedidoDePlata, type Emergencia, type Estafa } from './emergencia'
import { buscarCoordenadas } from './mapas'
import { juntarNombres } from './texto'
import { armarViajeUber, type Viaje } from './uber'
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
  /** Botón para llamar a un familiar (por ejemplo, si rechazó un pedido). */
  llamar?: { nombre: string; link: string }
}

/** Lo que necesita la pantalla del abuelo para esperar la respuesta de la familia. */
export interface EsperaAprobacion {
  id: string
  /** A quiénes se les preguntó (a todos a la vez). */
  familiares: string[]
}

export type { Emergencia, Estafa, Pedido, Viaje }

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
 * - proponer_viaje: elige el id del lugar y el servidor arma el link de Uber.
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
): Promise<RespuestaIA & { viaje?: Viaje; emergencia?: Emergencia; estafa?: Estafa; pedido?: Pedido; aprobacion?: EsperaAprobacion }> {
  const lugares = configuracion.lugares.map((lugar, i) => ({ id: `lugar-${i + 1}`, ...lugar }))
  const comercios = configuracion.comercios.map((comercio, i) => ({ id: `comercio-${i + 1}`, ...comercio }))
  const nombreAbuelo = primerNombre(configuracion.abuelo.nombre)
  let viaje: Viaje | undefined
  let emergencia: Emergencia | undefined
  let estafa: Estafa | undefined
  let pedido: Pedido | undefined
  let aprobacion: EsperaAprobacion | undefined

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
      const propuesto = armarViajeUber(lugar)
      if (propuesto) return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ${descripcion}`, { tipo: 'viaje', viaje: propuesto })
    }
    const destino = typeof entrada.destino === 'string' ? entrada.destino.trim().slice(0, 120) : ''
    if (destino) {
      // El lugar no está guardado: si el mapa lo encuentra, al aprobar se le muestra el Uber. Nunca se inventa.
      const ubicacion = await buscarCoordenadas(destino)
      const propuesto =
        ubicacion &&
        armarViajeUber({
          nombre: destino,
          apodos: [],
          direccion: ubicacion.direccionDelMapa.split(',').slice(0, 3).join(',').trim(),
          latitud: ubicacion.latitud,
          longitud: ubicacion.longitud,
          necesitaPermiso: true,
        })
      if (propuesto) return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ${descripcion}`, { tipo: 'viaje', viaje: propuesto })
    }
    return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ${descripcion}`, { tipo: 'consulta', texto: descripcion })
  }

  async function avisarPlata(): Promise<string> {
    const loQueDijo = charla.findLast((mensaje) => mensaje.de === 'abuelo')?.texto ?? ''
    const avisados = await avisarPedidoDePlata(configuracion, loQueDijo)
    const aviso = avisados.length > 0 ? `El sistema ya les avisó a ${juntarNombres(avisados)}.` : 'No se le pudo avisar a nadie de la familia.'
    return `NO se mandó plata ni se le preguntó nada a la familia: el asistente nunca manda ni transfiere plata. ${aviso} Decile con calma, en una o dos frases, que eso no lo podés hacer y que ${avisados.length > 0 ? 'ya le avisaste a la familia para que lo llamen' : 'es mejor que lo hable con la familia'}.`
  }

  async function proponerViaje(lugarId: unknown): Promise<string> {
    const lugar = lugares.find((l) => l.id === lugarId)
    if (!lugar) return 'Ese id no corresponde a ningún lugar guardado. No inventes lugares.'
    const propuesto = armarViajeUber(lugar)
    if (!propuesto) {
      return `NO se puede armar el viaje: a "${lugar.nombre}" le falta la ubicación exacta. Decile que esa dirección no está completa y que le pida a la familia que la complete.`
    }
    // Regla del servidor: los lugares con necesitaPermiso necesitan el OK de la familia.
    if (lugar.necesitaPermiso) {
      return pedirPermisoALaFamilia(`${nombreAbuelo} quiere ir a ${lugar.nombre}`, { tipo: 'viaje', viaje: propuesto })
    }
    viaje = propuesto
    return `Listo: debajo de tu respuesta, el abuelo ve una tarjeta con "${lugar.nombre}" (${lugar.direccion}) y un botón verde "Abrir Uber". El auto NO está pedido: lo pide él cuando toca el botón. Contáselo en una o dos frases, sin escribir links ni coordenadas.`
  }

  const respuesta = await llamarALaIA({
    system: instruccionesParaElAbuelo(configuracion, lugares, comercios),
    messages: charla.map((mensaje) => ({
      role: mensaje.de === 'abuelo' ? ('user' as const) : ('assistant' as const),
      content: mensaje.texto,
    })),
    tools: [
      HERRAMIENTA_MOSTRAR_EMERGENCIA,
      HERRAMIENTA_ALERTAR_ESTAFA,
      herramientaConsultarALaFamilia(lugares.map((l) => l.id)),
      HERRAMIENTA_AVISAR_PEDIDO_DE_PLATA,
      ...(lugares.length > 0 ? [herramientaProponerViaje(lugares.map((l) => l.id))] : []),
      ...(comercios.length > 0 ? [herramientaProponerPedido(comercios.map((c) => c.id))] : []),
    ],
    usarHerramienta: (bloque) => {
      if (bloque.name === 'mostrar_emergencia') return mostrarEmergencia()
      if (bloque.name === 'alertar_estafa') return alertarEstafa((bloque.input as { motivo?: unknown }).motivo)
      if (bloque.name === 'consultar_a_la_familia') return consultarALaFamilia(bloque.input as Record<string, unknown>)
      if (bloque.name === 'avisar_pedido_de_plata') return avisarPlata()
      if (bloque.name === 'proponer_viaje') return proponerViaje((bloque.input as { lugar_id?: unknown }).lugar_id)
      if (bloque.name === 'proponer_pedido') {
        const entrada = bloque.input as { comercio_id?: unknown; aclaracion?: unknown; pedido_distinto?: unknown }
        return proponerPedido(entrada.comercio_id, entrada.aclaracion, entrada.pedido_distinto)
      }
      return `No existe la herramienta "${bloque.name}".`
    },
  })
  if (!respuesta.ok) return respuesta
  return {
    ...respuesta,
    ...(viaje && { viaje }),
    ...(emergencia && { emergencia }),
    ...(estafa && { estafa }),
    ...(pedido && { pedido }),
    ...(aprobacion && { aprobacion }),
  }
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

function herramientaProponerViaje(ids: string[]): Anthropic.Beta.BetaTool {
  return {
    name: 'proponer_viaje',
    description:
      'Le muestra al abuelo una tarjeta con un botón para abrir Uber hacia un lugar GUARDADO. ' +
      'No pide el auto: lo pide el abuelo al tocar el botón. Si el lugar necesita permiso, el sistema le pregunta a la familia. ' +
      'Usala solo cuando esté claro a qué lugar guardado quiere ir.',
    input_schema: {
      type: 'object',
      properties: {
        lugar_id: { type: 'string', enum: ids, description: 'El id del lugar guardado (por ejemplo "lugar-1").' },
      },
      required: ['lugar_id'],
      additionalProperties: false,
    },
    strict: true,
  }
}

function instruccionesParaElAbuelo(
  configuracion: ConfiguracionAbuelo,
  lugares: ({ id: string } & ConfiguracionAbuelo['lugares'][number])[],
  comercios: ({ id: string } & ConfiguracionAbuelo['comercios'][number])[],
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
- Tratalo así: ${abuelo.comoLeGustaQueLeHablen}.
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

VIAJES EN UBER
Podés proponerle un viaje en Uber a un lugar GUARDADO con la herramienta proponer_viaje, pasando solo el id del lugar. La pantalla le muestra una tarjeta con un botón "Abrir Uber"; el auto lo pide él al tocarlo, vos nunca lo pedís.
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
Todavía no podés pedir el auto vos, mandar vos mensajes de WhatsApp, mandar mails ni llamar vos por teléfono (a un comercio guardado que se pide llamando, llama él con el botón de proponer_pedido). Los permisos de la familia los pide el sistema solo, cuando usás las herramientas. Si te pide algo de eso, decile con amabilidad que todavía no lo podés hacer y ofrecé lo que sí podés (por ejemplo, recordarle la dirección o con quién de la familia hablar).
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
