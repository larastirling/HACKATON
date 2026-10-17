// Ayudas de texto que usan tanto el servidor como la pantalla.

/** ["Inés", "Lara"] → "Inés y a Lara" (para "le pregunté a ..."). */
export function juntarNombres(nombres: string[]): string {
  return nombres.join(' y a ')
}
