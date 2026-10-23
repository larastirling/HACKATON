import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { leerConfiguracion, PENDIENTE, type Comercio } from '@/lib/datos'
import {
  cambiarConfiguracion,
  limpiarApodos,
  loDijoElHijo,
  mismoNombre,
  nombreValido,
  normalizarTelefono,
  normalizarTelefonoParaLlamar,
} from './guardar'

// Herramienta "guardar_comercio": comercios a los que la persona mayor les pide cosas.
// /abuelo arma el pedido con el pedido habitual (lib/whatsapp.ts): abre WhatsApp con el mensaje escrito,
// o, si se le pide llamando, le muestra el texto para leer y el botón para llamar.

export const propiedadesDelPermiso = {
  necesitaPermiso: {
    type: 'boolean',
    description:
      'Solo cuenta para comercios NUEVOS: lo que dijo el hijo (true = la familia aprueba cada pedido, false = puede pedir solo). ' +
      'En un comercio que ya existe no cambia nada: los permisos se cambian con mostrar_reglas y guardar_reglas.',
  },
  fraseDelHijo: {
    type: 'string',
    description:
      'Las palabras EXACTAS que escribió el hijo diciendo si puede pedir solo o necesita permiso en este comercio ' +
      '(ej. "puede pedir solo", "que pida permiso"). "" si todavía no lo dijo: un comercio nuevo no se guarda sin eso.',
  },
} as const

export const HERRAMIENTA_GUARDAR_COMERCIO: Anthropic.Beta.BetaTool = {
  name: 'guardar_comercio',
  description:
    'Guarda (o actualiza, si ya existe uno con el mismo nombre) un comercio al que la persona mayor le pide cosas. ' +
    'Usala cuando sepas el nombre, el pedido habitual, cómo se le pide (WhatsApp o llamando) con su número (o que el hijo no lo sabe) ' +
    'y si puede pedir solo o necesita permiso. Solo con datos que dijo el hijo.',
  input_schema: {
    type: 'object',
    properties: {
      nombre: { type: 'string', description: 'Nombre del comercio, ej. "Pizzería Don José".' },
      apodos: {
        type: 'array',
        items: { type: 'string' },
        description: 'Cómo lo llama la persona mayor, tal cual lo dijo el hijo, ej. ["lo de siempre"]. Puede ser [].',
      },
      pedidoPor: {
        type: 'string',
        enum: ['whatsapp', 'llamada'],
        description: '"whatsapp" si se le pide por WhatsApp; "llamada" si solo atiende por teléfono (el hijo lo tiene que haber dicho).',
      },
      numero: {
        type: 'string',
        description:
          'El número de WhatsApp (o el teléfono, si es "llamada") tal cual lo dijo el hijo (ej. "099 123 456"). Si no lo sabe, "PENDIENTE". Nunca lo inventes.',
      },
      pedidoHabitual: {
        type: 'string',
        description: 'Lo que pide siempre, con las palabras del hijo, ej. "Una muzzarella grande y una fainá".',
      },
      ...propiedadesDelPermiso,
    },
    required: ['nombre', 'apodos', 'pedidoPor', 'numero', 'pedidoHabitual', 'necesitaPermiso', 'fraseDelHijo'],
    additionalProperties: false,
  },
  strict: true,
}

interface PedidoGuardarComercio {
  nombre: string
  apodos: string[]
  pedidoPor: 'whatsapp' | 'llamada'
  numero: string
  pedidoHabitual: string
  necesitaPermiso: boolean
  fraseDelHijo: string
}

function esPedidoValido(dato: unknown): dato is PedidoGuardarComercio {
  const d = dato as Partial<PedidoGuardarComercio> | null
  return (
    !!d &&
    typeof d.nombre === 'string' &&
    Array.isArray(d.apodos) &&
    d.apodos.every((a) => typeof a === 'string') &&
    (d.pedidoPor === 'whatsapp' || d.pedidoPor === 'llamada') &&
    typeof d.numero === 'string' &&
    typeof d.pedidoHabitual === 'string' &&
    typeof d.necesitaPermiso === 'boolean' &&
    typeof d.fraseDelHijo === 'string'
  )
}

/** Arma el comercio con su número en el campo que corresponde (WhatsApp o teléfono). */
export function comercioConNumero(
  datos: Pick<Comercio, 'nombre' | 'apodos' | 'pedidoHabitual' | 'necesitaPermiso'>,
  pedidoPor: 'whatsapp' | 'llamada',
  numero: string,
): Comercio {
  return pedidoPor === 'llamada'
    ? { ...datos, pedidoPor, whatsapp: PENDIENTE, telefono: numero }
    : { ...datos, pedidoPor, whatsapp: numero }
}

