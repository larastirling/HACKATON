// Catálogo de comercios de Montevideo que toman pedidos por WhatsApp o por teléfono,
// para que /familia se los pueda SUGERIR al hijo. La IA nunca inventa comercios ni números: solo sugiere los de esta lista.
//
// Se carga a mano. Reglas para sumar uno:
//   - Solo comercios que toman pedidos directo (no los que venden solo por PedidosYa, Rappi o app propia, como Ta-Ta).
//   - Los datos salen de la web o las redes oficiales del comercio (anotar el link). Los de directorio son menos confiables.
//   - Cada uno tiene su confirmación (ver Confirmacion abajo). Solo los "confirmado por su web" se sugieren solos;
//     los "sin confirmar" aparecen en "Ver todos los cercanos" con el aviso "número sin confirmar", y para guardarlos
//     el hijo tiene que decir que ya le pidieron por ahí y funciona (eso vale solo para su familia).
//   - Un número que un hijo reportó que no anda deja de sugerirse a todas las familias (lib/datos.ts, reportarNumero).
//   - La zona de envío va solo si la fuente la dice: con zona, no se sugiere a quien vive fuera de ella.
// Las direcciones de los locales se ubicaron con el mapa (lib/mapas.ts): el barrio y las coordenadas son las del mapa.
// Cargado el 2026-10-23.

export type TipoDeFuente = 'oficial' | 'redes' | 'directorio' | 'prueba'

/**
 * Quién confirmó que el número toma pedidos:
 * - "confirmado por su web": la web oficial del comercio lo dice de forma explícita (se guarda el link, la fecha y la frase).
 *   Las guías de internet, Tripadvisor o Facebook no cuentan.
 * - "sin confirmar": no se sugiere solo; aparece en "Ver todos" con el aviso.
 * - "de prueba": el comercio del equipo, solo para probar en la compu.
 */
export type Confirmacion =
  | { estado: 'confirmado por su web'; link: string; fecha: string; dice: string }
  | { estado: 'sin confirmar' }
  | { estado: 'de prueba' }

const SIN_CONFIRMAR: Confirmacion = { estado: 'sin confirmar' }

export interface ComercioDelCatalogo {
  id: string
  nombre: string
  tipo: 'Supermercado' | 'Farmacia' | 'Restaurante'
  /**
   * Restaurantes: qué venden ("pizza", "empanadas"), solo si su fuente lo dice (para el buscador de /familia).
   * Si la fuente no lo dice, no va: nunca se adivina. comidaSegun dice de dónde salió.
   */
  comida?: string[]
  comidaSegun?: string
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
  /** Quién confirmó que el número toma pedidos (ver Confirmacion). */
  confirmacion: Confirmacion
  /** Solo para probar: aparece cuando la app corre en una compu, nunca en la app publicada en Vercel. */
  soloEnLaCompu?: boolean
}

