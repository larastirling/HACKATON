import 'server-only'
import { randomBytes, randomInt } from 'node:crypto'
import { Redis } from '@upstash/redis'
import type { Viaje } from './uber'
import type { Pedido } from './whatsapp'

// ─────────────────────────────────────────────────────────────
// ÚNICO lugar donde se leen y guardan datos.
// /abuelo, /familia y la API de Gmail usan estas funciones.
// El formato está explicado en docs/formato-configuracion.md
// ─────────────────────────────────────────────────────────────

/** Marca un dato que todavía falta completar. */
export const PENDIENTE = 'PENDIENTE'
type Pendiente = typeof PENDIENTE

export interface Abuelo {
  nombre: string
  comoLeGustaQueLeHablen: string
  telefono: string
  /** Dónde vive. Se usa, por ejemplo, en los pedidos por WhatsApp. */
  direccion: string
}

export interface Lugar {
  nombre: string
  apodos: string[]
  direccion: string
  latitud: number | Pendiente
  longitud: number | Pendiente
  necesitaPermiso: boolean
}

export interface Comercio {
  nombre: string
  apodos: string[]
  whatsapp: string
  pedidoHabitual: string
}

export interface Familiar {
  nombre: string
  relacion: string
  mail: string
  telefono: string
  /** 1 = se le pregunta primero, 2 = después, etc. */
  orden: number
}

export const NIVELES = ['Independiente', 'Acompañado', 'Cuidado cercano'] as const
export type Nivel = (typeof NIVELES)[number]

/** Reglas que siempre están activas. No se pueden cambiar ni apagar. */
export const REGLAS_FIJAS = Object.freeze([
  'En una emergencia, siempre se ayuda a llamar al 911 y se avisa a la familia.',
  'Nunca se manda ni se transfiere plata.',
  'Si algo parece una estafa, siempre se avisa a la familia.',
  'Nunca se dan consejos médicos: se sugiere hablar con un médico o con la familia.',
] as const)

export interface Reglas {
  nivel: Nivel
  seAvisa: string[]
  seAprueba: string[]
  abueloAceptoAvisos: boolean
  /** Siempre son REGLAS_FIJAS: lo que se guarde acá se ignora. */
  fijas: typeof REGLAS_FIJAS
}

export interface ConfiguracionAbuelo {
  codigoFamilia: string
  abuelo: Abuelo
  lugares: Lugar[]
  comercios: Comercio[]
  familiares: Familiar[]
  reglas: Reglas
}

/** Abuelo de ejemplo que siempre existe, para probar sin cargar nada. */
export const FAMILIA_DEMO: ConfiguracionAbuelo = {
  codigoFamilia: 'DEMO',
  abuelo: {
    nombre: 'Carlos Pérez',
    comoLeGustaQueLeHablen: 'Don Carlos, de usted',
    telefono: '+598 92 158 202',
    direccion: 'Costa Rica 621, Montevideo',
  },
  lugares: [
    {
      nombre: 'Casa de Inés',
      apodos: ['lo de Inés', 'lo de la nena'],
      direccion: 'Av. Sarmiento 2640, Montevideo',
      // Fuente: OpenStreetMap (Nominatim), objeto node 944843090
      latitud: -34.914315,
      longitud: -56.1553672,
      necesitaPermiso: false,
    },
    {
      nombre: 'Casa de Lara',
      apodos: ['lo de Lara', 'lo de la nena'],
      direccion: 'José Ellauri 407, 11300 Montevideo',
      // Fuente: OpenStreetMap (Nominatim), objeto node 944322391
      latitud: -34.9226593,
      longitud: -56.1591087,
      necesitaPermiso: false,
    },
    {
      nombre: 'Montevideo Shopping',
      apodos: ['el shopping'],
      direccion: 'Av. Luis Alberto de Herrera 1290, Buceo, Montevideo',
      // Fuente: OpenStreetMap (Nominatim), objeto way 37684509
      latitud: -34.9030628,
      longitud: -56.1363655,
      necesitaPermiso: true,
    },
  ],
  comercios: [
    {
      nombre: 'Pizzería Don José',
      apodos: ['lo de siempre'],
      whatsapp: '+598 92 625 554',
      pedidoHabitual: 'Una muzzarella grande y una fainá',
    },
  ],
  familiares: [
    { nombre: 'Inés', relacion: 'Hija', mail: 'inesbertolotti06@gmail.com', telefono: '+598 97 412 006', orden: 1 },
    { nombre: 'Lara', relacion: 'Hija', mail: 'larastirlingterra29@gmail.com', telefono: '+598 91 437 402', orden: 2 },
  ],
  reglas: {
    nivel: 'Acompañado',
    seAvisa: ['Cuando sale de su casa hacia un lugar', 'Cuando hace un pedido a un comercio'],
    seAprueba: ['Ir a un lugar que necesita permiso', 'Pedir algo que no es el pedido habitual'],
    abueloAceptoAvisos: true,
    fijas: REGLAS_FIJAS,
  },
}

