import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { NIVELES, REGLAS_FIJAS, type ConfiguracionAbuelo, type Nivel } from '@/lib/datos'
import { cambiarConfiguracion, mismoNombre } from './guardar'

// Nivel y reglas. La IA propone; el SERVIDOR arma la tabla con los datos guardados, así lo que
// se muestra es exactamente lo que va a pasar. /abuelo decide los permisos así (lib/ia.ts de Lara):
//   - Viaje: el lugar tiene necesitaPermiso: true  → eso es lo que cambia "lugaresConPermiso".
//   - Comida: el comercio tiene necesitaPermiso: true → eso es lo que cambia "comerciosConPermiso".
//     Además, pedir algo distinto al pedido habitual siempre necesita permiso (regla del sistema).

const IR_CON_PERMISO = 'Ir a un lugar que necesita permiso'
const PEDIDO_DISTINTO = 'Pedir algo que no es el pedido habitual'
const PEDIR_CON_PERMISO = 'Pedir a un comercio que necesita permiso'

/** Lo que ve el hijo: una tabla por grupos. */
export interface TablaReglas {
  nivel: Nivel
  motivo: string
  seAprueba: string[]
  seAvisa: string[]
  libre: string[]
  fijas: string[]
  abueloAceptoAvisos: boolean
  guardada: boolean
}

interface PropuestaReglas {
  nivel: Nivel
  motivo: string
  lugaresConPermiso: string[]
  comerciosConPermiso: string[]
  seAvisa: string[]
  otrasAprobaciones: string[]
}

const propiedades = {
  nivel: { type: 'string', enum: [...NIVELES], description: 'El nivel propuesto.' },
  motivo: {
    type: 'string',
    description:
      'Por qué ese nivel, en UNA frase simple, solo con lo que el hijo contó en ESTA charla (tecnología y plata). ' +
      'Si no contó nada de eso, "Es el nivel que ya tenía". Nunca inventes cómo está la persona mayor.',
  },
  lugaresConPermiso: {
    type: 'array',
    items: { type: 'string' },
    description: 'Nombres EXACTOS de los lugares guardados a los que solo puede ir con permiso de la familia. Los demás quedan libres.',
  },
  comerciosConPermiso: {
    type: 'array',
    items: { type: 'string' },
    description:
      'Nombres EXACTOS de los comercios guardados a los que solo puede pedir con permiso de la familia (cada pedido). A los demás les puede pedir lo de siempre solo.',
  },
  seAvisa: {
    type: 'array',
    items: { type: 'string' },
    description: 'Cosas que se le AVISAN a la familia (no hace falta que contesten), ej. "Cuando sale de su casa hacia un lugar".',
  },
  otrasAprobaciones: {
    type: 'array',
    items: { type: 'string' },
    description:
      'Otras cosas que la familia tiene que aprobar, además de los lugares y comercios con permiso y los pedidos distintos al habitual (esos ya los pone el sistema). Normalmente [].',
  },
} as const

const esquema = {
  type: 'object' as const,
  properties: propiedades,
  required: Object.keys(propiedades),
  additionalProperties: false,
}

export const HERRAMIENTA_MOSTRAR_REGLAS: Anthropic.Beta.BetaTool = {
  name: 'mostrar_reglas',
  description:
    'Le muestra al hijo una tabla con el nivel y las reglas propuestas. NO guarda nada. ' +
    'Usala para proponer y cada vez que el hijo cambie una regla, con la propuesta completa actualizada.',
  input_schema: esquema,
  // Sin strict: Haiku rechaza la charla si hay muchas herramientas strict ("The compiled grammar is too large").
  // Strict queda solo en las que guardan datos; lo que llega por acá lo revisa el servidor igual.
  strict: false,
}

export const HERRAMIENTA_GUARDAR_REGLAS: Anthropic.Beta.BetaTool = {
  name: 'guardar_reglas',
  description:
    'Guarda el nivel y las reglas. Usala SOLO cuando el hijo confirmó que la última tabla que viste está bien, con esa misma propuesta.',
  input_schema: esquema,
  strict: true,
}

function esPropuesta(dato: unknown): dato is PropuestaReglas {
  const d = dato as Partial<PropuestaReglas> | null
  const listaDeTextos = (v: unknown) => Array.isArray(v) && v.every((x) => typeof x === 'string')
  return (
    !!d &&
    NIVELES.includes(d.nivel as Nivel) &&
    typeof d.motivo === 'string' &&
    listaDeTextos(d.lugaresConPermiso) &&
    listaDeTextos(d.comerciosConPermiso) &&
    listaDeTextos(d.seAvisa) &&
    listaDeTextos(d.otrasAprobaciones)
  )
}

const limpiar = (lista: string[], sacar: string[] = []) =>
  [...new Set(lista.map((x) => x.trim()).filter((x) => x && !sacar.some((s) => mismoNombre(s, x))))]

