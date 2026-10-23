// Verifica el catálogo de lugares (Montevideo, Ciudad de la Costa y Las Piedras) con el mapa (lib/mapas.ts) y escribe
// app/familia/catalogo-lugares.ts SOLO con los que el mapa encuentra de verdad, cada uno con su tipo y su barrio.
//
// Hay tres formas de verificar:
//   - Lugar con DIRECCIÓN: el mapa tiene que encontrar la dirección (con el número de puerta exacto) y, buscando
//     por el nombre, ubicar el lugar a menos de 500 m de esa dirección (así no entra una dirección de otro lugar).
//   - Lugar sin dirección (plazas, parques, hospitales, cafés): se busca por el nombre y entra solo si el mapa devuelve
//     ESE lugar (su nombre en el mapa empieza igual). La dirección se toma del mapa, nunca se escribe a mano.
//   - FUENTES (cadenas como Abitab o Farmashop, y tipos de lugar como iglesias o bibliotecas): se le piden al mapa,
//     zona por zona, y entran las que el mapa tiene con ese nombre y esa categoría (farmacia, supermercado, iglesia…).
//     Una por barrio, primero los barrios que todavía tienen menos lugares en el catálogo. Nombre, dirección, barrio y
//     ubicación salen del mapa. Si una zona devuelve el máximo (40), se parte en 4 para no perder sucursales.
//
// Las reglas del mapa (1 búsqueda por segundo, decir quiénes somos, caché) las cumple lib/mapas.ts.
// Además, nunca corren dos a la vez: si ya hay uno corriendo, este no arranca.
// Si el mapa falla (por ejemplo, nos frena), para enseguida y NO escribe nada: el catálogo nunca queda a medias.
// Correrlo (tarda unos minutos la primera vez; después, lo ya buscado sale de la caché):
//   npx tsx@4.20.3 --conditions=react-server scripts/verificar-catalogo.ts

import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { barrioEnElMapa, buscarCoordenadas, buscarVarios, cuantosErroresDelMapa, type LugarDelMapa, type Zona } from '../lib/mapas'

type Tipo =
  | 'Salud'
  | 'Farmacia'
  | 'Supermercado'
  | 'Pagos'
  | 'Banco'
  | 'Trámites'
  | 'Correo'
  | 'Shopping'
  | 'Plaza'
  | 'Club'
  | 'Centro de jubilados'
  | 'Iglesia'
  | 'Biblioteca'
  | 'Cine'
  | 'Teatro'
  | 'Café'
  | 'Mercado'
  | 'Cementerio'
  | 'Paseo'

type Ciudad = 'Montevideo' | 'Ciudad de la Costa' | 'Las Piedras'
const CIUDADES: readonly Ciudad[] = ['Montevideo', 'Ciudad de la Costa', 'Las Piedras']

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
  /** Si no es de Montevideo. */
  ciudad?: Ciudad
}

