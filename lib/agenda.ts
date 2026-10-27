import 'server-only'
import { randomBytes } from 'node:crypto'
import { familiasConAgenda, guardarAgenda, leerAgenda, leerConfiguracion, PENDIENTE, tomarCandado, ZONA_HORARIA, type ConfiguracionAbuelo } from './datos'
import { anotarAgenda } from './lo-que-paso'
import { notificarAlAbuelo } from './notificaciones'
import { tratoDe } from './trato'

// La agenda del abuelo: los familiares le cargan actividades (/familia/agenda) y él las ve en /abuelo/agenda.
// Le llegan tres avisos al celular (si los activó) y arriba de su pantalla cuando abre la app:
//   1. apenas se la agregan: "Tu hijo José agregó a tu agenda: «Cumple de Sofi», el viernes 15 a las 17:00."
//   2. un día antes, y 3. dos horas antes (los manda /api/recordatorios, que cron-job.org llama cada 10 minutos).
// Uruguay no cambia la hora en verano desde 2015: la hora que carga la familia es siempre UTC-3.

export interface Actividad {
  id: string
  /** Qué es, como lo escribió el familiar: "Cumple de tu sobrina Sofi". */
  titulo: string
  /** Cuándo (ISO). */
  cuando: string
  /** Dónde, si lo dijo: "lo de Laura". */
  lugar?: string
  /** El familiar que la agregó (su nombre). */
  agregadaPor: string
  creadaEl: string
  /** Si el abuelo ya vio en su pantalla que se la agregaron. */
  vistaPorElAbuelo?: boolean
  /** Cuándo se mandó cada aviso (ISO), o "no hacía falta" (por ejemplo, la agregaron 3 horas antes: no va el del día antes). */
  avisos: { agregada?: string; diaAntes?: string; horasAntes?: string }
}

export const HORAS_ANTES = 2
const HORAS_DIA_ANTES = 24
const HORA = 3_600_000
const NO_HACIA_FALTA = 'no hacía falta'
const MAXIMO_LETRAS = 120
/** Se borran solas un día después de pasadas. */
const SE_BORRAN_DESPUES = 24 * HORA

// ── Fechas y textos ─────────────────────────────────────────

/** "2026-11-15" y "17:00" (hora de Uruguay) → el momento. null si no son válidos. */
export function momentoDe(fecha: string, hora: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) return null
  const momento = Date.parse(`${fecha}T${hora}:00-03:00`)
  return Number.isNaN(momento) ? null : momento
}

