import 'server-only'
import {
  COMO_SE_MANEJA,
  FORMAS_DE_VIAJAR,
  formasDeViajarDe,
  leerConfiguracion,
  PASOS,
  PENDIENTE,
  primerNombre,
  type ComoEs,
  type ConfiguracionAbuelo,
  type FormaDeViajar,
  type Nivel,
  type Paso,
} from '@/lib/datos'
import { ubicarYGuardarLaCasa } from './abuelo'
import { guardarFamiliar } from './familiares'
import { comoPuedeIr, guardarFormas, KM_CAMINANDO, NOMBRES_FORMAS } from './formas-de-viajar'
import { cambiarConfiguracion, nombreValido, normalizarTelefono } from './guardar'
import { reglasSinElegir } from './instrucciones'
import { guardarReglas, mostrarReglas, type TablaReglas } from './reglas'
import { buscarEnCatalogo, guardarLugarSugerido, todosLosLugaresCercanos, type LugarSugerido } from './sugerencias'
import { guardarComercioDeLaTarjeta, todosLosComerciosCercanos, type ComercioSugerido } from './sugerencias-comercios'

// Cargar a la persona mayor en /familia, en 6 pasos guiados con tarjetas (sin la IA, así es rápido y no gasta):
//   1. Sus datos (una tarjeta)          2. Cómo se maneja (botones)        3. Lugares (marcar varios de una)
//   4. Comercios (marcar varios de una) 5. Familiares (una tarjeta)        6. Reglas (la tabla con el nivel propuesto)
// Los pasos 2, 3, 4 y 6 se pueden dejar para después. Lo escrito a mano (un lugar que falta, una corrección)
// lo sigue atendiendo la IA. El avance queda guardado en la configuración (armado), así se puede volver más tarde.

export const TITULOS: Record<Paso, string> = {
  datos: 'Sus datos',
  'como-es': 'Cómo se maneja',
  lugares: 'Lugares',
  comercios: 'Comercios',
  familiares: 'Familiares',
  reglas: 'Reglas',
}
const OBLIGATORIOS: Paso[] = ['datos', 'familiares']

/** Cuántos se ven primero en las tarjetas de lugares y comercios (el resto, con "Ver todos los cercanos"). */
const PRIMERO_SE_MUESTRAN = 4

export interface EstadoDelArmado {
  /** El paso que toca ahora (null si están todos hechos o dejados para después). */
  actual: Paso | null
  numero: number
  total: number
  titulo: string
  obligatorio: boolean
  /** Los que el hijo dejó para después (todavía sin hacer). */
  paraDespues: Paso[]
}

/** Un botón de "¿Cómo puede ir?" en la tarjeta de lugares, marcado si ya estaba guardado. */
export interface FormaEnLaTarjeta {
  id: FormaDeViajar
  nombre: string
  marcada: boolean
}

export type Tarjeta =
  | { tipo: 'datos'; nombre: string; apodo: string; trato: 'usted' | 'vos' | ''; telefono: string; direccion: string }
  | { tipo: 'como-es'; tecnologia: readonly string[]; plata: readonly string[] }
  | { tipo: 'lugares'; primeros: LugarSugerido[]; todos: LugarSugerido[]; sinCasa?: boolean; formas: FormaEnLaTarjeta[] }
  | { tipo: 'comercios'; primeros: ComercioSugerido[]; todos: ComercioSugerido[]; sinCasa?: boolean }
  | { tipo: 'familiares'; vos: { nombre: string; relacion: string; telefono: string } }
  | { tipo: 'reglas'; tabla: TablaReglas }

export type RespuestaDeTarjeta =
  | { tipo: 'datos'; nombre: string; apodo: string; trato: 'usted' | 'vos'; telefono: string; direccion: string }
  | { tipo: 'como-es'; tecnologia: string; plata: string }
  | { tipo: 'lugares'; elegidos: { id: string; vaSolo: boolean }[]; formas: FormaDeViajar[] }
  | { tipo: 'comercios'; elegidos: { id: string; pedido: string; vaSolo: boolean; funciona: boolean }[] }
  | { tipo: 'familiares'; relacion: string; telefono: string; otro?: { nombre: string; relacion: string; mail: string; telefono: string } }
  | { tipo: 'reglas' }
  /** "Completar después": deja el paso actual para más tarde. */
  | { tipo: 'despues' }
  /** "Seguir" / "Completar lo que falta": vuelve a mostrar el paso actual (o retoma los dejados para después). */
  | { tipo: 'seguir' }