// ── Almacenamiento ──────────────────────────────────────────
// Si hay base de datos Upstash Redis configurada, se usa.
// Si no, se guarda en memoria (útil en la compu; se borra al reiniciar).

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null
// Guardada en globalThis: Next.js carga este archivo por separado para las páginas y para /api,
// y sin esto cada uno tendría su propia memoria (lo que guarda /familia no lo vería /api/configuracion).
const global = globalThis as typeof globalThis & { memoriaAsistente?: Map<string, unknown> }
const memoria = (global.memoriaAsistente ??= new Map<string, unknown>())

export const modoAlmacenamiento: 'redis' | 'memoria' = redis ? 'redis' : 'memoria'

// leer, guardar y borrar se exportan solo para datos nuevos que viven en otro archivo
// (como la conexión de Gmail, en lib/gmail-datos.ts). La configuración se guarda
// SIEMPRE con guardarConfiguracion, que controla el formato.

export async function leer<T>(clave: string): Promise<T | null> {
  if (redis) return redis.get<T>(clave)
  return (memoria.get(clave) as T | undefined) ?? null
}

export async function guardar(clave: string, valor: unknown): Promise<void> {
  if (redis) await redis.set(clave, valor)
  else memoria.set(clave, valor)
}

export async function borrar(clave: string): Promise<void> {
  if (redis) await redis.del(clave)
  else memoria.delete(clave)
}

/** Todas las claves guardadas que empiezan con `prefijo` (por ejemplo "aprobacion:"). */
async function clavesQueEmpiezanCon(prefijo: string): Promise<string[]> {
  if (!redis) return [...memoria.keys()].filter((clave) => clave.startsWith(prefijo))
  const claves: string[] = []
  let cursor = '0'
  do {
    const [siguiente, lote] = await redis.scan(cursor, { match: `${prefijo}*`, count: 200 })
    cursor = String(siguiente)
    claves.push(...lote)
  } while (cursor !== '0')
  return claves
}

// ── Configuración de cada abuelo ────────────────────────────

const claveConfiguracion = (codigoFamilia: string) => `configuracion:${normalizarCodigo(codigoFamilia)}`

/** "Carlos Pérez" → "Carlos". Para los mensajes. */
export function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0]
}

export function normalizarCodigo(codigo: string): string {
  return codigo.trim().toUpperCase()
}

/**
 * Las reglas fijas siempre se ponen desde el código, nunca desde lo guardado.
 * Si la configuración se guardó antes de que existiera abuelo.direccion, queda como PENDIENTE.
 */
function completarConfiguracion(configuracion: ConfiguracionAbuelo): ConfiguracionAbuelo {
  return {
    ...configuracion,
    abuelo: { ...configuracion.abuelo, direccion: configuracion.abuelo.direccion ?? PENDIENTE },
    reglas: { ...configuracion.reglas, fijas: REGLAS_FIJAS },
  }
}