const CANDIDATOS: Candidato[] = [
  // Salud: hospitales y sanatorios
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
  // Trámites
  { nombre: 'BPS (Atención Ciudadana)', tipo: 'Trámites', direccion: 'Colonia 1851, Montevideo', buscarComo: 'Banco de Previsión Social' },
  { nombre: 'Intendencia de Montevideo', tipo: 'Trámites', direccion: 'Avenida 18 de Julio 1360, Montevideo' },
  // Shoppings
  { nombre: 'Montevideo Shopping', tipo: 'Shopping', direccion: 'Avenida Luis Alberto de Herrera 1290, Montevideo' },
  { nombre: 'Punta Carretas Shopping', tipo: 'Shopping', direccion: 'José Ellauri 350, Montevideo' },
  { nombre: 'Tres Cruces (shopping y terminal)', tipo: 'Shopping', direccion: 'Bulevar Artigas 1825, Montevideo', buscarComo: 'Tres Cruces Shopping' },
  { nombre: 'Portones Shopping', tipo: 'Shopping', direccion: 'Avenida Italia 5775, Montevideo' },
  { nombre: 'Nuevocentro Shopping', tipo: 'Shopping', direccion: 'Avenida Luis Alberto de Herrera 3365, Montevideo' },
  { nombre: 'Costa Urbana Shopping', tipo: 'Shopping', ciudad: 'Ciudad de la Costa' },
  { nombre: 'Las Piedras Shopping', tipo: 'Shopping', ciudad: 'Las Piedras' },
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
  // Mercados y paseos
  { nombre: 'Teatro Solís', tipo: 'Teatro', direccion: 'Buenos Aires 652, Montevideo' },
  { nombre: 'Mercado del Puerto', tipo: 'Mercado', barrio: 'Ciudad Vieja' },
  { nombre: 'Mercado Agrícola (MAM)', tipo: 'Mercado', direccion: 'José L. Terra 2220, Montevideo', buscarComo: 'Mercado Agrícola de Montevideo' },
  // Cafés y bares tradicionales: entran solo si el mapa los tiene con ese nombre (y como café, bar o restaurante).
  { nombre: 'Café Brasilero', tipo: 'Café' },
  { nombre: 'Bar Facal', tipo: 'Café' },
  { nombre: 'Café Bacacay', tipo: 'Café' },
  { nombre: 'Bar Tasende', tipo: 'Café' },
  { nombre: 'Bar Hispano', tipo: 'Café' },
  { nombre: 'Bar Arocena', tipo: 'Café' },
  { nombre: 'Bar Fun Fun', tipo: 'Café' },
  { nombre: 'Expreso Pocitos', tipo: 'Café' },
  { nombre: 'Bar Los Yuyos', tipo: 'Café' },
  { nombre: 'Confitería La Americana', tipo: 'Café' },
  { nombre: 'Oro del Rhin', tipo: 'Café' },
  { nombre: 'Bar Andorra', tipo: 'Café' },
  { nombre: 'El Hacha', tipo: 'Café' },
  { nombre: 'Café Las Misiones', tipo: 'Café' },
]

/** Cadenas o tipos de lugar que se le piden al mapa zona por zona. */
interface Fuente {
  /** Cómo se llama en el catálogo: "Farmashop (Pocitos)". Sin nombre, se usa el del mapa ("Parroquia San Juan"). */
  nombre?: string
  tipo: Tipo
  /** Qué se le pregunta al mapa en cada zona: el nombre de la cadena, o el tipo de lugar ("church in {zona}": {zona} es el nombre de la zona). */
  buscar: string[]
  /** Cómo se llama la sucursal en el mapa (igual, o seguido de otra palabra: "Devoto Malvin"). */
  nombresEnElMapa?: string[]
  /** Además, el nombre tiene que decir esto (por ejemplo "Iglesia", "Parroquia"), o no decir esto otro. */
  nombreDice?: RegExp
  nombreNoDice?: RegExp
  /** Qué tiene que ser para el mapa: así no entra el estacionamiento o el cajero de la cadena. */
  categorias: string[]
  /** Quién lo atiende, según el mapa (o su nombre): por ejemplo, ASSE. */
  atiende?: RegExp
  /** Cuántos como máximo (uno por barrio). */
  maximo: number
}

const FARMACIA = ['amenity/pharmacy', 'shop/chemist']
const SUPERMERCADO = ['shop/supermarket']
const SALUD = ['amenity/hospital', 'amenity/clinic', 'amenity/doctors']

