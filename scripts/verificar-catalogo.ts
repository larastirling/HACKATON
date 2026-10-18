// Verifica el catálogo de lugares de Montevideo con el mapa (lib/mapas.ts) y escribe
// app/familia/catalogo-lugares.ts SOLO con los que el mapa encuentra de verdad.
//
// Hay dos formas de verificar cada lugar:
//   - Con DIRECCIÓN: el mapa tiene que encontrar la dirección (con el número de puerta exacto) y, buscando
//     por el nombre, ubicar el lugar a menos de 500 m de esa dirección (así no entra una dirección de otro lugar).
//   - Sin dirección (plazas, parques, sucursales): se busca por el nombre y entra solo si el mapa devuelve
//     ESE lugar (su nombre en el mapa empieza igual). La dirección se toma del mapa, nunca se escribe a mano.
//
// Correrlo (tarda unos minutos: el mapa permite 1 búsqueda por segundo):
//   npx tsx@4.20.3 --conditions=react-server scripts/verificar-catalogo.ts

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buscarCoordenadas } from '../lib/mapas'

type Tipo = 'Salud' | 'Farmacia' | 'Supermercado' | 'Banco' | 'Trámites' | 'Shopping' | 'Plaza' | 'Club' | 'Paseo'

interface Candidato {
  nombre: string
  tipo: Tipo
  /** Dirección para el mapa. Sin dirección, se busca por el nombre. */
  direccion?: string
  /** Cómo buscarlo por nombre (si no, se usa `nombre`). */
  buscarComo?: string
  /** Cómo empieza su nombre en el mapa (si no, igual que `buscarComo`). */
  enElMapa?: string
  /** Barrio donde tiene que estar (para nombres repetidos, como las plazas). */
  barrio?: string
}

