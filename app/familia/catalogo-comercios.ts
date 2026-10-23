// Catálogo de comercios de Montevideo que toman pedidos por WhatsApp o por teléfono,
// para que /familia se los pueda SUGERIR al hijo. La IA nunca inventa comercios ni números: solo sugiere los de esta lista.
//
// Se carga a mano. Reglas para sumar uno:
//   - Solo comercios que toman pedidos directo (no los que venden solo por PedidosYa, Rappi o app propia, como Ta-Ta).
//   - Los datos salen de la web o las redes oficiales del comercio (anotar el link). Los de directorio son menos confiables.
//   - Todos arrancan con verificado: false. SOLO los verificados se sugieren y se pueden guardar:
//     pasalo a true recién cuando alguien llamó o escribió y confirmó que el número es del comercio y toma pedidos.
//   - La zona de envío va solo si la fuente la dice: con zona, no se sugiere a quien vive fuera de ella.
// Las direcciones de los locales se ubicaron con el mapa (lib/mapas.ts): el barrio y las coordenadas son las del mapa.
// Cargado el 2026-10-23.

export type TipoDeFuente = 'oficial' | 'redes' | 'directorio' | 'prueba'

export interface ComercioDelCatalogo {
  id: string
  nombre: string
  tipo: 'Supermercado' | 'Farmacia' | 'Restaurante'
  /** Dirección del local, o null si es una cadena y se le pide a la central. */
  direccion: string | null
  /** Dónde está el local, según el mapa. null en las cadenas o si el mapa no lo encontró. */
  latitud: number | null
  longitud: number | null
  /** WhatsApp para pedir, o null si solo atiende por teléfono. */
  whatsapp: string | null
  /** Teléfonos para llamar. Si no tiene WhatsApp, se le pide llamando al primero. */
  llamada: string[]
  horario?: string
  /** Barrios a los que envía, si la fuente lo dice. null: la fuente no dice la zona. */
  zonaDeEnvio: string[] | null
  fuente: { tipo: TipoDeFuente; link: string | null; detalle?: string }
  /** Lo que falta confirmar o hay que saber antes de usarlo. */
  nota?: string
  /** Si alguien ya confirmó (llamando o escribiendo) que el número es el del comercio y toma pedidos. */
  verificado: boolean
}

