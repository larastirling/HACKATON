import 'server-only'
import { guardarConfiguracion, leerConfiguracion, PENDIENTE, type ConfiguracionAbuelo } from '@/lib/datos'

// Lo que comparten las herramientas de /familia (lugares, comercios, familiares).

export const mismoNombre = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** Lee la configuración, aplica el cambio y la guarda. Devuelve un error en texto para la IA, o null si salió bien. */
export async function cambiarConfiguracion(
  codigoFamilia: string,
  cambio: (configuracion: ConfiguracionAbuelo) => ConfiguracionAbuelo,
): Promise<string | null> {
  const configuracion = await leerConfiguracion(codigoFamilia)
  if (!configuracion) return 'No se guardó: no encontré la configuración de esta familia.'
  try {
    await guardarConfiguracion(cambio(configuracion))
    return null
  } catch (error) {
    console.error('[familia] no se pudo guardar:', error)
    return 'No se pudo guardar por un error del sistema. Decile al hijo que lo intente de nuevo en un ratito.'
  }
}

/**
 * Pasa un teléfono uruguayo al formato guardado ("+598 9X XXX XXX" o "+598 2XXX XXXX").
 * Solo cambia la forma de escribirlo, nunca los números. Devuelve null si no se entiende
 * (para que la IA le pregunte al hijo) y PENDIENTE si el hijo no lo sabe.
 */
export function normalizarTelefono(texto: string): string | null {
  if (texto.trim() === '' || texto.trim().toUpperCase() === PENDIENTE) return PENDIENTE
  const conMas = texto.trim().startsWith('+')
  let digitos = texto.replace(/\D/g, '')

  if (conMas && !digitos.startsWith('598')) return digitos.length >= 8 ? `+${digitos}` : null // otro país: tal cual
  if (digitos.startsWith('598')) digitos = digitos.slice(3)
  if (digitos.length === 9 && digitos.startsWith('09')) digitos = digitos.slice(1)

  if (digitos.length === 8 && digitos.startsWith('9')) {
    return `+598 ${digitos.slice(0, 2)} ${digitos.slice(2, 5)} ${digitos.slice(5)}` // celular
  }
  if (digitos.length === 8 && /^[24]/.test(digitos)) {
    return `+598 ${digitos.slice(0, 4)} ${digitos.slice(4)}` // fijo
  }
  return null
}

/** Mail en minúsculas, PENDIENTE si no lo sabe, o null si no parece un mail. */
export function normalizarMail(texto: string): string | null {
  const limpio = texto.trim().toLowerCase()
  if (limpio === '' || limpio === PENDIENTE.toLowerCase()) return PENDIENTE
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpio) ? limpio : null
}

/**
 * Teléfono para llamar: como normalizarTelefono, pero también acepta los 0800 ("0800 4242").
 * Devuelve null si no se entiende y PENDIENTE si el hijo no lo sabe.
 */
export function normalizarTelefonoParaLlamar(texto: string): string | null {
  const digitos = texto.replace(/\D/g, '')
  if (/^0800\d{4}$/.test(digitos)) return `0800 ${digitos.slice(4)}`
  return normalizarTelefono(texto)
}

/** Minúsculas, sin tildes ni signos, espacios simples: para comparar lo que escribió el hijo. */
const comparable = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

/**
 * La frase del permiso (si va o pide solo, o necesita permiso) tiene que estar de verdad en algo
 * que escribió el hijo, para que la IA no la invente. Lo usan los lugares y los comercios.
 */
export function loDijoElHijo(frase: string, loQueEscribioElHijo: string[]): boolean {
  const buscada = comparable(frase)
  // Tiene que hablar de hacerlo solo o con permiso (no vale una palabra suelta como "papá").
  const hablaDelPermiso = /\b(sol[oa]s?|permiso|libre|avis\w*|pregunt\w*|aprob\w*|acompa\w*|autoriz\w*)\b/.test(buscada)
  return hablaDelPermiso && loQueEscribioElHijo.some((mensaje) => comparable(mensaje).includes(buscada))
}

export const limpiarApodos =(apodos: string[]) => [...new Set(apodos.map((a) => a.trim()).filter(Boolean))]

/** Rechaza nombres que no parecen reales (ej. "x"), para que la IA no guarde datos de prueba. */
export const nombreValido = (nombre: string) => nombre.replace(/[^\p{L}]/gu, '').length >= 2
