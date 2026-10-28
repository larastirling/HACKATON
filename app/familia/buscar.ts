// El buscador de "Ver todos los cercanos" (lugares y comercios), en el navegador: filtra al instante mientras el hijo
// escribe, sin la IA ni el servidor. Busca en el nombre, el tipo, el barrio, la dirección y el tipo de comida,
// sin importar tildes ni mayúsculas, y entiende palabras comunes ("súper", "remedios", "pagar cuentas", "médico").

export interface Buscable {
  nombre: string
  tipo: string
  direccion: string
  barrio?: string
  /** Comercios y lugares de comida: lo que tienen según su fuente o el mapa ("pizza", "empanadas"). */
  comida?: string[]
}

export const sinTildes = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Los botones de categoría: cada uno filtra por esos tipos (los del catálogo de lugares y los de comercios). */
export const CATEGORIAS: { nombre: string; tipos: string[] }[] = [
  { nombre: 'Salud', tipos: ['Salud'] },
  { nombre: 'Farmacias', tipos: ['Farmacia'] },
  { nombre: 'Súper', tipos: ['Supermercado'] },
  { nombre: 'Pagos', tipos: ['Pagos'] },
  { nombre: 'Bancos', tipos: ['Banco'] },
  { nombre: 'Plazas', tipos: ['Plaza'] },
  { nombre: 'Comida', tipos: ['Restaurante'] },
  { nombre: 'Trámites', tipos: ['Trámites', 'Correo'] },
  { nombre: 'Iglesias', tipos: ['Iglesia'] },
  { nombre: 'Clubes', tipos: ['Club', 'Centro de jubilados'] },
  { nombre: 'Cafés', tipos: ['Café'] },
  { nombre: 'Cine y teatro', tipos: ['Cine', 'Teatro'] },
  { nombre: 'Bibliotecas', tipos: ['Biblioteca'] },
  { nombre: 'Shoppings', tipos: ['Shopping'] },
  { nombre: 'Paseos', tipos: ['Mercado', 'Paseo', 'Cementerio'] },
]

/** Los que se ven primero; el resto, con "Más tipos…". */
export const CATEGORIAS_PRINCIPALES = ['Salud', 'Farmacias', 'Súper', 'Pagos', 'Bancos', 'Plazas', 'Comida']

/**
 * Palabras comunes y lo que quieren decir: tipos de lugar o de comida. Primero se buscan las frases de varias palabras
 * ("pagar cuentas"); cada palabra se compara sin tildes y sin la "s" del plural.
 */
const SINONIMOS: { palabras: string[]; tipos?: string[]; comida?: string[] }[] = [
  { palabras: ['pagar cuentas', 'pagar las cuentas', 'pagar facturas', 'pagar', 'cuenta', 'factura', 'pago', 'cobrar', 'giro'], tipos: ['Pagos'] },
  { palabras: ['super', 'supermercado', 'mercadito', 'almacen', 'autoservicio', 'compra'], tipos: ['Supermercado'] },
  { palabras: ['remedio', 'farmacia', 'medicamento', 'pastilla', 'receta'], tipos: ['Farmacia'] },
  {
    palabras: ['medico', 'mutualista', 'mutual', 'doctor', 'hospital', 'sanatorio', 'salud', 'policlinica', 'emergencia', 'consulta', 'clinica'],
    tipos: ['Salud'],
  },
  { palabras: ['banco', 'cajero', 'plata'], tipos: ['Banco'] },
  { palabras: ['plaza', 'parque', 'caminar', 'pasear'], tipos: ['Plaza'] },
  { palabras: ['tramite', 'oficina', 'jubilacion'], tipos: ['Trámites'] },
  { palabras: ['correo', 'carta', 'encomienda', 'paquete'], tipos: ['Correo'] },
  { palabras: ['iglesia', 'misa', 'parroquia', 'capilla', 'templo', 'rezar'], tipos: ['Iglesia'] },
  { palabras: ['jubilado', 'abuelo', 'tercera edad', 'adulto mayor'], tipos: ['Centro de jubilados'] },
  { palabras: ['club', 'social', 'deporte'], tipos: ['Club', 'Centro de jubilados'] },
  { palabras: ['biblioteca', 'libro', 'leer'], tipos: ['Biblioteca'] },
  { palabras: ['cine', 'pelicula'], tipos: ['Cine'] },
  { palabras: ['teatro', 'obra', 'espectaculo'], tipos: ['Teatro'] },
  { palabras: ['cafe', 'bar', 'confiteria', 'cafeteria'], tipos: ['Café'] },
  { palabras: ['shopping', 'centro comercial'], tipos: ['Shopping'] },
  { palabras: ['mercado', 'feria'], tipos: ['Mercado'] },
  { palabras: ['cementerio'], tipos: ['Cementerio'] },
  { palabras: ['comida', 'comer', 'restaurante', 'delivery', 'pedir comida'], tipos: ['Restaurante'] },
  { palabras: ['pizza', 'pizzeria', 'muzza', 'faina'], comida: ['pizza'] },
  { palabras: ['hamburguesa', 'burger', 'hamburgueseria'], comida: ['hamburguesas'] },
  { palabras: ['empanada'], comida: ['empanadas'] },
  { palabras: ['chivito'], comida: ['chivitos'] },
  { palabras: ['helado', 'heladeria'], comida: ['helados'] },
  { palabras: ['milanesa'], comida: ['milanesas'] },
  { palabras: ['pasta', 'fideo', 'ravioles', 'noquis'], comida: ['pastas'] },
  { palabras: ['sushi'], comida: ['sushi'] },
  { palabras: ['parrilla', 'asado', 'carne', 'churrasco'], comida: ['parrilla'] },
  { palabras: ['pollo'], comida: ['pollo'] },
  { palabras: ['pescado', 'marisco'], comida: ['pescado'] },
  { palabras: ['sandwich', 'sanguche'], comida: ['sándwiches'] },
  { palabras: ['vegetariano', 'vegano'], comida: ['vegetariana'] },
]

