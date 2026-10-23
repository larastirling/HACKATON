import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import type { ConfiguracionAbuelo, Lugar } from '@/lib/datos'
import { buscarVarios, type LugarDelMapa } from '@/lib/mapas'
import { dondeVive, kmEntre, KM_MAXIMOS, textoDistancia } from './distancia'
import { cambiarConfiguracion, mismoNombre, nombreValido } from './guardar'
import type { LugarSugerido } from './sugerencias'

// Herramienta "buscar_lugar_en_el_mapa": el hijo nombra un lugar que no está en el catálogo ("el McDonald's de
// Avenida Italia") y, en vez de pedirle la dirección, el sistema lo busca por nombre en OpenStreetMap.
// Funciona igual que las sugerencias del catálogo (sugerencias.ts), con los mismos botones:
//   1. La IA busca y el hijo ve botones con lo que encontró el mapa (barrio y a cuántos km de la casa).
//   2. Si toca uno, el sistema le pregunta "¿Puede ir solo o necesita permiso?" (sin la IA).
//   3. Recién con esa respuesta se guarda, con la ubicación exacta del mapa. Nunca queda libre por defecto.
// Si el mapa no encuentra nada, la IA le pide la dirección como siempre (guardar_lugar).
// El id del botón lleva las coordenadas del mapa ("mapa:-34.88760,-56.11842"): la IA nunca las escribe.

const MAXIMO_RESULTADOS = 4
const PREFIJO = 'mapa:'

export const esDelMapa = (id: unknown): id is string => typeof id === 'string' && id.startsWith(PREFIJO)

export const HERRAMIENTA_BUSCAR_EN_EL_MAPA: Anthropic.Beta.BetaTool = {
  name: 'buscar_lugar_en_el_mapa',
  description:
    'Busca en el mapa un lugar por su NOMBRE (un comercio, un club, una iglesia, una mutualista) cuando el hijo lo nombra sin dirección, ' +
    'y le muestra botones con lo que encontró (barrio y distancia a la casa). NO guarda nada: si el hijo toca uno, ' +
    'el sistema le pregunta si puede ir solo o necesita permiso y lo guarda con la ubicación exacta. No la uses para casas de personas.',
  input_schema: {
    type: 'object',
    properties: {
      nombre: {
        type: 'string',
        description: 'El nombre del lugar bien escrito, como figura en el cartel (ej. "McDonald\'s" aunque el hijo escriba "mc donalds").',
      },
      zona: {
        type: 'string',
        description: 'La calle o el barrio que dijo el hijo para saber cuál es (ej. "Avenida Italia", "Pocitos"). "" si no dijo ninguna.',
      },
    },
    required: ['nombre', 'zona'],
    additionalProperties: false,
  },
  // Sin strict, como sugerir_lugares: Haiku rechaza la charla si hay muchas herramientas strict.
  strict: false,
}

const QUE_ES: Record<string, string> = {
  fast_food: 'Comida rápida',
  restaurant: 'Restaurante',
  cafe: 'Café',
  pharmacy: 'Farmacia',
  hospital: 'Salud',
  clinic: 'Salud',
  doctors: 'Salud',
  bank: 'Banco',
  supermarket: 'Supermercado',
  place_of_worship: 'Iglesia',
}

const queEs = (categoria: string) => QUE_ES[categoria.split('/')[1]] ?? 'Lugar'

const direccionDe = (l: LugarDelMapa) =>
  [l.calle && `${l.calle}${l.numero ? ` ${l.numero}` : ''}`, l.barrio, l.ciudad ?? 'Montevideo'].filter(Boolean).join(', ')

/** "McDonald's (Malvín Nuevo)": así se distinguen dos sucursales de la misma cadena, aunque estén en la misma avenida. */
const nombreDe = (l: LugarDelMapa) => (l.barrio || l.calle ? `${l.nombre} (${l.barrio ?? l.calle})` : l.nombre)

const paraMostrar = (l: LugarDelMapa, km?: number): LugarSugerido => ({
  id: `${PREFIJO}${l.latitud.toFixed(6)},${l.longitud.toFixed(6)}`,
  nombre: nombreDe(l),
  tipo: queEs(l.categoria),
  direccion: direccionDe(l),
  ...(km !== undefined && { distancia: textoDistancia(km) }),
})

/** Las coordenadas que van en el id del botón. null si no son de Uruguay (el id lo manda el celular). */
function coordenadasDelId(id: string): { latitud: number; longitud: number } | null {
  const [latitud, longitud] = id.slice(PREFIJO.length).split(',').map(Number)
  const enUruguay = latitud >= -35.1 && latitud <= -30 && longitud >= -58.5 && longitud <= -53
  return Number.isFinite(latitud) && Number.isFinite(longitud) && enUruguay ? { latitud, longitud } : null
}