const FUENTES: Fuente[] = [
  // Pagos
  { nombre: 'Abitab', tipo: 'Pagos', buscar: ['Abitab'], nombresEnElMapa: ['Abitab'], categorias: ['amenity/payment_centre', 'amenity/bureau_de_change'], maximo: 40 },
  { nombre: 'RedPagos', tipo: 'Pagos', buscar: ['Redpagos'], nombresEnElMapa: ['Redpagos', 'Red Pagos'], categorias: ['amenity/payment_centre', 'amenity/bureau_de_change', 'shop/stationery', 'shop/yes'], maximo: 19 },
  // Salud: mutualistas y policlínicas de ASSE
  { nombre: 'CASMU', tipo: 'Salud', buscar: ['CASMU'], nombresEnElMapa: ['CASMU'], categorias: SALUD, maximo: 5 },
  { nombre: 'Médica Uruguaya', tipo: 'Salud', buscar: ['Médica Uruguaya'], nombresEnElMapa: ['Médica Uruguaya'], categorias: SALUD, maximo: 5 },
  { nombre: 'SMI', tipo: 'Salud', buscar: ['SMI', 'Servicio Médico Integral'], nombresEnElMapa: ['SMI', 'Servicio Médico Integral', 'Sanatorio SMI'], categorias: SALUD, maximo: 3 },
  { nombre: 'Asociación Española', tipo: 'Salud', buscar: ['Asociación Española'], nombresEnElMapa: ['Asociación Española'], categorias: SALUD, maximo: 4 },
  { nombre: 'Círculo Católico', tipo: 'Salud', buscar: ['Círculo Católico'], nombresEnElMapa: ['Círculo Católico'], categorias: SALUD, maximo: 4 },
  { nombre: 'COSEM', tipo: 'Salud', buscar: ['COSEM'], nombresEnElMapa: ['COSEM'], categorias: SALUD, maximo: 2 },
  {
    tipo: 'Salud',
    buscar: ['policlínica', 'clinic in {zona}', 'centro de salud'],
    nombreDice: /policl[ií]nica|centro de salud|asse/i,
    categorias: SALUD,
    atiende: /\bASSE\b|Administraci[oó]n de los Servicios de Salud/i,
    maximo: 15,
  },
  // Supermercados
  { nombre: 'Disco', tipo: 'Supermercado', buscar: ['Disco'], nombresEnElMapa: ['Disco'], categorias: SUPERMERCADO, maximo: 8 },
  { nombre: 'Devoto', tipo: 'Supermercado', buscar: ['Devoto'], nombresEnElMapa: ['Devoto'], categorias: SUPERMERCADO, maximo: 6 },
  { nombre: 'Tienda Inglesa', tipo: 'Supermercado', buscar: ['Tienda Inglesa'], nombresEnElMapa: ['Tienda Inglesa'], categorias: SUPERMERCADO, maximo: 6 },
  { nombre: 'Ta-Ta', tipo: 'Supermercado', buscar: ['Ta-Ta'], nombresEnElMapa: ['Ta-Ta', 'Ta - Ta', 'Tata'], categorias: SUPERMERCADO, maximo: 14 },
  { nombre: 'Kinko', tipo: 'Supermercado', buscar: ['Kinko'], nombresEnElMapa: ['Kinko'], categorias: [...SUPERMERCADO, 'shop/convenience'], maximo: 8 },
  { nombre: 'El Dorado', tipo: 'Supermercado', buscar: ['El Dorado'], nombresEnElMapa: ['El Dorado'], categorias: SUPERMERCADO, maximo: 6 },
  { nombre: 'Macro Mercado', tipo: 'Supermercado', buscar: ['Macro Mercado'], nombresEnElMapa: ['Macro Mercado', 'Macromercado'], categorias: SUPERMERCADO, maximo: 4 },
  { nombre: 'Géant', tipo: 'Supermercado', buscar: ['Géant'], nombresEnElMapa: ['Géant'], categorias: SUPERMERCADO, maximo: 2 },
  // Farmacias
  { nombre: 'Farmashop', tipo: 'Farmacia', buscar: ['Farmashop'], nombresEnElMapa: ['Farmashop'], categorias: FARMACIA, maximo: 15 },
  { nombre: 'Farmacia San Roque', tipo: 'Farmacia', buscar: ['San Roque'], nombresEnElMapa: ['San Roque'], categorias: FARMACIA, maximo: 16 },
  { nombre: 'Farmacia El Túnel', tipo: 'Farmacia', buscar: ['Farmacia El Túnel'], nombresEnElMapa: ['El Túnel'], categorias: FARMACIA, maximo: 4 },
  // Bancos y trámites
  { nombre: 'BROU', tipo: 'Banco', buscar: ['BROU'], nombresEnElMapa: ['República', 'BROU'], categorias: ['amenity/bank'], maximo: 15 },
  { nombre: 'BPS', tipo: 'Trámites', buscar: ['Banco de Previsión Social', 'BPS'], nombresEnElMapa: ['Banco de Previsión Social', 'BPS'], categorias: ['office/government'], maximo: 4 },
  { nombre: 'Correo Uruguayo', tipo: 'Correo', buscar: ['Correo Uruguayo'], nombresEnElMapa: ['Correo Uruguayo'], categorias: ['amenity/post_office'], maximo: 10 },
  // Vida social
  {
    tipo: 'Iglesia',
    buscar: ['church in {zona}', 'place of worship in {zona}'],
    nombreDice: /iglesia|parroquia|capilla|catedral|bas[ií]lica|santuario|templo|sinagoga/i,
    categorias: ['amenity/place_of_worship'],
    maximo: 20,
  },
  { tipo: 'Biblioteca', buscar: ['biblioteca en {zona}', 'library in {zona}'], categorias: ['amenity/library'], maximo: 10 },
  { tipo: 'Cine', buscar: ['cine en {zona}', 'cinema in {zona}'], categorias: ['amenity/cinema'], maximo: 8 },
  { tipo: 'Teatro', buscar: ['teatro en {zona}', 'theatre in {zona}'], nombreNoDice: /anfiteatro/i, categorias: ['amenity/theatre'], maximo: 10 },
  {
    tipo: 'Club',
    buscar: ['community centre in {zona}', 'club'],
    nombreDice: /^(club|centro social|centro cultural|asociaci[oó]n|sociedad|ateneo)/i,
    nombreNoDice: /municipio|ccz|policl/i,
    categorias: ['amenity/community_centre', 'leisure/sports_centre', 'club/sport', 'club/social'],
    maximo: 20,
  },
  {
    tipo: 'Centro de jubilados',
    buscar: ['jubilados', 'adulto mayor', 'tercera edad'],
    nombreDice: /jubilad|pensionist|adulto mayor|adultos mayores|tercera edad|abuel/i,
    nombreNoDice: /residencial|hogar de ancianos/i,
    categorias: ['amenity/community_centre', 'amenity/social_facility', 'office/ngo', 'office/association', 'club/social', 'building/yes', 'amenity/social_centre'],
    maximo: 10,
  },
  { tipo: 'Cementerio', buscar: ['cementerio en {zona}', 'cemetery in {zona}'], nombreDice: /cementerio/i, categorias: ['landuse/cemetery', 'amenity/grave_yard'], maximo: 6 },
]