export async function leerConfiguracion(codigoFamilia: string): Promise<ConfiguracionAbuelo | null> {
  const guardada = await leer<ConfiguracionAbuelo>(claveConfiguracion(codigoFamilia))
  if (guardada) return completarConfiguracion(guardada)
  return normalizarCodigo(codigoFamilia) === FAMILIA_DEMO.codigoFamilia ? FAMILIA_DEMO : null
}

/** Guarda la configuración. Si no respeta el formato, lanza un error con la lista de problemas. */
export async function guardarConfiguracion(configuracion: ConfiguracionAbuelo): Promise<void> {
  const errores = validarConfiguracion(configuracion)
  if (errores.length > 0) {
    throw new Error(`La configuración no respeta el formato:\n- ${errores.join('\n- ')}`)
  }
  const { fijas: _ignoradas, ...reglasEditables } = configuracion.reglas
  const codigo = normalizarCodigo(configuracion.codigoFamilia)
  await guardar(claveConfiguracion(codigo), { ...configuracion, codigoFamilia: codigo, reglas: reglasEditables })
  // Cada familiar con mail puede entrar con su mail a esta familia.
  for (const familiar of configuracion.familiares) {
    if (familiar.mail.includes('@')) await guardar(claveMail(familiar.mail), codigo)
  }
}

// ── Familias por mail (login de los familiares) ─────────────

const claveMail = (mail: string) => `familia-de-mail:${normalizarMail(mail)}`

export function normalizarMail(mail: string): string {
  return mail.trim().toLowerCase()
}

/** La familia donde este mail figura como familiar (también la DEMO), o null. */
export async function buscarFamiliaPorMail(mail: string): Promise<ConfiguracionAbuelo | null> {
  const buscado = normalizarMail(mail)
  const codigos = new Set([await leer<string>(claveMail(buscado)), FAMILIA_DEMO.codigoFamilia].filter((c): c is string => !!c))
  for (const codigo of codigos) {
    const configuracion = await leerConfiguracion(codigo)
    // Se revisa que siga siendo familiar: si le cambiaron el mail, la lista vieja no vale.
    if (configuracion?.familiares.some((f) => normalizarMail(f.mail) === buscado)) return configuracion
  }
  return null
}

const LETRAS_DEL_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin 0/O ni 1/I, que se confunden

/**
 * Crea una familia nueva: quien la crea queda como primer familiar, y lo demás queda PENDIENTE
 * hasta que lo complete charlando en /familia. Devuelve la configuración con su código nuevo.
 */
export async function crearFamilia(familiar: { nombre: string; mail: string }): Promise<ConfiguracionAbuelo> {
  let codigo = ''
  do {
    codigo = Array.from({ length: 6 }, () => LETRAS_DEL_CODIGO.charAt(randomInt(LETRAS_DEL_CODIGO.length))).join('')
  } while (await leerConfiguracion(codigo))

  const configuracion: ConfiguracionAbuelo = {
    codigoFamilia: codigo,
    abuelo: { nombre: PENDIENTE, comoLeGustaQueLeHablen: PENDIENTE, telefono: PENDIENTE, direccion: PENDIENTE },
    lugares: [],
    comercios: [],
    familiares: [{ nombre: familiar.nombre.trim(), relacion: PENDIENTE, mail: normalizarMail(familiar.mail), telefono: PENDIENTE, orden: 1 }],
    reglas: { nivel: 'Acompañado', seAvisa: [], seAprueba: [], abueloAceptoAvisos: false, fijas: REGLAS_FIJAS },
  }
  await guardarConfiguracion(configuracion)
  return configuracion
}

/** Una familia recién creada todavía no tiene el nombre del abuelo. */
export const estaSinConfigurar = (configuracion: ConfiguracionAbuelo) => configuracion.abuelo.nombre === PENDIENTE

// ── Validación del formato ──────────────────────────────────
// Devuelve una lista de problemas en español. Lista vacía = está todo bien.

