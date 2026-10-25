// El trato que eligió la familia ("de usted" o "de vos") se respeta SIEMPRE, también en las emergencias.
// Las instrucciones de la IA lo dicen; además, si la respuesta se le escapa al otro trato, el servidor le pide que la
// reescriba (lib/ia.ts). Acá está cómo se detecta: palabras que solo se usan con el otro trato.

export type Trato = 'usted' | 'vos'

/** "Don Carlos, de usted" → "usted". null si no se sabe. */
export function tratoDe(comoLeGustaQueLeHablen: string): Trato | null {
  const m = comoLeGustaQueLeHablen.match(/(?<![\p{L}])de (usted|vos)(?![\p{L}])/iu)
  return m ? (m[1].toLowerCase() as Trato) : null
}

/** Busca palabras enteras sin importar mayúsculas (con tildes: \b no las entiende). */
function palabras(lista: string[]): RegExp {
  return new RegExp(`(?<![\\p{L}])(${lista.join('|')})(?![\\p{L}])`, 'giu')
}

/**
 * Si se le habla de usted, estas no van: el voseo ("tocá", "salí", "tenés") y el tuteo ("enciende", "tienes", "te").
 * Solo palabras que no se confunden con otra cosa (por ejemplo, no "llama": "¿cómo se llama?").
 */
const NO_VAN_DE_USTED = palabras([
  // voseo
  'tocá', 'salí', 'llamá', 'apretá', 'mirá', 'fijate', 'decime', 'andá', 'abrí', 'prendé', 'apagá', 'esperá', 'probá',
  'escribí', 'contame', 'quedate', 'tranquilizate', 'tenés', 'podés', 'querés', 'sabés', 'estás', 'sentís', 'vos',
  // tuteo
  'enciende', 'tienes', 'puedes', 'quieres', 'sabes', 'sientes', 'dime', 'cuéntame', 'quédate', 'fíjate',
  // pronombres de tú y vos ("contigo" no: es el nombre de la app)
  'te', 'tu', 'tus',
])

/**
 * Si se le habla de vos, estas no van (son de usted). Sin las que también son subjuntivo y aparecen en frases correctas
 * de vos ("cuando se abra el mapa", "que no se apague", "que salga el colectivo", "un toque"): solo las inconfundibles.
 */
const NO_VAN_DE_VOS = palabras([
  'usted', 'fíjese', 'dígame', 'cuénteme', 'quédese', 'llámeme', 'tranquilícese', 'avíseme', 'escríbame', 'tóquelo', 'ábralo', 'pruébelo',
])

/** Las palabras de la respuesta que son del otro trato (vacío si está bien). */
export function palabrasDelOtroTrato(texto: string, trato: Trato): string[] {
  const patron = trato === 'usted' ? NO_VAN_DE_USTED : NO_VAN_DE_VOS
  return [...new Set([...texto.matchAll(patron)].map((m) => m[0].toLowerCase()))]
}

/** Las instrucciones del trato, para la IA (con ejemplos de las dos formas). */
export function instruccionesDelTrato(trato: Trato | null, comoLeGustaQueLeHablen: string): string {
  if (trato === 'usted') {
    return `Hablale SIEMPRE de usted (${comoLeGustaQueLeHablen}), en cada frase, también en las emergencias y cuando hay apuro: "toque", "salga", "no encienda", "llame", "quédese tranquilo", "le", "su". Nunca "tocá", "salí", "enciende", "tenés", "te" ni "tu".`
  }
  if (trato === 'vos') {
    return `Hablale SIEMPRE de vos (${comoLeGustaQueLeHablen}), en cada frase, también en las emergencias y cuando hay apuro: "tocá", "salí", "no prendas", "llamá", "quedate tranquilo", "te", "tu". Nunca "usted", "toque", "salga" ni "quédese".`
  }
  return `Tratalo así: ${comoLeGustaQueLeHablen}.`
}
