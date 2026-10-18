// Catálogo de lugares comunes de Montevideo que /familia le puede SUGERIR al hijo.
  // Lo genera scripts/verificar-catalogo.ts: cada lugar se verificó con el mapa (lib/mapas.ts).
  // La IA nunca inventa lugares: solo puede sugerir los de esta lista. No editar a mano.
  // Verificado el 2026-10-18.

  export interface LugarDelCatalogo {
    id: string
    nombre: string
    tipo: string
    direccion: string
    latitud: number
    longitud: number
  }

  export const CATALOGO_LUGARES: readonly LugarDelCatalogo[] = [
  {
    "id": "hospital-britanico",
    "nombre": "Hospital Británico",
    "tipo": "Salud",
    "direccion": "Avenida Italia 2420",
    "latitud": -34.8945754,
    "longitud": -56.1625434
  },
  {
    "id": "hospital-italiano",
    "nombre": "Hospital Italiano",
    "tipo": "Salud",
    "direccion": "Bulevar Artigas 1632",
    "latitud": -34.8965334,
    "longitud": -56.1645559
  },
  {
    "id": "hospital-maciel",
    "nombre": "Hospital Maciel",
    "tipo": "Salud",
    "direccion": "25 de Mayo 174",
    "latitud": -34.9083534,
    "longitud": -56.2118645
  },
  {
    "id": "casmu-sanatorio-2",
    "nombre": "CASMU (Sanatorio 2)",
    "tipo": "Salud",
    "direccion": "8 de Octubre 3310",
    "latitud": -34.8806487,
    "longitud": -56.1491105
  },
  {
    "id": "hospital-evangelico",
    "nombre": "Hospital Evangélico",
    "tipo": "Salud",
    "direccion": "Bulevar José Batlle y Ordóñez 2759, Unión",
    "latitud": -34.88096,
    "longitud": -56.1468445
  },
  {
    "id": "hospital-pasteur",
    "nombre": "Hospital Pasteur",
    "tipo": "Salud",
    "direccion": "José Antonio Cabrera, Unión",
    "latitud": -34.8750639,
    "longitud": -56.1384305
  },
  {
    "id": "hospital-de-clinicas",
    "nombre": "Hospital de Clínicas",
    "tipo": "Salud",
    "direccion": "Avenida Italia, La Blanqueada",
    "latitud": -34.8907642,
    "longitud": -56.151988
  },
  {
    "id": "medica-uruguaya",
    "nombre": "Médica Uruguaya",
    "tipo": "Salud",
    "direccion": "Avenida 8 de Octubre, Tres Cruces",
    "latitud": -34.8931765,
    "longitud": -56.1625008
  },
  {
    "id": "sanatorio-americano",
    "nombre": "Sanatorio Americano",
    "tipo": "Salud",
    "direccion": "Doctor Enrique Pouey, Tres Cruces",
    "latitud": -34.8995589,
    "longitud": -56.1600856
  },
  {
    "id": "farmacia-san-roque-tres-ombues",
    "nombre": "Farmacia San Roque (Tres Ombúes)",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez 1490, Tres Ombúes",
    "latitud": -34.8732455,
    "longitud": -56.2463537
  },
  {
    "id": "farmashop-carrasco",
    "nombre": "Farmashop (Carrasco)",
    "tipo": "Farmacia",
    "direccion": "Avenida Bolivia, Carrasco",
    "latitud": -34.8929388,
    "longitud": -56.0659995
  },
  {
    "id": "tienda-inglesa-aires-puros",
    "nombre": "Tienda Inglesa (Aires Puros)",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Alberto de Herrera 4462, Aires Puros",
    "latitud": -34.8568742,
    "longitud": -56.1952529
  },
  {
    "id": "devoto-prado",
    "nombre": "Devoto (Prado)",
    "tipo": "Supermercado",
    "direccion": "Avenida Agraciada 3655, Prado",
    "latitud": -34.8655409,
    "longitud": -56.2102483
  },
  {
    "id": "ta-ta-union",
    "nombre": "Ta-Ta (Unión)",
    "tipo": "Supermercado",
    "direccion": "Avenida Italia 3796, Unión",
    "latitud": -34.8870302,
    "longitud": -56.1301911
  },
  {
    "id": "brou-convencion",
    "nombre": "BROU (Convención)",
    "tipo": "Banco",
    "direccion": "Convención 1300, Barrio Sur",
    "latitud": -34.9073893,
    "longitud": -56.1967236
  },
  {
    "id": "bps-atencion-ciudadana",
    "nombre": "BPS (Atención Ciudadana)",
    "tipo": "Trámites",
    "direccion": "Colonia 1851",
    "latitud": -34.9007922,
    "longitud": -56.1768349
  },
  {
    "id": "intendencia-de-montevideo",
    "nombre": "Intendencia de Montevideo",
    "tipo": "Trámites",
    "direccion": "Avenida 18 de Julio 1360",
    "latitud": -34.9065941,
    "longitud": -56.1860929
  },
  {
    "id": "correo-uruguayo-centro",
    "nombre": "Correo Uruguayo (Centro)",
    "tipo": "Trámites",
    "direccion": "Canelones 1358, Centro",
    "latitud": -34.9084827,
    "longitud": -56.18629
  },
  {
    "id": "abitab-cordon",
    "nombre": "Abitab (Cordón)",
    "tipo": "Trámites",
    "direccion": "Colonia, Cordón",
    "latitud": -34.901074,
    "longitud": -56.1766049
  },
  {
    "id": "montevideo-shopping",
    "nombre": "Montevideo Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Luis Alberto de Herrera 1290",
    "latitud": -34.9034768,
    "longitud": -56.1372954
  },
  {
    "id": "punta-carretas-shopping",
    "nombre": "Punta Carretas Shopping",
    "tipo": "Shopping",
    "direccion": "José Ellauri 350",
    "latitud": -34.9238107,
    "longitud": -56.1587422
  },
  {
    "id": "tres-cruces-shopping-y-terminal",
    "nombre": "Tres Cruces (shopping y terminal)",
    "tipo": "Shopping",
    "direccion": "Bulevar Artigas 1825",
    "latitud": -34.8937958,
    "longitud": -56.1664023
  },
  {
    "id": "portones-shopping",
    "nombre": "Portones Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Italia 5775",
    "latitud": -34.8813516,
    "longitud": -56.081088
  },
  {
    "id": "nuevocentro-shopping",
    "nombre": "Nuevocentro Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Luis Alberto de Herrera 3365",
    "latitud": -34.8684338,
    "longitud": -56.1695721
  },
  {
    "id": "plaza-independencia",
    "nombre": "Plaza Independencia",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "latitud": -34.9064755,
    "longitud": -56.1997577
  },
  {
    "id": "plaza-matriz",
    "nombre": "Plaza Matriz",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "latitud": -34.9065843,
    "longitud": -56.2035494
  },
  {
    "id": "plaza-gomensoro",
    "nombre": "Plaza Gomensoro",
    "tipo": "Plaza",
    "direccion": "Pocitos, Montevideo",
    "latitud": -34.9171077,
    "longitud": -56.1496616
  },
  {
    "id": "parque-rodo",
    "nombre": "Parque Rodó",
    "tipo": "Plaza",
    "direccion": "Parque Rodó, Montevideo",
    "latitud": -34.9100822,
    "longitud": -56.1697776
  },
  {
    "id": "parque-batlle",
    "nombre": "Parque Batlle",
    "tipo": "Plaza",
    "direccion": "Parque Batlle, Montevideo",
    "latitud": -34.8939591,
    "longitud": -56.1474165
  },
  {
    "id": "jardin-botanico",
    "nombre": "Jardín Botánico",
    "tipo": "Plaza",
    "direccion": "Prado, Montevideo",
    "latitud": -34.8593556,
    "longitud": -56.2004612
  },
  {
    "id": "club-bigua",
    "nombre": "Club Biguá",
    "tipo": "Club",
    "direccion": "José Vázquez Ledesma 2968, Punta Carretas",
    "latitud": -34.9212415,
    "longitud": -56.1534393
  },
  {
    "id": "club-banco-republica",
    "nombre": "Club Banco República",
    "tipo": "Club",
    "direccion": "Bulevar Juan Benito Blanco 1289, La Mondiola",
    "latitud": -34.9093068,
    "longitud": -56.1433027
  },
  {
    "id": "defensor-sporting",
    "nombre": "Defensor Sporting",
    "tipo": "Club",
    "direccion": "Jaime Zudáñez 2537, Punta Carretas",
    "latitud": -34.9161213,
    "longitud": -56.1576999
  },
  {
    "id": "teatro-solis",
    "nombre": "Teatro Solís",
    "tipo": "Paseo",
    "direccion": "Buenos Aires 652",
    "latitud": -34.9075109,
    "longitud": -56.2009456
  },
  {
    "id": "mercado-del-puerto",
    "nombre": "Mercado del Puerto",
    "tipo": "Paseo",
    "direccion": "Piedras, Ciudad Vieja",
    "latitud": -34.9056495,
    "longitud": -56.2117422
  },
  {
    "id": "mercado-agricola-mam",
    "nombre": "Mercado Agrícola (MAM)",
    "tipo": "Paseo",
    "direccion": "José L. Terra 2220",
    "latitud": -34.8869732,
    "longitud": -56.1834097
  }
]

  /** Los que quedaron afuera porque el mapa no los pudo confirmar. */
  export const QUEDARON_AFUERA: readonly string[] = [
  "Plaza Cagancha (Plaza Libertad): el mapa encontró uno con ese nombre pero en otro barrio (Ituzaingó, Montevideo), no en Centro"
]
  