import 'server-only'
import {
  anotarPregunta,
  cerrarAprobacion,
  crearAprobacion,
  crearToken,
  leerAprobacion,
  PENDIENTE,
  type ConfiguracionAbuelo,
  type Familiar,
  type PedidoDeAprobacion,
  type QueSePidio,
} from './datos'
import { anotarPermiso } from './lo-que-paso'
import { enviarMail } from './mail'
import { notificarAFamiliar } from './notificaciones'

// Pedidos de aprobación a la familia.
// El SERVIDOR (no la IA) decide si algo necesita permiso, con estas reglas:
//   - Viaje: si el lugar tiene necesitaPermiso: true.
//   - Pedido de comida: si NO es el pedido habitual del comercio.
//
// Se les pregunta a TODOS los familiares a la vez (por mail y por notificación en el celular),
// cada uno con su propio link. Gana el primero
// que contesta. Si nadie contesta en MINUTOS_PARA_CONTESTAR, el pedido queda "sin-respuesta".
// No hace falta ningún proceso aparte: cada vez que alguien consulta el pedido,
// actualizarSiVencio() revisa el reloj.

/** Minutos que tiene la familia para contestar. Para la demo se puede cambiar con la variable MINUTOS_PARA_CONTESTAR. */
export const MINUTOS_PARA_CONTESTAR = Number(process.env.MINUTOS_PARA_CONTESTAR) || 5

/** "1 minuto" / "5 minutos". */
export function textoMinutos(minutos: number): string {
  return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`
}

/** Familiares en el orden de la configuración. */
export function familiaresEnOrden(configuracion: ConfiguracionAbuelo): Familiar[] {
  return [...configuracion.familiares].sort((a, b) => a.orden - b.orden)
}

/** Familiares con mail guardado, en el orden de la configuración. */
export function familiaresConMail(configuracion: ConfiguracionAbuelo): Familiar[] {
  return familiaresEnOrden(configuracion).filter((familiar) => tieneMail(familiar))
}

function tieneMail(familiar: Familiar): boolean {
  return familiar.mail !== PENDIENTE && familiar.mail.includes('@')
}

export type ResultadoPermiso =
  | { ok: true; aprobacion: PedidoDeAprobacion; familiares: string[] }
  | { ok: false; motivo: string }

/** Guarda el pedido de aprobación y se lo manda a TODOS los familiares a la vez (mail + notificación). */
export async function pedirPermiso(
  configuracion: ConfiguracionAbuelo,
  descripcion: string,
  que: QueSePidio,
  urlApp: string,
): Promise<ResultadoPermiso> {
  const familiares = familiaresEnOrden(configuracion)
  if (familiares.length === 0) return { ok: false, motivo: 'no hay ningún familiar guardado' }

  const aprobacion = await crearAprobacion({ codigoFamilia: configuracion.codigoFamilia, descripcion, que })
  const preguntados: string[] = []
  for (const familiar of familiares) {
    const token = crearToken()
    const otros = familiares.filter((f) => f !== familiar).map((f) => f.nombre)
    // Mail y notificación salen juntos; si la notificación falla, el mail sale igual (y al revés).
    const [porMail, porNotificacion] = await Promise.all([
      tieneMail(familiar) ? mandarMailDeAprobacion(descripcion, familiar, otros, token, urlApp) : false,
      notificarAFamiliar(configuracion.codigoFamilia, familiar.nombre, {
        titulo: '¿Lo aprobás?',
        cuerpo: `${descripcion}. Tocá para aprobar o rechazar.`,
        url: `/aprobacion/${token}`,
        etiqueta: `aprobacion-${aprobacion.id}`,
        segundosDeVida: MINUTOS_PARA_CONTESTAR * 60,
      }),
    ])
    if (porMail || porNotificacion) {
      await anotarPregunta(aprobacion.id, { nombre: familiar.nombre, mail: familiar.mail }, token)
      preguntados.push(familiar.nombre)
    }
  }

  // Para "Lo que pasó" de /familia: el estado (aprobado, rechazado, sin respuesta) se lee después del pedido.
  await anotarPermiso(configuracion.codigoFamilia, aprobacion.id, descripcion, preguntados)
  if (preguntados.length === 0) {
    await cerrarAprobacion(aprobacion.id, 'sin-respuesta')
    return { ok: false, motivo: 'no se le pudo avisar a ningún familiar' }
  }
  return { ok: true, aprobacion: (await leerAprobacion(aprobacion.id)) ?? aprobacion, familiares: preguntados }
}

/** Si ya pasó el tiempo y nadie contestó, cierra el pedido como "sin-respuesta". Devuelve el pedido actualizado. */
export async function actualizarSiVencio(aprobacion: PedidoDeAprobacion): Promise<PedidoDeAprobacion> {
  if (aprobacion.estado !== 'esperando') return aprobacion
  if (Date.now() < Date.parse(aprobacion.creadoEl) + MINUTOS_PARA_CONTESTAR * 60_000) return aprobacion
  return (await cerrarAprobacion(aprobacion.id, 'sin-respuesta'))?.aprobacion ?? aprobacion
}

function linkDeRespuesta(urlApp: string, token: string, respuesta?: 'aprobar' | 'rechazar'): string {
  return `${urlApp.replace(/\/$/, '')}/aprobacion/${token}${respuesta ? `?respuesta=${respuesta}` : ''}`
}

async function mandarMailDeAprobacion(
  descripcion: string,
  familiar: Familiar,
  otros: string[],
  token: string,
  urlApp: string,
): Promise<boolean> {
  const aprobar = linkDeRespuesta(urlApp, token, 'aprobar')
  const rechazar = linkDeRespuesta(urlApp, token, 'rechazar')
  const tambien = otros.length > 0 ? `También le preguntamos a ${otros.join(' y a ')}: vale la primera respuesta. ` : ''
  const plazo = `${tambien}Tienen ${textoMinutos(MINUTOS_PARA_CONTESTAR)} para contestar.`

  const resultado = await enviarMail({
    para: familiar.mail,
    asunto: `${descripcion}. ¿Lo aprobás?`,
    texto: `Hola ${familiar.nombre}:\n\n${descripcion}. ¿Lo aprobás?\n\nAprobar: ${aprobar}\nRechazar: ${rechazar}\n\n${plazo}\n\nContigo`,
    html: mailHtml(familiar.nombre, descripcion, aprobar, rechazar, plazo),
  })
  return resultado.enviado
}

function mailHtml(nombre: string, descripcion: string, aprobar: string, rechazar: string, plazo: string): string {
  const boton = (href: string, texto: string, color: string) =>
    `<a href="${escapar(href)}" style="display:block;padding:20px;margin:12px 0;border-radius:12px;background:${color};color:#ffffff;font-size:24px;font-weight:bold;text-align:center;text-decoration:none">${texto}</a>`
  return `<div style="font-family:Arial,sans-serif;font-size:20px;line-height:1.5;color:#111111;max-width:480px">
  <p>Hola ${escapar(nombre)}:</p>
  <p style="font-size:24px"><strong>${escapar(descripcion)}.</strong><br>¿Lo aprobás?</p>
  ${boton(aprobar, '✅ Aprobar', '#0a6b2d')}
  ${boton(rechazar, '❌ Rechazar', '#a50e0e')}
  <p style="font-size:16px;color:#3d3d3d">${escapar(plazo)}</p>
  <p style="font-size:16px;color:#3d3d3d">Contigo</p>
</div>`
}

export function escapar(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
