import 'server-only'
import { escapar, familiaresConMail, familiaresEnOrden } from './aprobaciones'
import {
  anotarEnElDiario,
  guardarUbicacionDeEmergencia,
  guardarUltimaEmergencia,
  PENDIENTE,
  primerNombre,
  soltarCandado,
  tomarCandado,
  type ConfiguracionAbuelo,
  type Familiar,
  type Ubicacion,
} from './datos'
import { enviarMail, type ResultadoMail } from './mail'
import { notificarAFamiliar } from './notificaciones'

/** Lo que necesita la pantalla para mostrar los botones de emergencia. */
export interface Emergencia {
  /** Primer familiar (según "orden") que tiene teléfono guardado. */
  familiar?: { nombre: string; link: string }
  /** A quiénes se les avisó por mail (ahora o en los últimos minutos). */
  avisados?: string[]
}

/** Lo que necesita la pantalla para mostrar el cartel rojo de posible estafa. */
export interface Estafa {
  /** A quiénes se les avisó (ahora o en los últimos minutos). */
  avisados?: string[]
  /** Botón para llamar al primer familiar con teléfono. */
  familiar?: { nombre: string; link: string }
}

/** Como máximo un aviso de emergencia por mail cada estos minutos, por abuelo. */
export const MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA = 10
const MAXIMO_LETRAS_CITA = 300

/** Arma los botones con los teléfonos GUARDADOS en la configuración. El 911 va siempre. */
export function armarEmergencia(familiares: Familiar[]): Emergencia {
  const [primero] = contactosParaLlamar(familiares)
  return primero ? { familiar: primero } : {}
}

/** Los familiares con teléfono guardado, en orden ("orden" 1 primero), listos para llamar. */
export function contactosParaLlamar(familiares: Familiar[]): { nombre: string; link: string }[] {
  return [...familiares]
    .sort((a, b) => a.orden - b.orden)
    .filter((familiar) => familiar.telefono !== PENDIENTE && familiar.telefono.replace(/\D/g, '') !== '')
    .map((familiar) => ({ nombre: familiar.nombre, link: `tel:${familiar.telefono.replace(/[^\d+]/g, '')}` }))
}

/**
 * Les avisa a los familiares, solo y sin preguntar, contando lo que dijo el abuelo:
 * un mail (a los que tienen mail) y una notificación en el celular (a los que la activaron).
 * Si ya se avisó en los últimos minutos, no avisa de nuevo (para no llenar la casilla).
 * Devuelve a quiénes se les avisó (ahora o hace poco).
 */
export async function avisarEmergenciaALaFamilia(configuracion: ConfiguracionAbuelo, loQueDijo: string): Promise<string[]> {
  const familiares = familiaresEnOrden(configuracion)
  if (familiares.length === 0) return []

  const candado = `emergencia:${configuracion.codigoFamilia}`
  if (!(await tomarCandado(candado, MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA * 60))) {
    return familiares.map((f) => f.nombre) // ya se avisó hace poco
  }

  const nombre = primerNombre(configuracion.abuelo.nombre)
  const cita = loQueDijo.trim().slice(0, MAXIMO_LETRAS_CITA)
  const telefono = configuracion.abuelo.telefono
  const tieneTelefono = telefono !== PENDIENTE && telefono.replace(/\D/g, '') !== ''
  const llamalo = tieneTelefono ? `Llamalo al ${telefono}.` : 'No tenemos su teléfono guardado: comunicate con él como puedas.'

  await guardarUltimaEmergencia(configuracion.codigoFamilia, cita)
  const conMail = familiaresConMail(configuracion)
  // Mail y notificaciones salen juntos; si una falla, la otra sale igual.
  const [resultado, ...porNotificacion] = await Promise.all([
    conMail.length > 0 ? mandarMailDeEmergencia(conMail, nombre, cita, llamalo, tieneTelefono ? telefono : null) : sinMail(),
    ...familiares.map((f) =>
      notificarAFamiliar(configuracion.codigoFamilia, f.nombre, {
        titulo: `⚠️ ${nombre} puede necesitar ayuda`,
        cuerpo: `Dijo: "${cita}". Tocá para llamarlo.`,
        url: '/emergencia',
        etiqueta: 'emergencia',
      }),
    ),
  ])
  const avisados = familiares
    .filter((f, i) => (resultado.enviado && conMail.includes(f)) || porNotificacion[i])
    .map((f) => f.nombre)
  if (avisados.length === 0) await soltarCandado(candado) // así el próximo intento puede volver a probar
  return avisados
}

