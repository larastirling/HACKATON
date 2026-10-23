// Verifica el catálogo de lugares de Montevideo con el mapa (lib/mapas.ts) y escribe
// app/familia/catalogo-lugares.ts SOLO con los que el mapa encuentra de verdad.
//
// Hay tres formas de verificar:
//   - Lugar con DIRECCIÓN: el mapa tiene que encontrar la dirección (con el número de puerta exacto) y, buscando
//     por el nombre, ubicar el lugar a menos de 500 m de esa dirección (así no entra una dirección de otro lugar).
//   - Lugar sin dirección (plazas, parques, hospitales): se busca por el nombre y entra solo si el mapa devuelve
//     ESE lugar (su nombre en el mapa empieza igual). La dirección se toma del mapa, nunca se escribe a mano.
//   - CADENAS (farmacias, supermercados, bancos, mutualistas): se piden al mapa todas las sucursales con ese nombre y
//     entran las que el mapa tiene con ese nombre y esa categoría (farmacia, supermercado, banco…), una por barrio,
//     primero los BARRIOS_PRIMERO. Nombre, dirección, barrio y ubicación salen del mapa.
//
// Las reglas del mapa (1 búsqueda por segundo, decir quiénes somos, caché) las cumple lib/mapas.ts.
// Además, nunca corren dos a la vez: si ya hay uno corriendo, este no arranca. Si el mapa falla, no escribe nada.
// Correrlo (tarda unos minutos la primera vez; después, lo ya buscado sale de la caché):
//   npx tsx@4.20.3 --conditions=react-server scripts/verificar-catalogo.ts

import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buscarCoordenadas, buscarVarios, cuantosErroresDelMapa, type LugarDelMapa } from '../lib/mapas'

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
  { nombre: 'Hospital Policial', tipo: 'Salud' },
  { nombre: 'Hospital Militar', tipo: 'Salud' },
  { nombre: 'Hospital Español', tipo: 'Salud' },
  { nombre: 'Sanatorio SMI', tipo: 'Salud' },
  // Farmacias, supermercados y bancos: van como CADENAS (abajo), con el barrio que dice el mapa.
  // Trámites
  { nombre: 'BPS (Atención Ciudadana)', tipo: 'Trámites', direccion: 'Colonia 1851, Montevideo', buscarComo: 'Banco de Previsión Social' },
  { nombre: 'Intendencia de Montevideo', tipo: 'Trámites', direccion: 'Avenida 18 de Julio 1360, Montevideo' },
  { nombre: 'Correo Uruguayo (Centro)', tipo: 'Trámites', buscarComo: 'Correo Uruguayo', barrio: 'Centro' },
  { nombre: 'Abitab (Cordón)', tipo: 'Trámites', buscarComo: 'Abitab', barrio: 'Cordón' },
  // Shoppings
  { nombre: 'Montevideo Shopping', tipo: 'Shopping', direccion: 'Avenida Luis Alberto de Herrera 1290, Montevideo' },
  { nombre: 'Punta Carretas Shopping', tipo: 'Shopping', direccion: 'José Ellauri 350, Montevideo' },
  { nombre: 'Tres Cruces (shopping y terminal)', tipo: 'Shopping', direccion: 'Bulevar Artigas 1825, Montevideo', buscarComo: 'Tres Cruces Shopping' },
  { nombre: 'Portones Shopping', tipo: 'Shopping', direccion: 'Avenida Italia 5775, Montevideo' },
  { nombre: 'Nuevocentro Shopping', tipo: 'Shopping', direccion: 'Avenida Luis Alberto de Herrera 3365, Montevideo' },
  // Plazas y parques
  { nombre: 'Plaza Independencia', tipo: 'Plaza', barrio: 'Ciudad Vieja' },
  { nombre: 'Plaza Matriz', tipo: 'Plaza', barrio: 'Ciudad Vieja' },
  { nombre: 'Plaza Zabala', tipo: 'Plaza', barrio: 'Ciudad Vieja' },
  { nombre: 'Plaza Cagancha (Plaza Libertad)', tipo: 'Plaza', buscarComo: 'Plaza Libertad', barrio: 'Centro' },
  { nombre: 'Plaza Fabini', tipo: 'Plaza', barrio: 'Centro' },
  { nombre: 'Plaza de los Treinta y Tres', tipo: 'Plaza', barrio: 'Cordón' },
  { nombre: 'Plaza Seregni', tipo: 'Plaza', barrio: 'Cordón' },
  { nombre: 'Plaza Gomensoro', tipo: 'Plaza', barrio: 'Pocitos' },
  { nombre: 'Parque Villa Biarritz', tipo: 'Plaza', barrio: 'Punta Carretas' },
  { nombre: 'Parque Rodó', tipo: 'Plaza' },
  { nombre: 'Parque Batlle', tipo: 'Plaza' },
  { nombre: 'Parque Rivera', tipo: 'Plaza', barrio: 'Malvín' },
  { nombre: 'Parque Baroffio', tipo: 'Plaza' },
  { nombre: 'Plaza de la Armada', tipo: 'Plaza', barrio: 'Punta Gorda' },
  { nombre: 'Plaza Virgilio', tipo: 'Plaza', barrio: 'Punta Gorda' },
  { nombre: 'Jardín Botánico', tipo: 'Plaza' },
  { nombre: 'Parque Capurro', tipo: 'Plaza' },
  { nombre: 'Parque Vaz Ferreira', tipo: 'Plaza', barrio: 'Cerro' },
  { nombre: 'Plaza Samuel Lafone', tipo: 'Plaza' },
  // Clubes
  { nombre: 'Club Biguá', tipo: 'Club', buscarComo: 'Club Biguá de Villa Biarritz' },
  { nombre: 'Club Banco República', tipo: 'Club' },
  { nombre: 'Defensor Sporting', tipo: 'Club' },
  // Paseos
  { nombre: 'Teatro Solís', tipo: 'Paseo', direccion: 'Buenos Aires 652, Montevideo' },
  { nombre: 'Mercado del Puerto', tipo: 'Paseo', barrio: 'Ciudad Vieja' },
  { nombre: 'Mercado Agrícola (MAM)', tipo: 'Paseo', direccion: 'José L. Terra 2220, Montevideo', buscarComo: 'Mercado Agrícola de Montevideo' },
]

