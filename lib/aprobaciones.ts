import 'server-only'
import {
  anotarPregunta,
  crearAprobacion,
  PENDIENTE,
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

/** Familiares a los que se les puede preguntar por mail, en el orden de la configuración. */
export function familiaresParaPreguntar(configuracion: ConfiguracionAbuelo): Familiar[] {
  return [...configuracion.familiares]
    .sort((a, b) => a.orden - b.orden)
    .filter((familiar) => familiar.mail !== PENDIENTE && familiar.mail.includes('@'))
}

export type ResultadoPermiso =
  | { ok: true; aprobacion: PedidoDeAprobacion; familiar: Familiar }
  | { ok: false; motivo: string }

/** Guarda el pedido de aprobación y le manda el mail al primer familiar. */
export async function pedirPermiso(
  configuracion: ConfiguracionAbuelo,
  descripcion: string,
  que: QueSePidio,
  urlApp: string,
): Promise<ResultadoPermiso> {
  const [primero] = familiaresParaPreguntar(configuracion)
  if (!primero) return { ok: false, motivo: 'no hay ningún familiar con mail guardado' }

  const aprobacion = await crearAprobacion({ codigoFamilia: configuracion.codigoFamilia, descripcion, que })
  const enviado = await preguntarAFamiliar(aprobacion, primero, urlApp)
  if (!enviado) return { ok: false, motivo: 'no se pudo mandar el mail' }
  return { ok: true, aprobacion, familiar: primero }
}

/**
 * Le manda a UN familiar el mail con los botones Aprobar y Rechazar.
 * (La tarea 9 lo vuelve a usar para el segundo familiar si el primero no contesta.)
 */
export async function preguntarAFamiliar(
  aprobacion: PedidoDeAprobacion,
  familiar: Familiar,
  urlApp: string,
): Promise<boolean> {
  const link = (respuesta: 'aprobar' | 'rechazar') =>
    `${urlApp.replace(/\/$/, '')}/aprobacion/${aprobacion.token}?respuesta=${respuesta}`

  const resultado = await enviarMail({
    para: familiar.mail,
    asunto: `${aprobacion.descripcion}. ¿Lo aprobás?`,
    texto: `Hola ${familiar.nombre}:\n\n${aprobacion.descripcion}. ¿Lo aprobás?\n\nAprobar: ${link('aprobar')}\nRechazar: ${link('rechazar')}\n\nAsistente de confianza`,
    html: mailHtml(familiar.nombre, aprobacion.descripcion, link('aprobar'), link('rechazar')),
  })
  if (resultado.enviado) await anotarPregunta(aprobacion.id, { nombre: familiar.nombre, mail: familiar.mail })
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
  <p style="font-size:16px;color:#3d3d3d">Asistente de confianza</p>
</div>`
}

function escapar(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