async function sinMail(): Promise<ResultadoMail> {
  return { enviado: false, error: 'ningún familiar tiene mail' }
}

function mandarMailDeEmergencia(
  familiares: Familiar[],
  nombre: string,
  cita: string,
  llamalo: string,
  telefono: string | null,
): Promise<ResultadoMail> {
  const tieneTelefono = telefono !== null
  return enviarMail({
    para: familiares.map((f) => f.mail).join(', '),
    asunto: `⚠️ ${nombre} puede necesitar ayuda`,
    texto: `${nombre} dijo: "${cita}". Puede necesitar ayuda. ${llamalo}\n\nContigo`,
    html: `<div style="font-family:Arial,sans-serif;font-size:20px;line-height:1.5;color:#111111;max-width:480px">
  <p style="font-size:24px"><strong>${escapar(nombre)} dijo: "${escapar(cita)}".</strong></p>
  <p>Puede necesitar ayuda. ${escapar(llamalo)}</p>
  ${
    tieneTelefono
      ? `<a href="tel:${escapar(telefono.replace(/[^\d+]/g, ''))}" style="display:block;padding:20px;margin:12px 0;border-radius:12px;background:#a50e0e;color:#ffffff;font-size:24px;font-weight:bold;text-align:center;text-decoration:none">📞 Llamar a ${escapar(nombre)}</a>`
      : ''
  }
  <p style="font-size:16px;color:#3d3d3d">Contigo</p>
</div>`,
  })
}

/**
 * Botón Ayuda: les manda a los familiares dónde está el abuelo (link al mapa), por mail y al celular.
 * Llega unos segundos después del aviso de emergencia. Como máximo una vez cada 10 minutos.
 */
export async function avisarUbicacionALaFamilia(configuracion: ConfiguracionAbuelo, ubicacion: Ubicacion): Promise<string[]> {
  const familiares = familiaresEnOrden(configuracion)
  if (familiares.length === 0) return []
  await guardarUbicacionDeEmergencia(configuracion.codigoFamilia, ubicacion)
  const candado = `ubicacion:${configuracion.codigoFamilia}`
  if (!(await tomarCandado(candado, MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA * 60))) return familiares.map((f) => f.nombre)

  const nombre = primerNombre(configuracion.abuelo.nombre)
  const mapa = linkAlMapa(ubicacion)
  await anotarEnElDiario(configuracion.codigoFamilia, 'ayuda', 'El celular mandó su ubicación a la familia')
  const avisados = await avisarATodos(configuracion, {
    asunto: `Dónde está ${nombre} ahora`,
    titulo: `${nombre} pidió ayuda desde acá`,
    parrafo: `${nombre} tocó el botón de ayuda. Su celular estaba en este lugar (puede tener un margen de algunas cuadras).`,
    boton: { texto: 'Ver en el mapa', link: mapa, color: '#6b4226' },
    notificacion: { titulo: `Dónde está ${nombre}`, cuerpo: 'Tocá para ver en el mapa desde dónde pidió ayuda.', url: '/emergencia', etiqueta: 'ubicacion' },
  })
  if (avisados.length === 0) await soltarCandado(candado)
  return avisados
}

export function linkAlMapa({ latitud, longitud }: Ubicacion): string {
  return `https://www.google.com/maps?q=${latitud.toFixed(6)},${longitud.toFixed(6)}`
}