/** Ejecuta buscar_lugar_en_el_mapa: arma los botones (sin guardar nada), del más cerca al más lejos. */
export async function buscarEnElMapa(configuracion: ConfiguracionAbuelo, dato: unknown): Promise<{ texto: string; sugerencias?: LugarSugerido[] }> {
  console.log('[familia] la IA pidió buscar_lugar_en_el_mapa:', JSON.stringify(dato))
  const { nombre, zona } = (dato ?? {}) as { nombre?: unknown; zona?: unknown }
  if (typeof nombre !== 'string' || !nombreValido(nombre)) return { texto: 'No se buscó: falta el nombre del lugar.' }
  const conZona = typeof zona === 'string' && zona.trim() ? `${nombre.trim()} ${zona.trim()}` : null

  // Primero con la zona que dijo el hijo ("McDonald's Avenida Italia"); si así no aparece, solo por el nombre.
  let encontrados: LugarDelMapa[] = []
  try {
    if (conZona) encontrados = await buscarVarios(conZona)
    if (encontrados.length === 0) encontrados = await buscarVarios(nombre.trim())
  } catch {
    return { texto: 'No se pudo buscar en el mapa (sin conexión). Pedile la dirección con calle y número, como siempre.' }
  }

  const casa = await dondeVive(configuracion)
  const conDistancia = encontrados.map((l) => ({ l, km: casa ? kmEntre(casa, l) : undefined }))
  const cerca = casa ? conDistancia.filter((d) => d.km! <= KM_MAXIMOS).sort((a, b) => a.km! - b.km!) : conDistancia
  const sugerencias = cerca.slice(0, MAXIMO_RESULTADOS).map((d) => paraMostrar(d.l, d.km))

  if (sugerencias.length === 0) {
    const lejos = encontrados.length > 0 ? ` (encontró, pero a más de ${KM_MAXIMOS} km de su casa)` : ''
    return {
      texto: `El mapa no encontró "${nombre.trim()}"${lejos}. Pedile al hijo la dirección con calle y número, como siempre, y guardalo con guardar_lugar.`,
    }
  }
  return {
    sugerencias,
    texto:
      `Listo: debajo de tu mensaje el hijo ve botones con lo que encontró el mapa: ${sugerencias.map((s) => `${s.nombre}, ${s.direccion} (${s.distancia ?? 'sin distancia'})`).join('; ')}, ` +
      'y uno de "Ninguno". NO se guardó nada. En tu mensaje preguntale, en una frase, si es alguno de estos (por ejemplo "¿Es alguno de estos?"). ' +
      'No los listes: ya están en los botones. Si dice que ninguno, pedile la dirección.',
  }
}

/** El hijo tocó un lugar del mapa: antes de guardar, se le pregunta si puede ir solo o necesita permiso. */
export function preguntarPermisoDelMapa(configuracion: ConfiguracionAbuelo, elegido: LugarSugerido | undefined): { texto: string; preguntaPermiso?: LugarSugerido } {
  if (!elegido || !coordenadasDelId(elegido.id)) return { texto: 'No encontré ese lugar. ¿Me contás a qué lugar va?' }
  if (configuracion.lugares.some((l) => mismoNombre(l.nombre, elegido.nombre))) {
    return { texto: `${elegido.nombre} ya está guardado. ¿Va seguido a algún otro lugar?` }
  }
  return { texto: `Buenísimo: ${elegido.nombre} (${elegido.direccion}). ¿Puede ir solo o necesita permiso?`, preguntaPermiso: elegido }
}

/** Guarda el lugar del mapa por el que se preguntó, con el permiso que eligió el hijo. */
export async function guardarLugarDelMapa(codigoFamilia: string, elegido: LugarSugerido | undefined, necesitaPermiso: boolean): Promise<string> {
  const coordenadas = elegido && coordenadasDelId(elegido.id)
  if (!elegido || !coordenadas || !nombreValido(elegido.nombre)) return 'No se guardó: no se sabe qué lugar del mapa eligió.'
  const lugar: Lugar = {
    nombre: elegido.nombre,
    // El nombre corto ("McDonald's"), para cuando la persona mayor lo nombra sin la calle.
    apodos: elegido.nombre.includes(' (') ? [elegido.nombre.slice(0, elegido.nombre.lastIndexOf(' ('))] : [],
    direccion: elegido.direccion,
    ...coordenadas,
    necesitaPermiso,
  }
  let yaEstaba = false
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    yaEstaba = c.lugares.some((l) => mismoNombre(l.nombre, lugar.nombre))
    return yaEstaba ? c : { ...c, lugares: [...c.lugares, lugar] }
  })
  if (error) return error
  if (yaEstaba) return `"${lugar.nombre}" ya estaba guardado: no se cambió nada.`
  return `Guardado "${lugar.nombre}" (${lugar.direccion}) ${necesitaPermiso ? 'con permiso: la familia lo aprueba antes de que vaya' : 'como libre: puede ir solo'}.`
}