export function validarConfiguracion(dato: unknown): string[] {
  const errores: string[] = []
  const c = dato as Partial<ConfiguracionAbuelo> | null

  if (!c || typeof c !== 'object') return ['La configuración tiene que ser un objeto']
  if (!esTexto(c.codigoFamilia)) errores.push('Falta "codigoFamilia"')

  if (!c.abuelo || typeof c.abuelo !== 'object') {
    errores.push('Falta "abuelo"')
  } else {
    for (const campo of ['nombre', 'comoLeGustaQueLeHablen', 'telefono', 'direccion'] as const) {
      if (!esTexto(c.abuelo[campo])) errores.push(`Falta "abuelo.${campo}"`)
    }
  }

  revisarLista(c.lugares, 'lugares', errores, (lugar: Partial<Lugar>, donde) => {
    if (!esTexto(lugar.nombre)) errores.push(`Falta "${donde}.nombre"`)
    if (!esListaDeTextos(lugar.apodos)) errores.push(`"${donde}.apodos" tiene que ser una lista de textos`)
    if (!esTexto(lugar.direccion)) errores.push(`Falta "${donde}.direccion"`)
    if (!esCoordenada(lugar.latitud, 90)) errores.push(`"${donde}.latitud" tiene que ser un número o "PENDIENTE"`)
    if (!esCoordenada(lugar.longitud, 180)) errores.push(`"${donde}.longitud" tiene que ser un número o "PENDIENTE"`)
    if (typeof lugar.necesitaPermiso !== 'boolean') errores.push(`"${donde}.necesitaPermiso" tiene que ser true o false`)
  })

  revisarLista(c.comercios, 'comercios', errores, (comercio: Partial<Comercio>, donde) => {
    if (!esTexto(comercio.nombre)) errores.push(`Falta "${donde}.nombre"`)
    if (!esListaDeTextos(comercio.apodos)) errores.push(`"${donde}.apodos" tiene que ser una lista de textos`)
    if (!esTexto(comercio.whatsapp)) errores.push(`Falta "${donde}.whatsapp"`)
    if (!esTexto(comercio.pedidoHabitual)) errores.push(`Falta "${donde}.pedidoHabitual"`)
  })

  revisarLista(c.familiares, 'familiares', errores, (familiar: Partial<Familiar>, donde) => {
    for (const campo of ['nombre', 'relacion', 'mail', 'telefono'] as const) {
      if (!esTexto(familiar[campo])) errores.push(`Falta "${donde}.${campo}"`)
    }
    if (!Number.isInteger(familiar.orden) || (familiar.orden ?? 0) < 1) {
      errores.push(`"${donde}.orden" tiene que ser un número entero desde 1`)
    }
  })
  if (Array.isArray(c.familiares) && c.familiares.length === 0) errores.push('Tiene que haber al menos un familiar')

  if (!c.reglas || typeof c.reglas !== 'object') {
    errores.push('Falta "reglas"')
  } else {
    if (!NIVELES.includes(c.reglas.nivel as Nivel)) errores.push(`"reglas.nivel" tiene que ser: ${NIVELES.join(', ')}`)
    if (!esListaDeTextos(c.reglas.seAvisa)) errores.push('"reglas.seAvisa" tiene que ser una lista de textos')
    if (!esListaDeTextos(c.reglas.seAprueba)) errores.push('"reglas.seAprueba" tiene que ser una lista de textos')
    if (typeof c.reglas.abueloAceptoAvisos !== 'boolean') errores.push('"reglas.abueloAceptoAvisos" tiene que ser true o false')
  }

  return errores
}

function esTexto(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.trim() !== ''
}

function esListaDeTextos(valor: unknown): valor is string[] {
  return Array.isArray(valor) && valor.every(esTexto)
}

function esCoordenada(valor: unknown, maximo: number): boolean {
  return valor === PENDIENTE || (typeof valor === 'number' && Math.abs(valor) <= maximo)
}

