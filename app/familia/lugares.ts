import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { leerConfiguracion, PENDIENTE, type Lugar } from '@/lib/datos'
import { buscarCoordenadas } from '@/lib/mapas'
import { cambiarConfiguracion, limpiarApodos, loDijoElHijo, mismoNombre, nombreValido } from './guardar'

// Herramienta "guardar_lugar": la IA saca de la charla un lugar con sus apodos y lo guarda
// en la configuración (formato de docs/formato-configuracion.md). La IA nunca pasa coordenadas:
// las busca el servidor en el mapa, y si no las encuentra quedan "PENDIENTE".

export const HERRAMIENTA_GUARDAR_LUGAR: Anthropic.Beta.BetaTool = {
  name: 'guardar_lugar',
  description:
    'Guarda (o actualiza, si ya existe uno con el mismo nombre) un lugar al que la persona mayor va seguido. ' +
    'Usala apenas sepas el nombre del lugar y su dirección, o cuando el hijo diga que no sabe la dirección. ' +
    'No pases coordenadas: el sistema las busca solo en el mapa.',
  input_schema: {
    type: 'object',
    properties: {
      nombre: { type: 'string', description: 'Nombre claro del lugar, ej. "Casa de Laura (hija)" o "Club Biguá".' },
      apodos: {
        type: 'array',
        items: { type: 'string' },
        description: 'Cómo lo llama la persona mayor, tal cual lo dijo el hijo, ej. ["lo de la nena", "lo de Laura"]. Puede ser [].',
      },
      direccion: {
        type: 'string',
        description: 'Calle, número y barrio o ciudad, tal cual la dijo el hijo. Si no la sabe, "PENDIENTE". Nunca la inventes.',
      },
      necesitaPermiso: {
        type: 'boolean',
        description:
          'Solo cuenta para lugares NUEVOS: lo que dijo el hijo (true = necesita permiso, false = puede ir solo). ' +
          'En un lugar que ya existe no cambia nada: los permisos se cambian con mostrar_reglas y guardar_reglas.',
      },
      fraseDelHijo: {
        type: 'string',
        description:
          'Las palabras EXACTAS que escribió el hijo diciendo si puede ir solo o necesita permiso para este lugar ' +
          '(ej. "puede ir solo", "que pida permiso"). "" si todavía no lo dijo: un lugar nuevo no se guarda sin eso.',
      },
    },
    required: ['nombre', 'apodos', 'direccion', 'necesitaPermiso', 'fraseDelHijo'],
    additionalProperties: false,
  },
  strict: true,
}

interface PedidoGuardarLugar {
  nombre: string
  apodos: string[]
  direccion: string
  necesitaPermiso: boolean
  fraseDelHijo: string
}

function esPedidoValido(dato: unknown): dato is PedidoGuardarLugar {
  const d = dato as Partial<PedidoGuardarLugar> | null
  return (
    !!d &&
    typeof d.nombre === 'string' &&
    d.nombre.trim() !== '' &&
    Array.isArray(d.apodos) &&
    d.apodos.every((a) => typeof a === 'string') &&
    typeof d.direccion === 'string' &&
    typeof d.necesitaPermiso === 'boolean' &&
    typeof d.fraseDelHijo === 'string'
  )
}

/** Ejecuta guardar_lugar y le devuelve a la IA, en texto, qué quedó guardado. */
export async function guardarLugar(codigoFamilia: string, dato: unknown, loQueEscribioElHijo: string[]): Promise<string> {
  console.log('[familia] la IA pidió guardar_lugar:', JSON.stringify(dato))
  if (!esPedidoValido(dato)) return 'No se guardó: faltan datos del lugar (nombre, apodos, dirección y si necesita permiso).'
  if (!nombreValido(dato.nombre)) return 'No se guardó: ese nombre no parece un lugar real. Guardá solo lugares que el hijo te contó.'

  // Un lugar NUEVO nunca se guarda (ni libre ni con permiso) sin que el hijo haya dicho cuál de las dos.
  const existente = (await leerConfiguracion(codigoFamilia))?.lugares.some((l) => mismoNombre(l.nombre, dato.nombre))
  if (!existente && !loDijoElHijo(dato.fraseDelHijo, loQueEscribioElHijo)) {
    return (
      `Todavía NO se guardó "${dato.nombre.trim()}": falta que el hijo diga si puede ir solo o necesita permiso. ` +
      'Preguntáselo ahora, en una sola pregunta. Cuando conteste, volvé a usar guardar_lugar con sus palabras exactas en fraseDelHijo. ' +
      'No digas que ya está guardado.'
    )
  }

  const direccion = dato.direccion.trim() || PENDIENTE
  const ubicacion = direccion === PENDIENTE ? null : await buscarCoordenadas(direccion)

  const lugar: Lugar = {
    nombre: dato.nombre.trim(),
    apodos: limpiarApodos(dato.apodos),
    direccion,
    latitud: ubicacion?.latitud ?? PENDIENTE,
    longitud: ubicacion?.longitud ?? PENDIENTE,
    necesitaPermiso: dato.necesitaPermiso,
  }

  let yaExistia = false
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    yaExistia = c.lugares.some((l) => mismoNombre(l.nombre, lugar.nombre))
    // Al corregir un lugar que ya existe se mantiene su permiso: eso solo lo cambia guardar_reglas.
    const lugares = yaExistia
      ? c.lugares.map((l) => (mismoNombre(l.nombre, lugar.nombre) ? { ...lugar, necesitaPermiso: l.necesitaPermiso } : l))
      : [...c.lugares, lugar]
    return { ...c, lugares }
  })
  if (error) return error

  const accion = yaExistia ? 'Actualizado' : 'Guardado'
  if (direccion === PENDIENTE) {
    return `${accion} "${lugar.nombre}" sin dirección. Decile que hasta que no esté la dirección no se puede pedir un Uber a ese lugar, y que la puede pasar cuando quiera.`
  }
  if (!ubicacion) {
    return `${accion} "${lugar.nombre}" con la dirección "${direccion}", pero el mapa no encontró ese número exacto, así que la ubicación quedó pendiente y todavía no se puede pedir un Uber ahí. Pedile que revise cómo se escribe la calle o que agregue el barrio.`
  }
  return `${accion} "${lugar.nombre}". El mapa lo ubicó en: ${ubicacion.direccionDelMapa}. Contale al hijo en pocas palabras dónde quedó ubicado (calle, número y barrio) para que confirme que es ahí. No le digas coordenadas.`
}
