import 'server-only'
import { randomBytes, randomInt } from 'node:crypto'
import { Redis } from '@upstash/redis'
import type { Viaje } from './viajes'
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
  /**
   * Dónde queda la casa en el mapa (para sugerir lugares y comercios cercanos). La pone el sistema al guardar la
   * dirección (lib/mapas.ts) o con un link de Google Maps que pegó el hijo; nunca la IA. Si falta, se busca la dirección.
   */
  ubicacion?: { latitud: number; longitud: number; direccionDelMapa: string; fuente: string }
  /**
   * Si maneja: la matrícula del auto, en mayúsculas y sin espacios ("SBA1234"), para pagar el estacionamiento
   * tarifado por SMS desde /abuelo (lib/estacionamiento.ts). Opcional. El auto tiene que estar registrado en el
   * sistema de estacionamiento de la Intendencia: eso lo hace la familia una vez.
   */
  matricula?: string
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
  /** Cómo se le pide: el abuelo manda el WhatsApp armado, o llama y lee el pedido. Si falta, es por WhatsApp. */
  pedidoPor?: 'whatsapp' | 'llamada'
  /** Para pedir por WhatsApp. En los de llamada queda PENDIENTE. */
  whatsapp: string
  /** Teléfono para llamar (solo en los de llamada). */
  telefono?: string
  pedidoHabitual: string
  /** true si la familia tiene que aprobar cada pedido. Si se guardó sin esto, se toma como true (nunca libre por defecto). */
  necesitaPermiso: boolean
  /**
   * Para los que salieron del catálogo: quién confirmó que el número toma pedidos.
   * "confirmado por la familia" vale solo para ESTA familia (el hijo dijo que ya le pidieron por ahí y funciona).
   */
  confirmacion?: { estado: 'confirmado por su web' | 'confirmado por la familia'; fecha: string; link?: string }
  /** Fecha en que el hijo dijo que el número no anda: hasta que pase otro número, no se le arman pedidos. */
  numeroNoAnda?: string
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

/** Cómo puede ir la persona mayor a los lugares. Lo elige la familia en /familia. */
export const FORMAS_DE_VIAJAR = ['uber', 'caminando', 'colectivo'] as const
export type FormaDeViajar = (typeof FORMAS_DE_VIAJAR)[number]

/** Los pasos para cargar a la persona mayor en /familia (app/familia/pasos.ts). */
export const PASOS = ['datos', 'como-es', 'lugares', 'comercios', 'familiares', 'reglas'] as const
export type Paso = (typeof PASOS)[number]

/** Cómo se maneja con la tecnología y con la plata (lo eligió el hijo con botones; sirve para proponer el nivel). */
export const COMO_SE_MANEJA = {
  tecnologia: ['Se maneja bien', 'Le cuesta un poco', 'Le cuesta mucho'],
  plata: ['La maneja bien', 'A veces se confunde', 'Ya lo estafaron o casi'],
} as const
export interface ComoEs {
  tecnologia: (typeof COMO_SE_MANEJA.tecnologia)[number]
  plata: (typeof COMO_SE_MANEJA.plata)[number]
}

export interface ConfiguracionAbuelo {
  codigoFamilia: string
  abuelo: Abuelo
  lugares: Lugar[]
  comercios: Comercio[]
  familiares: Familiar[]
  reglas: Reglas
  /**
   * Formas de viajar que el asistente puede ofrecer. Si falta (familias de antes), solo Uber.
   * Los permisos no cambian: un lugar "con permiso" se consulta igual, vaya como vaya.
   */
  formasDeViajar?: FormaDeViajar[]
  /** Cómo se maneja la persona mayor (paso 2 de /familia). Si falta, todavía no se contestó. */
  comoEs?: ComoEs
  /** Cómo va la carga en /familia: los pasos terminados y los que el hijo dejó para después. */
  armado?: { hechos: Paso[]; despues: Paso[] }
}

/** Las formas de viajar de la familia (las de antes de que existiera el dato: solo Uber). */
export function formasDeViajarDe(configuracion: Pick<ConfiguracionAbuelo, 'formasDeViajar'>): FormaDeViajar[] {
  return configuracion.formasDeViajar ?? ['uber']
}