export const CATALOGO_COMERCIOS: readonly ComercioDelCatalogo[] = [
  // Solo para probar la app: el número es de alguien del equipo (el mismo de la pizzería de la familia DEMO).
  // Se pide llamando, para probar el botón "Llamar a…" de /abuelo. Sin local: no se filtra por distancia.
  // Antes de la demo con comercios reales, sacarlo o dejarlo en verificado: false.
  {
    id: 'comercio-de-prueba',
    nombre: 'Comercio de prueba (equipo)',
    tipo: 'Restaurante',
    direccion: null,
    latitud: null,
    longitud: null,
    whatsapp: null,
    llamada: ['+598 92 625 554'],
    zonaDeEnvio: null,
    fuente: { tipo: 'prueba', link: null, detalle: 'número de alguien del equipo' },
    nota: 'Es un comercio de prueba: atiende alguien del equipo.',
    verificado: true,
  },

  // Supermercados y farmacias (cadenas: se le pide a la central)
  {
    id: 'disco',
    nombre: 'Disco',
    tipo: 'Supermercado',
    direccion: null,
    latitud: null,
    longitud: null,
    whatsapp: null,
    llamada: ['0800 4242'],
    horario: 'de 8 a 20 h, todos los días',
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://discouy.disco.com.uy/contacto', detalle: 'compra telefónica' },
    verificado: false,
  },
  {
    id: 'devoto',
    nombre: 'Devoto',
    tipo: 'Supermercado',
    direccion: null,
    latitud: null,
    longitud: null,
    whatsapp: null,
    llamada: ['0800 0033'],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://devoto.com.uy/preguntas-frecuentes' },
    nota: 'Es para consultas de pedidos online: falta confirmar si toma pedidos por teléfono.',
    verificado: false,
  },
  {
    id: 'tienda-inglesa',
    nombre: 'Tienda Inglesa',
    tipo: 'Supermercado',
    direccion: null,
    latitud: null,
    longitud: null,
    whatsapp: null,
    llamada: ['0800 3030', '099 31 3030'],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://www.tiendainglesa.com.uy', detalle: 'Servicio al Cliente' },
    nota: 'Falta confirmar si toma pedidos por teléfono.',
    verificado: false,
  },
  {
    id: 'farmashop',
    nombre: 'Farmashop',
    tipo: 'Farmacia',
    direccion: null,
    latitud: null,
    longitud: null,
    whatsapp: '+598 91 284 848',
    llamada: ['2848 4848'],
    horario: 'de 8 a 23 h',
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://tienda.farmashop.com.uy/preguntas-frecuentes' },
    nota: 'Falta confirmar si toma pedidos nuevos por WhatsApp.',
    verificado: false,
  },

  // Restaurantes con fuente oficial
  {
    id: 'piazza-italia-centro',
    nombre: 'Piazza Italia (Centro)',
    tipo: 'Restaurante',
    direccion: 'Soriano 1384, Centro',
    latitud: -34.9074709,
    longitud: -56.1857577,
    whatsapp: '+598 97 213 707',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://piazzaitalia.uy', detalle: 'pedido automático mandando "Hola"' },
    nota: 'El WhatsApp responde con un pedido automático: hay que empezar mandando "Hola".',
    verificado: false,
  },
  {
    id: 'piazza-italia-pocitos',
    nombre: 'Piazza Italia (Pocitos)',
    tipo: 'Restaurante',
    direccion: 'Gestido 2807, Pocitos',
    latitud: -34.9059273,
    longitud: -56.1534253,
    whatsapp: '+598 97 213 707',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://piazzaitalia.uy', detalle: 'pedido automático mandando "Hola"' },
    nota: 'El WhatsApp responde con un pedido automático: hay que empezar mandando "Hola".',
    verificado: false,
  },
  {
    id: 'fundamento-pizza-ciudad-vieja',
    nombre: 'Fundamento Pizza (Ciudad Vieja)',
    tipo: 'Restaurante',
    direccion: 'Ciudadela 1274, Barrio Sur',
    latitud: -34.9080417,
    longitud: -56.1997405,
    whatsapp: '+598 95 652 543',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://fundamentopizza.com' },
    verificado: false,
  },
  {
    id: 'fundamento-pizza-cordon',
    nombre: 'Fundamento Pizza (Cordón)',
    tipo: 'Restaurante',
    direccion: 'Joaquín de Salterain 1441, Parque Rodó',
    latitud: -34.9025512,
    longitud: -56.1703049,
    whatsapp: '+598 93 551 815',
    llamada: [],
    zonaDeEnvio: ['Punta Carretas', 'Pocitos', 'Cordón'],
    fuente: { tipo: 'oficial', link: 'https://fundamentopizza.com', detalle: 'envíos en Punta Carretas, Pocitos y Cordón' },
    verificado: false,
  },
  {
    id: 'fundamento-pizza-pocitos',
    nombre: 'Fundamento Pizza (Pocitos)',
    tipo: 'Restaurante',
    direccion: 'Francisco Solano Antuña 2647, Punta Carretas',
    latitud: -34.9168651,
    longitud: -56.1565377,
    whatsapp: '+598 95 652 550',
    llamada: [],
    // La zona la dice la web de la marca (no la separa por local).
    zonaDeEnvio: ['Punta Carretas', 'Pocitos', 'Cordón'],
    fuente: { tipo: 'oficial', link: 'https://fundamentopizza.com', detalle: 'envíos en Punta Carretas, Pocitos y Cordón' },
    verificado: false,
  },
  {
    id: 'pizzeria-el-hidalgo',
    nombre: 'Pizzería El Hidalgo',
    tipo: 'Restaurante',
    direccion: 'Nueva Palmira 1899 esquina Defensa, La Comercial',
    latitud: -34.8886279,
    longitud: -56.1748483,
    whatsapp: '+598 99 910 894',
    llamada: ['2208 3969'],
    horario: 'delivery propio hasta la 01:30',
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://pizzeriaelhidalgo.com' },
    verificado: false,
  },
  {
    id: 'la-fabrica-empanadas-centro',
    nombre: 'La Fábrica Empanadas (Centro)',
    tipo: 'Restaurante',
    direccion: 'Dr. Aquiles R. Lanza 1285, Centro',
    latitud: -34.9068725,
    longitud: -56.1879623,
    whatsapp: '+598 94 180 022',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://lafabricaempanadas.com.uy' },
    verificado: false,
  },
  {
    id: 'la-fabrica-empanadas-tres-cruces',
    nombre: 'La Fábrica Empanadas (Tres Cruces)',
    tipo: 'Restaurante',
    direccion: 'Mario Cassinoni 1667, Tres Cruces',
    latitud: -34.8963911,
    longitud: -56.1661648,
    whatsapp: '+598 94 180 022',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://lafabricaempanadas.com.uy' },
    verificado: false,
  },
  {
    id: 'pizza-subte',
    nombre: 'Pizza Subte',
    tipo: 'Restaurante',
    direccion: 'Ejido 1327, Centro',
    latitud: -34.9061369,
    longitud: -56.18691,
    whatsapp: '+598 99 144 137',
    llamada: ['2902 3050'],
    zonaDeEnvio: null,
    fuente: { tipo: 'redes', link: null, detalle: 'página de Facebook del local' },
    verificado: false,
  },

  // Restaurantes con fuente de directorio (menos confiables)
  {
    id: 'pizza-centro',
    nombre: 'Pizza Centro',
    tipo: 'Restaurante',
    direccion: 'Canelones 1099, Barrio Sur',
    latitud: -34.9087366,
    longitud: -56.1923225,
    whatsapp: '+598 93 401 093',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://1122.com.uy' },
    verificado: false,
  },
  {
    id: 'la-pasiva-18-de-julio-899',
    nombre: 'La Pasiva (18 de Julio 899)',
    tipo: 'Restaurante',
    direccion: 'Avenida 18 de Julio 899, Barrio Sur',
    latitud: -34.9062032,
    longitud: -56.1971634,
    whatsapp: null,
    llamada: ['2900 4383'],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://sucursales24uy.com' },
    verificado: false,
  },
  {
    id: 'la-pasiva-plaza-fabini',
    nombre: 'La Pasiva (Plaza Fabini)',
    tipo: 'Restaurante',
    direccion: 'Avenida 18 de Julio 1022, Centro',
    latitud: -34.9062334,
    longitud: -56.1942249,
    whatsapp: null,
    llamada: ['2903 1830'],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://sucursales24uy.com' },
    verificado: false,
  },
  {
    id: 'la-pasiva-18-de-julio-1251',
    nombre: 'La Pasiva (18 de Julio 1251)',
    tipo: 'Restaurante',
    direccion: 'Avenida 18 de Julio 1251, Centro',
    latitud: -34.9055913,
    longitud: -56.1890191,
    whatsapp: null,
    llamada: ['2903 4444'],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://sucursales24uy.com' },
    verificado: false,
  },
  {
    id: 'la-pasiva-tres-cruces',
    nombre: 'La Pasiva (Tres Cruces)',
    tipo: 'Restaurante',
    direccion: 'Bulevar General Artigas 1825, Tres Cruces',
    latitud: -34.8937958,
    longitud: -56.1664023,
    whatsapp: '+598 99 206 010',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://opina.com.uy' },
    nota: 'El WhatsApp es "posible": la fuente no lo asegura.',
    verificado: false,
  },
  {
    id: 'la-pasiva-carrasco',
    nombre: 'La Pasiva (Carrasco)',
    tipo: 'Restaurante',
    direccion: 'Arocena 1644 esquina Schroeder, Carrasco',
    // El mapa no encontró la dirección: sin ubicación, no se sugiere (no se sabe a qué distancia queda).
    latitud: null,
    longitud: null,
    whatsapp: null,
    llamada: ['2600 6904'],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://www.tripadvisor.com', detalle: 'Tripadvisor' },
    verificado: false,
  },
  {
    id: 'la-pasiva-general-rivera',
    nombre: 'La Pasiva (General Rivera)',
    tipo: 'Restaurante',
    direccion: 'Avenida General Rivera 3488, Buceo',
    latitud: -34.9014359,
    longitud: -56.1389534,
    whatsapp: null,
    llamada: ['2628 7262'],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://www.tripadvisor.com', detalle: 'Tripadvisor' },
    verificado: false,
  },
  {
    id: 'la-pasiva-nuevocentro',
    nombre: 'La Pasiva (Nuevocentro Shopping)',
    tipo: 'Restaurante',
    direccion: 'Nuevocentro Shopping',
    // La ubicación del shopping (catalogo-lugares.ts, verificada con el mapa).
    latitud: -34.8684338,
    longitud: -56.1695721,
    whatsapp: null,
    llamada: ['2201 3201'],
    zonaDeEnvio: null,
    fuente: { tipo: 'redes', link: null, detalle: 'página de Facebook del local' },
    verificado: false,
  },
]