/** Palabras que no ayudan a buscar ("una farmacia en la rambla"). */
const SIN_SENTIDO = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'en', 'a', 'al', 'y', 'un', 'una', 'para', 'por', 'con', 'que', 'donde', 'quiero', 'cerca', 'me'])

/** Sin la "s" del plural: "farmacias" → "farmacia", "cines" → "cine", "hospitales" → "hospitale" (ver igual y esta). */
const singular = (palabra: string) => (palabra.length > 3 && palabra.endsWith('s') ? palabra.slice(0, -1) : palabra)

/** "hospitale" (de "hospitales") es "hospital". */
const igual = (escrita: string, conocida: string) => escrita === conocida || escrita === `${conocida}e`

const SINONIMOS_NORMALIZADOS = SINONIMOS.map((s) => ({ ...s, palabras: s.palabras.map((p) => sinTildes(p).split(' ').map(singular).join(' ')) }))

/** Lo que entendió de lo que escribió: palabras sueltas y grupos de sinónimos (cada uno tiene que coincidir). */
interface Consulta {
  palabras: string[]
  significados: { tipos?: string[]; comida?: string[]; palabra: string }[]
}

export function entender(texto: string): Consulta {
  let palabras = sinTildes(texto)
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .split(/\s+/)
    .filter((p) => p && !SIN_SENTIDO.has(p))
    .map(singular)
  const significados: Consulta['significados'] = []
  // Primero las frases más largas ("pagar cuentas" antes que "pagar").
  const frases = SINONIMOS_NORMALIZADOS.flatMap((s) => s.palabras.map((p) => ({ frase: p.split(' '), s }))).sort((a, b) => b.frase.length - a.frase.length)
  for (const { frase, s } of frases) {
    for (let i = 0; i + frase.length <= palabras.length; i++) {
      if (frase.every((p, j) => igual(palabras[i + j], p))) {
        significados.push({ tipos: s.tipos, comida: s.comida, palabra: frase.join(' ') })
        palabras = [...palabras.slice(0, i), ...palabras.slice(i + frase.length)]
        i--
      }
    }
  }
  return { palabras, significados }
}

/** El texto donde se busca, sin tildes. */
const textoDe = (x: Buscable) => sinTildes([x.nombre, x.tipo, x.barrio, x.direccion, ...(x.comida ?? [])].filter(Boolean).join(' '))

/** "bar" está en "bar facal" y en "bares", pero no en "barrio". */
const palabraEntera = (texto: string, palabra: string) => new RegExp(`(^|[^a-z0-9ñ])${palabra}(s|es)?($|[^a-z0-9ñ])`).test(texto)

/** Si coincide con lo que escribió: cada palabra tiene que estar (en el texto, o por lo que significa). */
export function coincide(x: Buscable, consulta: Consulta): boolean {
  const texto = textoDe(x)
  const esta = (palabra: string) => texto.includes(palabra) || (palabra.endsWith('e') && texto.includes(palabra.slice(0, -1)))
  return (
    consulta.palabras.every(esta) &&
    consulta.significados.every(
      (s) =>
        (s.tipos?.includes(x.tipo) ?? false) ||
        (s.comida?.some((c) => x.comida?.includes(c)) ?? false) ||
        // Si la palabra está escrita en el lugar ("Pizza Subte", "Bar Facal"), también vale: entera o en plural
        // (así "comer" no trae los de "La Comercial").
        palabraEntera(texto, s.palabra),
    )
  )
}

/** Filtra la lista (que ya viene del más cerca al más lejos) por lo escrito y por el botón de categoría. */
export function filtrar<T extends Buscable>(lista: readonly T[], texto: string, categoria: string | null): T[] {
  const consulta = entender(texto)
  const tipos = CATEGORIAS.find((c) => c.nombre === categoria)?.tipos
  return lista.filter((x) => (!tipos || tipos.includes(x.tipo)) && coincide(x, consulta))
}

/** Los botones de categoría que tienen algo en esta lista. */
export const categoriasDe = (lista: readonly Buscable[]) => CATEGORIAS.filter((c) => lista.some((x) => c.tipos.includes(x.tipo)))
