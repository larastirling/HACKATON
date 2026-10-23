import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { leerConfiguracion } from '@/lib/datos'
import { coordenadasDeGoogleMaps, linkDeGoogleMaps } from '@/lib/mapas'
import { cambiarConfiguracion, mismoNombre } from './guardar'

// Herramienta "ubicar_con_link_de_google_maps": cuando ni IDE Uruguay ni OpenStreetMap encuentran una dirección,
// el hijo puede pegar el link de Google Maps del lugar. Las coordenadas salen del link (lib/mapas.ts), nunca de la IA,
// y el link tiene que estar tal cual en algo que escribió el hijo (la IA no puede inventar uno).

export const HERRAMIENTA_UBICAR_CON_LINK: Anthropic.Beta.BetaTool = {
  name: 'ubicar_con_link_de_google_maps',
  description:
    'Ubica la casa de la persona mayor o un lugar guardado con el link de Google Maps que pegó el hijo en la charla. ' +
    'Usala solo cuando el hijo pegó un link de Google Maps. El sistema saca las coordenadas del link: vos nunca las escribas.',
  input_schema: {
    type: 'object',
    properties: {
      para: {
        type: 'string',
        description: '"casa" si es la casa de la persona mayor; si no, el nombre EXACTO del lugar guardado (como figura en LO QUE YA ESTÁ GUARDADO).',
      },
      link: { type: 'string', description: 'El link de Google Maps tal cual lo pegó el hijo.' },
    },
    required: ['para', 'link'],
    additionalProperties: false,
  },
  // Sin strict: no suma a la gramática de las herramientas strict (Haiku rechaza la charla si es muy grande).
  // Lo que llega lo revisa el servidor: que el link esté en lo que escribió el hijo y que tenga coordenadas en Uruguay.
  strict: false,
}

export async function ubicarConLink(codigoFamilia: string, dato: unknown, loQueEscribioElHijo: string[]): Promise<string> {
  console.log('[familia] la IA pidió ubicar_con_link_de_google_maps:', JSON.stringify(dato))
  const { para, link } = (dato ?? {}) as { para?: unknown; link?: unknown }
  if (typeof para !== 'string' || typeof link !== 'string' || !para.trim()) return 'No se ubicó: falta para qué es (la casa o qué lugar) y el link.'

  // El link tiene que estar en lo que escribió el hijo (y ser de Google Maps).
  const delHijo = loQueEscribioElHijo.map(linkDeGoogleMaps).find((l) => l && (l === link.trim() || link.includes(l)))
  if (!delHijo) {
    return 'No se ubicó: ese link no está en lo que escribió el hijo, o no es de Google Maps. Pedile que pegue el link (en Google Maps: "Compartir" y "Copiar enlace").'
  }
  const punto = await coordenadasDeGoogleMaps(delHijo)
  if (!punto) {
    return 'No se ubicó: ese link no tiene un punto de Uruguay que se pueda leer. Pedile que abra el lugar en Google Maps, toque "Compartir", "Copiar enlace" y lo pegue de nuevo.'
  }
  const { latitud, longitud, direccionDelMapa, fuente } = punto

  if (mismoNombre(para, 'casa')) {
    const error = await cambiarConfiguracion(codigoFamilia, (c) => ({ ...c, abuelo: { ...c.abuelo, ubicacion: { latitud, longitud, direccionDelMapa, fuente } } }))
    if (error) return error
    return `Listo: la casa quedó ubicada con el link (${direccionDelMapa}). Ya se le pueden sugerir lugares y comercios cercanos. Contale al hijo en una frase en qué barrio quedó para que confirme.`
  }

  const lugar = (await leerConfiguracion(codigoFamilia))?.lugares.find((l) => mismoNombre(l.nombre, para))
  if (!lugar) return `No se ubicó: no hay ningún lugar guardado que se llame "${para}". Guardalo primero con guardar_lugar (o usá "casa" si es la casa).`
  const error = await cambiarConfiguracion(codigoFamilia, (c) => ({
    ...c,
    lugares: c.lugares.map((l) => (mismoNombre(l.nombre, para) ? { ...l, latitud, longitud } : l)),
  }))
  if (error) return error
  return `Listo: "${lugar.nombre}" quedó ubicado con el link (${direccionDelMapa}). Ya se le puede pedir un Uber ahí. Contale al hijo en una frase en qué barrio quedó para que confirme.`
}