// ── En qué paso está ────────────────────────────────────────

const quienEscribe = (c: ConfiguracionAbuelo, mail: string | undefined) =>
  (mail && c.familiares.find((f) => f.mail.toLowerCase() === mail.toLowerCase())) || c.familiares.find((f) => f.orden === 1) || c.familiares[0]

/** Los pasos terminados. Las familias cargadas antes de los pasos (con las reglas ya guardadas) cuentan como hechas. */
function estaHecho(c: ConfiguracionAbuelo, paso: Paso, mail: string | undefined): boolean {
  const marcado = c.armado?.hechos.includes(paso) ?? false
  const yaTeniaReglas = !reglasSinElegir(c)
  switch (paso) {
    case 'datos':
      return c.abuelo.nombre !== PENDIENTE && c.abuelo.comoLeGustaQueLeHablen !== PENDIENTE && c.abuelo.direccion !== PENDIENTE
    case 'como-es':
      return !!c.comoEs || yaTeniaReglas
    case 'lugares':
    case 'comercios':
      return marcado || yaTeniaReglas
    case 'familiares': {
      const yo = quienEscribe(c, mail)
      return !!yo && yo.relacion !== PENDIENTE && yo.telefono !== PENDIENTE
    }
    case 'reglas':
      return marcado || yaTeniaReglas
  }
}

export function estadoDelArmado(c: ConfiguracionAbuelo, mail: string | undefined): EstadoDelArmado {
  const despues = c.armado?.despues ?? []
  const pendientes = PASOS.filter((p) => !estaHecho(c, p, mail))
  const actual = pendientes.find((p) => !despues.includes(p)) ?? null
  return {
    actual,
    numero: actual ? PASOS.indexOf(actual) + 1 : PASOS.length,
    total: PASOS.length,
    titulo: actual ? TITULOS[actual] : 'Listo',
    obligatorio: actual ? OBLIGATORIOS.includes(actual) : false,
    paraDespues: pendientes.filter((p) => despues.includes(p)),
  }
}

async function marcar(codigo: string, paso: Paso, como: 'hecho' | 'despues' | 'retomar') {
  await cambiarConfiguracion(codigo, (c) => {
    const armado = { hechos: [...(c.armado?.hechos ?? [])], despues: [...(c.armado?.despues ?? [])] }
    if (como === 'hecho') {
      armado.hechos = [...new Set([...armado.hechos, paso])]
      armado.despues = armado.despues.filter((p) => p !== paso)
    } else if (como === 'despues') {
      armado.despues = [...new Set([...armado.despues, paso])]
    } else {
      armado.despues = []
    }
    return { ...c, armado }
  })
}

// ── La tarjeta de cada paso ─────────────────────────────────

/** El nivel que se propone con lo que eligió el hijo en "Cómo se maneja" (y las reglas que van con él). */
function propuestaDeReglas(c: ConfiguracionAbuelo) {
  const { tecnologia, plata } = c.comoEs ?? {}
  const nivel: Nivel =
    tecnologia === 'Le cuesta mucho' || plata === 'Ya lo estafaron o casi'
      ? 'Cuidado cercano'
      : tecnologia === 'Se maneja bien' && plata === 'La maneja bien'
        ? 'Independiente'
        : 'Acompañado'
  const motivo = c.comoEs
    ? `Con la tecnología: ${c.comoEs.tecnologia.toLowerCase()}; con la plata: ${c.comoEs.plata.toLowerCase()}.`
    : 'Es el nivel que ya tenía.'
  const seAvisa = ['Cuando sale de su casa hacia un lugar', 'Cuando hace un pedido a un comercio']
  if (nivel === 'Cuidado cercano') seAvisa.push('Cada vez que usa el asistente')
  return {
    nivel,
    motivo,
    // Los permisos que eligió el hijo en cada lugar y comercio se respetan.
    lugaresConPermiso: c.lugares.filter((l) => l.necesitaPermiso).map((l) => l.nombre),
    comerciosConPermiso: c.comercios.filter((x) => x.necesitaPermiso).map((x) => x.nombre),
    seAvisa,
    otrasAprobaciones: [] as string[],
  }
}