interface Cadena {
  /** Cómo se llama en el catálogo: "Farmashop (Pocitos)". */
  nombre: string
  tipo: Tipo
  /** Qué se le pregunta al mapa (se agrega ", Montevideo"). */
  buscar: string[]
  /** Cómo se llama la sucursal en el mapa (igual, o seguido de otra palabra: "Devoto Malvin"). */
  nombresEnElMapa: string[]
  /** Qué tiene que ser para el mapa: así no entra el estacionamiento o el cajero de la cadena. */
  categorias: string[]
  /** Cuántas sucursales como máximo (una por barrio). */
  maximo: number
}

const FARMACIA = ['amenity/pharmacy', 'shop/chemist']
const SUPERMERCADO = ['shop/supermarket']
const SALUD = ['amenity/hospital', 'amenity/clinic']

const CADENAS: Cadena[] = [
  { nombre: 'Farmashop', tipo: 'Farmacia', buscar: ['Farmashop'], nombresEnElMapa: ['Farmashop'], categorias: FARMACIA, maximo: 7 },
  { nombre: 'Farmacia San Roque', tipo: 'Farmacia', buscar: ['San Roque'], nombresEnElMapa: ['San Roque'], categorias: FARMACIA, maximo: 7 },
  { nombre: 'Farmacia El Túnel', tipo: 'Farmacia', buscar: ['Farmacia El Túnel'], nombresEnElMapa: ['El Túnel'], categorias: FARMACIA, maximo: 5 },
  { nombre: 'Disco', tipo: 'Supermercado', buscar: ['Disco'], nombresEnElMapa: ['Disco'], categorias: SUPERMERCADO, maximo: 5 },
  { nombre: 'Devoto', tipo: 'Supermercado', buscar: ['Devoto'], nombresEnElMapa: ['Devoto'], categorias: SUPERMERCADO, maximo: 5 },
  { nombre: 'Tienda Inglesa', tipo: 'Supermercado', buscar: ['Tienda Inglesa'], nombresEnElMapa: ['Tienda Inglesa'], categorias: SUPERMERCADO, maximo: 5 },
  { nombre: 'Ta-Ta', tipo: 'Supermercado', buscar: ['Ta-Ta'], nombresEnElMapa: ['Ta-Ta', 'Ta - Ta'], categorias: SUPERMERCADO, maximo: 5 },
  { nombre: 'Géant', tipo: 'Supermercado', buscar: ['Géant'], nombresEnElMapa: ['Géant'], categorias: SUPERMERCADO, maximo: 2 },
  { nombre: 'BROU', tipo: 'Banco', buscar: ['BROU'], nombresEnElMapa: ['República'], categorias: ['amenity/bank'], maximo: 7 },
  {
    nombre: 'BPS',
    tipo: 'Trámites',
    buscar: ['Banco de Previsión Social', 'BPS'],
    nombresEnElMapa: ['Banco de Previsión Social', 'BPS'],
    categorias: ['office/government'],
    maximo: 4,
  },
  { nombre: 'CASMU', tipo: 'Salud', buscar: ['CASMU'], nombresEnElMapa: ['CASMU'], categorias: SALUD, maximo: 3 },
  { nombre: 'Asociación Española', tipo: 'Salud', buscar: ['Asociación Española'], nombresEnElMapa: ['Asociación Española'], categorias: SALUD, maximo: 3 },
  { nombre: 'Médica Uruguaya', tipo: 'Salud', buscar: ['Médica Uruguaya'], nombresEnElMapa: ['Médica Uruguaya'], categorias: SALUD, maximo: 3 },
  { nombre: 'COSEM', tipo: 'Salud', buscar: ['COSEM'], nombresEnElMapa: ['COSEM'], categorias: SALUD, maximo: 2 },
  { nombre: 'Círculo Católico', tipo: 'Salud', buscar: ['Círculo Católico'], nombresEnElMapa: ['Círculo Católico'], categorias: SALUD, maximo: 2 },
]

