import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { guardarConfiguracion, leerConfiguracion, PENDIENTE, type Lugar } from '@/lib/datos'
import { buscarCoordenadas } from '@/lib/mapas'

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
        description: 'true solo si el hijo dijo que para ir ahí la familia tiene que dar permiso antes. Si no lo dijo, false.',
      },
    },
    required: ['nombre', 'apodos', 'direccion', 'necesitaPermiso'],
    additionalProperties: false,
  },
  strict: true,
}

interface PedidoGuardarLugar {
  nombre: string
  apodos: string[]
  direccion: string
  necesitaPermiso: boolean
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
    typeof d.necesitaPermiso === 'boolean'
  )
}

const mismoNombre = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** Ejecuta guardar_lugar y le devuelve a la IA, en texto, qué quedó guardado. */
export async function guardarLugar(codigoFamilia: string, dato: unknown): Promise<string> {
  console.log('[familia] la IA pidió guardar_lugar:', JSON.stringify(dato))
  if (!esPedidoValido(dato)) return 'No se guardó: faltan datos del lugar (nombre, apodos, dirección y si necesita permiso).'
  if (dato.nombre.replace(/[^\p{L}]/gu, '').length < 3) {
    return 'No se guardó: ese nombre no parece un lugar real. Guardá solo lugares que el hijo te contó.'
  }

  const configuracion = await leerConfiguracion(codigoFamilia)
  if (!configuracion) return 'No se guardó: no encontré la configuración de esta familia.'

  const direccion = dato.direccion.trim() || PENDIENTE
  const ubicacion = direccion === PENDIENTE ? null : await buscarCoordenadas(direccion)

  const lugar: Lugar = {
    nombre: dato.nombre.trim(),
    apodos: [...new Set(dato.apodos.map((a) => a.trim()).filter(Boolean))],
    direccion,
    latitud: ubicacion?.latitud ?? PENDIENTE,
    longitud: ubicacion?.longitud ?? PENDIENTE,
    necesitaPermiso: dato.necesitaPermiso,
  }

  const yaExistia = configuracion.lugares.some((l) => mismoNombre(l.nombre, lugar.nombre))
  const lugares = yaExistia
    ? configuracion.lugares.map((l) => (mismoNombre(l.nombre, lugar.nombre) ? lugar : l))
    : [...configuracion.lugares, lugar]

  try {
    await guardarConfiguracion({ ...configuracion, lugares })
  } catch (error) {
    console.error('[familia] no se pudo guardar el lugar:', error)
    return 'No se pudo guardar el lugar por un error del sistema. Decile al hijo que lo intente de nuevo en un ratito.'
  }

  const accion = yaExistia ? 'Actualizado' : 'Guardado'
  if (direccion === PENDIENTE) {
    return `${accion} "${lugar.nombre}" sin dirección. Decile que hasta que no esté la dirección no se puede pedir un Uber a ese lugar, y que la puede pasar cuando quiera.`
  }
  if (!ubicacion) {
    return `${accion} "${lugar.nombre}" con la dirección "${direccion}", pero el mapa no encontró ese número exacto, así que la ubicación quedó pendiente y todavía no se puede pedir un Uber ahí. Pedile que revise cómo se escribe la calle o que agregue el barrio.`
  }
  return `${accion} "${lugar.nombre}". El mapa lo ubicó en: ${ubicacion.direccionDelMapa}. Contale al hijo en pocas palabras dónde quedó ubicado (calle, número y barrio) para que confirme que es ahí. No le digas coordenadas.`
}