function revisarLista<T>(
  lista: unknown,
  nombre: string,
  errores: string[],
  revisar: (elemento: Partial<T>, donde: string) => void,
) {
  if (!Array.isArray(lista)) {
    errores.push(`"${nombre}" tiene que ser una lista`)
    return
  }
  lista.forEach((elemento, i) => {
    const donde = `${nombre}[${i}]`
    if (!elemento || typeof elemento !== 'object') errores.push(`"${donde}" tiene que ser un objeto`)
    else revisar(elemento as Partial<T>, donde)
  })
}

// ── Candados ────────────────────────────────────────────────
// Para que algo pase UNA sola vez aunque dos pedidos lleguen al mismo tiempo
// (por ejemplo: dos respuestas al mismo mail, o un aviso de emergencia cada 10 minutos).

/** Devuelve true solo para el primero que lo pide. Si se pasa `segundos`, se libera solo después. */
export async function tomarCandado(clave: string, segundos?: number): Promise<boolean> {
  if (redis) {
    return (await redis.set(`candado:${clave}`, 1, segundos ? { nx: true, ex: segundos } : { nx: true })) === 'OK'
  }
  const vence = memoria.get(`candado:${clave}`) as number | undefined
  if (vence !== undefined && vence > Date.now()) return false
  memoria.set(`candado:${clave}`, segundos ? Date.now() + segundos * 1000 : Infinity)
  return true
}

export async function soltarCandado(clave: string): Promise<void> {
  if (redis) await redis.del(`candado:${clave}`)
  else memoria.delete(`candado:${clave}`)
}

// ── Pedidos de aprobación a la familia ──────────────────────
// Cuando el abuelo pide algo que necesita permiso, se guarda acá hasta que la familia conteste.
// Se les pregunta a todos los familiares a la vez (ver lib/aprobaciones.ts); cada uno recibe su propio link.

export type EstadoAprobacion = 'esperando' | 'aprobado' | 'rechazado' | 'sin-respuesta'

/** Lo que queda listo para mostrarle al abuelo si la familia aprueba. */
export type QueSePidio = { tipo: 'viaje'; viaje: Viaje } | { tipo: 'pedido'; pedido: Pedido }

export interface PreguntaAFamiliar {
  nombre: string
  mail: string
  enviadoEl: string
  /** Código secreto de SUS links (mail y notificación). */
  token: string
}

export interface PedidoDeAprobacion {
  /** Id para que la pantalla del abuelo consulte el estado. */
  id: string
  codigoFamilia: string
  /** Frase para el mail, por ejemplo "Carlos quiere ir a Montevideo Shopping". */
  descripcion: string
  que: QueSePidio
  creadoEl: string
  estado: EstadoAprobacion
  respondidoEl?: string
  /** Quién aprobó o rechazó. */
  respondidoPor?: string
  /** A quiénes se les preguntó (a todos a la vez). Gana el primero que contesta. */
  preguntadoA: PreguntaAFamiliar[]
  /** Si el abuelo ya vio el resultado (para no mostrárselo de nuevo al volver a abrir la pantalla). */
  avisadoAlAbuelo?: boolean
}

const claveAprobacion = (id: string) => `aprobacion:${id}`
const claveToken = (token: string) => `aprobacion-token:${token}`
const claveUltima = (codigoFamilia: string) => `aprobacion-ultima:${normalizarCodigo(codigoFamilia)}`

export async function crearAprobacion(
  datos: Pick<PedidoDeAprobacion, 'codigoFamilia' | 'descripcion' | 'que'>,
): Promise<PedidoDeAprobacion> {
  const aprobacion: PedidoDeAprobacion = {
    ...datos,
    id: randomBytes(16).toString('hex'),
    creadoEl: new Date().toISOString(),
    estado: 'esperando',
    preguntadoA: [],
  }
  await guardar(claveAprobacion(aprobacion.id), aprobacion)
  await guardar(claveUltima(aprobacion.codigoFamilia), aprobacion.id)
  return aprobacion
}