const parteDe = (momento: number, opciones: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('es-UY', { timeZone: ZONA_HORARIA, ...opciones }).format(momento)
const diaDe = (momento: number) => new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(momento)
const horaDe = (momento: number) => parteDe(momento, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

/** "hoy a las 17:00", "mañana a las 17:00", "el viernes 15 a las 17:00" o "el viernes 15 de noviembre a las 17:00". */
export function textoCuando(cuando: string, ahora = Date.now()): string {
  const momento = Date.parse(cuando)
  const a = `a las ${horaDe(momento)}`
  if (diaDe(momento) === diaDe(ahora)) return `hoy ${a}`
  if (diaDe(momento) === diaDe(ahora + 24 * HORA)) return `mañana ${a}`
  const otroMes = parteDe(momento, { month: 'numeric' }) !== parteDe(ahora, { month: 'numeric' })
  // En minúscula: según el sistema, el formato de Uruguay da "Noviembre" o "noviembre".
  const dia = parteDe(momento, { weekday: 'long' }).toLowerCase()
  const mes = parteDe(momento, { month: 'long' }).toLowerCase()
  return `el ${dia} ${parteDe(momento, { day: 'numeric' })}${otroMes ? ` de ${mes}` : ''} ${a}`
}

const conMayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

/** Tuteo o usted, según la familia: { tu: 'tu'|'su', Tu: 'Tu'|'Su' }. */
function posesivo(configuracion: ConfiguracionAbuelo) {
  const deVos = tratoDe(configuracion.abuelo.comoLeGustaQueLeHablen) === 'vos'
  return { tu: deVos ? 'tu' : 'su', deVos }
}

/** "tu hijo José" / "su hija Inés" (o solo el nombre si no se sabe qué es). */
function quienLaAgrego(configuracion: ConfiguracionAbuelo, nombre: string): string {
  const familiar = configuracion.familiares.find((f) => f.nombre === nombre)
  const relacion = familiar?.relacion && familiar.relacion !== PENDIENTE ? familiar.relacion.trim().toLowerCase() : ''
  return relacion ? `${posesivo(configuracion).tu} ${relacion} ${nombre}` : nombre
}

const queYDonde = (a: Actividad) => `«${a.titulo}»${a.lugar ? `, en ${a.lugar}` : ''}`

/** "Tu hijo José agregó a tu agenda: «Cumple de Sofi», el viernes 15 a las 17:00." */
export function textoAgregada(configuracion: ConfiguracionAbuelo, a: Actividad, ahora = Date.now()): string {
  const { tu } = posesivo(configuracion)
  return `${conMayuscula(quienLaAgrego(configuracion, a.agregadaPor))} agregó a ${tu} agenda: ${queYDonde(a)}, ${textoCuando(a.cuando, ahora)}.`
}

/** "Mañana a las 17:00: «Cumple de Sofi»." / "Hoy a las 17:00 (en 2 horas): «Cumple de Sofi»." */
export function textoRecordatorio(a: Actividad, ahora = Date.now()): string {
  const minutos = Math.round((Date.parse(a.cuando) - ahora) / 60_000)
  const falta = minutos >= 90 ? `en ${Math.round(minutos / 60)} horas` : minutos >= 50 ? 'en 1 hora' : `en ${Math.max(minutos, 1)} minutos`
  const cuando = conMayuscula(textoCuando(a.cuando, ahora))
  return minutos <= 12 * 60 ? `${cuando} (${falta}): ${queYDonde(a)}.` : `${cuando}: ${queYDonde(a)}.`
}

// ── Leer y guardar ──────────────────────────────────────────

function esActividad(dato: unknown): dato is Actividad {
  const a = dato as Partial<Actividad> | null
  return !!a && typeof a.id === 'string' && typeof a.titulo === 'string' && typeof a.cuando === 'string' && !Number.isNaN(Date.parse(a.cuando)) && typeof a.agregadaPor === 'string' && !!a.avisos
}

/** Todas, de la más próxima a la más lejana, sin las que ya pasaron hace más de un día. */
export async function agendaDe(codigoFamilia: string, ahora = Date.now()): Promise<Actividad[]> {
  return (await leerAgenda(codigoFamilia))
    .filter(esActividad)
    .filter((a) => Date.parse(a.cuando) > ahora - SE_BORRAN_DESPUES)
    .sort((a, b) => Date.parse(a.cuando) - Date.parse(b.cuando))
}

/** Las que vienen (y las que empezaron hace menos de una hora), de la más próxima a la más lejana. */
export async function actividadesQueVienen(codigoFamilia: string, ahora = Date.now()): Promise<Actividad[]> {
  return (await agendaDe(codigoFamilia, ahora)).filter((a) => Date.parse(a.cuando) > ahora - HORA)
}

export type ResultadoAgregar = { ok: true; actividad: Actividad; avisado: boolean } | { ok: false; problema: string }

/** Agrega una actividad (desde /familia/agenda) y le avisa al abuelo enseguida. */
export async function agregarActividad(
  configuracion: ConfiguracionAbuelo,
  familiar: string,
  datos: { titulo: string; fecha: string; hora: string; lugar?: string },
  ahora = Date.now(),
): Promise<ResultadoAgregar> {
  const titulo = datos.titulo.trim().replace(/\s+/g, ' ')
  const lugar = (datos.lugar ?? '').trim().replace(/\s+/g, ' ')
  if (titulo.length < 2) return { ok: false, problema: 'Escribí qué es (por ejemplo "Cumple de Sofi").' }
  if (titulo.length > MAXIMO_LETRAS || lugar.length > MAXIMO_LETRAS) return { ok: false, problema: `Escribilo más corto (hasta ${MAXIMO_LETRAS} letras).` }
  const momento = momentoDe(datos.fecha, datos.hora)
  if (!momento) return { ok: false, problema: 'Elegí el día y la hora.' }
  if (momento <= ahora) return { ok: false, problema: 'Ese día y hora ya pasaron.' }
  if (momento > ahora + 400 * 24 * HORA) return { ok: false, problema: 'Elegí una fecha de este año o del que viene.' }

  const falta = momento - ahora
  const actividad: Actividad = {
    id: randomBytes(8).toString('hex'),
    titulo,
    cuando: new Date(momento).toISOString(),
    ...(lugar && { lugar }),
    agregadaPor: familiar,
    creadaEl: new Date(ahora).toISOString(),
    avisos: {
      // Si falta menos de un día (o de 2 horas), ese recordatorio no hace falta: el aviso de "te agregaron" ya dice cuándo.
      ...(falta < HORAS_DIA_ANTES * HORA && { diaAntes: NO_HACIA_FALTA }),
      ...(falta < HORAS_ANTES * HORA && { horasAntes: NO_HACIA_FALTA }),
    },
  }
  const texto = textoAgregada(configuracion, actividad, ahora)
  const { deVos } = posesivo(configuracion)
  const avisado = await notificarAlAbuelo(configuracion.codigoFamilia, {
    titulo: deVos ? 'Nueva actividad en tu agenda' : 'Nueva actividad en su agenda',
    cuerpo: texto,
    url: '/abuelo/agenda',
    etiqueta: `agenda-${actividad.id}`,
  })
  actividad.avisos.agregada = new Date(ahora).toISOString()
  await guardarAgenda(configuracion.codigoFamilia, [...(await agendaDe(configuracion.codigoFamilia, ahora)), actividad])
  const nombre = configuracion.abuelo.nombre === PENDIENTE ? 'el abuelo' : configuracion.abuelo.nombre.split(' ')[0]
  await anotarAgenda(
    configuracion.codigoFamilia,
    `${familiar} agregó a la agenda: «${titulo}»`,
    `${conMayuscula(textoCuando(actividad.cuando, ahora))}${lugar ? `, en ${lugar}` : ''}. ${avisado ? `Le llegó el aviso al celular de ${nombre}.` : `${nombre} lo va a ver cuando abra la app (no tiene los avisos activados).`}`,
  )
  return { ok: true, actividad, avisado }
}

export async function borrarActividad(codigoFamilia: string, id: string): Promise<boolean> {
  const antes = await agendaDe(codigoFamilia)
  const quedan = antes.filter((a) => a.id !== id)
  if (quedan.length === antes.length) return false
  await guardarAgenda(codigoFamilia, quedan)
  return true
}

/** El abuelo vio en su pantalla las que le agregaron (no se las vuelve a mostrar como novedad). */
export async function marcarVistas(codigoFamilia: string): Promise<void> {
  const agenda = await agendaDe(codigoFamilia)
  if (agenda.every((a) => a.vistaPorElAbuelo)) return
  await guardarAgenda(codigoFamilia, agenda.map((a) => ({ ...a, vistaPorElAbuelo: true })))
}

// ── Recordatorios (cada 10 minutos, desde /api/recordatorios) ──

/** Qué recordatorio le toca ahora a una actividad (o ninguno). */
export function recordatorioQueToca(a: Actividad, ahora = Date.now()): 'diaAntes' | 'horasAntes' | null {
  const falta = Date.parse(a.cuando) - ahora
  if (falta <= 0) return null
  if (!a.avisos.horasAntes && falta <= HORAS_ANTES * HORA) return 'horasAntes'
  if (!a.avisos.diaAntes && falta <= HORAS_DIA_ANTES * HORA && falta > HORAS_ANTES * HORA) return 'diaAntes'
  return null
}

/** Manda los recordatorios que tocan, en todas las familias. Devuelve cuántos mandó (y a cuántos les llegó). */
export async function mandarRecordatorios(ahora = Date.now()): Promise<{ mandados: number; llegaron: number }> {
  let mandados = 0
  let llegaron = 0
  // Nunca dos a la vez (si cron-job.org llama dos veces seguidas, no se manda el mismo recordatorio dos veces).
  if (!(await tomarCandado('recordatorios-agenda', 9 * 60))) return { mandados, llegaron }
  for (const codigo of await familiasConAgenda()) {
    const configuracion = await leerConfiguracion(codigo)
    if (!configuracion) continue
    const agenda = await agendaDe(codigo, ahora)
    let cambio = false
    for (const a of agenda) {
      const toca = recordatorioQueToca(a, ahora)
      if (!toca) continue
      const { deVos } = posesivo(configuracion)
      const llego = await notificarAlAbuelo(codigo, {
        titulo: toca === 'diaAntes' ? (deVos ? 'Mañana tenés algo' : 'Mañana tiene algo') : deVos ? 'En un rato tenés algo' : 'En un rato tiene algo',
        cuerpo: textoRecordatorio(a, ahora),
        url: '/abuelo/agenda',
        etiqueta: `agenda-${a.id}`,
      })
      // Se anota aunque no le haya llegado (sin avisos activados): igual lo ve arriba de su pantalla al abrir la app.
      a.avisos[toca] = new Date(ahora).toISOString()
      cambio = true
      mandados++
      if (llego) llegaron++
    }
    if (cambio) await guardarAgenda(codigo, agenda)
  }
  return { mandados, llegaron }
}

// ── Lo que ve el abuelo arriba de su pantalla ───────────────

export interface AvisoDeAgenda {
  /** "nueva": se la agregaron y todavía no la vio. "pronto": falta menos de un día. */
  tipo: 'nueva' | 'pronto'
  texto: string
}

/** Las novedades sin ver y lo que tiene en las próximas 24 horas (como mucho 3), para arriba de /abuelo. */
export async function avisosParaElAbuelo(configuracion: ConfiguracionAbuelo, ahora = Date.now()): Promise<AvisoDeAgenda[]> {
  const vienen = await actividadesQueVienen(configuracion.codigoFamilia, ahora)
  const nuevas = vienen.filter((a) => !a.vistaPorElAbuelo).map((a): AvisoDeAgenda => ({ tipo: 'nueva', texto: textoAgregada(configuracion, a, ahora) }))
  const pronto = vienen
    .filter((a) => a.vistaPorElAbuelo && Date.parse(a.cuando) > ahora && Date.parse(a.cuando) - ahora <= HORAS_DIA_ANTES * HORA)
    .map((a): AvisoDeAgenda => ({ tipo: 'pronto', texto: textoRecordatorio(a, ahora) }))
  return [...nuevas, ...pronto].slice(0, 3)
}

/** Para la IA del abuelo (en AHORA, al final del prompt): lo que tiene en los próximos 14 días, como mucho 5. */
export async function agendaParaLaIA(codigoFamilia: string, ahora = Date.now()): Promise<string> {
  const vienen = (await actividadesQueVienen(codigoFamilia, ahora)).filter((a) => Date.parse(a.cuando) - ahora <= 14 * 24 * HORA).slice(0, 5)
  if (vienen.length === 0) return 'Agenda: no tiene nada en los próximos días.'
  return `Agenda (lo que le cargó la familia; si pregunta, contale): ${vienen.map((a) => `${textoCuando(a.cuando, ahora)}: ${queYDonde(a)} (lo agregó ${a.agregadaPor})`).join('; ')}.`
}
