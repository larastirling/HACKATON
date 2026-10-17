import 'server-only'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

// Todo lo que habla con el Gmail del abuelo (con el permiso de Google de cada familia).
// Plan y nombres: docs/plan-gmail-oauth.md

// ── Cifrado del permiso guardado ────────────────────────────
// El permiso de Google (refresh token) nunca se guarda en texto plano:
// se cifra con GMAIL_CLAVE_CIFRADO (32 bytes al azar, en base64).

const VERSION_CIFRADO = 'v1'

function claveCifrado(): Buffer {
  const valor = process.env.GMAIL_CLAVE_CIFRADO
  if (!valor) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Falta la variable de entorno GMAIL_CLAVE_CIFRADO')
    }
    return createHash('sha256').update('clave-gmail-solo-para-desarrollo').digest()
  }
  const clave = Buffer.from(valor, 'base64')
  if (clave.length !== 32) {
    throw new Error('GMAIL_CLAVE_CIFRADO tiene que ser 32 bytes en base64 (ver docs/plan-gmail-oauth.md)')
  }
  return clave
}

/** Cifra el permiso de Google antes de guardarlo. Devuelve un texto que se puede guardar en la base. */
export function cifrarPermiso(texto: string): string {
  const iv = randomBytes(12)
  const cifrador = createCipheriv('aes-256-gcm', claveCifrado(), iv)
  const datos = Buffer.concat([cifrador.update(texto, 'utf8'), cifrador.final()])
  const sello = cifrador.getAuthTag()
  return [VERSION_CIFRADO, ...[iv, sello, datos].map((parte) => parte.toString('base64url'))].join('.')
}

/** Devuelve el permiso original. Falla si el texto fue cambiado o se cifró con otra clave. */
export function descifrarPermiso(cifrado: string): string {
  const [version, iv, sello, datos] = cifrado.split('.')
  if (version !== VERSION_CIFRADO || !iv || !sello || !datos) {
    throw new Error('El permiso de Gmail guardado no tiene el formato esperado')
  }
  try {
    const descifrador = createDecipheriv('aes-256-gcm', claveCifrado(), Buffer.from(iv, 'base64url'))
    descifrador.setAuthTag(Buffer.from(sello, 'base64url'))
    return Buffer.concat([descifrador.update(Buffer.from(datos, 'base64url')), descifrador.final()]).toString('utf8')
  } catch {
    throw new Error('No se pudo descifrar el permiso de Gmail (¿cambió GMAIL_CLAVE_CIFRADO?): hay que volver a conectar Gmail')
  }
}
