import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import type { ConfiguracionAbuelo } from '@/lib/datos'
import { cambiarConfiguracion, mismoNombre } from './guardar'

// Borrar lugares, comercios y familiares charlando. Nunca se borra de una:
//   1. La IA usa proponer_borrar: el sistema busca cuál es y muestra "Sí, borrar" / "No".
//   2. Solo se borra si el hijo confirma (botón, o escribiendo "sí" → herramienta borrar).
// Nunca pueden quedar menos de dos familiares de contacto.

export type QueSeBorra = 'lugar' | 'comercio' | 'familiar'

export interface PedidoBorrar {
  tipo: QueSeBorra
  /** Nombre exacto, tal cual está guardado. */
  nombre: string
  /** Para mostrarle al hijo cuál es (dirección, pedido o parentesco). */
  detalle: string
}

export const MINIMO_FAMILIARES = 2

const TIPOS: QueSeBorra[] = ['lugar', 'comercio', 'familiar']
const ARTICULO: Record<QueSeBorra, string> = { lugar: 'el lugar', comercio: 'el comercio', familiar: 'a' }

export const HERRAMIENTA_PROPONER_BORRAR: Anthropic.Beta.BetaTool = {
  name: 'proponer_borrar',
  description:
    'Cuando el hijo pide sacar o borrar un lugar, comercio o familiar ("sacá la peluquería", "borrá el club"). ' +
    'NO borra nada: busca cuál es y le muestra al hijo los botones "Sí, borrar" y "No". Se borra solo si confirma.',
  input_schema: {
    type: 'object',
    properties: {
      tipo: { type: 'string', enum: TIPOS, description: 'Qué quiere borrar.' },
      nombre: { type: 'string', description: 'Cómo lo nombró el hijo (nombre o apodo), ej. "el club".' },
    },
    required: ['tipo', 'nombre'],
    additionalProperties: false,
  },
  strict: true,
}

export const HERRAMIENTA_BORRAR: Anthropic.Beta.BetaTool = {
  name: 'borrar',
  description:
    'Borra el lugar, comercio o familiar que propusiste con proponer_borrar, SOLO si el hijo acaba de confirmar que sí ' +
    '(tu mensaje anterior tiene que ser la pregunta "¿Seguro?"). Si dijo que no o no contestó eso, no la uses.',
  input_schema: {
    type: 'object',
    properties: {
      tipo: { type: 'string', enum: TIPOS },
      nombre: { type: 'string', description: 'El nombre exacto que mostró proponer_borrar.' },
    },
    required: ['tipo', 'nombre'],
    additionalProperties: false,
  },
  strict: true,
}

const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^(el|la|los|las|lo de|a)\s+/, '')
    .trim()

/** Busca por nombre o apodo (también parecido: "el club" encuentra "Club Biguá"). */
function buscar(configuracion: ConfiguracionAbuelo, tipo: QueSeBorra, nombre: string): PedidoBorrar[] {
  const buscado = normalizar(nombre)
  if (!buscado) return []
  const coincide = (nombres: string[]) =>
    nombres.some((n) => normalizar(n) === buscado) ||
    nombres.some((n) => normalizar(n).includes(buscado) || (buscado.length >= 4 && buscado.includes(normalizar(n))))
  if (tipo === 'lugar') {
    return configuracion.lugares
      .filter((l) => coincide([l.nombre, ...l.apodos]))
      .map((l) => ({ tipo, nombre: l.nombre, detalle: l.direccion }))
  }
  if (tipo === 'comercio') {
    return configuracion.comercios
      .filter((c) => coincide([c.nombre, ...c.apodos]))
      .map((c) => ({ tipo, nombre: c.nombre, detalle: `pide: ${c.pedidoHabitual}` }))
  }
  return configuracion.familiares
    .filter((f) => coincide([f.nombre, f.relacion]))
    .map((f) => ({ tipo, nombre: f.nombre, detalle: `${f.relacion}, ${f.orden}º para llamar` }))
}