/**
 * Sucursales que el mapa devuelve pero que revisamos a mano y no van: el dato del mapa no cierra.
 * (Si otra sucursal de la misma cadena entra en su lugar, está bien.)
 */
const NO_INCLUIR: Record<string, string> = {
  'Disco (Malvín)': 'revisado a mano: el mapa la pone en Avenida Italia 11400, un número que no corresponde a Malvín',
  'Géant (Jacinto Vera)': 'revisado a mano: el mapa la pone en Gualeguay 3350 y no pudimos confirmar que sea un Géant',
}

/** Dónde se busca: Montevideo (partido en 4 si hace falta), Ciudad de la Costa y Las Piedras. Oeste, norte, este, sur. */
const ZONAS: { nombre: string; zona: Zona }[] = [
  { nombre: 'Montevideo', zona: [-56.43, -34.7, -56.02, -34.94] },
  { nombre: 'Ciudad de la Costa', zona: [-56.03, -34.78, -55.85, -34.89] },
  { nombre: 'Las Piedras', zona: [-56.25, -34.69, -56.18, -34.76] },
]
/** El mapa devuelve hasta 40 por búsqueda: si llega a 40, la zona se parte en 4 (hasta 3 veces). */
const MAXIMO_DEL_MAPA = 40
const PARTIR_HASTA = 3

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
  barrio: string
  ciudad: Ciudad
}

const entraron: LugarDelCatalogo[] = []
const afuera: string[] = []

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** El mapa falló (por ejemplo, nos frenó): se para enseguida, sin escribir nada. */
class ElMapaFallo extends Error {}
function siElMapaFalloParar() {
  if (cuantosErroresDelMapa() > 0) throw new ElMapaFallo()
}

/**
 * Arma la dirección con lo que devuelve el mapa (nunca a mano):
 * "Hospital Evangélico, 2759, Bulevar José Batlle y Ordóñez, Unión, Montevideo, 11820, Uruguay" → "Bulevar José Batlle y Ordóñez 2759".
 * Sin número de puerta → "José Antonio Cabrera". Sin calle (plazas, parques) → "" (queda solo el barrio).
 */
function calleDesdeElMapa(delMapa: string): string {
  const [, ...resto] = delMapa.split(',').map((p) => p.trim())
  const utiles = resto.filter((p) => !/^\d{5}$/.test(p) && p !== 'Uruguay' && !CIUDADES.includes(p as Ciudad) && p !== 'Canelones')
  const numero = utiles.findIndex((p) => /^\d{1,4}([,;]\d{1,4})*$/.test(p))
  if (numero >= 0 && utiles[numero + 1]) return `${utiles[numero + 1]} ${utiles[numero].split(/[,;]/)[0]}`
  return ''
}