export async function leerAprobacion(id: string): Promise<PedidoDeAprobacion | null> {
  return leer<PedidoDeAprobacion>(claveAprobacion(id))
}

/** El último pedido de aprobación de la familia (para retomarlo si el abuelo vuelve a abrir la pantalla). */
export async function leerUltimaAprobacion(codigoFamilia: string): Promise<PedidoDeAprobacion | null> {
  const id = await leer<string>(claveUltima(codigoFamilia))
  return id ? leerAprobacion(id) : null
}

/** Busca el pedido por el código de un link (del mail o de la notificación). */
export async function buscarAprobacionPorToken(
  token: string,
): Promise<{ aprobacion: PedidoDeAprobacion; pregunta: PreguntaAFamiliar } | null> {
  const id = await leer<string>(claveToken(token))
  const aprobacion = id ? await leerAprobacion(id) : null
  const pregunta = aprobacion?.preguntadoA.find((p) => p.token === token)
  if (!aprobacion || !pregunta) return null
  return { aprobacion, pregunta }
}

/** Código secreto nuevo para los links de un familiar. Imposible de adivinar. */
export function crearToken(): string {
  return randomBytes(32).toString('base64url')
}

/** Anota que a un familiar ya le llegó la pregunta (por mail y/o notificación), con su código secreto. */
export async function anotarPregunta(id: string, familiar: { nombre: string; mail: string }, token: string): Promise<void> {
  const aprobacion = await leerAprobacion(id)
  if (!aprobacion) return
  aprobacion.preguntadoA.push({ ...familiar, enviadoEl: new Date().toISOString(), token })
  await guardar(claveAprobacion(id), aprobacion)
  await guardar(claveToken(token), id)
}

/**
 * Cierra el pedido: aprobado, rechazado o sin respuesta. Solo cuenta la PRIMERA vez:
 * si tocan el link dos veces, o justo vence el tiempo, no cambia nada.
 */
export async function cerrarAprobacion(
  id: string,
  estado: Exclude<EstadoAprobacion, 'esperando'>,
  respondidoPor?: string,
): Promise<{ aprobacion: PedidoDeAprobacion; cambio: boolean } | null> {
  const aprobacion = await leerAprobacion(id)
  if (!aprobacion) return null
  if (aprobacion.estado !== 'esperando' || !(await tomarCandado(`aprobacion-cierre:${id}`))) {
    return { aprobacion: (await leerAprobacion(id)) ?? aprobacion, cambio: false }
  }
  const cerrada: PedidoDeAprobacion = {
    ...aprobacion,
    estado,
    respondidoEl: new Date().toISOString(),
    ...(respondidoPor && { respondidoPor }),
  }
  await guardar(claveAprobacion(id), cerrada)
  return { aprobacion: cerrada, cambio: true }
}

export async function marcarAvisadoAlAbuelo(id: string): Promise<void> {
  const aprobacion = await leerAprobacion(id)
  if (aprobacion && !aprobacion.avisadoAlAbuelo) await guardar(claveAprobacion(id), { ...aprobacion, avisadoAlAbuelo: true })
}

// ── Avisos en el celular de la familia (Web Push) ───────────
// Cada familiar puede activar los avisos en uno o más celulares (página /avisos).