export const CATALOGO_COMERCIOS: readonly ComercioDelCatalogo[] = [
  // Solo para probar la app: el número es de alguien del equipo (el mismo de la pizzería de la familia DEMO).
  // Se pide llamando, para probar el botón "Llamar a…" de /abuelo. Sin local: no se filtra por distancia.
  // soloEnLaCompu: en la app publicada (Vercel) no aparece.
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
    confirmacion: { estado: 'de prueba' },
    soloEnLaCompu: true,
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
    confirmacion: {
      estado: 'confirmado por su web',
      link: 'https://discouy.disco.com.uy/contacto',
      fecha: '2026-10-23',
      dice: 'Compra telefónica: Podés hacer tu pedido llamando al: 0800 4242',
    },
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
  },

  // Restaurantes con fuente oficial
  {
    id: 'piazza-italia-centro',
    nombre: 'Piazza Italia (Centro)',
    tipo: 'Restaurante',
    comida: ['pizza'],
    comidaSegun: 'su web (https://piazzaitalia.uy, revisada el 2026-10-23): "Pizzería artesanal en Montevideo"',
    // Su web oficial dice "Centro: San José 1084" (antes teníamos Soriano 1384, de otra fuente).
    direccion: 'San José 1084, Centro',
    latitud: -34.907076,
    longitud: -56.1927841,
    whatsapp: '+598 97 213 707',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://piazzaitalia.uy', detalle: 'pedido automático mandando "Hola"' },
    nota: 'El WhatsApp responde con un pedido automático: hay que empezar mandando "Hola".',
    confirmacion: {
      estado: 'confirmado por su web',
      link: 'https://piazzaitalia.uy',
      fecha: '2026-10-23',
      dice: 'Pedí por WhatsApp y recibila donde estés. [...] Ambos solo para retiro o delivery. [...] WhatsApp: 097 213 707',
    },
  },
  {
    id: 'piazza-italia-pocitos',
    nombre: 'Piazza Italia (Pocitos)',
    tipo: 'Restaurante',
    comida: ['pizza'],
    comidaSegun: 'su web (https://piazzaitalia.uy, revisada el 2026-10-23): "Pizzería artesanal en Montevideo"',
    direccion: 'Gestido 2807, Pocitos',
    latitud: -34.9059273,
    longitud: -56.1534253,
    whatsapp: '+598 97 213 707',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://piazzaitalia.uy', detalle: 'pedido automático mandando "Hola"' },
    nota: 'El WhatsApp responde con un pedido automático: hay que empezar mandando "Hola".',
    confirmacion: {
      estado: 'confirmado por su web',
      link: 'https://piazzaitalia.uy',
      fecha: '2026-10-23',
      dice: 'Pedí por WhatsApp y recibila donde estés. [...] Ambos solo para retiro o delivery. [...] WhatsApp: 097 213 707',
    },
  },
  {
    id: 'fundamento-pizza-ciudad-vieja',
    nombre: 'Fundamento Pizza (Ciudad Vieja)',
    tipo: 'Restaurante',
    comida: ['pizza'],
    comidaSegun: 'su web (https://fundamentopizza.com, revisada el 2026-10-23): "Pizza al horno de leña en Ciudad Vieja, Cordón y Pocitos"',
    direccion: 'Ciudadela 1274, Barrio Sur',
    latitud: -34.9080417,
    longitud: -56.1997405,
    whatsapp: '+598 95 652 543',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://fundamentopizza.com' },
    confirmacion: SIN_CONFIRMAR,
  },
  {
    id: 'fundamento-pizza-cordon',
    nombre: 'Fundamento Pizza (Cordón)',
    tipo: 'Restaurante',
    comida: ['pizza'],
    comidaSegun: 'su web (https://fundamentopizza.com, revisada el 2026-10-23): "Pizza al horno de leña en Ciudad Vieja, Cordón y Pocitos"',
    direccion: 'Joaquín de Salterain 1441, Parque Rodó',
    latitud: -34.9025512,
    longitud: -56.1703049,
    whatsapp: '+598 93 551 815',
    llamada: [],
    zonaDeEnvio: ['Punta Carretas', 'Pocitos', 'Cordón'],
    fuente: { tipo: 'oficial', link: 'https://fundamentopizza.com', detalle: 'envíos en Punta Carretas, Pocitos y Cordón' },
    // Su web solo tiene un botón "WhatsApp" por local, sin decir que sirva para pedir (para pedir ofrece "Pedir online").
    confirmacion: SIN_CONFIRMAR,
  },
  {
    id: 'fundamento-pizza-pocitos',
    nombre: 'Fundamento Pizza (Pocitos)',
    tipo: 'Restaurante',
    comida: ['pizza'],
    comidaSegun: 'su web (https://fundamentopizza.com, revisada el 2026-10-23): "Pizza al horno de leña en Ciudad Vieja, Cordón y Pocitos"',
    direccion: 'Francisco Solano Antuña 2647, Punta Carretas',
    latitud: -34.9168651,
    longitud: -56.1565377,
    whatsapp: '+598 95 652 550',
    llamada: [],
    // La zona la dice la web de la marca (no la separa por local).
    zonaDeEnvio: ['Punta Carretas', 'Pocitos', 'Cordón'],
    fuente: { tipo: 'oficial', link: 'https://fundamentopizza.com', detalle: 'envíos en Punta Carretas, Pocitos y Cordón' },
    confirmacion: SIN_CONFIRMAR,
  },
  {
    id: 'pizzeria-el-hidalgo',
    nombre: 'Pizzería El Hidalgo',
    tipo: 'Restaurante',
    comida: ['pizza', 'empanadas', 'milanesas'],
    comidaSegun: 'su web (https://pizzeriaelhidalgo.com, revisada el 2026-10-23): "Pizzas, Fainá y Figazzas [...] Empanadas [...] Milanesas"',
    direccion: 'Nueva Palmira 1899 esquina Defensa, La Comercial',
    latitud: -34.8886279,
    longitud: -56.1748483,
    whatsapp: '+598 99 910 894',
    llamada: ['2208 3969'],
    horario: 'delivery propio hasta la 01:30',
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://pizzeriaelhidalgo.com' },
    // Su web tiene delivery propio y "Llámanos o escríbenos por WhatsApp" (también enlaza PedidosYa para los envíos).
    confirmacion: {
      estado: 'confirmado por su web',
      link: 'https://pizzeriaelhidalgo.com',
      fecha: '2026-10-23',
      dice: 'Delivery propio del local hasta 01:30 Hrs [...] Teléfono: 2208 3969 WhatsApp: 099 910 894 [...] Contacto: Llámanos o escríbenos por WhatsApp',
    },
  },
  {
    id: 'la-fabrica-empanadas-centro',
    nombre: 'La Fábrica Empanadas (Centro)',
    tipo: 'Restaurante',
    comida: ['empanadas'],
    comidaSegun: 'su web (https://lafabricaempanadas.com.uy, revisada el 2026-10-23): "auténticas empanadas artesanales"',
    direccion: 'Dr. Aquiles R. Lanza 1285, Centro',
    latitud: -34.9068725,
    longitud: -56.1879623,
    whatsapp: '+598 94 180 022',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://lafabricaempanadas.com.uy' },
    confirmacion: {
      estado: 'confirmado por su web',
      link: 'https://lafabricaempanadas.com.uy',
      fecha: '2026-10-23',
      dice: 'Hacé tu pedido de manera automática a través de WhatsApp. Mandá "Hola" al 094180022',
    },
  },
  {
    id: 'la-fabrica-empanadas-tres-cruces',
    nombre: 'La Fábrica Empanadas (Tres Cruces)',
    tipo: 'Restaurante',
    comida: ['empanadas'],
    comidaSegun: 'su web (https://lafabricaempanadas.com.uy, revisada el 2026-10-23): "auténticas empanadas artesanales"',
    direccion: 'Mario Cassinoni 1667, Tres Cruces',
    latitud: -34.8963911,
    longitud: -56.1661648,
    whatsapp: '+598 94 180 022',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'oficial', link: 'https://lafabricaempanadas.com.uy' },
    confirmacion: {
      estado: 'confirmado por su web',
      link: 'https://lafabricaempanadas.com.uy',
      fecha: '2026-10-23',
      dice: 'Hacé tu pedido de manera automática a través de WhatsApp. Mandá "Hola" al 094180022',
    },
  },
  {
    id: 'pizza-subte',
    nombre: 'Pizza Subte',
    tipo: 'Restaurante',
    comida: ['pizza'],
    comidaSegun: 'el nombre del comercio en su fuente ("Pizza Subte")',
    direccion: 'Ejido 1327, Centro',
    latitud: -34.9061369,
    longitud: -56.18691,
    whatsapp: '+598 99 144 137',
    llamada: ['2902 3050'],
    zonaDeEnvio: null,
    fuente: { tipo: 'redes', link: null, detalle: 'página de Facebook del local' },
    confirmacion: SIN_CONFIRMAR,
  },

  // Restaurantes con fuente de directorio (menos confiables)
  {
    id: 'pizza-centro',
    nombre: 'Pizza Centro',
    tipo: 'Restaurante',
    comida: ['pizza'],
    comidaSegun: 'el nombre del comercio en su fuente ("Pizza Centro")',
    direccion: 'Canelones 1099, Barrio Sur',
    latitud: -34.9087366,
    longitud: -56.1923225,
    whatsapp: '+598 93 401 093',
    llamada: [],
    zonaDeEnvio: null,
    fuente: { tipo: 'directorio', link: 'https://1122.com.uy' },
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
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
    confirmacion: SIN_CONFIRMAR,
  },
]