/** Los barrios que se cubren primero con las sucursales de cada cadena (después, los demás). */
const BARRIOS_PRIMERO = ['Pocitos', 'Punta Carretas', 'Centro', 'Cordón', 'Malvín', 'Buceo', 'Carrasco', 'Prado', 'Unión', 'Cerro', 'Parque Rodó']

const METROS_MAXIMOS = 500
/** Una sucursal a menos de esto de otro lugar de la misma marca ya cargado es el mismo lugar. */
const METROS_MISMO_LUGAR = 150

interface Punto {
  latitud: number
  longitud: number
}

function distanciaEnMetros(a: Punto, b: Punto): number {
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

interface LugarDelCatalogo extends Punto {
  id: string
  nombre: string
  tipo: Tipo
  direccion: string
}

const entraron: LugarDelCatalogo[] = []
const afuera: string[] = []

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

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

/** "Farmacia San Roque (Pocitos)" → "san roque": dos farmacias distintas pueden estar en la misma cuadra. */
const marca = (nombre: string) => sinTildes(nombre.replace(/\s*\(.*\)$/, '')).replace(/^farmacia /, '').trim()

/** Si ya hay un lugar con ese nombre, o de la misma marca a pocos metros, es repetido. */
function repetido(lugar: Pick<LugarDelCatalogo, 'nombre' | 'latitud' | 'longitud'>): LugarDelCatalogo | undefined {
  return entraron.find(
    (l) => slug(l.nombre) === slug(lugar.nombre) || (marca(l.nombre) === marca(lugar.nombre) && distanciaEnMetros(l, lugar) < METROS_MISMO_LUGAR),
  )
}

async function verificarCandidato(c: Candidato) {
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
    return
  }
  const lugar: LugarDelCatalogo = {
    id: slug(c.nombre),
    nombre: c.nombre,
    tipo: c.tipo,
    direccion: c.direccion ? c.direccion.replace(/, Montevideo$/, '') : direccionDesdeElMapa(ubicacion.direccionDelMapa, c.nombre),
    latitud: Number(ubicacion.latitud.toFixed(7)),
    longitud: Number(ubicacion.longitud.toFixed(7)),
  }
  const igual = repetido(lugar)
  if (igual) {
    afuera.push(`${c.nombre}: es el mismo lugar que "${igual.nombre}"`)
    console.log(`AFUERA ${afuera.at(-1)}`)
    return
  }
  entraron.push(lugar)
  console.log(`OK     ${c.nombre}  →  ${ubicacion.direccionDelMapa}`)
}

const prioridadDelBarrio = (barrio: string) => {
  const i = BARRIOS_PRIMERO.findIndex((b) => sinTildes(barrio).startsWith(sinTildes(b)))
  return i === -1 ? BARRIOS_PRIMERO.length : i
}

/** "Malvín Nuevo" y "Malvín Norte" cuentan como Malvín: una sucursal por barrio. */
const barrioBase = (barrio: string) => BARRIOS_PRIMERO.find((b) => sinTildes(barrio).startsWith(sinTildes(b))) ?? barrio

