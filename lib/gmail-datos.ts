import 'server-only'
import { borrar, guardar, leer, normalizarCodigo, soltarCandado, tomarCandado } from './datos'

// Conexión de Gmail de cada familia: el permiso de Google para revisar los mails del abuelo.
// Guarda y lee con las funciones de lib/datos.ts. Plan y nombres: docs/plan-gmail-oauth.md

export interface ConexionGmail {
  /** Gmail del abuelo, tal como lo devuelve Google. */
  mailAbuelo: string
  /** Permiso guardable de Google (refresh token). Se guarda CIFRADO con cifrarPermiso (lib/gmail.ts). */
  permisoCifrado: string
  /** Cuándo se conectó (fecha ISO, ej. "2026-10-17T21:00:00.000Z"). */
  conectadoEl: string
  /** Desde cuándo buscar mails, en segundos. Al conectar: ahora menos 24 horas. */
  revisarDesde: number
  /** Si la última revisión falló entera (ej. el abuelo sacó el permiso), por qué. Si anduvo bien, no está. */
  ultimoError?: string
}

const claveConexion = (codigoFamilia: string) => `gmail:${normalizarCodigo(codigoFamilia)}`
const CLAVE_FAMILIAS = 'gmail-familias'

/** Guarda la conexión y suma la familia a la lista de familias con Gmail. */
export async function guardarConexionGmail(codigoFamilia: string, conexion: ConexionGmail): Promise<void> {
  if (!conexion.mailAbuelo?.includes('@')) throw new Error('Falta el Gmail del abuelo en la conexión')
  if (!conexion.permisoCifrado) throw new Error('Falta el permiso de Google en la conexión')
  if (!Number.isFinite(conexion.revisarDesde)) throw new Error('"revisarDesde" tiene que ser un número (segundos)')

  const codigo = normalizarCodigo(codigoFamilia)
  await guardar(claveConexion(codigo), conexion)
  await cambiarListaDeFamilias((familias) => (familias.includes(codigo) ? familias : [...familias, codigo]))
}

/** Devuelve la conexión de Gmail de la familia, o null si no conectó. */
export async function leerConexionGmail(codigoFamilia: string): Promise<ConexionGmail | null> {
  return leer<ConexionGmail>(claveConexion(codigoFamilia))
}

/** Borra la conexión y saca la familia de la lista. (Sacar el permiso en Google lo hace quien llama.) */
export async function borrarConexionGmail(codigoFamilia: string): Promise<void> {
  const codigo = normalizarCodigo(codigoFamilia)
  await borrar(claveConexion(codigo))
  await cambiarListaDeFamilias((familias) => familias.filter((c) => c !== codigo))
}

/** Códigos de las familias que tienen Gmail conectado. */
export async function listarFamiliasConGmail(): Promise<string[]> {
  return (await leer<string[]>(CLAVE_FAMILIAS)) ?? []
}

/**
 * Cambia la lista de a uno por vez: si dos familias conectan al mismo tiempo,
 * sin el candado una podría pisar a la otra y quedar fuera de la lista.
 */
async function cambiarListaDeFamilias(cambio: (familias: string[]) => string[]): Promise<void> {
  for (let intento = 0; !(await tomarCandado(CLAVE_FAMILIAS, 10)); intento++) {
    if (intento >= 50) throw new Error('No se pudo actualizar la lista de familias con Gmail: probá de nuevo')
    await new Promise((listo) => setTimeout(listo, 100))
  }
  try {
    await guardar(CLAVE_FAMILIAS, cambio(await listarFamiliasConGmail()))
  } finally {
    await soltarCandado(CLAVE_FAMILIAS)
  }
}
