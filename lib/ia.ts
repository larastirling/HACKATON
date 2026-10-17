import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import type { ConfiguracionAbuelo } from './datos'

// ÚNICO lugar donde se habla con la IA. Solo corre en el servidor:
// la clave ANTHROPIC_API_KEY nunca llega al navegador.

export const MODELO_IA = 'claude-opus-5-5'

export type RespuestaIA = { ok: true; texto: string } | { ok: false; error: string }

/** Un mensaje de la charla, tal como lo ve la pantalla. */
export interface MensajeCharla {
  de: 'abuelo' | 'ia'
  texto: string
}

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

/** Charla del abuelo: manda TODA la charla y las instrucciones armadas con su configuración. */
export async function conversarConElAbuelo(
  configuracion: ConfiguracionAbuelo,
  charla: MensajeCharla[],
): Promise<RespuestaIA> {
  return llamarALaIA({
    system: instruccionesParaElAbuelo(configuracion),
    messages: charla.map((mensaje) => ({
      role: mensaje.de === 'abuelo' ? ('user' as const) : ('assistant' as const),
      content: mensaje.texto,
    })),
  })
}

function instruccionesParaElAbuelo(configuracion: ConfiguracionAbuelo): string {
  const { abuelo, reglas } = configuracion
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

LO QUE TODAVÍA NO PODÉS HACER
Por ahora solo podés conversar. Todavía no podés pedir un taxi o un auto, mandar mensajes de WhatsApp, mandar mails, llamar por teléfono, hacer pedidos ni avisarle a la familia. Si te pide algo de eso, decile con amabilidad que todavía no lo podés hacer y ofrecé lo que sí podés (por ejemplo, recordarle la dirección o con quién de la familia hablar).
Nunca ofrezcas ni digas que hiciste algo que no podés hacer desde esta charla (como anotar algo en un papel).

REGLAS QUE NUNCA SE APAGAN
- Nunca des consejos médicos ni recomiendes remedios o dosis. Sugerí con cariño consultar a un médico o hablar con la familia. Si parece algo grave o urgente, decile que llame al 911 enseguida.
- Nunca ayudes a mandar ni transferir plata. Si alguien le pide plata, decile que es mejor hablarlo primero con la familia.
- Si algo parece una estafa (alguien que se hace pasar por el banco y pide códigos, claves o datos; premios; urgencias de plata), decile claramente que no dé ningún dato ni código, que corte, y que lo hable con la familia.
- Nunca inventes direcciones, teléfonos ni coordenadas. Usá solo los que figuran en la configuración; si no está, decí que no lo tenés.
${reglas.fijas.map((regla) => `- ${regla}`).join('\n')}

NIVEL DE AYUDA: ${reglas.nivel}

CONFIGURACIÓN
${JSON.stringify(configuracion, null, 2)}`
}

async function llamarALaIA(pedido: {
  system?: string
  messages: Anthropic.Beta.BetaMessageParam[]
}): Promise<RespuestaIA> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, error: 'Falta la clave de la IA' }
  }

  const cliente = new Anthropic()
  try {
    const respuesta = await cliente.beta.messages.create({
      model: MODELO_IA,
      max_tokens: 16000,
      output_config: { effort: 'low' },
      // Si el modelo se niega por seguridad, la API prueba sola con otro modelo.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      ...(pedido.system && { system: pedido.system }),
      messages: pedido.messages,
    })

    if (respuesta.stop_reason === 'refusal') {
      return { ok: false, error: 'La IA no quiso responder esa pregunta' }
    }
    const texto = respuesta.content
      .map((bloque) => (bloque.type === 'text' ? bloque.text : ''))
      .join('')
      .trim()
    return { ok: true, texto }
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
