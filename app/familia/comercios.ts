import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { PENDIENTE, type Comercio } from '@/lib/datos'
import { cambiarConfiguracion, limpiarApodos, mismoNombre, nombreValido, normalizarTelefono } from './guardar'

// Herramienta "guardar_comercio": comercios a los que la persona mayor les pide cosas.
// /abuelo usa el WhatsApp y el pedido habitual para abrir WhatsApp con el pedido escrito (lib/whatsapp.ts).

export const HERRAMIENTA_GUARDAR_COMERCIO: Anthropic.Beta.BetaTool = {
  name: 'guardar_comercio',
  description:
    'Guarda (o actualiza, si ya existe uno con el mismo nombre) un comercio al que la persona mayor le pide cosas. ' +
    'Usala cuando sepas el nombre, el pedido habitual y el WhatsApp (o que el hijo no lo sabe). Solo con datos que dijo el hijo.',
  input_schema: {
    type: 'object',
    properties: {
      nombre: { type: 'string', description: 'Nombre del comercio, ej. "Pizzería Don José".' },
      apodos: {
        type: 'array',
        items: { type: 'string' },
        description: 'Cómo lo llama la persona mayor, tal cual lo dijo el hijo, ej. ["lo de siempre"]. Puede ser [].',
      },
      whatsapp: {
        type: 'string',
        description: 'El número de WhatsApp tal cual lo dijo el hijo (ej. "099 123 456"). Si no lo sabe, "PENDIENTE". Nunca lo inventes.',
      },
      pedidoHabitual: {
        type: 'string',
        description: 'Lo que pide siempre, con las palabras del hijo, ej. "Una muzzarella grande y una fainá".',
      },
    },
    required: ['nombre', 'apodos', 'whatsapp', 'pedidoHabitual'],
    additionalProperties: false,
  },
  strict: true,
}

interface PedidoGuardarComercio {
  nombre: string
  apodos: string[]
  whatsapp: string
  pedidoHabitual: string
}

function esPedidoValido(dato: unknown): dato is PedidoGuardarComercio {
  const d = dato as Partial<PedidoGuardarComercio> | null
  return (
    !!d &&
    typeof d.nombre === 'string' &&
    Array.isArray(d.apodos) &&
    d.apodos.every((a) => typeof a === 'string') &&
    typeof d.whatsapp === 'string' &&
    typeof d.pedidoHabitual === 'string'
  )
}

export async function guardarComercio(codigoFamilia: string, dato: unknown): Promise<string> {
  console.log('[familia] la IA pidió guardar_comercio:', JSON.stringify(dato))
  if (!esPedidoValido(dato)) return 'No se guardó: faltan datos del comercio (nombre, apodos, WhatsApp y pedido habitual).'
  if (!nombreValido(dato.nombre)) return 'No se guardó: ese nombre no parece un comercio real. Guardá solo lo que contó el hijo.'

  const pedidoHabitual = dato.pedidoHabitual.trim()
  if (!pedidoHabitual || pedidoHabitual.toUpperCase() === PENDIENTE) {
    return 'No se guardó: falta el pedido habitual (sin eso el asistente no puede escribir el pedido). Preguntale al hijo qué pide siempre.'
  }
  const whatsapp = normalizarTelefono(dato.whatsapp)
  if (!whatsapp) {
    return `No se guardó: no entiendo el número "${dato.whatsapp}". Pedile al hijo que te lo repita (por ejemplo 099 123 456). No lo completes vos.`
  }

  const comercio: Comercio = {
    nombre: dato.nombre.trim(),
    apodos: limpiarApodos(dato.apodos),
    whatsapp,
    pedidoHabitual,
  }
  let yaExistia = false
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    yaExistia = c.comercios.some((x) => mismoNombre(x.nombre, comercio.nombre))
    const comercios = yaExistia
      ? c.comercios.map((x) => (mismoNombre(x.nombre, comercio.nombre) ? comercio : x))
      : [...c.comercios, comercio]
    return { ...c, comercios }
  })
  if (error) return error

  const accion = yaExistia ? 'Actualizado' : 'Guardado'
  return whatsapp === PENDIENTE
    ? `${accion} "${comercio.nombre}" sin WhatsApp. Decile que hasta tener el número el asistente no le puede armar el pedido, y que lo puede pasar cuando quiera.`
    : `${accion} "${comercio.nombre}" con el WhatsApp ${whatsapp} y el pedido "${pedidoHabitual}". Repetile el número para que confirme que está bien.`
}
