import 'server-only'
import Anthropic from '@anthropic-ai/sdk'

// ÚNICO lugar donde se habla con la IA. Solo corre en el servidor:
// la clave ANTHROPIC_API_KEY nunca llega al navegador.

export const MODELO_IA = 'claude-opus-5-5'

export type RespuestaIA = { ok: true; texto: string } | { ok: false; error: string }

export async function preguntarALaIA(pregunta: string): Promise<RespuestaIA> {
  return charlarConLaIA(undefined, [{ role: 'user', content: pregunta }])
}

/**
 * Charla de varios mensajes. `instrucciones` le dice a la IA quién es y cómo hablar;
 * `mensajes` es toda la charla hasta ahora (la API no recuerda nada entre pedidos).
 */
export async function charlarConLaIA(
  instrucciones: string | undefined,
  mensajes: Anthropic.MessageParam[],
): Promise<RespuestaIA> {
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
      ...(instrucciones ? { system: instrucciones } : {}),
      messages: mensajes,
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
