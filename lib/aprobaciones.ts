import 'server-only'
import {
  anotarPregunta,
  cerrarAprobacion,
  crearAprobacion,
  leerAprobacion,
  PENDIENTE,
  tomarCandado,
  type ConfiguracionAbuelo,
  type Familiar,
  type PedidoDeAprobacion,
  type QueSePidio,
} from './datos'
import { enviarMail } from './mail'

// Pedidos de aprobación a la familia.
// El SERVIDOR (no la IA) decide si algo necesita permiso, con estas reglas:
//   - Viaje: si el lugar tiene necesitaPermiso: true.
//   - Pedido de comida: si NO es el pedido habitual del comercio.
//
// Se le pregunta a un familiar por vez, en el "orden" de la configuración. Si no contesta en
// MINUTOS_PARA_CONTESTAR, se le pregunta al siguiente (y el link del anterior deja de servir).
// Si nadie contesta, el pedido queda "sin-respuesta". No hace falta ningún proceso aparte:
// cada vez que alguien consulta el pedido, actualizarSiVencio() revisa el reloj.

/** Minutos que tiene cada familiar para contestar. Para la demo se puede bajar (por ejemplo a 1). */
export const MINUTOS_PARA_CONTESTAR = Number(process.env.MINUTOS_PARA_CONTESTAR) || 5

/** "1 minuto" / "5 minutos". */
export function textoMinutos(minutos: number): string {
  return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`
}

/** Familiares a los que se les puede preguntar por mail, en el orden de la configuración. */
export function familiaresParaPreguntar(configuracion: ConfiguracionAbuelo): Familiar[] {
  return [...configuracion.familiares]
    .sort((a, b) => a.orden - b.orden)
    .filter((familiar) => familiar.mail !== PENDIENTE && familiar.mail.includes('@'))
}

export type ResultadoPermiso =
  | { ok: true; aprobacion: PedidoDeAprobacion; familiar: string }
  | { ok: false; motivo: string }

/** Guarda el pedido de aprobación y le manda el mail al primer familiar. */
export async function pedirPermiso(
  configuracion: ConfiguracionAbuelo,
  descripcion: string,
  que: QueSePidio,
  urlApp: string,
): Promise<ResultadoPermiso> {
  if (familiaresParaPreguntar(configuracion).length === 0) {
    return { ok: false, motivo: 'no hay ningún familiar con mail guardado' }
  }
  const creada = await crearAprobacion({ codigoFamilia: configuracion.codigoFamilia, descripcion, que })
  const aprobacion = await preguntarAlSiguiente(creada, configuracion, urlApp)
  const familiar = aprobacion.preguntadoA.at(-1)?.nombre
  if (aprobacion.estado !== 'esperando' || !familiar) return { ok: false, motivo: 'no se pudo mandar el mail' }
  return { ok: true, aprobacion, familiar }
}

/**
 * Si al familiar actual ya se le venció el tiempo, le pregunta al siguiente.
 * Si no queda nadie, cierra el pedido como "sin-respuesta". Devuelve el pedido actualizado.
 */
export async function actualizarSiVencio(
  aprobacion: PedidoDeAprobacion,
  configuracion: ConfiguracionAbuelo,
  urlApp: string,
): Promise<PedidoDeAprobacion> {
  if (aprobacion.estado !== 'esperando') return aprobacion
  const ultima = aprobacion.preguntadoA.at(-1)
  if (ultima && Date.now() < Date.parse(ultima.enviadoEl) + MINUTOS_PARA_CONTESTAR * 60_000) return aprobacion
  return preguntarAlSiguiente(aprobacion, configuracion, urlApp)
}

/** Momento en que vence la pregunta actual (para mostrarlo, si hace falta). */
export function venceEl(aprobacion: PedidoDeAprobacion): Date | null {
  const ultima = aprobacion.preguntadoA.at(-1)
  return ultima ? new Date(Date.parse(ultima.enviadoEl) + MINUTOS_PARA_CONTESTAR * 60_000) : null
}

/**
 * Le manda el mail al siguiente familiar (con su propio link). Si no hay más familiares,
 * o no se le pudo mandar a nadie, cierra el pedido como "sin-respuesta".
 */
async function preguntarAlSiguiente(
  aprobacion: PedidoDeAprobacion,
  configuracion: ConfiguracionAbuelo,
  urlApp: string,
): Promise<PedidoDeAprobacion> {
  const familiares = familiaresParaPreguntar(configuracion)
  for (let paso = aprobacion.preguntadoA.length; paso < familiares.length; paso++) {
    // Candado: si dos consultas llegan juntas, solo una manda el mail de este paso.
    if (!(await tomarCandado(`aprobacion-paso:${aprobacion.id}:${paso}`))) {
      return (await leerAprobacion(aprobacion.id)) ?? aprobacion
    }
    const familiar = familiares[paso]
    const token = await anotarPregunta(aprobacion.id, { nombre: familiar.nombre, mail: familiar.mail })
    if (token && (await mandarMailDeAprobacion(aprobacion.descripcion, familiar, token, urlApp))) {
      return (await leerAprobacion(aprobacion.id)) ?? aprobacion
    }
    // No se pudo mandar: se prueba con el siguiente familiar.
  }
  return (await cerrarAprobacion(aprobacion.id, 'sin-respuesta'))?.aprobacion ?? aprobacion
}

async function mandarMailDeAprobacion(
  descripcion: string,
  familiar: Familiar,
  token: string,
  urlApp: string,
): Promise<boolean> {
  const link = (respuesta: 'aprobar' | 'rechazar') =>
    `${urlApp.replace(/\/$/, '')}/aprobacion/${token}?respuesta=${respuesta}`

  const resultado = await enviarMail({
    para: familiar.mail,
    asunto: `${descripcion}. ¿Lo aprobás?`,
    texto: `Hola ${familiar.nombre}:\n\n${descripcion}. ¿Lo aprobás?\n\nAprobar: ${link('aprobar')}\nRechazar: ${link('rechazar')}\n\nTenés ${textoMinutos(MINUTOS_PARA_CONTESTAR)} para contestar.\n\nAsistente de confianza`,
    html: mailHtml(familiar.nombre, descripcion, link('aprobar'), link('rechazar')),
  })
  return resultado.enviado
}

function mailHtml(nombre: string, descripcion: string, aprobar: string, rechazar: string): string {
  const boton = (href: string, texto: string, color: string) =>
    `<a href="${escapar(href)}" style="display:block;padding:20px;margin:12px 0;border-radius:12px;background:${color};color:#ffffff;font-size:24px;font-weight:bold;text-align:center;text-decoration:none">${texto}</a>`
  return `<div style="font-family:Arial,sans-serif;font-size:20px;line-height:1.5;color:#111111;max-width:480px">
  <p>Hola ${escapar(nombre)}:</p>
  <p style="font-size:24px"><strong>${escapar(descripcion)}.</strong><br>¿Lo aprobás?</p>
  ${boton(aprobar, '✅ Aprobar', '#0a6b2d')}
  ${boton(rechazar, '❌ Rechazar', '#a50e0e')}
  <p style="font-size:16px;color:#3d3d3d">Tenés ${textoMinutos(MINUTOS_PARA_CONTESTAR)} para contestar.</p>
  <p style="font-size:16px;color:#3d3d3d">Asistente de confianza</p>
</div>`
}

export function escapar(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
