import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import type { ConfiguracionAbuelo } from './datos'
import { armarViajeUber, type Viaje } from './uber'

// ÚNICO lugar donde se habla con la IA. Solo corre en el servidor:
// la clave ANTHROPIC_API_KEY nunca llega al navegador.

export const MODELO_IA = 'claude-opus-5-5'

export type RespuestaIA = { ok: true; texto: string } | { ok: false; error: string }

/** Un mensaje de la charla, tal como lo ve la pantalla. */
export interface MensajeCharla {
  de: 'abuelo' | 'ia'
  texto: string
  /** Si la IA propuso un viaje, la tarjeta con el botón de Uber. */
  viaje?: Viaje
}

export type { Viaje }

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
): Promise<RespuestaIA> {
  return llamarALaIA({ system: instrucciones, messages: mensajes })
}

/**
 * Charla del abuelo: manda TODA la charla y las instrucciones armadas con su configuración.
 * La IA puede usar la herramienta proponer_viaje: solo elige el id del lugar y el servidor
 * arma el link de Uber con las coordenadas guardadas.
 */
export async function conversarConElAbuelo(
  configuracion: ConfiguracionAbuelo,
  charla: MensajeCharla[],
): Promise<RespuestaIA & { viaje?: Viaje }> {
  const lugares = configuracion.lugares.map((lugar, i) => ({ id: `lugar-${i + 1}`, ...lugar }))
  let viaje: Viaje | undefined

  function proponerViaje(lugarId: unknown): string {
    const lugar = lugares.find((l) => l.id === lugarId)
    if (!lugar) return 'Ese id no corresponde a ningún lugar guardado. No inventes lugares.'
    if (lugar.necesitaPermiso) {
      return `NO se muestra el botón de Uber: "${lugar.nombre}" necesita permiso de la familia. Explicale con amabilidad que primero tiene que avisarle a la familia. Todavía no podés pedir el permiso vos.`
    }
    const propuesto = armarViajeUber(lugar)
    if (!propuesto) {
      return `NO se puede armar el viaje: a "${lugar.nombre}" le falta la ubicación exacta. Decile que esa dirección no está completa y que le pida a la familia que la complete.`
    }
    viaje = propuesto
    return `Listo: debajo de tu respuesta, el abuelo ve una tarjeta con "${lugar.nombre}" (${lugar.direccion}) y un botón verde "Abrir Uber". El auto NO está pedido: lo pide él cuando toca el botón. Contáselo en una o dos frases, sin escribir links ni coordenadas.`
  }

  const respuesta = await llamarALaIA({
    system: instruccionesParaElAbuelo(configuracion, lugares),
    messages: charla.map((mensaje) => ({
      role: mensaje.de === 'abuelo' ? ('user' as const) : ('assistant' as const),
      content: mensaje.texto,
    })),
    tools: lugares.length > 0 ? [herramientaProponerViaje(lugares.map((l) => l.id))] : undefined,
    usarHerramienta: (bloque) =>
      bloque.name === 'proponer_viaje'
        ? proponerViaje((bloque.input as { lugar_id?: unknown }).lugar_id)
        : `No existe la herramienta "${bloque.name}".`,
  })
  return respuesta.ok && viaje ? { ...respuesta, viaje } : respuesta
}

