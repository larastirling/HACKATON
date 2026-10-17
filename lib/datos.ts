import 'server-only'
import { Redis } from '@upstash/redis'

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
    { nombre: 'Lara', relacion: 'Hija', mail: 'laristirling29@gmail.com', telefono: '+598 91 437 402', orden: 2 },
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

async function leer<T>(clave: string): Promise<T | null> {
  if (redis) return redis.get<T>(clave)
  return (memoria.get(clave) as T | undefined) ?? null
}

async function guardar(clave: string, valor: unknown): Promise<void> {
  if (redis) await redis.set(clave, valor)
  else memoria.set(clave, valor)
}

// ── Configuración de cada abuelo ────────────────────────────

const claveConfiguracion = (codigoFamilia: string) => `configuracion:${normalizarCodigo(codigoFamilia)}`

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
  await guardar(claveConfiguracion(configuracion.codigoFamilia), {
    ...configuracion,
    codigoFamilia: normalizarCodigo(configuracion.codigoFamilia),
    reglas: reglasEditables,
  })
}

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

// ── Solo para la página /prueba ─────────────────────────────

export async function probarAlmacenamiento(): Promise<string | null> {
  const ahora = new Date().toISOString()
  await guardar('prueba:ultimo', ahora)
  return leer<string>('prueba:ultimo')
}