/**
 * Escudo anti-estafas: si la IA cree que alguien le quiere hacer una estafa al abuelo, les avisa a los familiares
 * (mail y celular) contando lo que dijo, para que lo llamen. Como máximo un aviso cada 10 minutos.
 */
export async function avisarEstafaALaFamilia(configuracion: ConfiguracionAbuelo, loQueDijo: string, motivo: string): Promise<Estafa> {
  const familiares = familiaresEnOrden(configuracion)
  const estafa: Estafa = armarEmergencia(configuracion.familiares)
  if (familiares.length === 0) return estafa

  const candado = `estafa:${configuracion.codigoFamilia}`
  if (!(await tomarCandado(candado, MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA * 60))) {
    return { ...estafa, avisados: familiares.map((f) => f.nombre) }
  }
  const nombre = primerNombre(configuracion.abuelo.nombre)
  const cita = loQueDijo.trim().slice(0, MAXIMO_LETRAS_CITA)
  const telefono = configuracion.abuelo.telefono
  const tieneTelefono = telefono !== PENDIENTE && telefono.replace(/\D/g, '') !== ''
  await anotarEnElDiario(configuracion.codigoFamilia, 'estafa', `Posible estafa: ${motivo}`)
  const avisados = await avisarATodos(configuracion, {
    asunto: `Posible estafa: llamá a ${nombre}`,
    titulo: `${nombre} puede estar recibiendo una estafa`,
    parrafo: `Le contó al asistente: "${cita}". Le dijimos que no dé datos, claves ni códigos y que no mande plata. Llamalo para quedarse tranquilos.`,
    ...(tieneTelefono && { boton: { texto: `Llamar a ${nombre}`, link: `tel:${telefono.replace(/[^\d+]/g, '')}`, color: '#a3261b' } }),
    notificacion: { titulo: `Posible estafa a ${nombre}`, cuerpo: `Dijo: "${cita}". Llamalo.`, url: '/familia', etiqueta: 'estafa' },
  })
  if (avisados.length === 0) await soltarCandado(candado)
  return { ...estafa, ...(avisados.length > 0 && { avisados }) }
}

/**
 * Si el abuelo quiere mandar o transferir plata (o alguien se la pide): NO se consulta ni se hace nada,
 * solo se les avisa a los familiares para que lo llamen. Como máximo un aviso cada 10 minutos.
 */
export async function avisarPedidoDePlata(configuracion: ConfiguracionAbuelo, loQueDijo: string): Promise<string[]> {
  const familiares = familiaresEnOrden(configuracion)
  if (familiares.length === 0) return []
  const candado = `plata:${configuracion.codigoFamilia}`
  if (!(await tomarCandado(candado, MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA * 60))) return familiares.map((f) => f.nombre)

  const nombre = primerNombre(configuracion.abuelo.nombre)
  const cita = loQueDijo.trim().slice(0, MAXIMO_LETRAS_CITA)
  const telefono = configuracion.abuelo.telefono
  const tieneTelefono = telefono !== PENDIENTE && telefono.replace(/\D/g, '') !== ''
  await anotarEnElDiario(configuracion.codigoFamilia, 'plata', cita)
  const avisados = await avisarATodos(configuracion, {
    asunto: `${nombre} quiso mandar plata`,
    titulo: `${nombre} quiso mandar plata`,
    parrafo: `Le dijo al asistente: "${cita}". El asistente no manda ni transfiere plata, así que no se hizo nada. Llamalo para ver qué necesita.`,
    ...(tieneTelefono && { boton: { texto: `Llamar a ${nombre}`, link: `tel:${telefono.replace(/[^\d+]/g, '')}`, color: '#6b4226' } }),
    notificacion: { titulo: `${nombre} quiso mandar plata`, cuerpo: `Dijo: "${cita}". No se hizo nada. Llamalo.`, url: '/familia', etiqueta: 'plata' },
  })
  if (avisados.length === 0) await soltarCandado(candado)
  return avisados
}

