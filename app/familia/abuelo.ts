import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { PENDIENTE, type Abuelo } from '@/lib/datos'
import { dondeVive } from './distancia'
import { cambiarConfiguracion, nombreValido, normalizarTelefono } from './guardar'

// Herramienta "guardar_abuelo": los datos de la persona mayor (sección 2 de docs/formato-configuracion.md).
// Un campo en "" = no cambiarlo, así la IA puede guardar de a un dato.

export const HERRAMIENTA_GUARDAR_ABUELO: Anthropic.Beta.BetaTool = {
  name: 'guardar_abuelo',
  description:
    'Guarda los datos de la persona mayor. Usala cada vez que el hijo te diga uno. ' +
    'Cada campo: el dato tal cual lo dijo el hijo, "PENDIENTE" si dijo que no lo sabe, o "" para no cambiar lo que ya está guardado.',
  input_schema: {
    type: 'object',
    properties: {
      nombre: { type: 'string', description: 'Nombre y apellido, ej. "Carlos Pérez".' },
      comoLeGustaQueLeHablen: {
        type: 'string',
        description: 'El nombre que usa y si de "vos" o de "usted", ej. "Don Carlos, de usted".',
      },
      telefono: { type: 'string', description: 'Su teléfono tal cual lo dijo el hijo. Nunca lo inventes.' },
      direccion: { type: 'string', description: 'Dónde vive: calle, número y barrio o ciudad, tal cual lo dijo el hijo. Nunca la inventes.' },
    },
    required: ['nombre', 'comoLeGustaQueLeHablen', 'telefono', 'direccion'],
    additionalProperties: false,
  },
  strict: true,
}

type PedidoGuardarAbuelo = Record<keyof Abuelo, string>

function esPedidoValido(dato: unknown): dato is PedidoGuardarAbuelo {
  const d = dato as Partial<PedidoGuardarAbuelo> | null
  return !!d && (['nombre', 'comoLeGustaQueLeHablen', 'telefono', 'direccion'] as const).every((campo) => typeof d[campo] === 'string')
}

export async function guardarAbuelo(codigoFamilia: string, dato: unknown): Promise<string> {
  console.log('[familia] la IA pidió guardar_abuelo:', JSON.stringify(dato))
  if (!esPedidoValido(dato)) return 'No se guardó: faltan campos (nombre, cómo le gusta que le hablen, teléfono y dirección; "" para no cambiar).'

  const cambios: Partial<Abuelo> = {}
  const nombre = dato.nombre.trim()
  if (nombre) {
    if (nombre !== PENDIENTE && !nombreValido(nombre)) return 'No se guardó: ese nombre no parece real. Preguntale al hijo cómo se llama.'
    cambios.nombre = nombre
  }
  if (dato.comoLeGustaQueLeHablen.trim()) cambios.comoLeGustaQueLeHablen = dato.comoLeGustaQueLeHablen.trim()
  if (dato.telefono.trim()) {
    const telefono = normalizarTelefono(dato.telefono)
    if (!telefono) return `No se guardó: no entiendo el teléfono "${dato.telefono}". Pedile al hijo que lo repita. No lo completes vos.`
    cambios.telefono = telefono
  }
  if (dato.direccion.trim()) cambios.direccion = dato.direccion.trim()
  if (Object.keys(cambios).length === 0) return 'No había nada para cambiar.'

  let abuelo: Abuelo | undefined
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    abuelo = { ...c.abuelo, ...cambios }
    return { ...c, abuelo }
  })
  if (error || !abuelo) return error ?? 'No se pudo guardar.'
  const faltan = [
    abuelo.nombre === PENDIENTE && 'el nombre',
    abuelo.comoLeGustaQueLeHablen === PENDIENTE && 'cómo le gusta que le hablen',
    abuelo.telefono === PENDIENTE && 'su teléfono',
    abuelo.direccion === PENDIENTE && 'su dirección',
  ].filter(Boolean)
  return `Guardado. Persona mayor: ${abuelo.nombre} | trato: ${abuelo.comoLeGustaQueLeHablen} | teléfono: ${abuelo.telefono} | dirección: ${abuelo.direccion}.` +
    (faltan.length ? ` Todavía falta: ${faltan.join(', ')} (preguntalo de a uno).` : '') +
    (cambios.direccion && cambios.direccion !== PENDIENTE ? await textoDeLaCasa(abuelo) : '')
}

/** La casa se ubica en el mapa apenas se guarda: con eso se sugieren los lugares y comercios cercanos. */
async function textoDeLaCasa(abuelo: Abuelo): Promise<string> {
  const casa = await dondeVive({ abuelo })
  if (!casa) {
    return (
      ` OJO: el mapa NO encontró esa dirección exacta, así que no se le van a poder sugerir lugares ni comercios cercanos. ` +
      'Pedile al hijo que la revise (calle y número, y si puede el barrio) y volvé a guardarla.'
    )
  }
  return ` El mapa ubicó la casa en: ${casa.direccionDelMapa}. Contale al hijo en pocas palabras (calle, número y barrio) para que confirme que es ahí.`
}