const separarApodo = (comoLeGusta: string) => {
  const m = comoLeGusta.match(/^(.*?),?\s*de (usted|vos)\s*$/i)
  return m ? { apodo: m[1].trim(), trato: m[2].toLowerCase() as 'usted' | 'vos' } : { apodo: comoLeGusta === PENDIENTE ? '' : comoLeGusta, trato: '' as const }
}
const sinPendiente = (v: string) => (v === PENDIENTE ? '' : v)

/** El texto que acompaña la tarjeta de cada paso. */
function textoDelPaso(c: ConfiguracionAbuelo, paso: Paso): string {
  const nombre = c.abuelo.nombre === PENDIENTE ? 'tu papá o mamá' : primerNombre(c.abuelo.nombre)
  switch (paso) {
    case 'datos':
      return 'Contame de tu papá o mamá.'
    case 'como-es':
      return `¿Cómo se maneja ${nombre}? Tocá una opción en cada una.`
    case 'lugares':
      return 'Estos quedan cerca de su casa. Tocá los que usa:'
    case 'comercios':
      return '¿Le pide a alguno de estos? Tocá los que usa:'
    case 'familiares':
      return 'Los pedidos de permiso y los avisos les llegan a los familiares de contacto.'
    case 'reglas':
      return 'Con lo que me contaste, te propongo este nivel. Podés guardarlo así o cambiar algo.'
  }
}

export async function tarjetaDelPaso(c: ConfiguracionAbuelo, paso: Paso, mail: string | undefined): Promise<{ texto: string; tarjeta: Tarjeta }> {
  const texto = textoDelPaso(c, paso)
  switch (paso) {
    case 'datos': {
      const { apodo, trato } = separarApodo(c.abuelo.comoLeGustaQueLeHablen)
      return {
        texto,
        tarjeta: {
          tipo: 'datos',
          nombre: sinPendiente(c.abuelo.nombre),
          apodo,
          trato,
          telefono: sinPendiente(c.abuelo.telefono),
          direccion: sinPendiente(c.abuelo.direccion),
        },
      }
    }
    case 'como-es':
      return { texto, tarjeta: { tipo: 'como-es', tecnologia: COMO_SE_MANEJA.tecnologia, plata: COMO_SE_MANEJA.plata } }
    case 'lugares': {
      const todos = await todosLosLugaresCercanos(c)
      const sinCasa = todos.length === 0
      // Si nunca se eligió, arranca solo con Uber (formasDeViajarDe).
      const guardadas = formasDeViajarDe(c)
      const formas = FORMAS_DE_VIAJAR.map((id) => ({ id, nombre: NOMBRES_FORMAS[id], marcada: guardadas.includes(id) }))
      return {
        texto: sinCasa ? 'Todavía no pude ubicar su casa en el mapa, así que no te puedo mostrar lugares cercanos. ¿A qué lugares va? Escribilos abajo.' : texto,
        tarjeta: { tipo: 'lugares', primeros: todos.slice(0, PRIMERO_SE_MUESTRAN), todos, ...(sinCasa && { sinCasa }), formas },
      }
    }
    case 'comercios': {
      const todos = await todosLosComerciosCercanos(c)
      // Primero, los confirmados más cercanos; con "Ver todos" aparecen también los sin confirmar.
      const primeros = todos.filter((x) => !x.sinConfirmar).slice(0, PRIMERO_SE_MUESTRAN)
      return {
        texto: todos.length === 0 ? 'No tengo comercios cerca de su casa para sugerirte. Si le pide a alguno, escribilo abajo.' : texto,
        tarjeta: { tipo: 'comercios', primeros: primeros.length ? primeros : todos.slice(0, PRIMERO_SE_MUESTRAN), todos, ...(todos.length === 0 && { sinCasa: true }) },
      }
    }
    case 'familiares': {
      const yo = quienEscribe(c, mail)
      return {
        texto,
        tarjeta: { tipo: 'familiares', vos: { nombre: yo?.nombre ?? '', relacion: sinPendiente(yo?.relacion ?? ''), telefono: sinPendiente(yo?.telefono ?? '') } },
      }
    }
    case 'reglas': {
      const { tabla } = mostrarReglas(c, propuestaDeReglas(c))
      return tabla
        ? { texto, tarjeta: { tipo: 'reglas', tabla } }
        : { texto: 'No pude armar la tabla de reglas. Escribime qué querés que se apruebe y qué solo se avise.', tarjeta: { tipo: 'reglas', tabla: tablaVacia(c) } }
    }
  }
}

