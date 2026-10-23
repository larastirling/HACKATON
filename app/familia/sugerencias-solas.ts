import 'server-only'
import type { ConfiguracionAbuelo } from '@/lib/datos'
import type { MensajeCharla } from './acciones'
import { HERRAMIENTA_GUARDAR_COMERCIO } from './comercios'
import { KM_MAXIMOS } from './distancia'
import { reglasSinElegir } from './instrucciones'
import { HERRAMIENTA_GUARDAR_LUGAR } from './lugares'
import { lugaresCercanos, type LugarSugerido } from './sugerencias'
import { comerciosCercanos, type ComercioSugerido } from './sugerencias-comercios'

// Sugerencias que muestra el sistema solo, sin que la IA las elija:
//   - con los botones "Sugerirme lugares" y "Sugerirme comercios" (siempre disponibles);
//   - mientras se arma el perfil, cuando la charla llega a los lugares y cuando llega a los comercios.

const lugaresYaMostrados = (mensajes: MensajeCharla[]) => mensajes.flatMap((m) => m.sugerencias?.map((s) => s.id) ?? [])
const comerciosYaMostrados = (mensajes: MensajeCharla[]) => mensajes.flatMap((m) => m.comerciosSugeridos?.map((s) => s.id) ?? [])

/** El hijo tocó "Sugerirme lugares" o "Sugerirme comercios": los cercanos que todavía no vio, sin la IA. */
export async function sugerirPorBoton(
  configuracion: ConfiguracionAbuelo,
  mensajes: MensajeCharla[],
  que: 'lugares' | 'comercios',
): Promise<{ texto: string; sugerencias?: LugarSugerido[]; comerciosSugeridos?: ComercioSugerido[] }> {
  if (que === 'lugares') {
    const lugares = await lugaresCercanos(configuracion, lugaresYaMostrados(mensajes))
    if (!lugares) {
      return { texto: 'Para sugerirte lugares cerca de su casa necesito ubicar su casa en el mapa. ¿Me pasás su dirección, con calle, número y barrio?' }
    }
    if (lugares.length === 0) return { texto: `No encontré lugares para sugerir a menos de ${KM_MAXIMOS} km de su casa. ¿Va seguido a algún lugar?` }
    return { texto: 'Estos son algunos lugares cerca de su casa. ¿Va a alguno de estos?', sugerencias: lugares }
  }
  const comercios = await comerciosCercanos(configuracion, comerciosYaMostrados(mensajes))
  if (comercios.length === 0) {
    return { texto: 'Todavía no tengo comercios confirmados cerca de su casa para sugerirte. ¿Le pide a algún comercio que me puedas contar?' }
  }
  return { texto: 'Estos son comercios confirmados cerca de su casa. ¿Le pide a alguno de estos?', comerciosSugeridos: comercios }
}

// Cómo se da cuenta el sistema de que la charla llegó a los lugares o a los comercios (sin preguntarle a la IA).
const HABLA_DE_LUGARES = /\b(lugar|lugares|va seguido|suele ir|sale seguido)\b/i
const HABLA_DE_COMERCIOS = /\b(comercio|comercios|delivery|pide comida|pedir comida|le pide a|pizzer[ií]a|almac[eé]n)\b/i

/**
 * Mientras se arma el perfil (todavía sin reglas elegidas), la primera vez que la charla llega a los lugares
 * se muestran solos los lugares cercanos, y la primera vez que llega a los comercios, los comercios verificados cercanos.
 * "Llega" = la IA usó la herramienta de guardar eso, o su mensaje pregunta por eso. No en la pregunta del permiso.
 */
export async function sugerenciasSolas(
  configuracion: ConfiguracionAbuelo,
  mensajes: MensajeCharla[],
  texto: string,
  usadas: Set<string>,
): Promise<{ sugerencias?: LugarSugerido[]; comerciosSugeridos?: ComercioSugerido[] }> {
  // Tampoco en la pregunta de cómo puede ir ("¿en Uber, caminando o en colectivo?"): habla de "lugares" pero no es para elegir uno.
  if (!reglasSinElegir(configuracion) || /permiso|\b(uber|caminando|colectivo)\b/i.test(texto)) return {}
  const sinEnLugarDe = texto.replace(/\ben lugar de\b/gi, '')
  const yaVioLugares = lugaresYaMostrados(mensajes).length > 0
  const yaVioComercios = comerciosYaMostrados(mensajes).length > 0

  const llegoAComercios = usadas.has(HERRAMIENTA_GUARDAR_COMERCIO.name) || HABLA_DE_COMERCIOS.test(sinEnLugarDe)
  if (!yaVioComercios && llegoAComercios && (configuracion.lugares.length > 0 || yaVioLugares)) {
    const comercios = await comerciosCercanos(configuracion, [])
    return comercios.length > 0 ? { comerciosSugeridos: comercios } : {}
  }
  const llegoALugares = usadas.has(HERRAMIENTA_GUARDAR_LUGAR.name) || HABLA_DE_LUGARES.test(sinEnLugarDe)
  if (!yaVioLugares && llegoALugares && !llegoAComercios) {
    const lugares = await lugaresCercanos(configuracion, [])
    return lugares?.length ? { sugerencias: lugares } : {}
  }
  return {}
}