/** Arma la tabla con los datos guardados. Devuelve un texto de error para la IA si algo no cuadra. */
function armar(
  configuracion: ConfiguracionAbuelo,
  dato: unknown,
): { tabla: TablaReglas; conPermiso: Set<string>; comerciosConPermiso: Set<string> } | string {
  if (!esPropuesta(dato)) return 'No se pudo armar la tabla: faltan datos (nivel, motivo, lugares con permiso, avisos y otras aprobaciones).'
  const { lugares, comercios } = configuracion
  const desconocidos = dato.lugaresConPermiso.filter((n) => !lugares.some((l) => mismoNombre(l.nombre, n)))
  if (desconocidos.length > 0) {
    return `No se pudo armar la tabla: estos lugares no están guardados: ${desconocidos.join(', ')}. Usá los nombres exactos de la lista de lugares.`
  }
  const conPermiso = new Set(lugares.filter((l) => dato.lugaresConPermiso.some((n) => mismoNombre(l.nombre, n))).map((l) => l.nombre))
  const comerciosDesconocidos = dato.comerciosConPermiso.filter((n) => !comercios.some((c) => mismoNombre(c.nombre, n)))
  if (comerciosDesconocidos.length > 0) {
    return `No se pudo armar la tabla: estos comercios no están guardados: ${comerciosDesconocidos.join(', ')}. Usá los nombres exactos de la lista de comercios.`
  }
  const comerciosConPermiso = new Set(
    comercios.filter((c) => dato.comerciosConPermiso.some((n) => mismoNombre(c.nombre, n))).map((c) => c.nombre),
  )

  const tabla: TablaReglas = {
    nivel: dato.nivel,
    motivo: dato.motivo.trim(),
    seAprueba: [
      ...lugares.filter((l) => conPermiso.has(l.nombre)).map((l) => `Ir a ${l.nombre}`),
      ...comercios.filter((c) => comerciosConPermiso.has(c.nombre)).map((c) => `Pedir a ${c.nombre}`),
      ...(comercios.length > 0 ? [`${PEDIDO_DISTINTO} (lo decide el sistema)`] : []),
      ...limpiar(dato.otrasAprobaciones, [IR_CON_PERMISO, PEDIDO_DISTINTO, PEDIR_CON_PERMISO]),
    ],
    seAvisa: limpiar(dato.seAvisa),
    libre: [
      ...lugares.filter((l) => !conPermiso.has(l.nombre)).map((l) => `Ir a ${l.nombre}`),
      ...comercios.filter((c) => !comerciosConPermiso.has(c.nombre)).map((c) => `Pedir lo de siempre a ${c.nombre}`),
    ],
    fijas: [...REGLAS_FIJAS],
    abueloAceptoAvisos: configuracion.reglas.abueloAceptoAvisos,
    guardada: false,
  }
  return { tabla, conPermiso, comerciosConPermiso }
}

/** mostrar_reglas: arma la tabla sin guardar. */
export function mostrarReglas(configuracion: ConfiguracionAbuelo, dato: unknown): { texto: string; tabla?: TablaReglas } {
  const armado = armar(configuracion, dato)
  if (typeof armado === 'string') return { texto: armado }
  return {
    tabla: armado.tabla,
    texto:
      'Listo: debajo de tu mensaje el hijo ve la tabla con el nivel y las reglas (NO está guardada). ' +
      'En tu mensaje: decí el nivel y por qué en una frase, y preguntale SOLO si quiere cambiar alguna regla. No repitas la tabla.',
  }
}

/** guardar_reglas: guarda nivel y reglas en el formato de docs/formato-configuracion.md. */
export async function guardarReglas(codigoFamilia: string, configuracion: ConfiguracionAbuelo, dato: unknown): Promise<{ texto: string; tabla?: TablaReglas }> {
  console.log('[familia] la IA pidió guardar_reglas:', JSON.stringify(dato))
  const armado = armar(configuracion, dato)
  if (typeof armado === 'string') return { texto: armado.replace('armar la tabla', 'guardar') }
  const { tabla, conPermiso, comerciosConPermiso } = armado
  const propuesta = dato as PropuestaReglas

  const error = await cambiarConfiguracion(codigoFamilia, (c) => ({
    ...c,
    lugares: c.lugares.map((l) => ({ ...l, necesitaPermiso: conPermiso.has(l.nombre) })),
    comercios: c.comercios.map((x) => ({ ...x, necesitaPermiso: comerciosConPermiso.has(x.nombre) })),
    reglas: {
      ...c.reglas,
      nivel: propuesta.nivel,
      seAvisa: tabla.seAvisa,
      seAprueba: [
        ...(conPermiso.size > 0 ? [IR_CON_PERMISO] : []),
        ...(comerciosConPermiso.size > 0 ? [PEDIR_CON_PERMISO] : []),
        ...(c.comercios.length > 0 ? [PEDIDO_DISTINTO] : []),
        ...limpiar(propuesta.otrasAprobaciones, [IR_CON_PERMISO, PEDIDO_DISTINTO, PEDIR_CON_PERMISO]),
      ],
      // abueloAceptoAvisos no se toca: lo tiene que aceptar el abuelo, no el hijo.
    },
  }))
  if (error) return { texto: error }
  return {
    tabla: { ...tabla, guardada: true },
    texto:
      'Guardado: el nivel y las reglas ya están activos para el asistente del abuelo. Contáselo al hijo en una frase.' +
      (tabla.abueloAceptoAvisos ? '' : ' Contale también que el abuelo todavía tiene que aceptar qué se le avisa a la familia.'),
  }
}