const CANDIDATOS: Candidato[] = [
  // Salud: hospitales y mutualistas
  { nombre: 'Hospital Británico', tipo: 'Salud', direccion: 'Avenida Italia 2420, Montevideo' },
  { nombre: 'Hospital Italiano', tipo: 'Salud', direccion: 'Bulevar Artigas 1632, Montevideo' },
  { nombre: 'Hospital Maciel', tipo: 'Salud', direccion: '25 de Mayo 174, Montevideo' },
  { nombre: 'CASMU (Sanatorio 2)', tipo: 'Salud', direccion: '8 de Octubre 3310, Montevideo', buscarComo: 'CASMU' },
  { nombre: 'Hospital Evangélico', tipo: 'Salud' },
  { nombre: 'Hospital Pasteur', tipo: 'Salud' },
  { nombre: 'Hospital de Clínicas', tipo: 'Salud' },
  { nombre: 'Médica Uruguaya', tipo: 'Salud' },
  { nombre: 'Sanatorio Americano', tipo: 'Salud' },
  // Farmacias
  { nombre: 'Farmacia San Roque (Tres Ombúes)', tipo: 'Farmacia', buscarComo: 'Farmacia San Roque', enElMapa: 'San Roque' },
  { nombre: 'Farmashop (Carrasco)', tipo: 'Farmacia', buscarComo: 'Farmashop' },
  // Supermercados
  { nombre: 'Tienda Inglesa (Aires Puros)', tipo: 'Supermercado', buscarComo: 'Tienda Inglesa' },
  { nombre: 'Devoto (Prado)', tipo: 'Supermercado', buscarComo: 'Devoto' },
  { nombre: 'Ta-Ta (Unión)', tipo: 'Supermercado', buscarComo: 'Ta-Ta' },
  // Bancos y trámites
  { nombre: 'BROU (Convención)', tipo: 'Banco', buscarComo: 'BROU', enElMapa: 'República' },
  { nombre: 'BPS (Atención Ciudadana)', tipo: 'Trámites', direccion: 'Colonia 1851, Montevideo', buscarComo: 'Banco de Previsión Social' },
  { nombre: 'Intendencia de Montevideo', tipo: 'Trámites', direccion: 'Avenida 18 de Julio 1360, Montevideo' },
  { nombre: 'Correo Uruguayo (Centro)', tipo: 'Trámites', buscarComo: 'Correo Uruguayo' },
  { nombre: 'Abitab (Cordón)', tipo: 'Trámites', buscarComo: 'Abitab' },
  // Shoppings
  { nombre: 'Montevideo Shopping', tipo: 'Shopping', direccion: 'Avenida Luis Alberto de Herrera 1290, Montevideo' },
  { nombre: 'Punta Carretas Shopping', tipo: 'Shopping', direccion: 'José Ellauri 350, Montevideo' },
  { nombre: 'Tres Cruces (shopping y terminal)', tipo: 'Shopping', direccion: 'Bulevar Artigas 1825, Montevideo', buscarComo: 'Tres Cruces Shopping' },
  { nombre: 'Portones Shopping', tipo: 'Shopping', direccion: 'Avenida Italia 5775, Montevideo' },
  { nombre: 'Nuevocentro Shopping', tipo: 'Shopping', direccion: 'Avenida Luis Alberto de Herrera 3365, Montevideo' },
  // Plazas y parques
  { nombre: 'Plaza Independencia', tipo: 'Plaza', barrio: 'Ciudad Vieja' },
  { nombre: 'Plaza Matriz', tipo: 'Plaza', barrio: 'Ciudad Vieja' },
  { nombre: 'Plaza Cagancha (Plaza Libertad)', tipo: 'Plaza', buscarComo: 'Plaza Libertad', barrio: 'Centro' },
  { nombre: 'Plaza Gomensoro', tipo: 'Plaza', barrio: 'Pocitos' },
  { nombre: 'Parque Rodó', tipo: 'Plaza' },
  { nombre: 'Parque Batlle', tipo: 'Plaza' },
  { nombre: 'Jardín Botánico', tipo: 'Plaza' },
  // Clubes
  { nombre: 'Club Biguá', tipo: 'Club', buscarComo: 'Club Biguá de Villa Biarritz' },
  { nombre: 'Club Banco República', tipo: 'Club' },
  { nombre: 'Defensor Sporting', tipo: 'Club' },
  // Paseos
  { nombre: 'Teatro Solís', tipo: 'Paseo', direccion: 'Buenos Aires 652, Montevideo' },
  { nombre: 'Mercado del Puerto', tipo: 'Paseo', barrio: 'Ciudad Vieja' },
  { nombre: 'Mercado Agrícola (MAM)', tipo: 'Paseo', direccion: 'José L. Terra 2220, Montevideo', buscarComo: 'Mercado Agrícola de Montevideo' },
]

const METROS_MAXIMOS = 500

function distanciaEnMetros(a: { latitud: number; longitud: number }, b: { latitud: number; longitud: number }): number {
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.latitud - a.latitud)
  const dLon = rad(b.longitud - a.longitud)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitud)) * Math.cos(rad(b.latitud)) * Math.sin(dLon / 2) ** 2
  return 2 * 6_371_000 * Math.asin(Math.sqrt(h))
}

const slug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const entraron: object[] = []
const afuera: string[] = []

const sinTildes = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

/**
 * Arma la dirección con lo que devuelve el mapa (nunca a mano):
 * "Hospital Evangélico, 2759, Bulevar José Batlle y Ordóñez, Unión, Montevideo, 11820, Uruguay" → "Bulevar José Batlle y Ordóñez 2759, Unión".
 * Sin número de puerta → "José Antonio Cabrera, Unión". Sin calle (plazas, parques) → "Ciudad Vieja, Montevideo".
 */