/**
 * Guarda el comercio en la configuración. Uno NUEVO nunca se guarda (ni libre ni con permiso) sin que el hijo
 * haya dicho cuál de las dos: la frase tiene que estar en lo que escribió. Uno que ya existe mantiene su permiso
 * (eso solo lo cambia guardar_reglas). Devuelve el error en texto para la IA, o cómo quedó.
 */
export async function escribirComercio(
  codigoFamilia: string,
  comercio: Comercio,
  fraseDelHijo: string,
  loQueEscribioElHijo: string[],
): Promise<{ error: string } | { yaExistia: boolean; necesitaPermiso: boolean }> {
  const existente = (await leerConfiguracion(codigoFamilia))?.comercios.find((c) => mismoNombre(c.nombre, comercio.nombre))
  if (!existente && !loDijoElHijo(fraseDelHijo, loQueEscribioElHijo)) {
    return {
      error:
        `Todavía NO se guardó "${comercio.nombre}": falta que el hijo diga si puede pedir solo o necesita permiso. ` +
        'Preguntáselo ahora, en una sola pregunta. Cuando conteste, volvé a usar la herramienta con sus palabras exactas en fraseDelHijo. ' +
        'No digas que ya está guardado.',
    }
  }
  let yaExistia = false
  let necesitaPermiso = comercio.necesitaPermiso
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    const anterior = c.comercios.find((x) => mismoNombre(x.nombre, comercio.nombre))
    yaExistia = !!anterior
    necesitaPermiso = anterior ? anterior.necesitaPermiso : comercio.necesitaPermiso
    const comercios = anterior
      ? c.comercios.map((x) => (x === anterior ? { ...comercio, necesitaPermiso } : x))
      : [...c.comercios, comercio]
    return { ...c, comercios }
  })
  return error ? { error } : { yaExistia, necesitaPermiso }
}

export const textoDelPermiso = (necesitaPermiso: boolean) =>
  necesitaPermiso ? 'con permiso: la familia aprueba cada pedido' : 'como libre: puede pedir lo de siempre solo'

export async function guardarComercio(codigoFamilia: string, dato: unknown, loQueEscribioElHijo: string[]): Promise<string> {
  console.log('[familia] la IA pidió guardar_comercio:', JSON.stringify(dato))
  if (!esPedidoValido(dato)) {
    return 'No se guardó: faltan datos del comercio (nombre, apodos, cómo se le pide, número, pedido habitual y si necesita permiso).'
  }
  if (!nombreValido(dato.nombre)) return 'No se guardó: ese nombre no parece un comercio real. Guardá solo lo que contó el hijo.'

  const pedidoHabitual = dato.pedidoHabitual.trim()
  if (!pedidoHabitual || pedidoHabitual.toUpperCase() === PENDIENTE) {
    return 'No se guardó: falta el pedido habitual (sin eso el asistente no puede armar el pedido). Preguntale al hijo qué pide siempre.'
  }
  const porLlamada = dato.pedidoPor === 'llamada'
  const numero = porLlamada ? normalizarTelefonoParaLlamar(dato.numero) : normalizarTelefono(dato.numero)
  if (!numero) {
    return `No se guardó: no entiendo el número "${dato.numero}". Pedile al hijo que te lo repita (por ejemplo 099 123 456). No lo completes vos.`
  }

  const comercio = comercioConNumero(
    { nombre: dato.nombre.trim(), apodos: limpiarApodos(dato.apodos), pedidoHabitual, necesitaPermiso: dato.necesitaPermiso },
    dato.pedidoPor,
    numero,
  )
  const resultado = await escribirComercio(codigoFamilia, comercio, dato.fraseDelHijo, loQueEscribioElHijo)
  if ('error' in resultado) return resultado.error

  const accion = resultado.yaExistia ? 'Actualizado' : 'Guardado'
  const como = porLlamada ? 'el teléfono' : 'el WhatsApp'
  return numero === PENDIENTE
    ? `${accion} "${comercio.nombre}" sin número, ${textoDelPermiso(resultado.necesitaPermiso)}. Decile que hasta tener ${como} el asistente no le puede armar el pedido, y que lo puede pasar cuando quiera.`
    : `${accion} "${comercio.nombre}" con ${como} ${numero}, el pedido "${pedidoHabitual}" y ${textoDelPermiso(resultado.necesitaPermiso)}. Repetile el número para que confirme que está bien.`
}
