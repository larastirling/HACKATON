import 'server-only'
import { Redis } from '@upstash/redis'

// ─────────────────────────────────────────────────────────────
// ÚNICO lugar donde se leen y guardan datos.
// /abuelo, /familia y la API de Gmail usan estas funciones.
// ─────────────────────────────────────────────────────────────

/**
 * Configuración de un abuelo.
 * EJEMPLO MÍNIMO: el formato completo se define en la próxima tarea.
 */
export interface ConfiguracionAbuelo {
  codigoFamilia: string
  nombreAbuelo: string
  nombreFamilia: string
}

/** Familia de demo que siempre existe, para probar sin cargar nada. */
export const FAMILIA_DEMO: ConfiguracionAbuelo = {
  codigoFamilia: 'DEMO',
  nombreAbuelo: 'Abuelo Demo',
  nombreFamilia: 'Familia Demo',
}

// ── Almacenamiento ──────────────────────────────────────────
// Si hay base de datos Upstash Redis configurada, se usa.
// Si no, se guarda en memoria (útil en la compu; se borra al reiniciar).

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null
const memoria = new Map<string, unknown>()

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

export async function leerConfiguracion(codigoFamilia: string): Promise<ConfiguracionAbuelo | null> {
  const guardada = await leer<ConfiguracionAbuelo>(claveConfiguracion(codigoFamilia))
  if (guardada) return guardada
  return normalizarCodigo(codigoFamilia) === FAMILIA_DEMO.codigoFamilia ? FAMILIA_DEMO : null
}

export async function guardarConfiguracion(configuracion: ConfiguracionAbuelo): Promise<void> {
  await guardar(claveConfiguracion(configuracion.codigoFamilia), configuracion)
}

// ── Solo para la página /prueba ─────────────────────────────

export async function probarAlmacenamiento(): Promise<string | null> {
  const ahora = new Date().toISOString()
  await guardar('prueba:ultimo', ahora)
  return leer<string>('prueba:ultimo')
}