/** Ejecuta proponer_borrar: NO borra; si encuentra uno solo, muestra los botones de confirmar. */
export function proponerBorrar(configuracion: ConfiguracionAbuelo, dato: unknown): { texto: string; pedidoBorrar?: PedidoBorrar } {
  const { tipo, nombre } = (dato ?? {}) as { tipo?: unknown; nombre?: unknown }
  if (!TIPOS.includes(tipo as QueSeBorra) || typeof nombre !== 'string') return { texto: 'No se pudo: falta qué borrar.' }
  if (tipo === 'familiar' && configuracion.familiares.length <= MINIMO_FAMILIARES) {
    return {
      texto: `NO se puede borrar: tienen que quedar al menos ${MINIMO_FAMILIARES} familiares de contacto y hay ${configuracion.familiares.length}. Explicáselo con calma; si quiere, puede cambiar los datos de ese familiar o agregar otro primero.`,
    }
  }
  const encontrados = buscar(configuracion, tipo as QueSeBorra, nombre)
  if (encontrados.length === 0) return { texto: `No encontré ningún ${tipo} guardado que se llame "${nombre}". Decíselo y mirá LO QUE YA ESTÁ GUARDADO.` }
  if (encontrados.length > 1) {
    return { texto: `Hay más de uno que coincide: ${encontrados.map((e) => `"${e.nombre}"`).join(', ')}. Preguntale cuál quiere borrar. No se borró nada.` }
  }
  const [pedidoBorrar] = encontrados
  return {
    pedidoBorrar,
    texto:
      `Encontré ${ARTICULO[pedidoBorrar.tipo]} "${pedidoBorrar.nombre}" (${pedidoBorrar.detalle}). NO está borrado. ` +
      'Debajo de tu mensaje el hijo ve los botones "Sí, borrar" y "No". Decile cuál vas a borrar (nombre y ese detalle) y preguntá "¿Seguro?".',
  }
}

/** Borra de verdad. Solo se llama después de que el hijo confirmó. */
export async function borrar(codigoFamilia: string, pedido: Pick<PedidoBorrar, 'tipo' | 'nombre'>): Promise<string> {
  let resultado = ''
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    if (pedido.tipo === 'lugar') {
      const lugares = c.lugares.filter((l) => !mismoNombre(l.nombre, pedido.nombre))
      resultado = lugares.length < c.lugares.length ? `Borrado el lugar "${pedido.nombre}".` : `No encontré el lugar "${pedido.nombre}": no se borró nada.`
      return { ...c, lugares }
    }
    if (pedido.tipo === 'comercio') {
      const comercios = c.comercios.filter((x) => !mismoNombre(x.nombre, pedido.nombre))
      resultado = comercios.length < c.comercios.length ? `Borrado el comercio "${pedido.nombre}".` : `No encontré el comercio "${pedido.nombre}": no se borró nada.`
      return { ...c, comercios }
    }
    if (c.familiares.length <= MINIMO_FAMILIARES) {
      resultado = `No se borró: tienen que quedar al menos ${MINIMO_FAMILIARES} familiares de contacto.`
      return c
    }
    const quedan = c.familiares.filter((f) => !mismoNombre(f.nombre, pedido.nombre))
    if (quedan.length === c.familiares.length) {
      resultado = `No encontré a "${pedido.nombre}": no se borró nada.`
      return c
    }
    // Se vuelve a numerar el orden (1, 2, 3…) para que siempre haya un número 1 al que llamar.
    const familiares = quedan.sort((a, b) => a.orden - b.orden).map((f, i) => ({ ...f, orden: i + 1 }))
    resultado = `Borrado ${pedido.nombre} de los familiares de contacto. Ahora el número 1 para llamar es ${familiares[0].nombre}.`
    return { ...c, familiares }
  })
  return error ?? resultado
}