/** "Calle 123, Pocitos" en Montevideo; "Calle 123, Lagomar, Ciudad de la Costa" afuera. Sin calle: solo el barrio. */
function direccionCompleta(calle: string, barrio: string, ciudad: Ciudad): string {
  const partes = [calle, barrio, ciudad !== 'Montevideo' && ciudad !== barrio ? ciudad : ''].filter(Boolean)
  return partes.length === 1 && ciudad === 'Montevideo' ? `${partes[0]}, Montevideo` : partes.join(', ')
}

/** "Farmacia San Roque (Pocitos)" → "san roque": dos farmacias distintas pueden estar en la misma cuadra. */
const marca = (nombre: string) => sinTildes(nombre.replace(/\s*\(.*\)$/, '')).replace(/^farmacia /, '').trim()

/** Dos del mismo tipo a menos de esto son el mismo lugar aunque se llamen distinto ("Sanatorio SMI" y "SMI"). */
const METROS_MISMO_PUNTO = 30

/** Si ya hay un lugar con ese nombre, de la misma marca a pocos metros, o del mismo tipo en el mismo punto, es repetido. */
function repetido(lugar: Pick<LugarDelCatalogo, 'nombre' | 'tipo' | 'latitud' | 'longitud'>): LugarDelCatalogo | undefined {
  return entraron.find(
    (l) =>
      slug(l.nombre) === slug(lugar.nombre) ||
      (marca(l.nombre) === marca(lugar.nombre) && distanciaEnMetros(l, lugar) < METROS_MISMO_LUGAR) ||
      (l.tipo === lugar.tipo && distanciaEnMetros(l, lugar) < METROS_MISMO_PUNTO),
  )
}

const dejarAfuera = (texto: string) => {
  afuera.push(texto)
  console.log(`AFUERA ${texto}`)
}

/** El barrio de un candidato: el que dice el mapa en la dirección, o el del punto. */
async function barrioDelCandidato(c: Candidato, delMapa: string, punto: Punto): Promise<string | undefined> {
  if (c.barrio && sinTildes(delMapa).includes(sinTildes(c.barrio))) return c.barrio
  return (await barrioEnElMapa(punto.latitud, punto.longitud)) ?? (c.ciudad === 'Las Piedras' ? 'Las Piedras' : undefined)
}

async function verificarCandidato(c: Candidato) {
  const ciudad = c.ciudad ?? 'Montevideo'
  const nombreParaBuscar = c.buscarComo ?? c.nombre
  const porNombre = await buscarCoordenadas(`${nombreParaBuscar}, ${ciudad}`)
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
  } else if (ciudad !== 'Montevideo' && !sinTildes(porNombre.direccionDelMapa).includes(sinTildes(ciudad))) {
    motivo = `el mapa lo encontró, pero no en ${ciudad}`
  }
  if (!motivo && c.barrio && ubicacion && !sinTildes(ubicacion.direccionDelMapa).includes(sinTildes(c.barrio))) {
    motivo = `el mapa encontró uno con ese nombre pero en otro barrio (${ubicacion.direccionDelMapa.split(',').slice(1, 3).join(',').trim()}), no en ${c.barrio}`
  }
  siElMapaFalloParar()
  if (motivo || !ubicacion) return dejarAfuera(`${c.nombre}: ${motivo}`)
  const barrio = await barrioDelCandidato(c, ubicacion.direccionDelMapa, ubicacion)
  siElMapaFalloParar()
  if (!barrio) return dejarAfuera(`${c.nombre}: el mapa no dice en qué barrio queda`)
  const calle = c.direccion ? c.direccion.replace(/, Montevideo$/, '') : calleDesdeElMapa(ubicacion.direccionDelMapa)
  const lugar: LugarDelCatalogo = {
    id: slug(c.nombre),
    nombre: c.nombre,
    tipo: c.tipo,
    direccion: direccionCompleta(calle, barrio, ciudad),
    barrio,
    ciudad,
    latitud: Number(ubicacion.latitud.toFixed(7)),
    longitud: Number(ubicacion.longitud.toFixed(7)),
  }
  const igual = repetido(lugar)
  if (igual) return dejarAfuera(`${c.nombre}: es el mismo lugar que "${igual.nombre}"`)
  entraron.push(lugar)
  console.log(`OK     ${c.nombre}  →  ${lugar.direccion}`)
}