/**
 * Una duda del día a día que el asistente no pudo resolver por chat ("no me anda la tele"): con el OK del abuelo, se la
 * cuenta a los familiares para que lo llamen. No es un permiso: no hay que aprobar nada. Como máximo una cada 10 minutos.
 */
export async function avisarDudaALaFamilia(configuracion: ConfiguracionAbuelo, duda: string): Promise<string[]> {
  const familiares = familiaresEnOrden(configuracion)
  if (familiares.length === 0) return []
  const candado = `duda:${configuracion.codigoFamilia}`
  if (!(await tomarCandado(candado, MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA * 60))) return familiares.map((f) => f.nombre)

  const nombre = primerNombre(configuracion.abuelo.nombre)
  const cita = duda.trim().slice(0, MAXIMO_LETRAS_CITA)
  const telefono = configuracion.abuelo.telefono
  const tieneTelefono = telefono !== PENDIENTE && telefono.replace(/\D/g, '') !== ''
  await anotarEnElDiario(configuracion.codigoFamilia, 'ayuda', `Le preguntó a la familia: ${cita}`)
  const avisados = await avisarATodos(configuracion, {
    asunto: `${nombre} tiene una duda`,
    titulo: `${nombre} tiene una duda`,
    parrafo: `Le preguntó al asistente: "${cita}". No se pudo resolver por chat y pidió que te avisemos. Cuando puedas, llamalo.`,
    ...(tieneTelefono && { boton: { texto: `Llamar a ${nombre}`, link: `tel:${telefono.replace(/[^\d+]/g, '')}`, color: '#6b4226' } }),
    notificacion: { titulo: `${nombre} tiene una duda`, cuerpo: `"${cita}". Llamalo cuando puedas.`, url: '/familia', etiqueta: 'duda' },
  })
  if (avisados.length === 0) await soltarCandado(candado)
  return avisados
}

/** Manda el mismo aviso a todos los familiares: un mail (a los que tienen mail) y una notificación al celular. */
async function avisarATodos(
  configuracion: ConfiguracionAbuelo,
  aviso: {
    asunto: string
    titulo: string
    parrafo: string
    boton?: { texto: string; link: string; color: string }
    notificacion: Parameters<typeof notificarAFamiliar>[2]
  },
): Promise<string[]> {
  const familiares = familiaresEnOrden(configuracion)
  const conMail = familiaresConMail(configuracion)
  const { asunto, titulo, parrafo, boton } = aviso
  const [resultado, ...porNotificacion] = await Promise.all([
    conMail.length > 0
      ? enviarMail({
          para: conMail.map((f) => f.mail).join(', '),
          asunto,
          texto: `${titulo}\n\n${parrafo}${boton ? `\n\n${boton.texto}: ${boton.link}` : ''}\n\nContigo`,
          html: `<div style="font-family:Arial,sans-serif;font-size:20px;line-height:1.5;color:#4a3123;max-width:480px">
  <p style="font-size:24px"><strong>${escapar(titulo)}</strong></p>
  <p>${escapar(parrafo)}</p>
  ${boton ? `<a href="${escapar(boton.link)}" style="display:block;padding:20px;margin:12px 0;border-radius:14px;background:${boton.color};color:#ffffff;font-size:22px;font-weight:bold;text-align:center;text-decoration:none">${escapar(boton.texto)}</a>` : ''}
  <p style="font-size:16px;color:#7a6152">Contigo</p>
</div>`,
        })
      : sinMail(),
    ...familiares.map((f) => notificarAFamiliar(configuracion.codigoFamilia, f.nombre, aviso.notificacion)),
  ])
  return familiares.filter((f, i) => (resultado.enviado && conMail.includes(f)) || porNotificacion[i]).map((f) => f.nombre)
}