const tablaVacia = (c: ConfiguracionAbuelo): TablaReglas => ({
  nivel: c.reglas.nivel,
  motivo: '',
  seAprueba: [],
  seAvisa: [],
  libre: [],
  fijas: [...c.reglas.fijas],
  abueloAceptoAvisos: c.reglas.abueloAceptoAvisos,
  guardada: false,
})

/** Qué mostrar ahora: la tarjeta del paso que toca, o el cierre si no queda ninguno. */
export async function loQueSigue(
  c: ConfiguracionAbuelo,
  mail: string | undefined,
  antes = '',
): Promise<{ texto: string; tarjeta?: Tarjeta; paso: EstadoDelArmado }> {
  const paso = estadoDelArmado(c, mail)
  const con = (t: string) => [antes, t].filter(Boolean).join('\n\n')
  if (paso.actual) {
    const { texto, tarjeta } = await tarjetaDelPaso(c, paso.actual, mail)
    // "Paso N de 6" ya se ve arriba, en el encabezado.
    return { texto: con(texto), tarjeta, paso }
  }
  const nombre = primerNombre(c.abuelo.nombre)
  if (paso.paraDespues.length > 0) {
    return {
      texto: con(
        `Listo por ahora. Te quedaron para después: ${paso.paraDespues.map((p) => TITULOS[p]).join(', ')}. ` +
          `Cuando quieras, tocá "Completar lo que falta" arriba. En el celular de ${nombre}, entrá a la app, tocá "Soy el abuelo" y poné el código ${c.codigoFamilia}.`,
      ),
      paso,
    }
  }
  return {
    texto: con(`¡Listo! Ya está todo cargado para ${nombre}. En su celular, entrá a la app, tocá "Soy el abuelo" y poné el código ${c.codigoFamilia}. Si querés cambiar algo, escribime.`),
    paso,
  }
}

// ── Lo que el hijo completó en cada tarjeta ─────────────────

const esTexto = (v: unknown, max = 200): v is string => typeof v === 'string' && v.length <= max

/**
 * Guarda lo que el hijo completó en la tarjeta y devuelve lo que sigue (sin la IA).
 * Si falta algo, lo dice y vuelve a mostrar la misma tarjeta.
 */