/** Lo que guarda el navegador al activar los avisos (formato estándar de Web Push). */
export interface SuscripcionPush {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

const claveSuscripciones = (codigoFamilia: string, familiar: string) =>
  `avisos:${normalizarCodigo(codigoFamilia)}:${familiar}`

export async function leerSuscripciones(codigoFamilia: string, familiar: string): Promise<SuscripcionPush[]> {
  return (await leer<SuscripcionPush[]>(claveSuscripciones(codigoFamilia, familiar))) ?? []
}

/** Guarda el celular para ese familiar (y lo saca de los otros familiares, si estaba). */
export async function guardarSuscripcion(
  configuracion: ConfiguracionAbuelo,
  familiar: string,
  suscripcion: SuscripcionPush,
): Promise<void> {
  for (const otro of configuracion.familiares) {
    if (otro.nombre !== familiar) await quitarSuscripcion(configuracion.codigoFamilia, otro.nombre, suscripcion.endpoint)
  }
  const actuales = await leerSuscripciones(configuracion.codigoFamilia, familiar)
  const sinRepetir = actuales.filter((s) => s.endpoint !== suscripcion.endpoint)
  await guardar(claveSuscripciones(configuracion.codigoFamilia, familiar), [...sinRepetir, suscripcion])
}

export async function quitarSuscripcion(codigoFamilia: string, familiar: string, endpoint: string): Promise<void> {
  const actuales = await leerSuscripciones(codigoFamilia, familiar)
  const quedan = actuales.filter((s) => s.endpoint !== endpoint)
  if (quedan.length !== actuales.length) await guardar(claveSuscripciones(codigoFamilia, familiar), quedan)
}

/** ¿De qué familiar es este celular? (null si no tiene los avisos activados). */
export async function buscarFamiliarDelCelular(configuracion: ConfiguracionAbuelo, endpoint: string): Promise<string | null> {
  for (const familiar of configuracion.familiares) {
    const suscripciones = await leerSuscripciones(configuracion.codigoFamilia, familiar.nombre)
    if (suscripciones.some((s) => s.endpoint === endpoint)) return familiar.nombre
  }
  return null
}

// ── Último aviso de emergencia (para la página que abre la notificación) ──

export interface AvisoDeEmergencia {
  loQueDijo: string
  cuando: string
}

const claveEmergencia = (codigoFamilia: string) => `emergencia-ultima:${normalizarCodigo(codigoFamilia)}`

export async function guardarUltimaEmergencia(codigoFamilia: string, loQueDijo: string): Promise<void> {
  await guardar(claveEmergencia(codigoFamilia), { loQueDijo, cuando: new Date().toISOString() } satisfies AvisoDeEmergencia)
}

export async function leerUltimaEmergencia(codigoFamilia: string): Promise<AvisoDeEmergencia | null> {
  return leer<AvisoDeEmergencia>(claveEmergencia(codigoFamilia))
}

// ── Restaurar la familia DEMO (para usar antes de la demo) ──

/**
 * Deja la familia DEMO como al principio: datos originales (FAMILIA_DEMO), los mails de sus familiares
 * apuntando a DEMO, sin pedidos de aprobación pendientes y con el aviso de emergencia listo para salir.
 * No toca los celulares que activaron los avisos.
 */
export async function restaurarFamiliaDemo(): Promise<{ pendientesBorrados: number }> {
  const codigo = FAMILIA_DEMO.codigoFamilia
  // Guarda los datos originales y vuelve a asociar los mails de Inés y Lara a DEMO.
  await guardarConfiguracion(FAMILIA_DEMO)

  let pendientesBorrados = 0
  for (const clave of await clavesQueEmpiezanCon('aprobacion:')) {
    const aprobacion = await leer<PedidoDeAprobacion>(clave)
    if (aprobacion?.codigoFamilia !== codigo || aprobacion.estado !== 'esperando') continue
    for (const pregunta of aprobacion.preguntadoA) await borrar(claveToken(pregunta.token)) // los links dejan de servir
    await borrar(clave)
    pendientesBorrados++
  }
  await borrar(claveUltima(codigo)) // la pantalla del abuelo no retoma nada viejo
  await borrar(claveEmergencia(codigo))
  await soltarCandado(`emergencia:${codigo}`) // el próximo "me siento mal" avisa de nuevo
  return { pendientesBorrados }
}

// ── Solo para la página /prueba ─────────────────────────────

export async function probarAlmacenamiento(): Promise<string | null> {
  const ahora = new Date().toISOString()
  await guardar('prueba:ultimo', ahora)
  return leer<string>('prueba:ultimo')
}
