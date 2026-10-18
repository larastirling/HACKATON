import 'server-only'
import { escapar, familiaresConMail, familiaresEnOrden } from './aprobaciones'
import {
  fechaDeHoy,
  leerDiario,
  primerNombre,
  soltarCandado,
  tomarCandado,
  ZONA_HORARIA,
  type ConfiguracionAbuelo,
  type EventoDelDia,
} from './datos'
import { charlarConLaIA } from './ia'
import { enviarMail } from './mail'
import { notificarAFamiliar } from './notificaciones'

// Resumen del día para la familia: a la noche les llega un mail (y un aviso al celular) contando
// qué hizo y qué pidió el abuelo, con lo importante primero (si se sintió mal, una posible estafa, etc.).
// Lo escribe la IA SOLO con lo anotado en el diario del día (lib/datos.ts).

export type ResultadoResumen = { ok: true; texto: string; avisados: string[] } | { ok: false; error: string }

const ETIQUETAS: Record<EventoDelDia['tipo'], string> = {
  charla: 'Le dijo al asistente',
  viaje: 'Viaje',
  pedido: 'Pedido',
  permiso: 'Permiso',
  emergencia: 'SALUD / EMERGENCIA',
  ayuda: 'BOTÓN DE AYUDA',
  estafa: 'POSIBLE ESTAFA',
  plata: 'QUISO MANDAR PLATA',
}

/** Escribe el resumen de hoy (no manda nada). */
export async function escribirResumenDelDia(configuracion: ConfiguracionAbuelo): Promise<{ ok: true; texto: string } | { ok: false; error: string }> {
  const nombre = primerNombre(configuracion.abuelo.nombre)
  const eventos = await leerDiario(configuracion.codigoFamilia)
  if (eventos.length === 0) return { ok: true, texto: `Hoy ${nombre} no usó el asistente.` }

  const familia = familiaresEnOrden(configuracion).map((f) => f.nombre).join(', ')
  const lista = eventos
    .map((e) => `${new Date(e.cuando).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', timeZone: ZONA_HORARIA })} · ${ETIQUETAS[e.tipo]}: ${e.texto}`)
    .join('\n')

  const respuesta = await charlarConLaIA(
    `Escribís el resumen del día de ${nombre} para su familia (${familia}), que lo lee a la noche en un mail.
- Entre 2 y 5 frases cortas, en español rioplatense, con tono cálido y tranquilo. Hablale a la familia de "vos".
- Si pasó algo para prestar atención (se sintió mal, tocó el botón de ayuda, una posible estafa, algo raro), contalo PRIMERO y con claridad, y sugerí llamarlo.
- Después contá lo demás: qué pidió, a dónde quiso ir, qué charló.
- Usá SOLO lo que está en la lista. No inventes nada. No des consejos médicos.
- Sin saludos, sin títulos, sin listas y sin emojis.`,
    [{ role: 'user', content: `Lo que pasó hoy con ${nombre}:\n${lista}` }],
  )
  if (!respuesta.ok) return respuesta
  return { ok: true, texto: respuesta.texto.trim() }
}

/**
 * Escribe el resumen de hoy y se lo manda a toda la familia (mail y celular).
 * Con `unaVezPorDia`, si ya se mandó hoy no lo manda de nuevo (lo usa el envío automático de la noche).
 */
export async function mandarResumenDelDia(configuracion: ConfiguracionAbuelo, { unaVezPorDia = false } = {}): Promise<ResultadoResumen> {
  const familiares = familiaresEnOrden(configuracion)
  if (familiares.length === 0) return { ok: false, error: 'No hay familiares guardados' }
  const candado = `resumen:${configuracion.codigoFamilia}:${fechaDeHoy()}`
  if (unaVezPorDia && !(await tomarCandado(candado, 2 * 86_400))) return { ok: false, error: 'El resumen de hoy ya se mandó' }

  const resumen = await escribirResumenDelDia(configuracion)
  if (!resumen.ok) {
    if (unaVezPorDia) await soltarCandado(candado)
    return resumen
  }
  const nombre = primerNombre(configuracion.abuelo.nombre)
  const conMail = familiaresConMail(configuracion)
  const parrafos = resumen.texto.split(/\n+/).filter(Boolean)

  const [mail, ...porNotificacion] = await Promise.all([
    conMail.length > 0
      ? enviarMail({
          para: conMail.map((f) => f.mail).join(', '),
          asunto: `Resumen del día de ${nombre}`,
          texto: `${resumen.texto}\n\nContigo`,
          html: `<div style="font-family:Arial,sans-serif;font-size:20px;line-height:1.5;color:#4a3123;max-width:480px">
  <p style="font-size:24px"><strong>Así fue el día de ${escapar(nombre)}</strong></p>
  ${parrafos.map((p) => `<p>${escapar(p)}</p>`).join('\n  ')}
  <p style="font-size:16px;color:#7a6152">Contigo</p>
</div>`,
        })
      : Promise.resolve({ enviado: false as const, error: 'ningún familiar tiene mail' }),
    ...familiares.map((f) =>
      notificarAFamiliar(configuracion.codigoFamilia, f.nombre, {
        titulo: `Resumen del día de ${nombre}`,
        cuerpo: resumen.texto.length > 160 ? `${resumen.texto.slice(0, 157)}...` : resumen.texto,
        url: '/familia',
        etiqueta: 'resumen',
      }),
    ),
  ])
  const avisados = familiares.filter((f, i) => (mail.enviado && conMail.includes(f)) || porNotificacion[i]).map((f) => f.nombre)
  if (avisados.length === 0) {
    if (unaVezPorDia) await soltarCandado(candado)
    return { ok: false, error: 'No se pudo mandar ni el mail ni el aviso al celular' }
  }
  return { ok: true, texto: resumen.texto, avisados }
}