/** Las 4 partes de una zona. */
function partir([oeste, norte, este, sur]: Zona): Zona[] {
  const medioLon = (oeste + este) / 2
  const medioLat = (norte + sur) / 2
  return [
    [oeste, norte, medioLon, medioLat],
    [medioLon, norte, este, medioLat],
    [oeste, medioLat, medioLon, sur],
    [medioLon, medioLat, este, sur],
  ]
}

/** Todo lo que el mapa tiene con ese texto en la zona (si llega al máximo, la parte en 4 y busca en cada una). */
async function buscarEnLaZona(texto: string, zona: Zona, veces = 0): Promise<LugarDelMapa[]> {
  const encontrados = await buscarVarios(texto, zona)
  siElMapaFalloParar()
  if (encontrados.length < MAXIMO_DEL_MAPA || veces >= PARTIR_HASTA) return encontrados
  const partes: LugarDelMapa[] = []
  for (const parte of partir(zona)) partes.push(...(await buscarEnLaZona(texto, parte, veces + 1)))
  return partes
}

const prioridadDelBarrio = (barrio: string) => {
  const i = BARRIOS_PRIMERO.findIndex((b) => sinTildes(barrio).startsWith(sinTildes(b)))
  return i === -1 ? BARRIOS_PRIMERO.length : i
}

/** "Malvín Nuevo" y "Malvín Norte" cuentan como Malvín: una sucursal por barrio. */
const barrioBase = (barrio: string) => BARRIOS_PRIMERO.find((b) => sinTildes(barrio).startsWith(sinTildes(b))) ?? barrio
/** Cuántos lugares tiene ya el catálogo en ese barrio: los barrios con menos van primero (así quedan repartidos). */
const cuantosHayEn = (barrio: string) => entraron.filter((l) => barrioBase(l.barrio) === barrioBase(barrio)).length

const ciudadDe = (l: LugarDelMapa): Ciudad | undefined => CIUDADES.find((c) => c === l.ciudad)

/** Nombres que no dicen cuál es ("Policlínica", "Centro Cultural"): se les agrega el barrio. */
const NOMBRE_GENERICO = /^(policl[ií]nica|centro cultural|centro de salud|iglesia( evang[eé]lica)?|capilla|parroquia|biblioteca|cine|teatro|club)$/i