function herramientaProponerViaje(ids: string[]): Anthropic.Beta.BetaTool {
  return {
    name: 'proponer_viaje',
    description:
      'Le muestra al abuelo una tarjeta con un botón para abrir Uber hacia un lugar GUARDADO. ' +
      'No pide el auto: lo pide el abuelo al tocar el botón. Usala solo cuando esté claro a qué lugar guardado quiere ir.',
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
): string {
  const { abuelo, reglas } = configuracion
  // La IA no recibe las coordenadas: nunca las necesita y así no las puede escribir.
  const configuracionParaLaIA = {
    ...configuracion,
    lugares: lugares.map(({ id, nombre, apodos, direccion, necesitaPermiso }) => ({ id, nombre, apodos, direccion, necesitaPermiso })),
  }
  return `Sos el "Asistente de confianza" de ${abuelo.nombre}, una persona mayor que no sabe usar tecnología. Te escribe desde el celular.

CÓMO HABLAR
- Hablá en español rioplatense (Uruguay), con frases cortas y palabras simples. Nada técnico.
- Tratalo así: ${abuelo.comoLeGustaQueLeHablen}.
- Respuestas breves: dos o tres frases como máximo.
- Si te falta información para ayudarlo, preguntá de a UNA cosa por vez.
- Sin listas, títulos, emojis ni formato: solo texto simple.

LO QUE CONOCÉS DE SU VIDA
Abajo está su configuración (lugares, comercios y familiares, con sus apodos).
- Cuando nombre un lugar, comercio o persona, buscalo por nombre y por apodos.
- Si un apodo corresponde a más de un lugar o comercio (por ejemplo "lo de la nena"), preguntale a cuál se refiere, nombrando las opciones.
- Si un lugar tiene "necesitaPermiso": true, contale con amabilidad que para ir ahí primero tiene que dar el OK la familia. Si no necesita permiso, no hables del permiso.
- Familiares: el de "orden" 1 es a quien se recurre primero.

VIAJES EN UBER
Podés proponerle un viaje en Uber a un lugar GUARDADO con la herramienta proponer_viaje, pasando solo el id del lugar. La pantalla le muestra una tarjeta con un botón "Abrir Uber"; el auto lo pide él al tocarlo, vos nunca lo pedís.
- Usala solo cuando quede claro a qué lugar guardado quiere ir. Si un nombre o apodo corresponde a más de un lugar, primero preguntale cuál.
- Si el lugar necesita permiso, no uses la herramienta: explicale con amabilidad que primero tiene que avisarle a la familia.
- Si quiere ir a un lugar que no está guardado, no lo busques ni inventes nada: decile que ese lugar no lo tenés anotado y que le pida a la familia que lo agregue.
- Nunca escribas links ni coordenadas.

LO QUE TODAVÍA NO PODÉS HACER
Todavía no podés pedir el auto vos, mandar mensajes de WhatsApp, mandar mails, llamar por teléfono, hacer pedidos, avisarle a la familia ni pedirle permiso. Si te pide algo de eso, decile con amabilidad que todavía no lo podés hacer y ofrecé lo que sí podés (por ejemplo, recordarle la dirección o con quién de la familia hablar).
Nunca ofrezcas ni digas que hiciste algo que no podés hacer desde esta charla (como anotar algo en un papel).

REGLAS QUE NUNCA SE APAGAN
- Nunca des consejos médicos ni recomiendes remedios o dosis. Sugerí con cariño consultar a un médico o hablar con la familia. Si parece algo grave o urgente, decile que llame al 911 enseguida.
- Nunca ayudes a mandar ni transferir plata. Si alguien le pide plata, decile que es mejor hablarlo primero con la familia.
- Si algo parece una estafa (alguien que se hace pasar por el banco y pide códigos, claves o datos; premios; urgencias de plata), decile claramente que no dé ningún dato ni código, que corte, y que lo hable con la familia.
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
  /** Ejecuta una herramienta que pidió la IA y devuelve el resultado en texto. */
  usarHerramienta?: (bloque: Anthropic.Beta.BetaToolUseBlock) => string
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
        output_config: { effort: 'low' },
        // Si el modelo se niega por seguridad, la API prueba sola con otro modelo.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
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
        mensajes.push({
          role: 'user',
          content: respuesta.content
            .filter((bloque) => bloque.type === 'tool_use')
            .map((bloque) => ({ type: 'tool_result', tool_use_id: bloque.id, content: usarHerramienta(bloque) })),
        })
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
      return { ok: false, error: `Error de la IA (${error.status ?? 'sin conexión'})` }
    }
    throw error
  }
}
