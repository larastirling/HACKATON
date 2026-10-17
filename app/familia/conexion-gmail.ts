import 'server-only'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { normalizarCodigo } from '@/lib/datos'

// ─────────────────────────────────────────────────────────────
// PROVISORIO, hasta que Inés suba sus funciones (docs/plan-gmail-oauth.md, secciones 1.2 y 1.3).
// Mismos nombres y mismo tipo que el plan. Cuando estén en GitHub, este archivo queda así:
//   export { type ConexionGmail, guardarConexionGmail, leerConexionGmail, borrarConexionGmail } from '@/lib/datos'
//   export { cifrarPermiso, descifrarPermiso } from '@/lib/gmail'
// Mientras tanto guarda en la memoria de la app: sirve para probar en la compu, NO para Vercel.
// ─────────────────────────────────────────────────────────────

export interface ConexionGmail {
  /** Gmail del abuelo, tal como lo devuelve Google. */
  mailAbuelo: string
  /** Permiso guardable de Google (refresh token). Se guarda CIFRADO, nunca en texto plano. */
  permisoCifrado: string
  /** Cuándo se conectó (fecha ISO, ej. "2026-10-17T21:00:00.000Z"). */
  conectadoEl: string
  /** Desde cuándo buscar mails, en segundos. Al conectar: ahora menos 24 horas. */
  revisarDesde: number
  /** Si la última revisión falló entera (ej. el abuelo sacó el permiso), por qué. Si anduvo bien, no está. */
  ultimoError?: string
}

const global = globalThis as typeof globalThis & { conexionesGmailProvisorias?: Map<string, ConexionGmail> }
const conexiones = (global.conexionesGmailProvisorias ??= new Map<string, ConexionGmail>())

export async function guardarConexionGmail(codigoFamilia: string, conexion: ConexionGmail): Promise<void> {
  conexiones.set(normalizarCodigo(codigoFamilia), conexion)
}

export async function leerConexionGmail(codigoFamilia: string): Promise<ConexionGmail | null> {
  return conexiones.get(normalizarCodigo(codigoFamilia)) ?? null
}

export async function borrarConexionGmail(codigoFamilia: string): Promise<void> {
  conexiones.delete(normalizarCodigo(codigoFamilia))
}

export async function listarFamiliasConGmail(): Promise<string[]> {
  return [...conexiones.keys()]
}

// Cifrado AES-256-GCM con GMAIL_CLAVE_CIFRADO (en la compu sin la variable, una clave de prueba).
function clave(): Buffer {
  const texto = process.env.GMAIL_CLAVE_CIFRADO
  if (texto) return Buffer.from(texto, 'base64')
  if (process.env.NODE_ENV === 'production') throw new Error('Falta la variable de entorno GMAIL_CLAVE_CIFRADO')
  return createHash('sha256').update('clave-solo-para-probar-en-la-compu').digest()
}

export function cifrarPermiso(texto: string): string {
  const iv = randomBytes(12)
  const cifrador = createCipheriv('aes-256-gcm', clave(), iv)
  const cifrado = Buffer.concat([cifrador.update(texto, 'utf8'), cifrador.final()])
  return [iv, cifrador.getAuthTag(), cifrado].map((b) => b.toString('base64url')).join('.')
}

export function descifrarPermiso(texto: string): string {
  const [iv, etiqueta, cifrado] = texto.split('.').map((parte) => Buffer.from(parte, 'base64url'))
  const descifrador = createDecipheriv('aes-256-gcm', clave(), iv)
  descifrador.setAuthTag(etiqueta)
  return Buffer.concat([descifrador.update(cifrado), descifrador.final()]).toString('utf8')
}