export async function responderTarjeta(
  codigo: string,
  mail: string | undefined,
  r: RespuestaDeTarjeta,
): Promise<{ texto: string; tarjeta?: Tarjeta; paso: EstadoDelArmado }> {
  const c = await leerConfiguracion(codigo)
  if (!c) throw new Error('No encontré la configuración de la familia')
  const pasoActual = estadoDelArmado(c, mail).actual
  const deNuevo = async (problema: string) => {
    const paso = estadoDelArmado(c, mail)
    if (!paso.actual) return loQueSigue(c, mail, problema)
    const { tarjeta } = await tarjetaDelPaso(c, paso.actual, mail)
    return { texto: problema, tarjeta, paso }
  }
  const seguir = async (hecho: string) => loQueSigue((await leerConfiguracion(codigo)) ?? c, mail, hecho)

  switch (r.tipo) {
    case 'seguir':
      if (!pasoActual) await marcar(codigo, 'datos', 'retomar')
      return seguir('')

    case 'despues':
      if (!pasoActual) return seguir('')
      if (OBLIGATORIOS.includes(pasoActual)) return deNuevo(`"${TITULOS[pasoActual]}" hace falta para que la app funcione: no se puede dejar para después.`)
      await marcar(codigo, pasoActual, 'despues')
      return seguir(`Dejé "${TITULOS[pasoActual]}" para después.`)

    case 'datos': {
      if (!esTexto(r.nombre) || !nombreValido(r.nombre.trim())) return deNuevo('Falta el nombre y apellido.')
      if (r.trato !== 'usted' && r.trato !== 'vos') return deNuevo('Elegí si le hablamos de usted o de vos.')
      if (!esTexto(r.direccion) || !r.direccion.trim()) return deNuevo('Falta la dirección (calle, número y barrio).')
      const telefono = esTexto(r.telefono) && r.telefono.trim() ? normalizarTelefono(r.telefono) : PENDIENTE
      if (!telefono) return deNuevo(`No entiendo el teléfono "${r.telefono}". Escribilo como 099 123 456.`)
      const nombre = r.nombre.trim()
      const apodo = esTexto(r.apodo) && r.apodo.trim() ? r.apodo.trim() : primerNombre(nombre)
      const direccion = r.direccion.trim()
      let abuelo = c.abuelo
      await cambiarConfiguracion(codigo, (x) => {
        abuelo = { ...x.abuelo, nombre, comoLeGustaQueLeHablen: `${apodo}, de ${r.trato}`, telefono, direccion }
        if (x.abuelo.direccion !== direccion) delete abuelo.ubicacion // dirección nueva: se ubica de nuevo
        return { ...x, abuelo }
      })
      const casa = abuelo.ubicacion ?? (await ubicarYGuardarLaCasa(codigo, abuelo))
      const dondeQueda = casa
        ? `Ubiqué la casa en el mapa: ${casa.direccionDelMapa}.`
        : 'No encontré esa dirección en el mapa. Si querés, revisala o pegá abajo el link de Google Maps de la casa (en Google Maps: "Compartir" y "Copiar enlace"). Mientras tanto, seguimos.'
      return seguir(`Listo, guardé a ${nombre}. ${dondeQueda}`)
    }

    case 'como-es': {
      const tecnologia = COMO_SE_MANEJA.tecnologia.find((o) => o === r.tecnologia)
      const plata = COMO_SE_MANEJA.plata.find((o) => o === r.plata)
      if (!tecnologia || !plata) return deNuevo('Tocá una opción en cada una.')
      const comoEs: ComoEs = { tecnologia, plata }
      await cambiarConfiguracion(codigo, (x) => ({ ...x, comoEs }))
      return seguir('Anotado.')
    }

    case 'lugares': {
      // Primero cómo puede ir: si llega mal, se vuelve a mostrar la tarjeta sin guardar nada.
      const formas = await guardarFormas(codigo, r.formas)
      if ('problema' in formas) return deNuevo('Elegí cómo puede ir con los botones.')
      const comoVa =
        formas.elegidas.length === 0
          ? 'No se le van a ofrecer viajes.'
          : `Puede ir ${comoPuedeIr(formas.elegidas)}${formas.elegidas.includes('caminando') ? ` (caminando, solo a lugares a menos de ${KM_CAMINANDO} km)` : ''}.`
      const elegidos = Array.isArray(r.elegidos) ? r.elegidos.slice(0, 50) : []
      const guardados: string[] = []
      for (const e of elegidos) {
        const lugar = buscarEnCatalogo(e?.id)
        if (!lugar || typeof e.vaSolo !== 'boolean') continue
        // Libre solo si el hijo tocó "Va solo"; si no, con permiso (nunca libre por defecto).
        await guardarLugarSugerido(codigo, lugar.id, !e.vaSolo)
        guardados.push(`${lugar.nombre} (${e.vaSolo ? 'va solo' : 'con permiso'})`)
      }
      await marcar(codigo, 'lugares', 'hecho')
      const lugares = guardados.length ? `Guardé ${guardados.length === 1 ? 'un lugar' : `${guardados.length} lugares`}: ${guardados.join(', ')}.` : 'No guardé ningún lugar de la lista.'
      return seguir(`${lugares} ${comoVa}`)
    }

    case 'comercios': {
      const elegidos = Array.isArray(r.elegidos) ? r.elegidos.slice(0, 30) : []
      const guardados: string[] = []
      const problemas: string[] = []
      for (const e of elegidos) {
        if (!e || !esTexto(e.id, 100) || !esTexto(e.pedido) || typeof e.vaSolo !== 'boolean' || typeof e.funciona !== 'boolean') continue
        const resultado = await guardarComercioDeLaTarjeta(codigo, e)
        if ('problema' in resultado) problemas.push(resultado.problema)
        else guardados.push(`${resultado.nombre} (${e.vaSolo ? 'pide solo' : 'con permiso'})`)
      }
      if (problemas.length) return deNuevo(`No pude guardar todo: ${problemas.join('; ')}.`)
      await marcar(codigo, 'comercios', 'hecho')
      return seguir(guardados.length ? `Guardé ${guardados.join(', ')}.` : 'No guardé ningún comercio de la lista.')
    }

    case 'familiares': {
      const yo = quienEscribe(c, mail)
      if (!yo) return deNuevo('No encontré tus datos de familiar.')
      if (!esTexto(r.relacion, 40) || !r.relacion.trim()) return deNuevo('Elegí qué sos de la persona mayor.')
      if (!esTexto(r.telefono, 40) || !r.telefono.trim()) return deNuevo('Falta tu teléfono (el botón de emergencia llama al primer familiar).')
      const mio = await guardarFamiliar(codigo, { nombre: yo.nombre, relacion: r.relacion.trim(), mail: yo.mail, telefono: r.telefono, orden: yo.orden })
      if (mio.startsWith('No se guardó')) return deNuevo(`Tus datos: ${mio.replace(/^No se guardó: /, '').replace(/Pedile al hijo.*$/, 'Revisalo.')}`)
      let delOtro = ''
      const o = r.otro
      if (o && esTexto(o.nombre) && o.nombre.trim()) {
        // Si el que escribe es el primero a quien llamar, el otro es el segundo; si no, va al final.
        const ordenes = ((await leerConfiguracion(codigo))?.familiares ?? []).map((f) => f.orden)
        const otro = await guardarFamiliar(codigo, {
          nombre: o.nombre,
          relacion: esTexto(o.relacion, 40) && o.relacion.trim() ? o.relacion : PENDIENTE,
          mail: esTexto(o.mail) && o.mail.trim() ? o.mail : PENDIENTE,
          telefono: esTexto(o.telefono, 40) && o.telefono.trim() ? o.telefono : PENDIENTE,
          orden: yo.orden === 1 ? 2 : Math.max(...ordenes) + 1,
        })
        if (otro.startsWith('No se guardó')) return deNuevo(`${o.nombre}: ${otro.replace(/^No se guardó: /, '').replace(/Pedile al hijo.*$/, 'Revisalo.')}`)
        delOtro = ` y a ${o.nombre.trim()}`
      }
      return seguir(`Guardé tus datos${delOtro}.`)
    }

    case 'reglas': {
      const { texto, tabla } = await guardarReglas(codigo, c, propuestaDeReglas(c))
      if (!tabla) return deNuevo(texto)
      await marcar(codigo, 'reglas', 'hecho')
      return seguir(`Guardé el nivel ${tabla.nivel}.`)
    }
  }
}

/** Lo mínimo para aceptar lo que llega del navegador (el detalle lo revisa responderTarjeta). */
export function esRespuestaDeTarjeta(dato: unknown): dato is RespuestaDeTarjeta {
  const r = dato as { tipo?: unknown } | null
  return !!r && typeof r === 'object' && ['datos', 'como-es', 'lugares', 'comercios', 'familiares', 'reglas', 'despues', 'seguir'].includes(String(r.tipo))
}