function direccionDesdeElMapa(delMapa: string, nombre: string): string {
  const [, ...resto] = delMapa.split(',').map((p) => p.trim())
  const utiles = resto.filter((p) => !/^\d{5}$/.test(p) && p !== 'Uruguay' && p !== 'Montevideo')
  const numero = utiles.findIndex((p) => /^\d{1,4}([,;]\d{1,4})*$/.test(p))
  if (numero >= 0 && utiles[numero + 1]) {
    return [`${utiles[numero + 1]} ${utiles[numero].split(/[,;]/)[0]}`, utiles[numero + 2]].filter(Boolean).join(', ')
  }
  if (utiles.length === 0) return `${nombre}, Montevideo`
  return utiles.length === 1 ? `${utiles[0]}, Montevideo` : utiles.slice(0, 2).join(', ')
}

async function verificar() {
  for (const c of CANDIDATOS) {
    const nombreParaBuscar = c.buscarComo ?? c.nombre
    const porNombre = await buscarCoordenadas(`${nombreParaBuscar}, Montevideo`)
    let ubicacion = porNombre
    let motivo = ''
    if (c.direccion) {
      const porDireccion = await buscarCoordenadas(c.direccion)
      if (!porDireccion) motivo = `el mapa no encontró la dirección "${c.direccion}"`
      else if (!porNombre) motivo = 'el mapa encontró la dirección, pero no el lugar por su nombre (no se pudo confirmar que sea ahí)'
      else if (distanciaEnMetros(porNombre, porDireccion) > METROS_MAXIMOS) {
        motivo = `la dirección y el lugar quedan a ${Math.round(distanciaEnMetros(porNombre, porDireccion))} m (no coinciden)`
      }
      ubicacion = porDireccion
    } else if (!porNombre) {
      motivo = 'el mapa no lo encontró por su nombre'
    } else if (!sinTildes(porNombre.direccionDelMapa).startsWith(sinTildes(c.enElMapa ?? nombreParaBuscar))) {
      motivo = `el mapa devolvió otro lugar ("${porNombre.direccionDelMapa.split(',')[0]}")`
    }
    if (!motivo && c.barrio && ubicacion && !sinTildes(ubicacion.direccionDelMapa).includes(sinTildes(c.barrio))) {
      motivo = `el mapa encontró uno con ese nombre pero en otro barrio (${ubicacion.direccionDelMapa.split(',').slice(1, 3).join(',').trim()}), no en ${c.barrio}`
    }
    if (motivo || !ubicacion) {
      afuera.push(`${c.nombre}: ${motivo}`)
      console.log(`AFUERA ${afuera.at(-1)}`)
      continue
    }
    entraron.push({
      id: slug(c.nombre),
      nombre: c.nombre,
      tipo: c.tipo,
      direccion: c.direccion ? c.direccion.replace(/, Montevideo$/, '') : direccionDesdeElMapa(ubicacion.direccionDelMapa, c.nombre),
      latitud: Number(ubicacion.latitud.toFixed(7)),
      longitud: Number(ubicacion.longitud.toFixed(7)),
    })
    console.log(`OK     ${c.nombre}  →  ${ubicacion.direccionDelMapa}`)
  }
  const archivo = `// Catálogo de lugares comunes de Montevideo que /familia le puede SUGERIR al hijo.
  // Lo genera scripts/verificar-catalogo.ts: cada lugar se verificó con el mapa (lib/mapas.ts).
  // La IA nunca inventa lugares: solo puede sugerir los de esta lista. No editar a mano.
  // Verificado el ${new Date().toISOString().slice(0, 10)}.

  export interface LugarDelCatalogo {
    id: string
    nombre: string
    tipo: string
    direccion: string
    latitud: number
    longitud: number
  }

  export const CATALOGO_LUGARES: readonly LugarDelCatalogo[] = ${JSON.stringify(entraron, null, 2)}

  /** Los que quedaron afuera porque el mapa no los pudo confirmar. */
  export const QUEDARON_AFUERA: readonly string[] = ${JSON.stringify(afuera, null, 2)}
  `
  writeFileSync(join(process.cwd(), 'app', 'familia', 'catalogo-lugares.ts'), archivo)
  console.log(`\n${entraron.length} entraron, ${afuera.length} quedaron afuera.`)
}

verificar()