async function verificarCadena(cadena: Cadena) {
  const delMapa: LugarDelMapa[] = []
  for (const texto of cadena.buscar) delMapa.push(...(await buscarVarios(`${texto}, Montevideo`)))
  const esDeLaCadena = (l: LugarDelMapa) =>
    cadena.nombresEnElMapa.some((n) => sinTildes(l.nombre) === sinTildes(n) || sinTildes(l.nombre).startsWith(`${sinTildes(n)} `))
  const validas = delMapa.filter(
    (l) => esDeLaCadena(l) && cadena.categorias.includes(l.categoria) && l.ciudad === 'Montevideo' && l.barrio && l.calle,
  )
  // Por barrio, la que tiene número de puerta primero. Los barrios, en el orden de BARRIOS_PRIMERO.
  const porBarrio = new Map<string, LugarDelMapa>()
  for (const l of validas) {
    const anterior = porBarrio.get(barrioBase(l.barrio!))
    if (!anterior || (!anterior.numero && l.numero)) porBarrio.set(barrioBase(l.barrio!), l)
  }
  const barrios = [...porBarrio.keys()].sort((a, b) => prioridadDelBarrio(a) - prioridadDelBarrio(b))
  let cuantas = 0
  const repetidas: string[] = []
  for (const barrio of barrios) {
    if (cuantas >= cadena.maximo) break
    const l = porBarrio.get(barrio)!
    const lugar: LugarDelCatalogo = {
      id: slug(`${cadena.nombre} ${barrio}`),
      nombre: `${cadena.nombre} (${barrio})`,
      tipo: cadena.tipo,
      direccion: `${l.calle}${l.numero ? ` ${l.numero}` : ''}, ${l.barrio}`,
      latitud: Number(l.latitud.toFixed(7)),
      longitud: Number(l.longitud.toFixed(7)),
    }
    const igual = repetido(lugar)
    if (igual) {
      repetidas.push(`${barrio} (ya está "${igual.nombre}")`)
      continue
    }
    entraron.push(lugar)
    cuantas++
    console.log(`OK     ${lugar.nombre}  →  ${lugar.direccion}`)
  }
  console.log(
    `CADENA ${cadena.nombre}: el mapa devolvió ${delMapa.length}, ${validas.length} son sucursales en Montevideo, ` +
      `en ${porBarrio.size} barrios; entraron ${cuantas}.` + (repetidas.length ? ` Repetidas: ${repetidas.join(', ')}.` : ''),
  )
  if (cuantas === 0) afuera.push(`${cadena.nombre}: el mapa no tiene sucursales que se puedan confirmar`)
}

async function verificar() {
  for (const c of CANDIDATOS) await verificarCandidato(c)
  for (const cadena of CADENAS) await verificarCadena(cadena)

  // Si el mapa falló (por ejemplo, nos frenó por buscar demasiado), lo que "no encontró" no vale: no se toca el catálogo.
  if (cuantosErroresDelMapa() > 0) {
    console.log(`
El mapa no contestó bien ${cuantosErroresDelMapa()} veces: NO se escribió el catálogo. Probá de nuevo en un rato (y corré el script de a uno).`)
    process.exitCode = 1
    return
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
  const porTipo = Object.entries(Object.groupBy(entraron, (l) => l.tipo)).map(([t, l]) => `${t} ${l!.length}`)
  console.log(`\n${entraron.length} entraron (${porTipo.join(', ')}), ${afuera.length} quedaron afuera.`)
}

/** Nunca dos a la vez: se anota el número de proceso; si hay otro vivo, este no arranca. */
function unoPorVez(): boolean {
  const carpeta = join(tmpdir(), 'contigo-mapa')
  const archivo = join(carpeta, 'verificar-catalogo.pid')
  mkdirSync(carpeta, { recursive: true })
  try {
    const otro = Number(readFileSync(archivo, 'utf8'))
    if (otro && otro !== process.pid) {
      process.kill(otro, 0) // tira error si ese proceso ya no existe
      console.log(`Ya hay otro verificar-catalogo corriendo (proceso ${otro}). Esperá a que termine.`)
      return false
    }
  } catch {
    // no había otro, o quedó el archivo de uno que ya terminó
  }
  writeFileSync(archivo, String(process.pid))
  process.on('exit', () => {
    try {
      if (Number(readFileSync(archivo, 'utf8')) === process.pid) unlinkSync(archivo)
    } catch {}
  })
  return true
}

if (unoPorVez()) verificar()
else process.exitCode = 1