/** Abuelo de ejemplo que siempre existe, para probar sin cargar nada. */
export const FAMILIA_DEMO: ConfiguracionAbuelo = {
  codigoFamilia: 'DEMO',
  abuelo: {
    nombre: 'Carlos Pérez',
    comoLeGustaQueLeHablen: 'Don Carlos, de usted',
    telefono: '+598 92 158 202',
    direccion: 'Juan Benito Blanco 780, Montevideo',
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
      necesitaPermiso: false,
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
  formasDeViajar: ['uber', 'caminando', 'colectivo'],
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

async function leer<T>(clave: string): Promise<T | null> {
  if (redis) return redis.get<T>(clave)
  return (memoria.get(clave) as T | undefined) ?? null
}

async function guardar(clave: string, valor: unknown): Promise<void> {
  if (redis) await redis.set(clave, valor)
  else memoria.set(clave, valor)
}

async function borrar(clave: string): Promise<void> {
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
 * Si un comercio se guardó antes de que existiera necesitaPermiso, queda con permiso (nunca libre por defecto).
 */
function completarConfiguracion(configuracion: ConfiguracionAbuelo): ConfiguracionAbuelo {
  return {
    ...configuracion,
    abuelo: { ...configuracion.abuelo, direccion: configuracion.abuelo.direccion ?? PENDIENTE },
    comercios: configuracion.comercios.map((c) => ({ ...c, necesitaPermiso: c.necesitaPermiso ?? true })),
    reglas: { ...configuracion.reglas, fijas: REGLAS_FIJAS },
    formasDeViajar: formasDeViajarDe(configuracion),
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
    const u = c.abuelo.ubicacion
    if (u !== undefined && (!u || !esCoordenadaNumerica(u.latitud, 90) || !esCoordenadaNumerica(u.longitud, 180) || !esTexto(u.direccionDelMapa))) {
      errores.push('"abuelo.ubicacion" tiene que tener latitud, longitud (números) y direccionDelMapa')
    }
    if (c.abuelo.matricula !== undefined && (typeof c.abuelo.matricula !== 'string' || !/^[A-Z0-9]{6,7}$/.test(c.abuelo.matricula))) {
      errores.push('"abuelo.matricula" tiene que ser la matrícula en mayúsculas y sin espacios, ej. "SBA1234"')
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
    if (comercio.pedidoPor !== undefined && comercio.pedidoPor !== 'whatsapp' && comercio.pedidoPor !== 'llamada') {
      errores.push(`"${donde}.pedidoPor" tiene que ser "whatsapp" o "llamada"`)
    }
    if (comercio.pedidoPor === 'llamada' && !esTexto(comercio.telefono)) errores.push(`Falta "${donde}.telefono" (se le pide llamando)`)
    // Si falta, al leer queda con permiso (nunca libre por defecto).
    if (comercio.necesitaPermiso !== undefined && typeof comercio.necesitaPermiso !== 'boolean') {
      errores.push(`"${donde}.necesitaPermiso" tiene que ser true o false`)
    }
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

  if (
    c.formasDeViajar !== undefined &&
    (!Array.isArray(c.formasDeViajar) || !c.formasDeViajar.every((f) => FORMAS_DE_VIAJAR.includes(f)))
  ) {
    errores.push(`"formasDeViajar" tiene que ser una lista con: ${FORMAS_DE_VIAJAR.join(', ')}`)
  }
  if (
    c.comoEs !== undefined &&
    (!c.comoEs || !COMO_SE_MANEJA.tecnologia.includes(c.comoEs.tecnologia) || !COMO_SE_MANEJA.plata.includes(c.comoEs.plata))
  ) {
    errores.push('"comoEs" tiene que tener "tecnologia" y "plata" (de las opciones de COMO_SE_MANEJA)')
  }
  const esListaDePasos = (v: unknown) => Array.isArray(v) && v.every((p) => PASOS.includes(p))
  if (c.armado !== undefined && (!c.armado || !esListaDePasos(c.armado.hechos) || !esListaDePasos(c.armado.despues))) {
    errores.push(`"armado" tiene que tener "hechos" y "despues" (listas con: ${PASOS.join(', ')})`)
  }

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
  return valor === PENDIENTE || esCoordenadaNumerica(valor, maximo)
}

function esCoordenadaNumerica(valor: unknown, maximo: number): boolean {
  return typeof valor === 'number' && Number.isFinite(valor) && Math.abs(valor) <= maximo
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
export type QueSePidio =
  | { tipo: 'viaje'; viaje: Viaje }
  | { tipo: 'pedido'; pedido: Pedido }
  /** Algo fuera de lo común que no se puede armar como viaje ni pedido: si aprueban, solo se le avisa. */
  | { tipo: 'consulta'; texto: string }

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
  /** Dónde estaba el abuelo, si el celular lo pudo saber (botón Ayuda). */
  ubicacion?: Ubicacion
}

export interface Ubicacion {
  latitud: number
  longitud: number
}

const claveEmergencia = (codigoFamilia: string) => `emergencia-ultima:${normalizarCodigo(codigoFamilia)}`

export async function guardarUltimaEmergencia(codigoFamilia: string, loQueDijo: string): Promise<void> {
  await guardar(claveEmergencia(codigoFamilia), { loQueDijo, cuando: new Date().toISOString() } satisfies AvisoDeEmergencia)
}

export async function leerUltimaEmergencia(codigoFamilia: string): Promise<AvisoDeEmergencia | null> {
  return leer<AvisoDeEmergencia>(claveEmergencia(codigoFamilia))
}

/** Le agrega la ubicación al último aviso de emergencia (llega unos segundos después del aviso). */
export async function guardarUbicacionDeEmergencia(codigoFamilia: string, ubicacion: Ubicacion): Promise<void> {
  const aviso = await leerUltimaEmergencia(codigoFamilia)
  await guardar(claveEmergencia(codigoFamilia), {
    loQueDijo: aviso?.loQueDijo ?? 'Pidió ayuda',
    cuando: aviso?.cuando ?? new Date().toISOString(),
    ubicacion,
  } satisfies AvisoDeEmergencia)
}

// ── Diario del día (para el resumen que le llega a la familia a la noche) ──
// Se anota lo que pidió el abuelo y lo que pasó (viajes, pedidos, emergencias, estafas).
// Se guarda por día (hora de Uruguay) y se borra solo a los pocos días.

export const ZONA_HORARIA = 'America/Montevideo'
const DIAS_QUE_SE_GUARDA_EL_DIARIO = 3

export type TipoDeEvento = 'charla' | 'viaje' | 'pedido' | 'permiso' | 'emergencia' | 'ayuda' | 'estafa' | 'plata'

export interface EventoDelDia {
  cuando: string
  tipo: TipoDeEvento
  texto: string
}

/** "2026-10-17" en hora de Uruguay. */
export function fechaDeHoy(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(new Date())
}

const claveDiario = (codigoFamilia: string, fecha: string) => `diario:${fecha}:${normalizarCodigo(codigoFamilia)}`

export async function anotarEnElDiario(codigoFamilia: string, tipo: TipoDeEvento, texto: string): Promise<void> {
  const clave = claveDiario(codigoFamilia, fechaDeHoy())
  const evento: EventoDelDia = { cuando: new Date().toISOString(), tipo, texto: texto.trim().slice(0, 300) }
  try {
    if (redis) {
      await redis.rpush(clave, evento)
      await redis.expire(clave, DIAS_QUE_SE_GUARDA_EL_DIARIO * 86_400)
    } else {
      memoria.set(clave, [...((memoria.get(clave) as EventoDelDia[] | undefined) ?? []), evento])
    }
  } catch (error) {
    console.error('No se pudo anotar en el diario:', error) // el diario nunca rompe lo que está haciendo el abuelo
  }
}

export async function leerDiario(codigoFamilia: string, fecha = fechaDeHoy()): Promise<EventoDelDia[]> {
  const clave = claveDiario(codigoFamilia, fecha)
  if (redis) return redis.lrange<EventoDelDia>(clave, 0, -1)
  return (memoria.get(clave) as EventoDelDia[] | undefined) ?? []
}

/** Los códigos de las familias que tienen algo anotado ese día. */
export async function familiasConDiario(fecha = fechaDeHoy()): Promise<string[]> {
  const prefijo = `diario:${fecha}:`
  return (await clavesQueEmpiezanCon(prefijo)).map((clave) => clave.slice(prefijo.length))
}

// ── Números de comercios que no andan (valen para TODAS las familias) ──
// Cuando un hijo dice que el número de un comercio no anda, ese número deja de sugerirse a todas las familias
// hasta que alguien del equipo lo revise y lo saque de acá (en /prueba, "Números reportados").

export interface NumeroReportado {
  /** El número tal cual lo tiene el comercio, ej. "+598 97 213 707" o "0800 4242". */
  numero: string
  comercio: string
  cuando: string
  codigoFamilia: string
  /** Lo que escribió el hijo. */
  loQueDijo: string
}

const claveNumeroReportado = (numero: string) => `numero-reportado:${numero.replace(/\D/g, '')}`

export async function reportarNumero(reporte: NumeroReportado): Promise<void> {
  await guardar(claveNumeroReportado(reporte.numero), reporte)
}

export async function leerNumerosReportados(): Promise<NumeroReportado[]> {
  const claves = await clavesQueEmpiezanCon('numero-reportado:')
  const reportes = await Promise.all(claves.map((clave) => leer<NumeroReportado>(clave)))
  return reportes.filter((r): r is NumeroReportado => !!r).sort((a, b) => b.cuando.localeCompare(a.cuando))
}

/** Lo revisó alguien del equipo: el número vuelve a sugerirse. */
export async function quitarReporteDeNumero(numero: string): Promise<void> {
  await borrar(claveNumeroReportado(numero))
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
  await soltarCandado(`ubicacion:${codigo}`)
  await soltarCandado(`estafa:${codigo}`)
  await borrar(claveDiario(codigo, fechaDeHoy())) // el resumen de hoy arranca de cero
  return { pendientesBorrados }
}

// ── Solo para la página /prueba ─────────────────────────────

export async function probarAlmacenamiento(): Promise<string | null> {
  const ahora = new Date().toISOString()
  await guardar('prueba:ultimo', ahora)
  return leer<string>('prueba:ultimo')
}