async function verificarFuente(fuente: Fuente) {
  const etiqueta = fuente.nombre ?? `${fuente.tipo} (${fuente.buscar.join(', ')})`
  const delMapa: LugarDelMapa[] = []
  for (const { nombre, zona } of ZONAS) for (const texto of fuente.buscar) delMapa.push(...(await buscarEnLaZona(texto.replace('{zona}', nombre), zona)))
  const esDeLaFuente = (l: LugarDelMapa) =>
    (!fuente.nombresEnElMapa ||
      fuente.nombresEnElMapa.some((n) => sinTildes(l.nombre) === sinTildes(n) || sinTildes(l.nombre).startsWith(`${sinTildes(n)} `))) &&
    (!fuente.nombreDice || fuente.nombreDice.test(l.nombre)) &&
    (!fuente.nombreNoDice || !fuente.nombreNoDice.test(l.nombre)) &&
    (!fuente.atiende || fuente.atiende.test(l.quienAtiende ?? '') || fuente.atiende.test(l.nombre))
  const validas = delMapa.filter((l) => {
    const ciudad = ciudadDe(l)
    return esDeLaFuente(l) && fuente.categorias.includes(l.categoria) && ciudad && (l.barrio || ciudad === 'Las Piedras')
  })
  // Por barrio, el que tiene número de puerta primero.
  const porBarrio = new Map<string, LugarDelMapa>()
  for (const l of validas) {
    const barrio = barrioBase(l.barrio ?? 'Las Piedras')
    const anterior = porBarrio.get(barrio)
    if (!anterior || (!anterior.numero && l.numero)) porBarrio.set(barrio, l)
  }
  // Primero los barrios con menos lugares en el catálogo; si empatan, los de BARRIOS_PRIMERO.
  const barrios = [...porBarrio.keys()].sort((a, b) => cuantosHayEn(a) - cuantosHayEn(b) || prioridadDelBarrio(a) - prioridadDelBarrio(b))
  let cuantas = 0
  const repetidas: string[] = []
  for (const barrioDeLaLista of barrios) {
    if (cuantas >= fuente.maximo) break
    const l = porBarrio.get(barrioDeLaLista)!
    const ciudad = ciudadDe(l)!
    const barrio = l.barrio ?? 'Las Piedras'
    // Con el nombre de la fuente: "Farmashop (Pocitos)". Con el del mapa: tal cual, y el barrio si se repite el nombre.
    const nombreDelMapa = l.nombre.trim()
    const nombre = fuente.nombre
      ? `${fuente.nombre} (${barrio})`
      : NOMBRE_GENERICO.test(nombreDelMapa) || entraron.some((x) => slug(x.nombre) === slug(nombreDelMapa))
        ? `${nombreDelMapa} (${barrio})`
        : nombreDelMapa
    const lugar: LugarDelCatalogo = {
      id: slug(nombre),
      nombre,
      tipo: fuente.tipo,
      direccion: direccionCompleta(`${l.calle ?? ''}${l.calle && l.numero ? ` ${l.numero}` : ''}`, barrio, ciudad),
      barrio,
      ciudad,
      latitud: Number(l.latitud.toFixed(7)),
      longitud: Number(l.longitud.toFixed(7)),
    }
    if (NO_INCLUIR[lugar.nombre]) {
      dejarAfuera(`${lugar.nombre}: ${NO_INCLUIR[lugar.nombre]}`)
      continue
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
    `FUENTE ${etiqueta}: el mapa devolvió ${delMapa.length}, ${validas.length} sirven, en ${porBarrio.size} barrios; entraron ${cuantas}.` +
      (repetidas.length ? ` Repetidas: ${repetidas.join(', ')}.` : ''),
  )
  if (cuantas === 0) dejarAfuera(`${etiqueta}: el mapa no tiene ninguno que se pueda confirmar`)
}

async function verificar() {
  try {
    for (const c of CANDIDATOS) await verificarCandidato(c)
    for (const fuente of FUENTES) await verificarFuente(fuente)
  } catch (error) {
    if (!(error instanceof ElMapaFallo)) throw error
  }

  // Si el mapa falló (por ejemplo, nos frenó por buscar demasiado), lo que "no encontró" no vale: no se toca el catálogo.
  if (cuantosErroresDelMapa() > 0) {
    console.log(`
El mapa no contestó bien ${cuantosErroresDelMapa()} veces: se paró y NO se escribió el catálogo. Probá de nuevo en un rato (lo ya buscado queda en la caché).`)
    process.exitCode = 1
    return
  }

  const archivo = `// Catálogo de lugares comunes (Montevideo, Ciudad de la Costa y Las Piedras) que /familia le puede SUGERIR al hijo.
// Lo genera scripts/verificar-catalogo.ts: cada lugar se verificó con el mapa (lib/mapas.ts).
// La IA nunca inventa lugares: solo puede sugerir los de esta lista. No editar a mano.
// Verificado el ${new Date().toISOString().slice(0, 10)}.

export interface LugarDelCatalogo {
  id: string
  nombre: string
  tipo: string
  direccion: string
  barrio: string
  ciudad: string
  latitud: number
  longitud: number
}

export const CATALOGO_LUGARES: readonly LugarDelCatalogo[] = ${JSON.stringify(entraron, null, 2)}

/** Los que quedaron afuera porque el mapa no los pudo confirmar. */
export const QUEDARON_AFUERA: readonly string[] = ${JSON.stringify(afuera, null, 2)}
`
  writeFileSync(join(process.cwd(), 'app', 'familia', 'catalogo-lugares.ts'), archivo)
  const contar = (clave: (l: LugarDelCatalogo) => string) =>
    Object.entries(Object.groupBy(entraron, clave))
      .sort((a, b) => b[1]!.length - a[1]!.length)
      .map(([t, l]) => `${t} ${l!.length}`)
      .join(', ')
  console.log(`\n${entraron.length} entraron, ${afuera.length} quedaron afuera.`)
  console.log(`POR TIPO: ${contar((l) => l.tipo)}`)
  console.log(`POR CIUDAD: ${contar((l) => l.ciudad)}`)
  console.log(`POR BARRIO: ${contar((l) => `${l.barrio}${l.ciudad !== 'Montevideo' && l.barrio !== l.ciudad ? ` (${l.ciudad})` : ''}`)}`)
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
