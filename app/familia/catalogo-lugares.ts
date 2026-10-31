// Catálogo de lugares comunes (Montevideo, Ciudad de la Costa y Las Piedras) que /familia le puede SUGERIR al hijo.
// Lo genera scripts/verificar-catalogo.ts: cada lugar se verificó con el mapa (lib/mapas.ts).
// La IA nunca inventa lugares: solo puede sugerir los de esta lista. No editar a mano.
// Verificado el 2026-10-31.

export interface LugarDelCatalogo {
  id: string
  nombre: string
  tipo: string
  direccion: string
  barrio: string
  ciudad: string
  latitud: number
  longitud: number
  /** Qué comida tiene, solo si el mapa lo dice ("pizza", "parrilla"). */
  comida?: string[]
  /** De dónde sale el dato (los baños: "OpenStreetMap: baño público"). */
  fuente?: string
  /** Si no está confirmado, por qué (por ejemplo, el baño de un shopping que el mapa no confirma). */
  sinConfirmar?: string
}

export const CATALOGO_LUGARES: readonly LugarDelCatalogo[] = [
  {
    "id": "hospital-britanico",
    "nombre": "Hospital Británico",
    "tipo": "Salud",
    "direccion": "Avenida Italia 2420, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.894275,
    "longitud": -56.1630004
  },
  {
    "id": "hospital-italiano",
    "nombre": "Hospital Italiano",
    "tipo": "Salud",
    "direccion": "Bulevar Artigas 1632, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.896532,
    "longitud": -56.1645594
  },
  {
    "id": "hospital-maciel",
    "nombre": "Hospital Maciel",
    "tipo": "Salud",
    "direccion": "25 de Mayo 174, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9080025,
    "longitud": -56.2120333
  },
  {
    "id": "casmu-sanatorio-2",
    "nombre": "CASMU (Sanatorio 2)",
    "tipo": "Salud",
    "direccion": "8 de Octubre 3310, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8806487,
    "longitud": -56.1491105
  },
  {
    "id": "hospital-evangelico",
    "nombre": "Hospital Evangélico",
    "tipo": "Salud",
    "direccion": "Bulevar José Batlle y Ordóñez 2759, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.88096,
    "longitud": -56.1468445
  },
  {
    "id": "hospital-pasteur",
    "nombre": "Hospital Pasteur",
    "tipo": "Salud",
    "direccion": "Unión, Montevideo",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8750639,
    "longitud": -56.1384305
  },
  {
    "id": "hospital-de-clinicas",
    "nombre": "Hospital de Clínicas",
    "tipo": "Salud",
    "direccion": "La Blanqueada, Montevideo",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8907642,
    "longitud": -56.151988
  },
  {
    "id": "medica-uruguaya",
    "nombre": "Médica Uruguaya",
    "tipo": "Salud",
    "direccion": "Tres Cruces, Montevideo",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8931765,
    "longitud": -56.1625008
  },
  {
    "id": "sanatorio-americano",
    "nombre": "Sanatorio Americano",
    "tipo": "Salud",
    "direccion": "Tres Cruces, Montevideo",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8995589,
    "longitud": -56.1600856
  },
  {
    "id": "hospital-policial",
    "nombre": "Hospital Policial",
    "tipo": "Salud",
    "direccion": "Bulevar José Batlle y Ordóñez 3574, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8685636,
    "longitud": -56.1607557
  },
  {
    "id": "hospital-militar",
    "nombre": "Hospital Militar",
    "tipo": "Salud",
    "direccion": "La Blanqueada, Montevideo",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8845639,
    "longitud": -56.1540567
  },
  {
    "id": "hospital-espanol",
    "nombre": "Hospital Español",
    "tipo": "Salud",
    "direccion": "Avenida General José Garibaldi 1729, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8750288,
    "longitud": -56.1814005
  },
  {
    "id": "sanatorio-smi",
    "nombre": "Sanatorio SMI",
    "tipo": "Salud",
    "direccion": "Avenida Luis Alberto de Herrera 2275, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8854599,
    "longitud": -56.1503468
  },
  {
    "id": "bps-atencion-ciudadana",
    "nombre": "BPS (Atención Ciudadana)",
    "tipo": "Trámites",
    "direccion": "Colonia 1851, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9007962,
    "longitud": -56.176835
  },
  {
    "id": "intendencia-de-montevideo",
    "nombre": "Intendencia de Montevideo",
    "tipo": "Trámites",
    "direccion": "Avenida 18 de Julio 1360, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9056963,
    "longitud": -56.186173
  },
  {
    "id": "montevideo-shopping",
    "nombre": "Montevideo Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.904097,
    "longitud": -56.137255
  },
  {
    "id": "punta-carretas-shopping",
    "nombre": "Punta Carretas Shopping",
    "tipo": "Shopping",
    "direccion": "José Ellauri 350, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9236262,
    "longitud": -56.159748
  },
  {
    "id": "tres-cruces-shopping-y-terminal",
    "nombre": "Tres Cruces (shopping y terminal)",
    "tipo": "Shopping",
    "direccion": "Bulevar Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8943095,
    "longitud": -56.165202
  },
  {
    "id": "portones-shopping",
    "nombre": "Portones Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Italia 5775, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8824435,
    "longitud": -56.0827562
  },
  {
    "id": "nuevocentro-shopping",
    "nombre": "Nuevocentro Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Luis Alberto de Herrera 3365, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8688111,
    "longitud": -56.168912
  },
  {
    "id": "costa-urbana-shopping",
    "nombre": "Costa Urbana Shopping",
    "tipo": "Shopping",
    "direccion": "San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8409537,
    "longitud": -55.9941516
  },
  {
    "id": "las-piedras-shopping",
    "nombre": "Las Piedras Shopping",
    "tipo": "Shopping",
    "direccion": "Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7253315,
    "longitud": -56.2036048
  },
  {
    "id": "plaza-independencia",
    "nombre": "Plaza Independencia",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9064755,
    "longitud": -56.1997577
  },
  {
    "id": "plaza-matriz",
    "nombre": "Plaza Matriz",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9065843,
    "longitud": -56.2035494
  },
  {
    "id": "plaza-zabala",
    "nombre": "Plaza Zabala",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9076019,
    "longitud": -56.2081314
  },
  {
    "id": "plaza-fabini",
    "nombre": "Plaza Fabini",
    "tipo": "Plaza",
    "direccion": "Centro, Montevideo",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9056266,
    "longitud": -56.1942305
  },
  {
    "id": "plaza-de-los-treinta-y-tres",
    "nombre": "Plaza de los Treinta y Tres",
    "tipo": "Plaza",
    "direccion": "Cordón, Montevideo",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9030168,
    "longitud": -56.1803077
  },
  {
    "id": "plaza-gomensoro",
    "nombre": "Plaza Gomensoro",
    "tipo": "Plaza",
    "direccion": "Pocitos, Montevideo",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9171077,
    "longitud": -56.1496616
  },
  {
    "id": "parque-villa-biarritz",
    "nombre": "Parque Villa Biarritz",
    "tipo": "Plaza",
    "direccion": "Punta Carretas, Montevideo",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9211501,
    "longitud": -56.1539465
  },
  {
    "id": "parque-rodo",
    "nombre": "Parque Rodó",
    "tipo": "Plaza",
    "direccion": "Parque Rodó, Montevideo",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9100822,
    "longitud": -56.1697776
  },
  {
    "id": "parque-batlle",
    "nombre": "Parque Batlle",
    "tipo": "Plaza",
    "direccion": "Parque Batlle, Montevideo",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8939591,
    "longitud": -56.1474165
  },
  {
    "id": "parque-rivera",
    "nombre": "Parque Rivera",
    "tipo": "Plaza",
    "direccion": "Malvín, Montevideo",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8797061,
    "longitud": -56.0921249
  },
  {
    "id": "parque-baroffio",
    "nombre": "Parque Baroffio",
    "tipo": "Plaza",
    "direccion": "Malvín, Montevideo",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8939581,
    "longitud": -56.0901465
  },
  {
    "id": "plaza-de-la-armada",
    "nombre": "Plaza de la Armada",
    "tipo": "Plaza",
    "direccion": "Punta Gorda, Montevideo",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8989781,
    "longitud": -56.0811901
  },
  {
    "id": "jardin-botanico",
    "nombre": "Jardín Botánico",
    "tipo": "Plaza",
    "direccion": "Prado, Montevideo",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8593556,
    "longitud": -56.2004612
  },
  {
    "id": "parque-capurro",
    "nombre": "Parque Capurro",
    "tipo": "Plaza",
    "direccion": "Capurro, Montevideo",
    "barrio": "Capurro",
    "ciudad": "Montevideo",
    "latitud": -34.8729595,
    "longitud": -56.2144365
  },
  {
    "id": "parque-vaz-ferreira",
    "nombre": "Parque Vaz Ferreira",
    "tipo": "Plaza",
    "direccion": "Cerro, Montevideo",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8959705,
    "longitud": -56.2578414
  },
  {
    "id": "plaza-samuel-lafone",
    "nombre": "Plaza Samuel Lafone",
    "tipo": "Plaza",
    "direccion": "Tres Ombúes, Montevideo",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8676301,
    "longitud": -56.2371127
  },
  {
    "id": "club-bigua",
    "nombre": "Club Biguá",
    "tipo": "Club",
    "direccion": "José Vázquez Ledesma 2968, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9212415,
    "longitud": -56.1534393
  },
  {
    "id": "club-banco-republica",
    "nombre": "Club Banco República",
    "tipo": "Club",
    "direccion": "Bulevar Juan Benito Blanco 1289, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9093068,
    "longitud": -56.1433027
  },
  {
    "id": "defensor-sporting",
    "nombre": "Defensor Sporting",
    "tipo": "Club",
    "direccion": "Jaime Zudáñez 2537, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9161213,
    "longitud": -56.1576999
  },
  {
    "id": "teatro-solis",
    "nombre": "Teatro Solís",
    "tipo": "Teatro",
    "direccion": "Buenos Aires 652, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9074063,
    "longitud": -56.2012162
  },
  {
    "id": "mercado-del-puerto",
    "nombre": "Mercado del Puerto",
    "tipo": "Mercado",
    "direccion": "Ciudad Vieja, Montevideo",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9056495,
    "longitud": -56.2117422
  },
  {
    "id": "mercado-agricola-mam",
    "nombre": "Mercado Agrícola (MAM)",
    "tipo": "Mercado",
    "direccion": "José L. Terra 2220, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8867762,
    "longitud": -56.1839119
  },
  {
    "id": "cafe-brasilero",
    "nombre": "Café Brasilero",
    "tipo": "Café",
    "direccion": "Ituzaingó 1447, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9056692,
    "longitud": -56.2046929
  },
  {
    "id": "bar-facal",
    "nombre": "Bar Facal",
    "tipo": "Café",
    "direccion": "Avenida 18 de Julio 1249, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9056381,
    "longitud": -56.1892753
  },
  {
    "id": "bar-tasende",
    "nombre": "Bar Tasende",
    "tipo": "Café",
    "direccion": "Ciudadela 1300, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9076137,
    "longitud": -56.1995721
  },
  {
    "id": "bar-hispano",
    "nombre": "Bar Hispano",
    "tipo": "Café",
    "direccion": "Centro, Montevideo",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9071658,
    "longitud": -56.1936733
  },
  {
    "id": "bar-arocena",
    "nombre": "Bar Arocena",
    "tipo": "Café",
    "direccion": "Avenida Alfredo Arocena 1564, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8898169,
    "longitud": -56.0565446
  },
  {
    "id": "expreso-pocitos",
    "nombre": "Expreso Pocitos",
    "tipo": "Café",
    "direccion": "Pocitos, Montevideo",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9139912,
    "longitud": -56.1491188
  },
  {
    "id": "oro-del-rhin",
    "nombre": "Oro del Rhin",
    "tipo": "Café",
    "direccion": "Pocitos, Montevideo",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9195749,
    "longitud": -56.1543924
  },
  {
    "id": "bar-andorra",
    "nombre": "Bar Andorra",
    "tipo": "Café",
    "direccion": "Centro, Montevideo",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9085691,
    "longitud": -56.1876105
  },
  {
    "id": "abitab-piedras-blancas",
    "nombre": "Abitab (Piedras Blancas)",
    "tipo": "Pagos",
    "direccion": "Avenida José Belloni, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8135747,
    "longitud": -56.1382965
  },
  {
    "id": "abitab-las-piedras",
    "nombre": "Abitab (Las Piedras)",
    "tipo": "Pagos",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7273373,
    "longitud": -56.2229553
  },
  {
    "id": "abitab-nuevo-paris",
    "nombre": "Abitab (Nuevo París)",
    "tipo": "Pagos",
    "direccion": "Santa Lucía, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.8424514,
    "longitud": -56.2418253
  },
  {
    "id": "abitab-tres-ombues",
    "nombre": "Abitab (Tres Ombúes)",
    "tipo": "Pagos",
    "direccion": "Rivera Indarte, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8660558,
    "longitud": -56.2363909
  },
  {
    "id": "abitab-cerro",
    "nombre": "Abitab (Cerro)",
    "tipo": "Pagos",
    "direccion": "Avenida Carlos María Ramírez, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8739303,
    "longitud": -56.2512588
  },
  {
    "id": "abitab-casabo",
    "nombre": "Abitab (Casabó)",
    "tipo": "Pagos",
    "direccion": "Etiopía, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8875899,
    "longitud": -56.2697691
  },
  {
    "id": "abitab-sayago",
    "nombre": "Abitab (Sayago)",
    "tipo": "Pagos",
    "direccion": "Avenida Millán, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8235295,
    "longitud": -56.2399612
  },
  {
    "id": "abitab-la-teja",
    "nombre": "Abitab (La Teja)",
    "tipo": "Pagos",
    "direccion": "Avenida Carlos María Ramírez, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8581201,
    "longitud": -56.2266174
  },
  {
    "id": "abitab-paso-molino",
    "nombre": "Abitab (Paso Molino)",
    "tipo": "Pagos",
    "direccion": "San Quintín, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8545262,
    "longitud": -56.2216803
  },
  {
    "id": "abitab-reducto",
    "nombre": "Abitab (Reducto)",
    "tipo": "Pagos",
    "direccion": "Avenida Burgues, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8753897,
    "longitud": -56.1854682
  },
  {
    "id": "abitab-perez-castellanos",
    "nombre": "Abitab (Pérez Castellanos)",
    "tipo": "Pagos",
    "direccion": "Elcano, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.859883,
    "longitud": -56.1514203
  },
  {
    "id": "abitab-belvedere",
    "nombre": "Abitab (Belvedere)",
    "tipo": "Pagos",
    "direccion": "San Quintín, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8524656,
    "longitud": -56.2230469
  },
  {
    "id": "abitab-flor-de-maronas",
    "nombre": "Abitab (Flor de Maroñas)",
    "tipo": "Pagos",
    "direccion": "Avenida 8 de Octubre, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8596709,
    "longitud": -56.1338906
  },
  {
    "id": "abitab-las-acacias",
    "nombre": "Abitab (Las Acacias)",
    "tipo": "Pagos",
    "direccion": "Avenida General San Martín 4250, Las Acacias",
    "barrio": "Las Acacias",
    "ciudad": "Montevideo",
    "latitud": -34.8484013,
    "longitud": -56.1698684
  },
  {
    "id": "abitab-jacinto-vera",
    "nombre": "Abitab (Jacinto Vera)",
    "tipo": "Pagos",
    "direccion": "Bulevar General Artigas 3003, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.871702,
    "longitud": -56.1677396
  },
  {
    "id": "abitab-la-figurita",
    "nombre": "Abitab (La Figurita)",
    "tipo": "Pagos",
    "direccion": "Bulevar General Artigas 3528, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.870417,
    "longitud": -56.1794184
  },
  {
    "id": "abitab-atahualpa",
    "nombre": "Abitab (Atahualpa)",
    "tipo": "Pagos",
    "direccion": "Avenida Millán, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8718313,
    "longitud": -56.1901472
  },
  {
    "id": "abitab-penarol",
    "nombre": "Abitab (Peñarol)",
    "tipo": "Pagos",
    "direccion": "Avenida de las Instrucciones, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8361018,
    "longitud": -56.1920159
  },
  {
    "id": "abitab-bella-vista",
    "nombre": "Abitab (Bella Vista)",
    "tipo": "Pagos",
    "direccion": "Grito de Asencio, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8751784,
    "longitud": -56.1994161
  },
  {
    "id": "abitab-paso-de-las-duranas",
    "nombre": "Abitab (Paso de las Duranas)",
    "tipo": "Pagos",
    "direccion": "Bulevar José Batlle y Ordóñez, Paso de las Duranas",
    "barrio": "Paso de las Duranas",
    "ciudad": "Montevideo",
    "latitud": -34.8436839,
    "longitud": -56.1931716
  },
  {
    "id": "abitab-bolivar",
    "nombre": "Abitab (Bolívar)",
    "tipo": "Pagos",
    "direccion": "Bulevar José Batlle y Ordóñez, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8692176,
    "longitud": -56.1614108
  },
  {
    "id": "abitab-brazo-oriental",
    "nombre": "Abitab (Brazo Oriental)",
    "tipo": "Pagos",
    "direccion": "Avenida General San Martín 3234, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8669246,
    "longitud": -56.1798053
  },
  {
    "id": "abitab-colon",
    "nombre": "Abitab (Colón)",
    "tipo": "Pagos",
    "direccion": "Bulevar Aparicio Saravia, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.826939,
    "longitud": -56.2008037
  },
  {
    "id": "abitab-prado",
    "nombre": "Abitab (Prado)",
    "tipo": "Pagos",
    "direccion": "Avenida Agraciada, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8652984,
    "longitud": -56.2100819
  },
  {
    "id": "abitab-capurro",
    "nombre": "Abitab (Capurro)",
    "tipo": "Pagos",
    "direccion": "Capurro, Capurro",
    "barrio": "Capurro",
    "ciudad": "Montevideo",
    "latitud": -34.870678,
    "longitud": -56.2112071
  },
  {
    "id": "abitab-maronas",
    "nombre": "Abitab (Maroñas)",
    "tipo": "Pagos",
    "direccion": "Veracierto, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8652073,
    "longitud": -56.1216539
  },
  {
    "id": "abitab-carrasco",
    "nombre": "Abitab (Carrasco)",
    "tipo": "Pagos",
    "direccion": "Cooper, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8799545,
    "longitud": -56.067347
  },
  {
    "id": "abitab-parque-miramar",
    "nombre": "Abitab (Parque Miramar)",
    "tipo": "Pagos",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8652979,
    "longitud": -56.0239847
  },
  {
    "id": "abitab-aguada",
    "nombre": "Abitab (Aguada)",
    "tipo": "Pagos",
    "direccion": "Avenida Daniel Fernández Crespo 2266, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8922251,
    "longitud": -56.1853733
  },
  {
    "id": "abitab-arroyo-seco",
    "nombre": "Abitab (Arroyo Seco)",
    "tipo": "Pagos",
    "direccion": "Avenida Agraciada 2329, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8885299,
    "longitud": -56.1888788
  },
  {
    "id": "abitab-buceo",
    "nombre": "Abitab (Buceo)",
    "tipo": "Pagos",
    "direccion": "Avenida General Rivera, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.899928,
    "longitud": -56.1298932
  },
  {
    "id": "abitab-larranaga",
    "nombre": "Abitab (Larrañaga)",
    "tipo": "Pagos",
    "direccion": "Jaime Cibils, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8845724,
    "longitud": -56.1566275
  },
  {
    "id": "abitab-la-comercial",
    "nombre": "Abitab (La Comercial)",
    "tipo": "Pagos",
    "direccion": "Bulevar General Artigas, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8811244,
    "longitud": -56.1660231
  },
  {
    "id": "abitab-parque-rodo",
    "nombre": "Abitab (Parque Rodó)",
    "tipo": "Pagos",
    "direccion": "Juan Paullier, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9022334,
    "longitud": -56.1678338
  },
  {
    "id": "abitab-cordon",
    "nombre": "Abitab (Cordón)",
    "tipo": "Pagos",
    "direccion": "Avenida 18 de Julio 1969, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.900729,
    "longitud": -56.1733151
  },
  {
    "id": "abitab-palermo",
    "nombre": "Abitab (Palermo)",
    "tipo": "Pagos",
    "direccion": "Avenida Gonzalo Ramírez, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9123995,
    "longitud": -56.1859978
  },
  {
    "id": "abitab-parque-de-carrasco",
    "nombre": "Abitab (Parque de Carrasco)",
    "tipo": "Pagos",
    "direccion": "Avenida Calcagno, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8502138,
    "longitud": -55.9995781
  },
  {
    "id": "abitab-lomas-de-solymar",
    "nombre": "Abitab (Lomas de Solymar)",
    "tipo": "Pagos",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8058508,
    "longitud": -55.9284522
  },
  {
    "id": "abitab-solymar",
    "nombre": "Abitab (Solymar)",
    "tipo": "Pagos",
    "direccion": "Real de Azua, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8264041,
    "longitud": -55.9653313
  },
  {
    "id": "abitab-el-pinar",
    "nombre": "Abitab (El Pinar)",
    "tipo": "Pagos",
    "direccion": "Avenida José \"Pepe\" D'Elía, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8029685,
    "longitud": -55.9082565
  },
  {
    "id": "abitab-lagomar",
    "nombre": "Abitab (Lagomar)",
    "tipo": "Pagos",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8353353,
    "longitud": -55.9819016
  },
  {
    "id": "abitab-piedras-blancas-matilde-pacheco-de-batlle-y-ordonez",
    "nombre": "Abitab (Piedras Blancas, Matilde Pacheco de Batlle y Ordóñez)",
    "tipo": "Pagos",
    "direccion": "Matilde Pacheco de Batlle y Ordóñez, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8223919,
    "longitud": -56.1400381
  },
  {
    "id": "abitab-casabo-avenida-carlos-maria-ramirez",
    "nombre": "Abitab (Casabó, Avenida Carlos María Ramírez)",
    "tipo": "Pagos",
    "direccion": "Avenida Carlos María Ramírez, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8762372,
    "longitud": -56.2661835
  },
  {
    "id": "abitab-sayago-maria-orticochea",
    "nombre": "Abitab (Sayago, María Orticochea)",
    "tipo": "Pagos",
    "direccion": "María Orticochea, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8327425,
    "longitud": -56.2316196
  },
  {
    "id": "abitab-paso-molino-camino-castro",
    "nombre": "Abitab (Paso Molino, Camino Castro)",
    "tipo": "Pagos",
    "direccion": "Camino Castro, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8553946,
    "longitud": -56.2114313
  },
  {
    "id": "abitab-las-acacias-jose-a-possolo",
    "nombre": "Abitab (Las Acacias, José A. Possolo)",
    "tipo": "Pagos",
    "direccion": "José A. Possolo, Las Acacias",
    "barrio": "Las Acacias",
    "ciudad": "Montevideo",
    "latitud": -34.8451026,
    "longitud": -56.1548105
  },
  {
    "id": "abitab-perez-castellanos-avenida-general-flores",
    "nombre": "Abitab (Pérez Castellanos, Avenida General Flores)",
    "tipo": "Pagos",
    "direccion": "Avenida General Flores, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.8536001,
    "longitud": -56.1618189
  },
  {
    "id": "abitab-belvedere-avenida-general-eugenio-garzon",
    "nombre": "Abitab (Belvedere, Avenida General Eugenio Garzón)",
    "tipo": "Pagos",
    "direccion": "Avenida General Eugenio Garzón, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8419126,
    "longitud": -56.2219716
  },
  {
    "id": "abitab-atahualpa-avenida-burgues",
    "nombre": "Abitab (Atahualpa, Avenida Burgues)",
    "tipo": "Pagos",
    "direccion": "Avenida Burgues, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8636022,
    "longitud": -56.1869658
  },
  {
    "id": "abitab-paso-de-las-duranas-avenida-millan",
    "nombre": "Abitab (Paso de las Duranas, Avenida Millán)",
    "tipo": "Pagos",
    "direccion": "Avenida Millán, Paso de las Duranas",
    "barrio": "Paso de las Duranas",
    "ciudad": "Montevideo",
    "latitud": -34.8472851,
    "longitud": -56.2004458
  },
  {
    "id": "abitab-brazo-oriental-avenida-general-san-martin-3083",
    "nombre": "Abitab (Brazo Oriental, Avenida General San Martín 3083)",
    "tipo": "Pagos",
    "direccion": "Avenida General San Martín 3083, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8696796,
    "longitud": -56.1821527
  },
  {
    "id": "abitab-parque-miramar-gabriela-mistral",
    "nombre": "Abitab (Parque Miramar, Gabriela Mistral)",
    "tipo": "Pagos",
    "direccion": "Gabriela Mistral, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8653859,
    "longitud": -56.0335304
  },
  {
    "id": "abitab-aguada-nueva-york-1267",
    "nombre": "Abitab (Aguada, Nueva York 1267)",
    "tipo": "Pagos",
    "direccion": "Nueva York 1267, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8967737,
    "longitud": -56.1902392
  },
  {
    "id": "abitab-arroyo-seco-general-fausto-aguilar",
    "nombre": "Abitab (Arroyo Seco, General Fausto Aguilar)",
    "tipo": "Pagos",
    "direccion": "General Fausto Aguilar, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8850775,
    "longitud": -56.1933778
  },
  {
    "id": "abitab-parque-de-carrasco-ecuador",
    "nombre": "Abitab (Parque de Carrasco, Ecuador)",
    "tipo": "Pagos",
    "direccion": "Ecuador, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8558315,
    "longitud": -56.0010234
  },
  {
    "id": "abitab-buceo-avenida-mariscal-francisco-solano-lopez",
    "nombre": "Abitab (Buceo, Avenida Mariscal Francisco Solano López)",
    "tipo": "Pagos",
    "direccion": "Avenida Mariscal Francisco Solano López, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.887216,
    "longitud": -56.1298567
  },
  {
    "id": "abitab-carrasco-avenida-alfredo-arocena",
    "nombre": "Abitab (Carrasco, Avenida Alfredo Arocena)",
    "tipo": "Pagos",
    "direccion": "Avenida Alfredo Arocena, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8896974,
    "longitud": -56.0565105
  },
  {
    "id": "abitab-parque-rodo-constituyente",
    "nombre": "Abitab (Parque Rodó, Constituyente)",
    "tipo": "Pagos",
    "direccion": "Constituyente, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9077636,
    "longitud": -56.1724431
  },
  {
    "id": "abitab-las-piedras-avenida-general-artigas",
    "nombre": "Abitab (Las Piedras, Avenida General Artigas)",
    "tipo": "Pagos",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7271833,
    "longitud": -56.218654
  },
  {
    "id": "abitab-jacinto-vera-guadalupe",
    "nombre": "Abitab (Jacinto Vera, Guadalupe)",
    "tipo": "Pagos",
    "direccion": "Guadalupe, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8800128,
    "longitud": -56.1716359
  },
  {
    "id": "abitab-villa-munoz",
    "nombre": "Abitab (Villa Muñoz)",
    "tipo": "Pagos",
    "direccion": "José L. Terra 2220, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8870912,
    "longitud": -56.1839881
  },
  {
    "id": "abitab-barrio-sur",
    "nombre": "Abitab (Barrio Sur)",
    "tipo": "Pagos",
    "direccion": "Río Negro 1341, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9062768,
    "longitud": -56.1936799
  },
  {
    "id": "abitab-parque-batlle",
    "nombre": "Abitab (Parque Batlle)",
    "tipo": "Pagos",
    "direccion": "Avenida Italia, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8875048,
    "longitud": -56.1449196
  },
  {
    "id": "abitab-cordon-constituyente-1751",
    "nombre": "Abitab (Cordón, Constituyente 1751)",
    "tipo": "Pagos",
    "direccion": "Constituyente 1751, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9063586,
    "longitud": -56.1785019
  },
  {
    "id": "abitab-malvin-nuevo",
    "nombre": "Abitab (Malvín Nuevo)",
    "tipo": "Pagos",
    "direccion": "Avenida Italia 4206, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8877986,
    "longitud": -56.1176824
  },
  {
    "id": "abitab-union",
    "nombre": "Abitab (Unión)",
    "tipo": "Pagos",
    "direccion": "Avenida Italia 3498, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8868552,
    "longitud": -56.1386551
  },
  {
    "id": "abitab-punta-gorda",
    "nombre": "Abitab (Punta Gorda)",
    "tipo": "Pagos",
    "direccion": "Avenida Bolivia, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8835164,
    "longitud": -56.0830279
  },
  {
    "id": "abitab-pocitos",
    "nombre": "Abitab (Pocitos)",
    "tipo": "Pagos",
    "direccion": "Francisco Aguilar 843, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9153373,
    "longitud": -56.1550065
  },
  {
    "id": "abitab-punta-carretas",
    "nombre": "Abitab (Punta Carretas)",
    "tipo": "Pagos",
    "direccion": "José Ellauri, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9228835,
    "longitud": -56.1594378
  },
  {
    "id": "abitab-la-blanqueada",
    "nombre": "Abitab (La Blanqueada)",
    "tipo": "Pagos",
    "direccion": "República Dominicana, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8857282,
    "longitud": -56.1501151
  },
  {
    "id": "abitab-centro",
    "nombre": "Abitab (Centro)",
    "tipo": "Pagos",
    "direccion": "Avenida Uruguay 1032 bis, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.903339,
    "longitud": -56.1943463
  },
  {
    "id": "abitab-tres-cruces",
    "nombre": "Abitab (Tres Cruces)",
    "tipo": "Pagos",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8934222,
    "longitud": -56.1662063
  },
  {
    "id": "abitab-ciudad-vieja",
    "nombre": "Abitab (Ciudad Vieja)",
    "tipo": "Pagos",
    "direccion": "Zabala 1384, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9075863,
    "longitud": -56.2070443
  },
  {
    "id": "abitab-sayago-bulevar-jose-batlle-y-ordonez",
    "nombre": "Abitab (Sayago, Bulevar José Batlle y Ordóñez)",
    "tipo": "Pagos",
    "direccion": "Bulevar José Batlle y Ordóñez, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8335096,
    "longitud": -56.2102134
  },
  {
    "id": "abitab-brazo-oriental-avenida-general-san-martin",
    "nombre": "Abitab (Brazo Oriental, Avenida General San Martín)",
    "tipo": "Pagos",
    "direccion": "Avenida General San Martín, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8563503,
    "longitud": -56.1748065
  },
  {
    "id": "abitab-aguada-avenida-libertador-brigadier-general-lavalleja-1945",
    "nombre": "Abitab (Aguada, Avenida Libertador Brigadier General Lavalleja 1945)",
    "tipo": "Pagos",
    "direccion": "Avenida Libertador Brigadier General Lavalleja 1945, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8951063,
    "longitud": -56.1892938
  },
  {
    "id": "abitab-buceo-avenida-general-rivera",
    "nombre": "Abitab (Buceo, Avenida General Rivera)",
    "tipo": "Pagos",
    "direccion": "Avenida General Rivera, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.901378,
    "longitud": -56.1393017
  },
  {
    "id": "abitab-carrasco-norte",
    "nombre": "Abitab (Carrasco Norte)",
    "tipo": "Pagos",
    "direccion": "Córcega, Carrasco Norte",
    "barrio": "Carrasco Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8854195,
    "longitud": -56.069726
  },
  {
    "id": "abitab-parque-rodo-canelones",
    "nombre": "Abitab (Parque Rodó, Canelones)",
    "tipo": "Pagos",
    "direccion": "Canelones, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9070966,
    "longitud": -56.1673658
  },
  {
    "id": "abitab-villa-munoz-avenida-general-flores-2287",
    "nombre": "Abitab (Villa Muñoz, Avenida General Flores 2287)",
    "tipo": "Pagos",
    "direccion": "Avenida General Flores 2287, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8853164,
    "longitud": -56.1843592
  },
  {
    "id": "abitab-barrio-sur-maldonado",
    "nombre": "Abitab (Barrio Sur, Maldonado)",
    "tipo": "Pagos",
    "direccion": "Maldonado, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9099211,
    "longitud": -56.1933335
  },
  {
    "id": "abitab-parque-batlle-avenida-ramon-anador",
    "nombre": "Abitab (Parque Batlle, Avenida Ramón Anador)",
    "tipo": "Pagos",
    "direccion": "Avenida Ramón Anador, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8955485,
    "longitud": -56.1429019
  },
  {
    "id": "abitab-cordon-constituyente-1661",
    "nombre": "Abitab (Cordón, Constituyente 1661)",
    "tipo": "Pagos",
    "direccion": "Constituyente 1661, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9059664,
    "longitud": -56.180358
  },
  {
    "id": "abitab-malvin-norte",
    "nombre": "Abitab (Malvín Norte)",
    "tipo": "Pagos",
    "direccion": "Camino Carrasco, Malvín Norte",
    "barrio": "Malvín Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8718977,
    "longitud": -56.1173302
  },
  {
    "id": "abitab-union-avenida-8-de-octubre",
    "nombre": "Abitab (Unión, Avenida 8 de Octubre)",
    "tipo": "Pagos",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8725247,
    "longitud": -56.1361127
  },
  {
    "id": "abitab-punta-gorda-avenida-bolivia",
    "nombre": "Abitab (Punta Gorda, Avenida Bolivia)",
    "tipo": "Pagos",
    "direccion": "Avenida Bolivia, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.893256,
    "longitud": -56.0665684
  },
  {
    "id": "abitab-pocitos-eduardo-mac-eachen",
    "nombre": "Abitab (Pocitos, Eduardo Mac Eachen)",
    "tipo": "Pagos",
    "direccion": "Eduardo Mac Eachen, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9032071,
    "longitud": -56.1498004
  },
  {
    "id": "abitab-punta-carretas-21-de-setiembre",
    "nombre": "Abitab (Punta Carretas, 21 de Setiembre)",
    "tipo": "Pagos",
    "direccion": "21 de Setiembre, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9134803,
    "longitud": -56.1623714
  },
  {
    "id": "abitab-centro-avenida-18-de-julio-1204",
    "nombre": "Abitab (Centro, Avenida 18 de Julio 1204)",
    "tipo": "Pagos",
    "direccion": "Avenida 18 de Julio 1204, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9059176,
    "longitud": -56.1900253
  },
  {
    "id": "abitab-tres-cruces-avenida-18-de-julio",
    "nombre": "Abitab (Tres Cruces, Avenida 18 de Julio)",
    "tipo": "Pagos",
    "direccion": "Avenida 18 de Julio, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8984561,
    "longitud": -56.1667313
  },
  {
    "id": "redpagos-larranaga",
    "nombre": "RedPagos (Larrañaga)",
    "tipo": "Pagos",
    "direccion": "Juan Cabal, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8802538,
    "longitud": -56.1569224
  },
  {
    "id": "redpagos-casabo",
    "nombre": "RedPagos (Casabó)",
    "tipo": "Pagos",
    "direccion": "Avenida Carlos María Ramírez, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8747133,
    "longitud": -56.2546879
  },
  {
    "id": "redpagos-tres-cruces",
    "nombre": "RedPagos (Tres Cruces)",
    "tipo": "Pagos",
    "direccion": "Palmar 2311, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.9008718,
    "longitud": -56.1649171
  },
  {
    "id": "redpagos-flor-de-maronas",
    "nombre": "RedPagos (Flor de Maroñas)",
    "tipo": "Pagos",
    "direccion": "Avenida 8 de Octubre, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8564427,
    "longitud": -56.1324179
  },
  {
    "id": "redpagos-union",
    "nombre": "RedPagos (Unión)",
    "tipo": "Pagos",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8706903,
    "longitud": -56.1353073
  },
  {
    "id": "redpagos-la-teja",
    "nombre": "RedPagos (La Teja)",
    "tipo": "Pagos",
    "direccion": "Bulevar Doctor Manuel Herrera y Obes, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8582611,
    "longitud": -56.2257409
  },
  {
    "id": "redpagos-la-figurita",
    "nombre": "RedPagos (La Figurita)",
    "tipo": "Pagos",
    "direccion": "Avenida General Flores, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8732549,
    "longitud": -56.1771237
  },
  {
    "id": "redpagos-pocitos",
    "nombre": "RedPagos (Pocitos)",
    "tipo": "Pagos",
    "direccion": "26 de Marzo 1366, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.907833,
    "longitud": -56.146049
  },
  {
    "id": "redpagos-cordon",
    "nombre": "RedPagos (Cordón)",
    "tipo": "Pagos",
    "direccion": "Gaboto, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9045705,
    "longitud": -56.1774356
  },
  {
    "id": "redpagos-parque-rodo",
    "nombre": "RedPagos (Parque Rodó)",
    "tipo": "Pagos",
    "direccion": "Canelones, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9074364,
    "longitud": -56.1720938
  },
  {
    "id": "redpagos-perez-castellanos",
    "nombre": "RedPagos (Pérez Castellanos)",
    "tipo": "Pagos",
    "direccion": "Avenida General Flores, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.8552271,
    "longitud": -56.1630397
  },
  {
    "id": "redpagos-la-comercial",
    "nombre": "RedPagos (La Comercial)",
    "tipo": "Pagos",
    "direccion": "Avenida General José Garibaldi, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.886276,
    "longitud": -56.1639142
  },
  {
    "id": "redpagos-bolivar",
    "nombre": "RedPagos (Bolívar)",
    "tipo": "Pagos",
    "direccion": "Bulevar José Batlle y Ordóñez 3770, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8655158,
    "longitud": -56.1644882
  },
  {
    "id": "redpagos-punta-carretas",
    "nombre": "RedPagos (Punta Carretas)",
    "tipo": "Pagos",
    "direccion": "21 de Setiembre, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9197237,
    "longitud": -56.1520818
  },
  {
    "id": "redpagos-parque-batlle",
    "nombre": "RedPagos (Parque Batlle)",
    "tipo": "Pagos",
    "direccion": "Avenida General Rivera, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.9028995,
    "longitud": -56.1453068
  },
  {
    "id": "redpagos-palermo",
    "nombre": "RedPagos (Palermo)",
    "tipo": "Pagos",
    "direccion": "Doctor Carlos María Morales 902, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9133637,
    "longitud": -56.1821852
  },
  {
    "id": "redpagos-las-piedras",
    "nombre": "RedPagos (Las Piedras)",
    "tipo": "Pagos",
    "direccion": "Doctor Enrique Pouey, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7279465,
    "longitud": -56.2235958
  },
  {
    "id": "redpagos-solymar",
    "nombre": "RedPagos (Solymar)",
    "tipo": "Pagos",
    "direccion": "Adela Reta, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.815994,
    "longitud": -55.9796047
  },
  {
    "id": "redpagos-malvin",
    "nombre": "RedPagos (Malvín)",
    "tipo": "Pagos",
    "direccion": "Avenida Enrique Legrand 5085, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8895684,
    "longitud": -56.0985832
  },
  {
    "id": "redpagos-pocitos-jose-marti",
    "nombre": "RedPagos (Pocitos, José Martí)",
    "tipo": "Pagos",
    "direccion": "José Martí, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9132174,
    "longitud": -56.1481599
  },
  {
    "id": "redpagos-pocitos-26-de-marzo",
    "nombre": "RedPagos (Pocitos, 26 de Marzo)",
    "tipo": "Pagos",
    "direccion": "26 de Marzo, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9116726,
    "longitud": -56.1517315
  },
  {
    "id": "casmu-la-blanqueada",
    "nombre": "CASMU (La Blanqueada)",
    "tipo": "Salud",
    "direccion": "Avenida Luis Alberto de Herrera 2521, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8846925,
    "longitud": -56.1508945
  },
  {
    "id": "casmu-colon",
    "nombre": "CASMU (Colón)",
    "tipo": "Salud",
    "direccion": "Avenida Lezica 5704, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.804216,
    "longitud": -56.2240559
  },
  {
    "id": "casmu-malvin",
    "nombre": "CASMU (Malvín)",
    "tipo": "Salud",
    "direccion": "Avenida Italia, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8835632,
    "longitud": -56.0836616
  },
  {
    "id": "casmu-tres-cruces",
    "nombre": "CASMU (Tres Cruces)",
    "tipo": "Salud",
    "direccion": "Bulevar General Artigas 1910, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8924106,
    "longitud": -56.1649706
  },
  {
    "id": "casmu-solymar",
    "nombre": "CASMU (Solymar)",
    "tipo": "Salud",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8245528,
    "longitud": -55.9620384
  },
  {
    "id": "medica-uruguaya-tres-ombues",
    "nombre": "Médica Uruguaya (Tres Ombúes)",
    "tipo": "Salud",
    "direccion": "Avenida Carlos María Ramírez, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8679376,
    "longitud": -56.2387644
  },
  {
    "id": "medica-uruguaya-perez-castellanos",
    "nombre": "Médica Uruguaya (Pérez Castellanos)",
    "tipo": "Salud",
    "direccion": "Avenida General Flores, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.8531832,
    "longitud": -56.1613646
  },
  {
    "id": "medica-uruguaya-colon",
    "nombre": "Médica Uruguaya (Colón)",
    "tipo": "Salud",
    "direccion": "Avenida General Eugenio Garzón 1907, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.806193,
    "longitud": -56.2223104
  },
  {
    "id": "medica-uruguaya-el-pinar",
    "nombre": "Médica Uruguaya (El Pinar)",
    "tipo": "Salud",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8012849,
    "longitud": -55.9194114
  },
  {
    "id": "medica-uruguaya-parque-de-carrasco",
    "nombre": "Médica Uruguaya (Parque de Carrasco)",
    "tipo": "Salud",
    "direccion": "Avenida Ingeniero Luis Giannattasio 0402, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8534632,
    "longitud": -56.0088858
  },
  {
    "id": "smi-union",
    "nombre": "SMI (Unión)",
    "tipo": "Salud",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8694078,
    "longitud": -56.1344816
  },
  {
    "id": "smi-solymar",
    "nombre": "SMI (Solymar)",
    "tipo": "Salud",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8229585,
    "longitud": -55.9589653
  },
  {
    "id": "asociacion-espanola-colon",
    "nombre": "Asociación Española (Colón)",
    "tipo": "Salud",
    "direccion": "Margarita, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8025152,
    "longitud": -56.2241313
  },
  {
    "id": "asociacion-espanola-paso-molino",
    "nombre": "Asociación Española (Paso Molino)",
    "tipo": "Salud",
    "direccion": "Doctor Pedro Visca 4223, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8563375,
    "longitud": -56.2218356
  },
  {
    "id": "asociacion-espanola-prado",
    "nombre": "Asociación Española (Prado)",
    "tipo": "Salud",
    "direccion": "Avenida 19 de Abril 3322, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8686328,
    "longitud": -56.2044088
  },
  {
    "id": "asociacion-espanola-solymar",
    "nombre": "Asociación Española (Solymar)",
    "tipo": "Salud",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8303442,
    "longitud": -55.9723358
  },
  {
    "id": "circulo-catolico-palermo",
    "nombre": "Círculo Católico (Palermo)",
    "tipo": "Salud",
    "direccion": "Minas 1250, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9071943,
    "longitud": -56.1794883
  },
  {
    "id": "circulo-catolico-colon",
    "nombre": "Círculo Católico (Colón)",
    "tipo": "Salud",
    "direccion": "Avenida Lezica, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8041585,
    "longitud": -56.2244282
  },
  {
    "id": "circulo-catolico-lagomar",
    "nombre": "Círculo Católico (Lagomar)",
    "tipo": "Salud",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8327205,
    "longitud": -55.9789748
  },
  {
    "id": "cosem-tres-cruces",
    "nombre": "COSEM (Tres Cruces)",
    "tipo": "Salud",
    "direccion": "Doctor Gastón Ramón 2330, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8998894,
    "longitud": -56.163191
  },
  {
    "id": "cosem-malvin-nuevo",
    "nombre": "COSEM (Malvín Nuevo)",
    "tipo": "Salud",
    "direccion": "Avenida Italia 4206, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8874739,
    "longitud": -56.1197775
  },
  {
    "id": "cosem-lagomar",
    "nombre": "COSEM (Lagomar)",
    "tipo": "Salud",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.835924,
    "longitud": -55.9830384
  },
  {
    "id": "policlinica-doctor-yanicelli",
    "nombre": "Policlínica Doctor Yanicelli",
    "tipo": "Salud",
    "direccion": "Camino Carrasco 4626, Malvín Norte",
    "barrio": "Malvín Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8725075,
    "longitud": -56.1188256
  },
  {
    "id": "policlinica-las-retamas",
    "nombre": "Policlínica Las Retamas",
    "tipo": "Salud",
    "direccion": "Picaflor, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.821908,
    "longitud": -56.2322243
  },
  {
    "id": "asse",
    "nombre": "ASSE",
    "tipo": "Salud",
    "direccion": "Cuacziola 5645, Barrio Abayubá",
    "barrio": "Barrio Abayubá",
    "ciudad": "Montevideo",
    "latitud": -34.7673669,
    "longitud": -56.2245405
  },
  {
    "id": "centro-de-salud-union",
    "nombre": "Centro de Salud Unión",
    "tipo": "Salud",
    "direccion": "Vicenza 2815, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8574758,
    "longitud": -56.1316348
  },
  {
    "id": "policlinica-solymar",
    "nombre": "Policlínica (Solymar)",
    "tipo": "Salud",
    "direccion": "Luis Perez Aguirre, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8388865,
    "longitud": -55.9622611
  },
  {
    "id": "policlinica-de-todos",
    "nombre": "Policlínica De Todos",
    "tipo": "Salud",
    "direccion": "Interlagos, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.787964,
    "longitud": -55.9242124
  },
  {
    "id": "policlinica-pinar-norte",
    "nombre": "Policlinica Pinar Norte",
    "tipo": "Salud",
    "direccion": "Avenida Eduardo Pérez Robido, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8003129,
    "longitud": -55.9394116
  },
  {
    "id": "policlinica-punta-de-rieles",
    "nombre": "Policlínica Punta de Rieles",
    "tipo": "Salud",
    "direccion": "Camino Guerra, Punta Rieles",
    "barrio": "Punta Rieles",
    "ciudad": "Montevideo",
    "latitud": -34.8237109,
    "longitud": -56.1007602
  },
  {
    "id": "policlinica-municipal-yucatan",
    "nombre": "Policlínica Municipal Yucatán",
    "tipo": "Salud",
    "direccion": "Tomás Claramunt 3749, Villa Española",
    "barrio": "Villa Española",
    "ciudad": "Montevideo",
    "latitud": -34.8665841,
    "longitud": -56.148535
  },
  {
    "id": "disco-flor-de-maronas",
    "nombre": "Disco (Flor de Maroñas)",
    "tipo": "Supermercado",
    "direccion": "Avenida 8 de Octubre 4786, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8572729,
    "longitud": -56.1324659
  },
  {
    "id": "disco-la-figurita",
    "nombre": "Disco (La Figurita)",
    "tipo": "Supermercado",
    "direccion": "Marcelino Sosa, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8778301,
    "longitud": -56.1809235
  },
  {
    "id": "disco-parque-batlle",
    "nombre": "Disco (Parque Batlle)",
    "tipo": "Supermercado",
    "direccion": "Ayacucho, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8945297,
    "longitud": -56.1445551
  },
  {
    "id": "disco-villa-garcia",
    "nombre": "Disco (Villa García)",
    "tipo": "Supermercado",
    "direccion": "Dionisio Fernández, Villa García",
    "barrio": "Villa García",
    "ciudad": "Montevideo",
    "latitud": -34.8020344,
    "longitud": -56.086493
  },
  {
    "id": "disco-buceo",
    "nombre": "Disco (Buceo)",
    "tipo": "Supermercado",
    "direccion": "Avenida Mariscal Francisco Solano López, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8916336,
    "longitud": -56.1250928
  },
  {
    "id": "disco-cordon",
    "nombre": "Disco (Cordón)",
    "tipo": "Supermercado",
    "direccion": "Avenida Daniel Fernández Crespo 1727, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.8990703,
    "longitud": -56.1776808
  },
  {
    "id": "disco-centro",
    "nombre": "Disco (Centro)",
    "tipo": "Supermercado",
    "direccion": "Ejido 1530, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9021589,
    "longitud": -56.1867062
  },
  {
    "id": "disco-pocitos",
    "nombre": "Disco (Pocitos)",
    "tipo": "Supermercado",
    "direccion": "Avenida Doctor Francisco Soca 1318, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9055318,
    "longitud": -56.1547295
  },
  {
    "id": "disco-punta-carretas",
    "nombre": "Disco (Punta Carretas)",
    "tipo": "Supermercado",
    "direccion": "Obligado 968, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9132726,
    "longitud": -56.1601252
  },
  {
    "id": "disco-barrio-sur",
    "nombre": "Disco (Barrio Sur)",
    "tipo": "Supermercado",
    "direccion": "Maldonado, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9099806,
    "longitud": -56.194065
  },
  {
    "id": "disco-palermo",
    "nombre": "Disco (Palermo)",
    "tipo": "Supermercado",
    "direccion": "Doctor Javier Barrios Amorín 859, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9138951,
    "longitud": -56.1838399
  },
  {
    "id": "devoto-prado",
    "nombre": "Devoto (Prado)",
    "tipo": "Supermercado",
    "direccion": "Avenida Agraciada 3655, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8655409,
    "longitud": -56.2102483
  },
  {
    "id": "devoto-punta-gorda",
    "nombre": "Devoto (Punta Gorda)",
    "tipo": "Supermercado",
    "direccion": "Avenida Italia 5779, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8803924,
    "longitud": -56.0808892
  },
  {
    "id": "devoto-union",
    "nombre": "Devoto (Unión)",
    "tipo": "Supermercado",
    "direccion": "Avenida 8 de Octubre 3621, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8765368,
    "longitud": -56.1437821
  },
  {
    "id": "devoto-villa-munoz",
    "nombre": "Devoto (Villa Muñoz)",
    "tipo": "Supermercado",
    "direccion": "Arenal Grande 2006, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8925868,
    "longitud": -56.1807314
  },
  {
    "id": "devoto-centro",
    "nombre": "Devoto (Centro)",
    "tipo": "Supermercado",
    "direccion": "Carlos Quijano, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9084842,
    "longitud": -56.1887585
  },
  {
    "id": "devoto-las-piedras",
    "nombre": "Devoto (Las Piedras)",
    "tipo": "Supermercado",
    "direccion": "Avenida Instrucciones del Año XIII, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.727933,
    "longitud": -56.2240597
  },
  {
    "id": "devoto-malvin-nuevo",
    "nombre": "Devoto (Malvín Nuevo)",
    "tipo": "Supermercado",
    "direccion": "Hipólito Yrigoyen 1444, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8948828,
    "longitud": -56.1075481
  },
  {
    "id": "tienda-inglesa-punta-gorda",
    "nombre": "Tienda Inglesa (Punta Gorda)",
    "tipo": "Supermercado",
    "direccion": "Avenida Italia 5820, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8833,
    "longitud": -56.0816468
  },
  {
    "id": "tienda-inglesa-bolivar",
    "nombre": "Tienda Inglesa (Bolívar)",
    "tipo": "Supermercado",
    "direccion": "Bulevar José Batlle y Ordóñez 3770, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8656615,
    "longitud": -56.1646189
  },
  {
    "id": "tienda-inglesa-carrasco",
    "nombre": "Tienda Inglesa (Carrasco)",
    "tipo": "Supermercado",
    "direccion": "Doctor Alejandro Schroeder 6436, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8879461,
    "longitud": -56.0582581
  },
  {
    "id": "tienda-inglesa-aires-puros",
    "nombre": "Tienda Inglesa (Aires Puros)",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Alberto de Herrera 4462, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8568742,
    "longitud": -56.1952529
  },
  {
    "id": "tienda-inglesa-pocitos",
    "nombre": "Tienda Inglesa (Pocitos)",
    "tipo": "Supermercado",
    "direccion": "Libertad 2479, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9116169,
    "longitud": -56.1597503
  },
  {
    "id": "tienda-inglesa-buceo",
    "nombre": "Tienda Inglesa (Buceo)",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.90265,
    "longitud": -56.1363019
  },
  {
    "id": "tienda-inglesa-cordon",
    "nombre": "Tienda Inglesa (Cordón)",
    "tipo": "Supermercado",
    "direccion": "Mercedes 1615, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.8994948,
    "longitud": -56.1755488
  },
  {
    "id": "tienda-inglesa-union",
    "nombre": "Tienda Inglesa (Unión)",
    "tipo": "Supermercado",
    "direccion": "Avenida 8 de Octubre 4086, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8708636,
    "longitud": -56.1349453
  },
  {
    "id": "tienda-inglesa-lagomar",
    "nombre": "Tienda Inglesa (Lagomar)",
    "tipo": "Supermercado",
    "direccion": "Emilio de Franco, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8348003,
    "longitud": -55.9801717
  },
  {
    "id": "ta-ta-flor-de-maronas",
    "nombre": "Ta-Ta (Flor de Maroñas)",
    "tipo": "Supermercado",
    "direccion": "Camino Maldonado, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8405165,
    "longitud": -56.1238983
  },
  {
    "id": "ta-ta-paso-molino",
    "nombre": "Ta-Ta (Paso Molino)",
    "tipo": "Supermercado",
    "direccion": "Avenida Agraciada 4214, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8561378,
    "longitud": -56.2197657
  },
  {
    "id": "ta-ta-piedras-blancas",
    "nombre": "Ta-Ta (Piedras Blancas)",
    "tipo": "Supermercado",
    "direccion": "Avenida José Belloni, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8230197,
    "longitud": -56.1410115
  },
  {
    "id": "ta-ta-ituzaingo",
    "nombre": "Ta-Ta (Ituzaingó)",
    "tipo": "Supermercado",
    "direccion": "Avenida Dámaso Antonio Larrañaga, Ituzaingó",
    "barrio": "Ituzaingó",
    "ciudad": "Montevideo",
    "latitud": -34.8598967,
    "longitud": -56.1515361
  },
  {
    "id": "ta-ta-aires-puros",
    "nombre": "Ta-Ta (Aires Puros)",
    "tipo": "Supermercado",
    "direccion": "Avenida Costanera Felipe Carapé 4478, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8534893,
    "longitud": -56.1940599
  },
  {
    "id": "ta-ta-pocitos",
    "nombre": "Ta-Ta (Pocitos)",
    "tipo": "Supermercado",
    "direccion": "Libertad 2545, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9106252,
    "longitud": -56.158107
  },
  {
    "id": "ta-ta-jacinto-vera",
    "nombre": "Ta-Ta (Jacinto Vera)",
    "tipo": "Supermercado",
    "direccion": "Cufré 2687, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8778456,
    "longitud": -56.1709201
  },
  {
    "id": "ta-ta-tres-ombues",
    "nombre": "Ta-Ta (Tres Ombúes)",
    "tipo": "Supermercado",
    "direccion": "Doctor Pedro Castellino, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8729937,
    "longitud": -56.2467665
  },
  {
    "id": "ta-ta-villa-munoz",
    "nombre": "Ta-Ta (Villa Muñoz)",
    "tipo": "Supermercado",
    "direccion": "José L. Terra 2220, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8867873,
    "longitud": -56.1829907
  },
  {
    "id": "ta-ta-buceo",
    "nombre": "Ta-Ta (Buceo)",
    "tipo": "Supermercado",
    "direccion": "Bulevar José Batlle y Ordóñez, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8936937,
    "longitud": -56.1292876
  },
  {
    "id": "ta-ta-centro",
    "nombre": "Ta-Ta (Centro)",
    "tipo": "Supermercado",
    "direccion": "Avenida 18 de Julio 1280, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9058685,
    "longitud": -56.1884551
  },
  {
    "id": "ta-ta-barrio-sur",
    "nombre": "Ta-Ta (Barrio Sur)",
    "tipo": "Supermercado",
    "direccion": "Avenida 18 de Julio 880, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9064703,
    "longitud": -56.1974551
  },
  {
    "id": "ta-ta-malvin-norte",
    "nombre": "Ta-Ta (Malvín Norte)",
    "tipo": "Supermercado",
    "direccion": "Camino Carrasco 4656, Malvín Norte",
    "barrio": "Malvín Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8719626,
    "longitud": -56.1176035
  },
  {
    "id": "ta-ta-reducto",
    "nombre": "Ta-Ta (Reducto)",
    "tipo": "Supermercado",
    "direccion": "Avenida General San Martín 2700, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8765944,
    "longitud": -56.1856408
  },
  {
    "id": "ta-ta-cordon",
    "nombre": "Ta-Ta (Cordón)",
    "tipo": "Supermercado",
    "direccion": "Constituyente 1570, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.906057,
    "longitud": -56.1817806
  },
  {
    "id": "ta-ta-punta-carretas",
    "nombre": "Ta-Ta (Punta Carretas)",
    "tipo": "Supermercado",
    "direccion": "José H. Figueira 2301, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9156954,
    "longitud": -56.1638021
  },
  {
    "id": "ta-ta-perez-castellanos",
    "nombre": "Ta-Ta (Pérez Castellanos)",
    "tipo": "Supermercado",
    "direccion": "Avenida General Flores 4104, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.8548571,
    "longitud": -56.1620868
  },
  {
    "id": "ta-ta-san-jose-de-carrasco",
    "nombre": "Ta-Ta (San José de Carrasco)",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis Giannattasio Local 149, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8412764,
    "longitud": -55.992635
  },
  {
    "id": "kinko-parque-rodo",
    "nombre": "Kinko (Parque Rodó)",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis P. Ponce 1347, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9029222,
    "longitud": -56.1617228
  },
  {
    "id": "kinko-bella-vista",
    "nombre": "Kinko (Bella Vista)",
    "tipo": "Supermercado",
    "direccion": "Hermanos Gil, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8704519,
    "longitud": -56.2015736
  },
  {
    "id": "kinko-jacinto-vera",
    "nombre": "Kinko (Jacinto Vera)",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Alberto de Herrera, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8678827,
    "longitud": -56.1697935
  },
  {
    "id": "kinko-carrasco",
    "nombre": "Kinko (Carrasco)",
    "tipo": "Supermercado",
    "direccion": "General Máximo Tajes, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8749863,
    "longitud": -56.0431754
  },
  {
    "id": "kinko-pocitos",
    "nombre": "Kinko (Pocitos)",
    "tipo": "Supermercado",
    "direccion": "Bulevar España 2753, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9138628,
    "longitud": -56.1533684
  },
  {
    "id": "kinko-parque-batlle",
    "nombre": "Kinko (Parque Batlle)",
    "tipo": "Supermercado",
    "direccion": "Avenida Doctor Américo Ricaldoni 2854, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8989257,
    "longitud": -56.1541098
  },
  {
    "id": "kinko-la-blanqueada",
    "nombre": "Kinko (La Blanqueada)",
    "tipo": "Supermercado",
    "direccion": "Estero Bellaco 2846, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8890284,
    "longitud": -56.157465
  },
  {
    "id": "kinko-el-pinar",
    "nombre": "Kinko (El Pinar)",
    "tipo": "Supermercado",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8038258,
    "longitud": -55.9060981
  },
  {
    "id": "el-dorado-la-blanqueada",
    "nombre": "El Dorado (La Blanqueada)",
    "tipo": "Supermercado",
    "direccion": "Estero Bellaco, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8862857,
    "longitud": -56.1627929
  },
  {
    "id": "el-dorado-cordon",
    "nombre": "El Dorado (Cordón)",
    "tipo": "Supermercado",
    "direccion": "Avenida 18 de Julio 1807, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9020989,
    "longitud": -56.1771861
  },
  {
    "id": "el-dorado-centro",
    "nombre": "El Dorado (Centro)",
    "tipo": "Supermercado",
    "direccion": "Yi, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9053869,
    "longitud": -56.1891928
  },
  {
    "id": "el-dorado-las-piedras",
    "nombre": "El Dorado (Las Piedras)",
    "tipo": "Supermercado",
    "direccion": "Avenida Instrucciones del Año XIII, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.728029,
    "longitud": -56.2163851
  },
  {
    "id": "el-dorado-cordon-avenida-18-de-julio",
    "nombre": "El Dorado (Cordón, Avenida 18 de Julio)",
    "tipo": "Supermercado",
    "direccion": "Avenida 18 de Julio, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9006562,
    "longitud": -56.1723954
  },
  {
    "id": "macro-mercado-brazo-oriental",
    "nombre": "Macro Mercado (Brazo Oriental)",
    "tipo": "Supermercado",
    "direccion": "Avenida General San Martín 3234, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8664298,
    "longitud": -56.1796878
  },
  {
    "id": "macro-mercado-la-teja",
    "nombre": "Macro Mercado (La Teja)",
    "tipo": "Supermercado",
    "direccion": "Florentino Ameghino, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8614897,
    "longitud": -56.2315225
  },
  {
    "id": "macro-mercado-parque-miramar",
    "nombre": "Macro Mercado (Parque Miramar)",
    "tipo": "Supermercado",
    "direccion": "Avenida al Parque, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.869742,
    "longitud": -56.0225737
  },
  {
    "id": "geant-sayago",
    "nombre": "Géant (Sayago)",
    "tipo": "Supermercado",
    "direccion": "Camino Ariel 4626, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8353493,
    "longitud": -56.2109722
  },
  {
    "id": "geant-parque-miramar",
    "nombre": "Géant (Parque Miramar)",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8651871,
    "longitud": -56.0245281
  },
  {
    "id": "solymar",
    "nombre": "Solymar",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis Giannattasio, El Bosque, Ciudad de la Costa",
    "barrio": "El Bosque",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8327685,
    "longitud": -55.9770169
  },
  {
    "id": "supermercado-la-barra",
    "nombre": "Supermercado La Barra",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Batlle Berres 230, Santiago Vázquez",
    "barrio": "Santiago Vázquez",
    "ciudad": "Montevideo",
    "latitud": -34.7898912,
    "longitud": -56.3528043
  },
  {
    "id": "unicentro",
    "nombre": "Unicentro",
    "tipo": "Supermercado",
    "direccion": "Veraguas 1907, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.7948555,
    "longitud": -56.249368
  },
  {
    "id": "supermercado-mayorista-don-pepe",
    "nombre": "Supermercado Mayorista Don Pepe",
    "tipo": "Supermercado",
    "direccion": "Camino Petirossi, Manga",
    "barrio": "Manga",
    "ciudad": "Montevideo",
    "latitud": -34.8031426,
    "longitud": -56.1369673
  },
  {
    "id": "frigo",
    "nombre": "Frigo",
    "tipo": "Supermercado",
    "direccion": "Avenida de las Instrucciones 3086, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8069076,
    "longitud": -56.161953
  },
  {
    "id": "autoservice-la-chacra",
    "nombre": "Autoservice La Chacra",
    "tipo": "Supermercado",
    "direccion": "Avenida José Belloni 6389, Puntas de Manga",
    "barrio": "Puntas de Manga",
    "ciudad": "Montevideo",
    "latitud": -34.7820414,
    "longitud": -56.1363405
  },
  {
    "id": "supermercado-donato",
    "nombre": "Supermercado Donato",
    "tipo": "Supermercado",
    "direccion": "Capitán Pedro de Mesa y Castro 7995, Pajas Blancas",
    "barrio": "Pajas Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8674417,
    "longitud": -56.3355423
  },
  {
    "id": "super-lalo",
    "nombre": "Super Lalo",
    "tipo": "Supermercado",
    "direccion": "Samuel Lafone 2039, La Paloma Tomkinson",
    "barrio": "La Paloma Tomkinson",
    "ciudad": "Montevideo",
    "latitud": -34.8668871,
    "longitud": -56.2604009
  },
  {
    "id": "betina",
    "nombre": "Betina",
    "tipo": "Supermercado",
    "direccion": "Avenida José Belloni 3354, Jardines del Hipódromo",
    "barrio": "Jardines del Hipódromo",
    "ciudad": "Montevideo",
    "latitud": -34.8457445,
    "longitud": -56.1345519
  },
  {
    "id": "devoto-shangrila",
    "nombre": "Devoto Shangrila",
    "tipo": "Supermercado",
    "direccion": "Avenida Calcagno, Shangrila, Ciudad de la Costa",
    "barrio": "Shangrila",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8498118,
    "longitud": -55.9988781
  },
  {
    "id": "malba-tahan",
    "nombre": "Malba Tahan",
    "tipo": "Supermercado",
    "direccion": "Carlos de la Vega 5201, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.846066,
    "longitud": -56.2434993
  },
  {
    "id": "super-edison",
    "nombre": "SUPER EDISON",
    "tipo": "Supermercado",
    "direccion": "Camino Edison 5168, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8208266,
    "longitud": -56.2179032
  },
  {
    "id": "autoservicio-el-petitero",
    "nombre": "Autoservicio El Petitero",
    "tipo": "Supermercado",
    "direccion": "Doctor José Irureta Goyena 3198, Villa Española",
    "barrio": "Villa Española",
    "ciudad": "Montevideo",
    "latitud": -34.8645494,
    "longitud": -56.1448909
  },
  {
    "id": "super-roy",
    "nombre": "Super Roy",
    "tipo": "Supermercado",
    "direccion": "Camino Corrales 3320, Ituzaingó",
    "barrio": "Ituzaingó",
    "ciudad": "Montevideo",
    "latitud": -34.8550129,
    "longitud": -56.1441828
  },
  {
    "id": "supermercado-bidenux",
    "nombre": "Supermercado Bidenux?",
    "tipo": "Supermercado",
    "direccion": "Camino Chacarita de los Padres 3374, Punta Rieles",
    "barrio": "Punta Rieles",
    "ciudad": "Montevideo",
    "latitud": -34.8340819,
    "longitud": -56.1109807
  },
  {
    "id": "la-gastroteca",
    "nombre": "La Gastroteca",
    "tipo": "Supermercado",
    "direccion": "Portugal 3302, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8920863,
    "longitud": -56.2498074
  },
  {
    "id": "super-frigo",
    "nombre": "Super Frigo",
    "tipo": "Supermercado",
    "direccion": "Avenida de las Instrucciones 1388, Paso de las Duranas",
    "barrio": "Paso de las Duranas",
    "ciudad": "Montevideo",
    "latitud": -34.8376801,
    "longitud": -56.1936726
  },
  {
    "id": "cuspide",
    "nombre": "Cúspide",
    "tipo": "Supermercado",
    "direccion": "Avenida General Eugenio Garzón 223, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8498408,
    "longitud": -56.2239474
  },
  {
    "id": "supermarket-ofermak",
    "nombre": "Supermarket Ofermak",
    "tipo": "Supermercado",
    "direccion": "Avenida Agraciada, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8725404,
    "longitud": -56.2022522
  },
  {
    "id": "express-2",
    "nombre": "Express 2",
    "tipo": "Supermercado",
    "direccion": "Avenida Millán 2683, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8764141,
    "longitud": -56.1875968
  },
  {
    "id": "super-dino",
    "nombre": "Super Dino",
    "tipo": "Supermercado",
    "direccion": "Avenida Millán 3294, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8668351,
    "longitud": -56.1920351
  },
  {
    "id": "la-clave",
    "nombre": "La Clave",
    "tipo": "Supermercado",
    "direccion": "Bulevar José Batlle y Ordóñez 4750, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8501917,
    "longitud": -56.1850414
  },
  {
    "id": "express-6",
    "nombre": "Express 6",
    "tipo": "Supermercado",
    "direccion": "Conciliación 3910, Capurro",
    "barrio": "Capurro",
    "ciudad": "Montevideo",
    "latitud": -34.8648493,
    "longitud": -56.2203582
  },
  {
    "id": "super-express",
    "nombre": "Super Express",
    "tipo": "Supermercado",
    "direccion": "Veracierto 2798, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8660763,
    "longitud": -56.120546
  },
  {
    "id": "dunny-2",
    "nombre": "Dunny 2",
    "tipo": "Supermercado",
    "direccion": "Quijote 2499, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8810001,
    "longitud": -56.1653525
  },
  {
    "id": "super-meka-s",
    "nombre": "Super Meka's",
    "tipo": "Supermercado",
    "direccion": "Isidoro de María 1326, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8863623,
    "longitud": -56.189699
  },
  {
    "id": "el-abasto",
    "nombre": "El Abasto",
    "tipo": "Supermercado",
    "direccion": "Martín Fierro 2581, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8811576,
    "longitud": -56.1634071
  },
  {
    "id": "disco-23",
    "nombre": "Disco 23",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8056762,
    "longitud": -55.9274673
  },
  {
    "id": "super-san-jose",
    "nombre": "Super San José",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis Giannattasio, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8425098,
    "longitud": -55.9947664
  },
  {
    "id": "la-pollita",
    "nombre": "La Pollita",
    "tipo": "Supermercado",
    "direccion": "Camino Domingo Arena 4254, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8174125,
    "longitud": -56.1431983
  },
  {
    "id": "hazlo-simple",
    "nombre": "Hazlo Simple",
    "tipo": "Supermercado",
    "direccion": "Avenida Carlos María Ramírez 300, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8584543,
    "longitud": -56.2272083
  },
  {
    "id": "supermercado-5-hermanos",
    "nombre": "Supermercado 5 Hermanos",
    "tipo": "Supermercado",
    "direccion": "Venezuela 1409, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8935128,
    "longitud": -56.1873711
  },
  {
    "id": "el-grillito",
    "nombre": "El Grillito",
    "tipo": "Supermercado",
    "direccion": "Ecuador, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8559949,
    "longitud": -56.0005892
  },
  {
    "id": "la-palmera",
    "nombre": "La Palmera",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Batlle Berres 4656, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8545988,
    "longitud": -56.234241
  },
  {
    "id": "del-fuerte",
    "nombre": "Del Fuerte",
    "tipo": "Supermercado",
    "direccion": "Del Fuerte 5302, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8519683,
    "longitud": -56.11746
  },
  {
    "id": "devoto-san-martin-ii",
    "nombre": "Devoto San Martín II",
    "tipo": "Supermercado",
    "direccion": "Avenida General San Martín 3083, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8695555,
    "longitud": -56.1825594
  },
  {
    "id": "marymar",
    "nombre": "Marymar",
    "tipo": "Supermercado",
    "direccion": "San Quintín 4276, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8552006,
    "longitud": -56.221059
  },
  {
    "id": "3e-distribuidora",
    "nombre": "3e Distribuidora",
    "tipo": "Supermercado",
    "direccion": "Colorado 2059, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8786268,
    "longitud": -56.1744987
  },
  {
    "id": "fresh-market",
    "nombre": "Fresh Market",
    "tipo": "Supermercado",
    "direccion": "Avenida de las Américas 6000, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8699655,
    "longitud": -56.0310018
  },
  {
    "id": "frog-9",
    "nombre": "Frog 9",
    "tipo": "Supermercado",
    "direccion": "Avenida Gonzalo Ramírez 1345, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9119762,
    "longitud": -56.1863621
  },
  {
    "id": "disco",
    "nombre": "Disco",
    "tipo": "Supermercado",
    "direccion": "Avenida Naciones Unidas, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8041542,
    "longitud": -55.9081487
  },
  {
    "id": "parada-dos",
    "nombre": "Parada Dos",
    "tipo": "Supermercado",
    "direccion": "Yegros 2062, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8008841,
    "longitud": -56.2286678
  },
  {
    "id": "don-alberto",
    "nombre": "Don Alberto",
    "tipo": "Supermercado",
    "direccion": "Camino General Máximo Santos 5207, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8236815,
    "longitud": -56.2201329
  },
  {
    "id": "autoservice-180",
    "nombre": "AUTOSERVICE 180",
    "tipo": "Supermercado",
    "direccion": "Jaime Roldos y Pons 4051, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.8599959,
    "longitud": -56.1548569
  },
  {
    "id": "geant",
    "nombre": "Géant",
    "tipo": "Supermercado",
    "direccion": "Gualeguay 3350, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8680718,
    "longitud": -56.1704131
  },
  {
    "id": "multi-ahorro",
    "nombre": "Multi Ahorro",
    "tipo": "Supermercado",
    "direccion": "Canelones 888, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9092523,
    "longitud": -56.1970702
  },
  {
    "id": "autoservice-quique",
    "nombre": "Autoservice Quique",
    "tipo": "Supermercado",
    "direccion": "Democracia 2498, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8826329,
    "longitud": -56.1776759
  },
  {
    "id": "devoto-santa-monica",
    "nombre": "Devoto Santa Mónica",
    "tipo": "Supermercado",
    "direccion": "Avenida Italia 6958, Carrasco Norte",
    "barrio": "Carrasco Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8778204,
    "longitud": -56.0573141
  },
  {
    "id": "frog-26",
    "nombre": "Frog 26",
    "tipo": "Supermercado",
    "direccion": "Canelones 2185, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9068355,
    "longitud": -56.1677785
  },
  {
    "id": "percat-1",
    "nombre": "Percat 1",
    "tipo": "Supermercado",
    "direccion": "Ramón Ortiz 51, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7369361,
    "longitud": -56.223349
  },
  {
    "id": "super-chance",
    "nombre": "Super Chance",
    "tipo": "Supermercado",
    "direccion": "Magariños Cervantes 1913, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8910173,
    "longitud": -56.1404981
  },
  {
    "id": "devoto",
    "nombre": "Devoto",
    "tipo": "Supermercado",
    "direccion": "Avenida General José María Paz 1404, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8935359,
    "longitud": -56.0795988
  },
  {
    "id": "ta-ta",
    "nombre": "Ta-Ta",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8283371,
    "longitud": -55.9684543
  },
  {
    "id": "la-chacra-2",
    "nombre": "La Chacra 2",
    "tipo": "Supermercado",
    "direccion": "Avenida General Rivera 3840/44, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8999242,
    "longitud": -56.1300374
  },
  {
    "id": "almacen-asere-con-ashe",
    "nombre": "Almacén Asere con Ashé",
    "tipo": "Supermercado",
    "direccion": "José Antonio Cabrera 4002, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8733603,
    "longitud": -56.1348022
  },
  {
    "id": "ageran",
    "nombre": "Ageran",
    "tipo": "Supermercado",
    "direccion": "Avenida General José Garibaldi 2876, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8905657,
    "longitud": -56.1575197
  },
  {
    "id": "cooperativa-bancaria",
    "nombre": "Cooperativa Bancaria",
    "tipo": "Supermercado",
    "direccion": "Sarandí, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.908214,
    "longitud": -56.2072664
  },
  {
    "id": "cornermarket",
    "nombre": "CornerMarket",
    "tipo": "Supermercado",
    "direccion": "Lagunillas, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.921905,
    "longitud": -56.1607302
  },
  {
    "id": "disco-legrand",
    "nombre": "Disco Legrand",
    "tipo": "Supermercado",
    "direccion": "Avenida Enrique Legrand 5085, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8893286,
    "longitud": -56.0984505
  },
  {
    "id": "cofa-s",
    "nombre": "Cofa's",
    "tipo": "Supermercado",
    "direccion": "Acevedo Díaz 1663, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8966688,
    "longitud": -56.1678205
  },
  {
    "id": "super-mekas",
    "nombre": "Super Mekas",
    "tipo": "Supermercado",
    "direccion": "Doctor Aquiles R. Lanza 1270, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9071601,
    "longitud": -56.1876842
  },
  {
    "id": "frog-15",
    "nombre": "Frog 15",
    "tipo": "Supermercado",
    "direccion": "Constituyente 1788, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.906732,
    "longitud": -56.1778699
  },
  {
    "id": "portisur-alimentos-congelados",
    "nombre": "Portisur Alimentos Congelados",
    "tipo": "Supermercado",
    "direccion": "Avenida Brasil 2540, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9075554,
    "longitud": -56.15908
  },
  {
    "id": "tata",
    "nombre": "Tata",
    "tipo": "Supermercado",
    "direccion": "Avenida Lezica 6345, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.7966847,
    "longitud": -56.2479459
  },
  {
    "id": "los-paraisos",
    "nombre": "Los Paraísos",
    "tipo": "Supermercado",
    "direccion": "Avenida Don Pedro de Mendoza 5388, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8062262,
    "longitud": -56.1610906
  },
  {
    "id": "el-morro",
    "nombre": "El Morro",
    "tipo": "Supermercado",
    "direccion": "Avenida Cibils 4484, La Paloma Tomkinson",
    "barrio": "La Paloma Tomkinson",
    "ciudad": "Montevideo",
    "latitud": -34.8714826,
    "longitud": -56.2669893
  },
  {
    "id": "macromercado-paso-de-la-arena",
    "nombre": "MacroMercado Paso de la Arena",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Batlle Berres, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.8390823,
    "longitud": -56.2630699
  },
  {
    "id": "la-familia",
    "nombre": "La Familia",
    "tipo": "Supermercado",
    "direccion": "Camino Coronel Raíz 1604, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8271377,
    "longitud": -56.2003804
  },
  {
    "id": "macromercado",
    "nombre": "Macromercado",
    "tipo": "Supermercado",
    "direccion": "Camino Maldonado 6783, Punta Rieles",
    "barrio": "Punta Rieles",
    "ciudad": "Montevideo",
    "latitud": -34.8240275,
    "longitud": -56.1021927
  },
  {
    "id": "supermercado-tata",
    "nombre": "Supermercado Tata",
    "tipo": "Supermercado",
    "direccion": "República Argentina, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8902825,
    "longitud": -56.2478759
  },
  {
    "id": "devoto-hermanos-san-quintin",
    "nombre": "Devoto Hermanos (San Quintín)",
    "tipo": "Supermercado",
    "direccion": "San Quintín, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8523506,
    "longitud": -56.222905
  },
  {
    "id": "la-italiana",
    "nombre": "La Italiana",
    "tipo": "Supermercado",
    "direccion": "Ciclovía Boulevard, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8714343,
    "longitud": -56.186188
  },
  {
    "id": "devoto-el-prado",
    "nombre": "Devoto El Prado",
    "tipo": "Supermercado",
    "direccion": "Caigua, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8642497,
    "longitud": -56.1953387
  },
  {
    "id": "eco-market-3",
    "nombre": "Eco Market 3",
    "tipo": "Supermercado",
    "direccion": "Avenida Burgues, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.850418,
    "longitud": -56.1794631
  },
  {
    "id": "el-tio",
    "nombre": "El Tío",
    "tipo": "Supermercado",
    "direccion": "Avenida General José Garibaldi 2511, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8857024,
    "longitud": -56.1644328
  },
  {
    "id": "multi-ahorro-arroyo-seco",
    "nombre": "Multi Ahorro (Arroyo Seco)",
    "tipo": "Supermercado",
    "direccion": "Avenida Agraciada 2560, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8846169,
    "longitud": -56.1932129
  },
  {
    "id": "el-encanto",
    "nombre": "El Encanto",
    "tipo": "Supermercado",
    "direccion": "Gaviotas, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8165403,
    "longitud": -55.9276411
  },
  {
    "id": "supermercado-continente",
    "nombre": "Supermercado Continente",
    "tipo": "Supermercado",
    "direccion": "Avenida José Belloni 4752, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8166618,
    "longitud": -56.1389006
  },
  {
    "id": "super-express-la-teja",
    "nombre": "Super Express (La Teja)",
    "tipo": "Supermercado",
    "direccion": "Doctor Martín Berinduague 870, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8691687,
    "longitud": -56.2319401
  },
  {
    "id": "fenix",
    "nombre": "Fénix",
    "tipo": "Supermercado",
    "direccion": "Avenida General Rondeau 2132, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8906071,
    "longitud": -56.1927777
  },
  {
    "id": "supermercadio",
    "nombre": "Supermercadio",
    "tipo": "Supermercado",
    "direccion": "Bulevar Doctor Manuel Herrera y Obes, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8551046,
    "longitud": -56.230785
  },
  {
    "id": "la-bohemia",
    "nombre": "La Bohemia",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Alberto de Herrera 3846, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8628745,
    "longitud": -56.1785309
  },
  {
    "id": "el-clon",
    "nombre": "El Clon",
    "tipo": "Supermercado",
    "direccion": "Juan Antonio Artigas 4120, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8577261,
    "longitud": -56.2179124
  },
  {
    "id": "super-vero",
    "nombre": "Super Vero",
    "tipo": "Supermercado",
    "direccion": "Avenida General José Garibaldi, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8766183,
    "longitud": -56.1794697
  },
  {
    "id": "expres",
    "nombre": "Expres",
    "tipo": "Supermercado",
    "direccion": "Avenida Gonzalo Ramírez 1811, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9117752,
    "longitud": -56.1755199
  },
  {
    "id": "el-pinar",
    "nombre": "El Pinar",
    "tipo": "Supermercado",
    "direccion": "Avenida Naciones Unidas, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8037802,
    "longitud": -55.9083707
  },
  {
    "id": "devoto-colon",
    "nombre": "Devoto (Colón)",
    "tipo": "Supermercado",
    "direccion": "Avenida General Eugenio Garzón 1945, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8052345,
    "longitud": -56.2229343
  },
  {
    "id": "frigo-sayago",
    "nombre": "Frigo (Sayago)",
    "tipo": "Supermercado",
    "direccion": "Camino Ariel 4835, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8337812,
    "longitud": -56.2166746
  },
  {
    "id": "prisma",
    "nombre": "Prisma",
    "tipo": "Supermercado",
    "direccion": "Avenida General Flores 3327, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8672409,
    "longitud": -56.1722194
  },
  {
    "id": "planeta",
    "nombre": "Planeta",
    "tipo": "Supermercado",
    "direccion": "Andes 1427, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9048778,
    "longitud": -56.1984105
  },
  {
    "id": "sluckis",
    "nombre": "Sluckis",
    "tipo": "Supermercado",
    "direccion": "Arenal Grande 2193, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8886199,
    "longitud": -56.1814014
  },
  {
    "id": "devoto-express",
    "nombre": "Devoto Express",
    "tipo": "Supermercado",
    "direccion": "Camino Carrasco 6955, Carrasco Norte",
    "barrio": "Carrasco Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8699138,
    "longitud": -56.0724271
  },
  {
    "id": "devoto-express-parque-rodo",
    "nombre": "Devoto Express (Parque Rodó)",
    "tipo": "Supermercado",
    "direccion": "Bulevar General Artigas 1205, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9065795,
    "longitud": -56.16394
  },
  {
    "id": "el-minisuper-de-las-piedras",
    "nombre": "El Minisuper De Las Piedras",
    "tipo": "Supermercado",
    "direccion": "República Argentina 816, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7247858,
    "longitud": -56.2104248
  },
  {
    "id": "frog",
    "nombre": "Frog",
    "tipo": "Supermercado",
    "direccion": "Avenida Ramón Anador 3272, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.89627,
    "longitud": -56.1460255
  },
  {
    "id": "devoto-punta-gorda-avenida-bolivia",
    "nombre": "Devoto (Punta Gorda, Avenida Bolivia)",
    "tipo": "Supermercado",
    "direccion": "Avenida Bolivia, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8934262,
    "longitud": -56.0664293
  },
  {
    "id": "disco-solymar",
    "nombre": "Disco (Solymar)",
    "tipo": "Supermercado",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.826298,
    "longitud": -55.9651137
  },
  {
    "id": "supermercado-1210",
    "nombre": "Supermercado 1210",
    "tipo": "Supermercado",
    "direccion": "Pedro Bustamante 1210, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9024287,
    "longitud": -56.1333792
  },
  {
    "id": "super-compras",
    "nombre": "Super Compras",
    "tipo": "Supermercado",
    "direccion": "Comercio 2069, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8839404,
    "longitud": -56.1338691
  },
  {
    "id": "asociacion-cooperativa-electoral",
    "nombre": "Asociación Cooperativa Electoral",
    "tipo": "Supermercado",
    "direccion": "Avenida 8 de Octubre 2897, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8855144,
    "longitud": -56.1572042
  },
  {
    "id": "devoto-punta-carretas",
    "nombre": "Devoto Punta Carretas",
    "tipo": "Supermercado",
    "direccion": "Coronel Mora, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9191801,
    "longitud": -56.15747
  },
  {
    "id": "portisur",
    "nombre": "Portisur",
    "tipo": "Supermercado",
    "direccion": "Avenida Italia 4452, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8876311,
    "longitud": -56.1130941
  },
  {
    "id": "ta-ta-tres-cruces",
    "nombre": "Ta-Ta (Tres Cruces)",
    "tipo": "Supermercado",
    "direccion": "Miguelete 2224, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8925172,
    "longitud": -56.1708593
  },
  {
    "id": "super-frigo-centro",
    "nombre": "Super Frigo (Centro)",
    "tipo": "Supermercado",
    "direccion": "Avenida Uruguay 1104, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9032844,
    "longitud": -56.1926442
  },
  {
    "id": "don-paulino",
    "nombre": "Don Paulino",
    "tipo": "Supermercado",
    "direccion": "Avenida Daniel Fernández Crespo 1685, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.8994872,
    "longitud": -56.1769922
  },
  {
    "id": "frog-maxishop-7",
    "nombre": "Frog Maxishop 7",
    "tipo": "Supermercado",
    "direccion": "Luis B. Cavia 3058, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9136084,
    "longitud": -56.1512717
  },
  {
    "id": "super-bambu",
    "nombre": "Super BAMBÚ",
    "tipo": "Supermercado",
    "direccion": "Capitán Tula 4711, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.822028,
    "longitud": -56.1561773
  },
  {
    "id": "super-tren",
    "nombre": "SUPER TREN",
    "tipo": "Supermercado",
    "direccion": "Camino Coronel Raíz 1672, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.825279,
    "longitud": -56.2003161
  },
  {
    "id": "disco-agraciada",
    "nombre": "Disco Agraciada",
    "tipo": "Supermercado",
    "direccion": "Avenida Agraciada, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8757995,
    "longitud": -56.1982016
  },
  {
    "id": "buenas-migas",
    "nombre": "Buenas Migas",
    "tipo": "Supermercado",
    "direccion": "Avenida Amelia Ramírez de García Lagos, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8194734,
    "longitud": -55.9388945
  },
  {
    "id": "marymar-piedras-blancas",
    "nombre": "MARYMAR (Piedras Blancas)",
    "tipo": "Supermercado",
    "direccion": "Avenida José Belloni 4208, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8269653,
    "longitud": -56.1407042
  },
  {
    "id": "multi-ahorro-la-teja",
    "nombre": "Multi Ahorro (La Teja)",
    "tipo": "Supermercado",
    "direccion": "Avenida Carlos María Ramírez, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8664889,
    "longitud": -56.2371087
  },
  {
    "id": "coop-policial",
    "nombre": "Coop. Policial",
    "tipo": "Supermercado",
    "direccion": "Nueva York 1335, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8970842,
    "longitud": -56.1891109
  },
  {
    "id": "super-dioma",
    "nombre": "Super Dioma",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Alberto de Herrera 4008, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8621557,
    "longitud": -56.1834704
  },
  {
    "id": "nuevo-porvenir",
    "nombre": "Nuevo Porvenir",
    "tipo": "Supermercado",
    "direccion": "Ángel Salvo 80, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8621845,
    "longitud": -56.2154966
  },
  {
    "id": "tata-la-figurita",
    "nombre": "TaTa (La Figurita)",
    "tipo": "Supermercado",
    "direccion": "Avenida General Flores, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8737973,
    "longitud": -56.1772299
  },
  {
    "id": "super-xxi",
    "nombre": "Super XXI",
    "tipo": "Supermercado",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.7974331,
    "longitud": -55.9357854
  },
  {
    "id": "ta-ta-colon",
    "nombre": "Ta-Ta (Colón)",
    "tipo": "Supermercado",
    "direccion": "Avenida General Eugenio Garzón 1952, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8044738,
    "longitud": -56.2226354
  },
  {
    "id": "tata-sayago",
    "nombre": "TaTa (Sayago)",
    "tipo": "Supermercado",
    "direccion": "Bulevar José Batlle y Ordóñez, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8254834,
    "longitud": -56.2240111
  },
  {
    "id": "kinko",
    "nombre": "Kinko",
    "tipo": "Supermercado",
    "direccion": "General Máximo Tajes, Carrasco Norte",
    "barrio": "Carrasco Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8767918,
    "longitud": -56.0669699
  },
  {
    "id": "farmashop-tres-cruces",
    "nombre": "Farmashop (Tres Cruces)",
    "tipo": "Farmacia",
    "direccion": "Bulevar General Artigas 1481, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.901423,
    "longitud": -56.1645399
  },
  {
    "id": "farmashop-lezica",
    "nombre": "Farmashop (Lezica)",
    "tipo": "Farmacia",
    "direccion": "Avenida Lezica 6394, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.7951515,
    "longitud": -56.2490248
  },
  {
    "id": "farmashop-punta-carretas",
    "nombre": "Farmashop (Punta Carretas)",
    "tipo": "Farmacia",
    "direccion": "Doctor José Scosería 2614, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9152826,
    "longitud": -56.1557418
  },
  {
    "id": "farmashop-maronas",
    "nombre": "Farmashop (Maroñas)",
    "tipo": "Farmacia",
    "direccion": "Veracierto, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8712487,
    "longitud": -56.1173786
  },
  {
    "id": "farmashop-union",
    "nombre": "Farmashop (Unión)",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8786437,
    "longitud": -56.1472606
  },
  {
    "id": "farmashop-malvin-nuevo",
    "nombre": "Farmashop (Malvín Nuevo)",
    "tipo": "Farmacia",
    "direccion": "Avenida Italia 4206, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8876173,
    "longitud": -56.1176977
  },
  {
    "id": "farmashop-malvin",
    "nombre": "Farmashop (Malvín)",
    "tipo": "Farmacia",
    "direccion": "Avenida Enrique Legrand 5085, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8895577,
    "longitud": -56.0988068
  },
  {
    "id": "farmashop-buceo",
    "nombre": "Farmashop (Buceo)",
    "tipo": "Farmacia",
    "direccion": "Avenida Mariscal Francisco Solano López, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8921033,
    "longitud": -56.1254065
  },
  {
    "id": "farmashop-brazo-oriental",
    "nombre": "Farmashop (Brazo Oriental)",
    "tipo": "Farmacia",
    "direccion": "Avenida General San Martín 3402, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8628004,
    "longitud": -56.1788092
  },
  {
    "id": "farmashop-punta-gorda",
    "nombre": "Farmashop (Punta Gorda)",
    "tipo": "Farmacia",
    "direccion": "Avenida Bolivia, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8929388,
    "longitud": -56.0659995
  },
  {
    "id": "farmashop-centro",
    "nombre": "Farmashop (Centro)",
    "tipo": "Farmacia",
    "direccion": "San José 1052, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9070711,
    "longitud": -56.1934197
  },
  {
    "id": "farmashop-cordon",
    "nombre": "Farmashop (Cordón)",
    "tipo": "Farmacia",
    "direccion": "Colonia 1800, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9016448,
    "longitud": -56.1778873
  },
  {
    "id": "farmashop-barrio-sur",
    "nombre": "Farmashop (Barrio Sur)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 850, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9065497,
    "longitud": -56.1983044
  },
  {
    "id": "farmashop-las-piedras",
    "nombre": "Farmashop (Las Piedras)",
    "tipo": "Farmacia",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7270021,
    "longitud": -56.2136009
  },
  {
    "id": "farmashop-parque-miramar",
    "nombre": "Farmashop (Parque Miramar)",
    "tipo": "Farmacia",
    "direccion": "Avenida de las Américas, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8698099,
    "longitud": -56.0311519
  },
  {
    "id": "farmashop-lagomar",
    "nombre": "Farmashop (Lagomar)",
    "tipo": "Farmacia",
    "direccion": "Escribano Luis Laserre, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8408431,
    "longitud": -55.9729976
  },
  {
    "id": "farmashop-barrio-sur-convencion",
    "nombre": "Farmashop (Barrio Sur, Convención)",
    "tipo": "Farmacia",
    "direccion": "Convención, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9052235,
    "longitud": -56.1969893
  },
  {
    "id": "farmashop-punta-carretas-21-de-setiembre-2752",
    "nombre": "Farmashop (Punta Carretas, 21 de Setiembre 2752)",
    "tipo": "Farmacia",
    "direccion": "21 de Setiembre 2752, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9144244,
    "longitud": -56.1603464
  },
  {
    "id": "farmashop-tres-cruces-avenida-italia-2490",
    "nombre": "Farmashop (Tres Cruces, Avenida Italia 2490)",
    "tipo": "Farmacia",
    "direccion": "Avenida Italia 2490, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8936989,
    "longitud": -56.1615849
  },
  {
    "id": "farmashop-cordon-avenida-18-de-julio-1649",
    "nombre": "Farmashop (Cordón, Avenida 18 de Julio 1649)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 1649, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9035955,
    "longitud": -56.1807917
  },
  {
    "id": "farmacia-san-roque-centro",
    "nombre": "Farmacia San Roque (Centro)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 1252, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9058643,
    "longitud": -56.188981
  },
  {
    "id": "farmacia-san-roque-union",
    "nombre": "Farmacia San Roque (Unión)",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre 3640, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8766386,
    "longitud": -56.1430505
  },
  {
    "id": "farmacia-san-roque-paso-molino",
    "nombre": "Farmacia San Roque (Paso Molino)",
    "tipo": "Farmacia",
    "direccion": "Avenida Agraciada 4214, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8563477,
    "longitud": -56.2198347
  },
  {
    "id": "farmacia-san-roque-cordon",
    "nombre": "Farmacia San Roque (Cordón)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 1799, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9023056,
    "longitud": -56.1774454
  },
  {
    "id": "farmacia-san-roque-tres-ombues",
    "nombre": "Farmacia San Roque (Tres Ombúes)",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez 1490, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8732455,
    "longitud": -56.2463537
  },
  {
    "id": "farmacia-san-roque-malvin",
    "nombre": "Farmacia San Roque (Malvín)",
    "tipo": "Farmacia",
    "direccion": "Missisipi 1647, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8914191,
    "longitud": -56.0963442
  },
  {
    "id": "farmacia-san-roque-punta-gorda",
    "nombre": "Farmacia San Roque (Punta Gorda)",
    "tipo": "Farmacia",
    "direccion": "Avenida Italia 5775, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8812841,
    "longitud": -56.0813031
  },
  {
    "id": "farmacia-san-roque-barrio-sur",
    "nombre": "Farmacia San Roque (Barrio Sur)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 900, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9064363,
    "longitud": -56.1971303
  },
  {
    "id": "farmacia-san-roque-carrasco",
    "nombre": "Farmacia San Roque (Carrasco)",
    "tipo": "Farmacia",
    "direccion": "Avenida Alfredo Arocena 1681, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8867722,
    "longitud": -56.0586393
  },
  {
    "id": "farmacia-san-roque-buceo",
    "nombre": "Farmacia San Roque (Buceo)",
    "tipo": "Farmacia",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9031978,
    "longitud": -56.1370059
  },
  {
    "id": "farmacia-san-roque-villa-munoz",
    "nombre": "Farmacia San Roque (Villa Muñoz)",
    "tipo": "Farmacia",
    "direccion": "José L. Terra 2200, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.886865,
    "longitud": -56.1835715
  },
  {
    "id": "farmacia-san-roque-punta-carretas",
    "nombre": "Farmacia San Roque (Punta Carretas)",
    "tipo": "Farmacia",
    "direccion": "José Ellauri 512, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9211904,
    "longitud": -56.1572953
  },
  {
    "id": "farmacia-san-roque-pocitos",
    "nombre": "Farmacia San Roque (Pocitos)",
    "tipo": "Farmacia",
    "direccion": "Gabriel Pereira 3298, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9112263,
    "longitud": -56.1462412
  },
  {
    "id": "farmacia-san-roque-parque-rodo",
    "nombre": "Farmacia San Roque (Parque Rodó)",
    "tipo": "Farmacia",
    "direccion": "Canelones 2198, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9071202,
    "longitud": -56.1676027
  },
  {
    "id": "farmacia-san-roque-ciudad-vieja",
    "nombre": "Farmacia San Roque (Ciudad Vieja)",
    "tipo": "Farmacia",
    "direccion": "Sarandí 699, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9064382,
    "longitud": -56.2010223
  },
  {
    "id": "farmacia-san-roque-parque-miramar",
    "nombre": "Farmacia San Roque (Parque Miramar)",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8655132,
    "longitud": -56.0236407
  },
  {
    "id": "farmacia-san-roque-san-jose-de-carrasco",
    "nombre": "Farmacia San Roque (San José de Carrasco)",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8406916,
    "longitud": -55.9936243
  },
  {
    "id": "farmacia-san-roque-union-avenida-italia-3830",
    "nombre": "Farmacia San Roque (Unión, Avenida Italia 3830)",
    "tipo": "Farmacia",
    "direccion": "Avenida Italia 3830, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8871065,
    "longitud": -56.1290201
  },
  {
    "id": "farmacia-san-roque-punta-carretas-jose-ellauri-350",
    "nombre": "Farmacia San Roque (Punta Carretas, José Ellauri 350)",
    "tipo": "Farmacia",
    "direccion": "José Ellauri 350, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9238107,
    "longitud": -56.1587422
  },
  {
    "id": "farmacia-san-roque-centro-avenida-18-de-julio-1078",
    "nombre": "Farmacia San Roque (Centro, Avenida 18 de Julio 1078)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 1078, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9061904,
    "longitud": -56.19299
  },
  {
    "id": "farmacia-san-roque-tres-cruces",
    "nombre": "Farmacia San Roque (Tres Cruces)",
    "tipo": "Farmacia",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8936913,
    "longitud": -56.1664102
  },
  {
    "id": "farmacia-san-roque-cordon-avenida-general-rivera-2102",
    "nombre": "Farmacia San Roque (Cordón, Avenida General Rivera 2102)",
    "tipo": "Farmacia",
    "direccion": "Avenida General Rivera 2102, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9023404,
    "longitud": -56.1700912
  },
  {
    "id": "farmacia-el-tunel-punta-carretas",
    "nombre": "Farmacia El Túnel (Punta Carretas)",
    "tipo": "Farmacia",
    "direccion": "21 de Setiembre 2816, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9187319,
    "longitud": -56.1565129
  },
  {
    "id": "farmacia-el-tunel-barrio-sur",
    "nombre": "Farmacia El Túnel (Barrio Sur)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9061176,
    "longitud": -56.1960202
  },
  {
    "id": "farmacia-el-tunel-paso-molino",
    "nombre": "Farmacia El Túnel (Paso Molino)",
    "tipo": "Farmacia",
    "direccion": "Avenida Agraciada 4089, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8587843,
    "longitud": -56.217317
  },
  {
    "id": "farmacia-el-tunel-carrasco-norte",
    "nombre": "Farmacia El Túnel (Carrasco Norte)",
    "tipo": "Farmacia",
    "direccion": "Avenida Doctor Juan Bautista Alberdi 6597, Carrasco Norte",
    "barrio": "Carrasco Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8796535,
    "longitud": -56.0636243
  },
  {
    "id": "farmacia-el-tunel-pocitos",
    "nombre": "Farmacia El Túnel (Pocitos)",
    "tipo": "Farmacia",
    "direccion": "26 de Marzo 3397, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9061866,
    "longitud": -56.1396877
  },
  {
    "id": "farmacia-el-tunel-malvin-nuevo",
    "nombre": "Farmacia El Túnel (Malvín Nuevo)",
    "tipo": "Farmacia",
    "direccion": "Hipólito Yrigoyen 1599, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8914295,
    "longitud": -56.1090522
  },
  {
    "id": "manga",
    "nombre": "Manga",
    "tipo": "Farmacia",
    "direccion": "Avenida José Belloni, Manga",
    "barrio": "Manga",
    "ciudad": "Montevideo",
    "latitud": -34.8068051,
    "longitud": -56.136837
  },
  {
    "id": "acuario",
    "nombre": "Acuario",
    "tipo": "Farmacia",
    "direccion": "Avenida José Belloni 6374, Puntas de Manga",
    "barrio": "Puntas de Manga",
    "ciudad": "Montevideo",
    "latitud": -34.7820679,
    "longitud": -56.13583
  },
  {
    "id": "giannycal",
    "nombre": "Giannycal",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Shangrila, Ciudad de la Costa",
    "barrio": "Shangrila",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8469259,
    "longitud": -56.0033901
  },
  {
    "id": "mensar",
    "nombre": "Mensar",
    "tipo": "Farmacia",
    "direccion": "Avenida Don Pedro de Mendoza 4096, Ituzaingó",
    "barrio": "Ituzaingó",
    "ciudad": "Montevideo",
    "latitud": -34.8340014,
    "longitud": -56.1513084
  },
  {
    "id": "las-vegas",
    "nombre": "Las Vegas",
    "tipo": "Farmacia",
    "direccion": "Avenida General Flores 4733, Las Acacias",
    "barrio": "Las Acacias",
    "ciudad": "Montevideo",
    "latitud": -34.8446585,
    "longitud": -56.1542798
  },
  {
    "id": "colombes",
    "nombre": "Colombes",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre, Villa Española",
    "barrio": "Villa Española",
    "ciudad": "Montevideo",
    "latitud": -34.8656013,
    "longitud": -56.1339374
  },
  {
    "id": "macarem",
    "nombre": "Macarem",
    "tipo": "Farmacia",
    "direccion": "Avenida Lezica 6170, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.8006354,
    "longitud": -56.2428431
  },
  {
    "id": "uriel",
    "nombre": "Uriel",
    "tipo": "Farmacia",
    "direccion": "Avenida Don Pedro de Mendoza 5345, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8073908,
    "longitud": -56.1613999
  },
  {
    "id": "timbo",
    "nombre": "Timbó",
    "tipo": "Farmacia",
    "direccion": "Carlos de la Vega 5143 bis, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.8468844,
    "longitud": -56.2419993
  },
  {
    "id": "farmacia-san-esteban",
    "nombre": "Farmacia San Esteban",
    "tipo": "Farmacia",
    "direccion": "Etiopía 2662, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8872785,
    "longitud": -56.2681091
  },
  {
    "id": "san-jose",
    "nombre": "San José",
    "tipo": "Farmacia",
    "direccion": "Avenida Millán, Paso de las Duranas",
    "barrio": "Paso de las Duranas",
    "ciudad": "Montevideo",
    "latitud": -34.8494673,
    "longitud": -56.1982146
  },
  {
    "id": "gilda",
    "nombre": "Gilda",
    "tipo": "Farmacia",
    "direccion": "Avenida Millán 2744, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8759568,
    "longitud": -56.187508
  },
  {
    "id": "hector",
    "nombre": "Héctor",
    "tipo": "Farmacia",
    "direccion": "Camino Maldonado, Punta Rieles",
    "barrio": "Punta Rieles",
    "ciudad": "Montevideo",
    "latitud": -34.8361027,
    "longitud": -56.1153726
  },
  {
    "id": "avicena",
    "nombre": "Avicena",
    "tipo": "Farmacia",
    "direccion": "Monte Caseros 3050, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8810737,
    "longitud": -56.1577412
  },
  {
    "id": "elhordoy",
    "nombre": "Elhordoy",
    "tipo": "Farmacia",
    "direccion": "Avenida Doctor Juan Carlos Blanco 3420, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8684347,
    "longitud": -56.2008051
  },
  {
    "id": "del-cerro",
    "nombre": "Del Cerro",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8738589,
    "longitud": -56.2508641
  },
  {
    "id": "penarol",
    "nombre": "Peñarol",
    "tipo": "Farmacia",
    "direccion": "Camino Coronel Raíz 1607, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8269988,
    "longitud": -56.2006582
  },
  {
    "id": "belvedere",
    "nombre": "Belvedere",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez 50, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8551088,
    "longitud": -56.2228878
  },
  {
    "id": "rita",
    "nombre": "Rita",
    "tipo": "Farmacia",
    "direccion": "Bulevar José Batlle y Ordóñez 4701, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8510655,
    "longitud": -56.184713
  },
  {
    "id": "tami",
    "nombre": "Tami",
    "tipo": "Farmacia",
    "direccion": "Avenida Millán 2952, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8720889,
    "longitud": -56.189634
  },
  {
    "id": "tiendafarma",
    "nombre": "Tiendafarma",
    "tipo": "Farmacia",
    "direccion": "Bulevar José Batlle y Ordóñez, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8657725,
    "longitud": -56.1645807
  },
  {
    "id": "veraciento",
    "nombre": "Veraciento",
    "tipo": "Farmacia",
    "direccion": "Camino Carrasco 4720, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8712221,
    "longitud": -56.1155805
  },
  {
    "id": "roosvelt",
    "nombre": "Roosvelt",
    "tipo": "Farmacia",
    "direccion": "General Fausto Aguilar, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8850817,
    "longitud": -56.1937539
  },
  {
    "id": "farma-cor",
    "nombre": "Farma-Cor",
    "tipo": "Farmacia",
    "direccion": "Cufré 2351, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.884154,
    "longitud": -56.1701243
  },
  {
    "id": "pigalle",
    "nombre": "Pigalle",
    "tipo": "Farmacia",
    "direccion": "Avenida Calcagno, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.850172,
    "longitud": -55.9996769
  },
  {
    "id": "diu-drogueria-industrial-uruguaya",
    "nombre": "DIU - Droguería Industrial Uruguaya",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8399427,
    "longitud": -55.9904849
  },
  {
    "id": "aleluya-iii",
    "nombre": "Aleluya III",
    "tipo": "Farmacia",
    "direccion": "Camino Maldonado 4902, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8552613,
    "longitud": -56.1312171
  },
  {
    "id": "bella-vista",
    "nombre": "Bella Vista",
    "tipo": "Farmacia",
    "direccion": "Uruguayana 3152, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8746996,
    "longitud": -56.2019049
  },
  {
    "id": "drogueria-montevideo",
    "nombre": "Droguería Montevideo",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8342133,
    "longitud": -55.9797154
  },
  {
    "id": "la-gracia",
    "nombre": "La Gracia",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8053235,
    "longitud": -55.9274493
  },
  {
    "id": "luxor",
    "nombre": "Luxor",
    "tipo": "Farmacia",
    "direccion": "Avenida José Belloni, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8175183,
    "longitud": -56.1389628
  },
  {
    "id": "maresca",
    "nombre": "Maresca",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez 900, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8661445,
    "longitud": -56.2363612
  },
  {
    "id": "cerrito",
    "nombre": "Cerrito",
    "tipo": "Farmacia",
    "direccion": "Avenida General Flores, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.8562972,
    "longitud": -56.1632886
  },
  {
    "id": "farma-uy",
    "nombre": "Farma.uy",
    "tipo": "Farmacia",
    "direccion": "Maldonado 1801, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9084916,
    "longitud": -56.1760617
  },
  {
    "id": "amistad",
    "nombre": "Amistad",
    "tipo": "Farmacia",
    "direccion": "Avenida Libertador Brigadier General Lavalleja 1601, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.9010994,
    "longitud": -56.1922881
  },
  {
    "id": "gerard",
    "nombre": "Gerard",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez 1097, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8689224,
    "longitud": -56.2393119
  },
  {
    "id": "drogueria-paysandu",
    "nombre": "Droguería Paysandú",
    "tipo": "Farmacia",
    "direccion": "Avenida Luis Alberto de Herrera 3430, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8679696,
    "longitud": -56.1696372
  },
  {
    "id": "parque-miramar",
    "nombre": "Parque Miramar",
    "tipo": "Farmacia",
    "direccion": "Gabriela Mistral, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8653828,
    "longitud": -56.0334073
  },
  {
    "id": "farmacia-del-pinar-atenea",
    "nombre": "Farmacia Del Pinar Atenea",
    "tipo": "Farmacia",
    "direccion": "Avenida José \"Pepe\" D'Elía, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8029101,
    "longitud": -55.9082333
  },
  {
    "id": "paris-2",
    "nombre": "Paris 2",
    "tipo": "Farmacia",
    "direccion": "Avenida General Eugenio Garzón 1999 bis, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8031364,
    "longitud": -56.2237006
  },
  {
    "id": "osacar",
    "nombre": "Osacar",
    "tipo": "Farmacia",
    "direccion": "Avenida Millán 4502, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8418693,
    "longitud": -56.2088068
  },
  {
    "id": "pose",
    "nombre": "Pose",
    "tipo": "Farmacia",
    "direccion": "Avenida General San Martín 3680, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.857528,
    "longitud": -56.1755759
  },
  {
    "id": "justicia",
    "nombre": "Justicia",
    "tipo": "Farmacia",
    "direccion": "Justicia 2302, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8871242,
    "longitud": -56.1792474
  },
  {
    "id": "san-salvador",
    "nombre": "San Salvador",
    "tipo": "Farmacia",
    "direccion": "Doctor Manuel Quintela 3202, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8926487,
    "longitud": -56.1489073
  },
  {
    "id": "ibirapita",
    "nombre": "Ibirapitá",
    "tipo": "Farmacia",
    "direccion": "Avenida Uruguay, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8267362,
    "longitud": -55.9688598
  },
  {
    "id": "farmacia-dover",
    "nombre": "Farmacia Dover",
    "tipo": "Farmacia",
    "direccion": "Doctor Joaquín Requena 1250, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.90507,
    "longitud": -56.1686738
  },
  {
    "id": "del-camino",
    "nombre": "Del Camino",
    "tipo": "Farmacia",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7274389,
    "longitud": -56.227186
  },
  {
    "id": "drogueria-uruguayana",
    "nombre": "Droguería Uruguayana",
    "tipo": "Farmacia",
    "direccion": "Ángel Salvo 94, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8623646,
    "longitud": -56.2161291
  },
  {
    "id": "corominas",
    "nombre": "Corominas",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre 2689, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8895625,
    "longitud": -56.1605555
  },
  {
    "id": "zabala",
    "nombre": "Zabala",
    "tipo": "Farmacia",
    "direccion": "25 de Mayo 392, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9066881,
    "longitud": -56.2078254
  },
  {
    "id": "pigalle-punta-gorda",
    "nombre": "Pigalle (Punta Gorda)",
    "tipo": "Farmacia",
    "direccion": "Avenida Bolivia 1429, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8931774,
    "longitud": -56.0666914
  },
  {
    "id": "guarino",
    "nombre": "Guarino",
    "tipo": "Farmacia",
    "direccion": "Avenida Mariscal Francisco Solano López 1546, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8944247,
    "longitud": -56.12277
  },
  {
    "id": "avelino",
    "nombre": "Avelino",
    "tipo": "Farmacia",
    "direccion": "Santa Mónica 2533, Carrasco Norte",
    "barrio": "Carrasco Norte",
    "ciudad": "Montevideo",
    "latitud": -34.8680096,
    "longitud": -56.0603553
  },
  {
    "id": "tabare",
    "nombre": "Tabaré",
    "tipo": "Farmacia",
    "direccion": "Río Negro 1152, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9096619,
    "longitud": -56.1931387
  },
  {
    "id": "panama",
    "nombre": "Panamá",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre 3606, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8770631,
    "longitud": -56.143786
  },
  {
    "id": "machado-2",
    "nombre": "Machado 2",
    "tipo": "Farmacia",
    "direccion": "Bulevar General Artigas 1999, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8907574,
    "longitud": -56.1656645
  },
  {
    "id": "pigalle-punta-carretas",
    "nombre": "Pigalle (Punta Carretas)",
    "tipo": "Farmacia",
    "direccion": "21 de Setiembre 2948, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9196508,
    "longitud": -56.1534177
  },
  {
    "id": "antartida",
    "nombre": "Antartida",
    "tipo": "Farmacia",
    "direccion": "Colonia 1475, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9041842,
    "longitud": -56.1846241
  },
  {
    "id": "pitagoras",
    "nombre": "Pitágoras",
    "tipo": "Farmacia",
    "direccion": "Alberto Zum Felde 2057, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8788273,
    "longitud": -56.1007025
  },
  {
    "id": "farmaglobal",
    "nombre": "FarmaGlobal",
    "tipo": "Farmacia",
    "direccion": "Avenida General Rivera 2690 A, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9032687,
    "longitud": -56.1563328
  },
  {
    "id": "homeopatia-alemana",
    "nombre": "Homeopatía Alemana",
    "tipo": "Farmacia",
    "direccion": "Carlos Roxlo 1494, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9024991,
    "longitud": -56.1821804
  },
  {
    "id": "gasmart",
    "nombre": "Gasmart",
    "tipo": "Farmacia",
    "direccion": "Avenida Calcagno, Shangrila, Ciudad de la Costa",
    "barrio": "Shangrila",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8486236,
    "longitud": -56.001644
  },
  {
    "id": "industria-2",
    "nombre": "Industria 2",
    "tipo": "Farmacia",
    "direccion": "Avenida Dámaso Antonio Larrañaga 4548, Ituzaingó",
    "barrio": "Ituzaingó",
    "ciudad": "Montevideo",
    "latitud": -34.8496946,
    "longitud": -56.1477047
  },
  {
    "id": "de-las-acacias",
    "nombre": "De Las Acacias",
    "tipo": "Farmacia",
    "direccion": "Avenida General Flores, Las Acacias",
    "barrio": "Las Acacias",
    "ciudad": "Montevideo",
    "latitud": -34.846458,
    "longitud": -56.155191
  },
  {
    "id": "ferpa",
    "nombre": "Ferpa",
    "tipo": "Farmacia",
    "direccion": "Avenida Lezica 6326, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.7969238,
    "longitud": -56.2470986
  },
  {
    "id": "estefania",
    "nombre": "Estefanía",
    "tipo": "Farmacia",
    "direccion": "Doctor Isidro Más de Ayala 5351, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8326105,
    "longitud": -56.1726409
  },
  {
    "id": "paris",
    "nombre": "París",
    "tipo": "Farmacia",
    "direccion": "Santa Lucía, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.843616,
    "longitud": -56.2399962
  },
  {
    "id": "san-pablo",
    "nombre": "San Pablo",
    "tipo": "Farmacia",
    "direccion": "Avenida General San Martín 2443, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8812698,
    "longitud": -56.1864406
  },
  {
    "id": "guarani",
    "nombre": "Guaraní",
    "tipo": "Farmacia",
    "direccion": "Avenida Luis Alberto de Herrera 2569, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8817334,
    "longitud": -56.1530614
  },
  {
    "id": "del-prado",
    "nombre": "Del Prado",
    "tipo": "Farmacia",
    "direccion": "Avenida 19 de Abril 3544, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8640921,
    "longitud": -56.2026355
  },
  {
    "id": "setiembre",
    "nombre": "Setiembre",
    "tipo": "Farmacia",
    "direccion": "Enrique George, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.818889,
    "longitud": -56.2144631
  },
  {
    "id": "de-leon",
    "nombre": "De León",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez 180, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8566558,
    "longitud": -56.2247898
  },
  {
    "id": "del-norte",
    "nombre": "Del Norte",
    "tipo": "Farmacia",
    "direccion": "Bulevar José Batlle y Ordóñez, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8530163,
    "longitud": -56.1817321
  },
  {
    "id": "carmen",
    "nombre": "Carmen",
    "tipo": "Farmacia",
    "direccion": "Bulevar General Artigas 3847, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8713935,
    "longitud": -56.1872454
  },
  {
    "id": "de-marco",
    "nombre": "De Marco",
    "tipo": "Farmacia",
    "direccion": "Avenida Luis Alberto de Herrera, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8749742,
    "longitud": -56.158855
  },
  {
    "id": "marilouz",
    "nombre": "Marilouz",
    "tipo": "Farmacia",
    "direccion": "Avenida General San Martín, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8867446,
    "longitud": -56.1882013
  },
  {
    "id": "ralf",
    "nombre": "Ralf",
    "tipo": "Farmacia",
    "direccion": "Doctor Juan José de Amézaga 2300, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8841941,
    "longitud": -56.1676672
  },
  {
    "id": "torre-18",
    "nombre": "Torre 18",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8566689,
    "longitud": -56.0111616
  },
  {
    "id": "zipirtia",
    "nombre": "Zipirtía",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre 4701, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.857972,
    "longitud": -56.1338894
  },
  {
    "id": "duzar",
    "nombre": "Duzar",
    "tipo": "Farmacia",
    "direccion": "Bulevar General Artigas 4396, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8719909,
    "longitud": -56.2018961
  },
  {
    "id": "farmaglobal-lagomar",
    "nombre": "FarmaGlobal (Lagomar)",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8360478,
    "longitud": -55.9832057
  },
  {
    "id": "san-giovanni",
    "nombre": "San Giovanni",
    "tipo": "Farmacia",
    "direccion": "Avenida Tuyutí, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8156898,
    "longitud": -55.9274676
  },
  {
    "id": "san-bernardo",
    "nombre": "San Bernardo",
    "tipo": "Farmacia",
    "direccion": "Avenida Carlos María Ramírez 515, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.861327,
    "longitud": -56.2299984
  },
  {
    "id": "antibes",
    "nombre": "Antibes",
    "tipo": "Farmacia",
    "direccion": "Avenida Gonzalo Ramírez 1840, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9121132,
    "longitud": -56.1750674
  },
  {
    "id": "ferrero",
    "nombre": "Ferrero",
    "tipo": "Farmacia",
    "direccion": "Avenida Daniel Fernández Crespo 2221, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8930208,
    "longitud": -56.1849702
  },
  {
    "id": "machado-i",
    "nombre": "Machado I",
    "tipo": "Farmacia",
    "direccion": "Bulevar General Artigas 2947, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8731264,
    "longitud": -56.1676496
  },
  {
    "id": "20-de-setiembre",
    "nombre": "20 de Setiembre",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8024124,
    "longitud": -55.9224253
  },
  {
    "id": "lecocq",
    "nombre": "Lecocq",
    "tipo": "Farmacia",
    "direccion": "Camino Lecocq, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8131522,
    "longitud": -56.2307038
  },
  {
    "id": "calveira",
    "nombre": "Calveira",
    "tipo": "Farmacia",
    "direccion": "Camino Ariel 4926, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.832916,
    "longitud": -56.2175253
  },
  {
    "id": "don-bosco",
    "nombre": "Don Bosco",
    "tipo": "Farmacia",
    "direccion": "Avenida General San Martín 3659, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8574999,
    "longitud": -56.1759693
  },
  {
    "id": "aboire",
    "nombre": "Aboire",
    "tipo": "Farmacia",
    "direccion": "Isidoro de María 1669, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8886446,
    "longitud": -56.1830809
  },
  {
    "id": "tres",
    "nombre": "Tres",
    "tipo": "Farmacia",
    "direccion": "Avenida Ramón Anador 3549, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8943408,
    "longitud": -56.139324
  },
  {
    "id": "la-botica",
    "nombre": "La Botica",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8255699,
    "longitud": -55.9639855
  },
  {
    "id": "mykonos",
    "nombre": "Mykonos",
    "tipo": "Farmacia",
    "direccion": "Canelones 2301, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9067213,
    "longitud": -56.1648311
  },
  {
    "id": "elisar-centro",
    "nombre": "Elisar Centro",
    "tipo": "Farmacia",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7271456,
    "longitud": -56.2171792
  },
  {
    "id": "costa-rosa",
    "nombre": "Costa Rosa",
    "tipo": "Farmacia",
    "direccion": "Avenida Agraciada 4140, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8572709,
    "longitud": -56.2187384
  },
  {
    "id": "estadio",
    "nombre": "Estadio",
    "tipo": "Farmacia",
    "direccion": "Avenida Italia 2795, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8907362,
    "longitud": -56.1541418
  },
  {
    "id": "canabis-protectio",
    "nombre": "Cañabis Protectio",
    "tipo": "Farmacia",
    "direccion": "Alzáibar, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9082821,
    "longitud": -56.2079558
  },
  {
    "id": "rubira",
    "nombre": "Rubira",
    "tipo": "Farmacia",
    "direccion": "Líbano, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8918101,
    "longitud": -56.0716397
  },
  {
    "id": "3-esquinas",
    "nombre": "3 Esquinas",
    "tipo": "Farmacia",
    "direccion": "Avenida Mariscal Francisco Solano López 1855, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8877176,
    "longitud": -56.1292267
  },
  {
    "id": "thompson-ltda",
    "nombre": "Thompson Ltda",
    "tipo": "Farmacia",
    "direccion": "Cooper, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.880061,
    "longitud": -56.0673124
  },
  {
    "id": "olivencia",
    "nombre": "Olivencia",
    "tipo": "Farmacia",
    "direccion": "Maldonado 1349, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9092395,
    "longitud": -56.1866028
  },
  {
    "id": "potosi",
    "nombre": "Potosi",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8725989,
    "longitud": -56.1367572
  },
  {
    "id": "miguelete",
    "nombre": "Miguelete",
    "tipo": "Farmacia",
    "direccion": "Miguelete 2145, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.892231,
    "longitud": -56.1733079
  },
  {
    "id": "castano-homeopatia",
    "nombre": "Castaño Homeopatía",
    "tipo": "Farmacia",
    "direccion": "21 de Setiembre 2967, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.919579,
    "longitud": -56.1527665
  },
  {
    "id": "astral",
    "nombre": "Astral",
    "tipo": "Farmacia",
    "direccion": "Avenida Uruguay 1350, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9028695,
    "longitud": -56.1872954
  },
  {
    "id": "nesant",
    "nombre": "Nesant",
    "tipo": "Farmacia",
    "direccion": "Avenida Italia 5016, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8861305,
    "longitud": -56.0995594
  },
  {
    "id": "pigalle-pocitos",
    "nombre": "Pigalle (Pocitos)",
    "tipo": "Farmacia",
    "direccion": "Avenida Brasil 2570, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9077296,
    "longitud": -56.1583755
  },
  {
    "id": "libra",
    "nombre": "Libra",
    "tipo": "Farmacia",
    "direccion": "Avenida Daniel Fernández Crespo 1651, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.899902,
    "longitud": -56.1764542
  },
  {
    "id": "rodrimar",
    "nombre": "Rodrimar",
    "tipo": "Farmacia",
    "direccion": "Camino Edison, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8361057,
    "longitud": -56.1927037
  },
  {
    "id": "cosmos",
    "nombre": "Cosmos",
    "tipo": "Farmacia",
    "direccion": "Avenida Luis Alberto de Herrera, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.857332,
    "longitud": -56.1957055
  },
  {
    "id": "ani",
    "nombre": "ANI",
    "tipo": "Farmacia",
    "direccion": "Avenida Millán 3014, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8709805,
    "longitud": -56.1903538
  },
  {
    "id": "machado",
    "nombre": "Machado",
    "tipo": "Farmacia",
    "direccion": "Bulevar General Artigas 2251, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8859177,
    "longitud": -56.1661836
  },
  {
    "id": "paysandu",
    "nombre": "Paysandú",
    "tipo": "Farmacia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8509725,
    "longitud": -56.0068193
  },
  {
    "id": "2da-font",
    "nombre": "2da Font",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre 4716, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8582737,
    "longitud": -56.1335122
  },
  {
    "id": "asuncion",
    "nombre": "Asunción",
    "tipo": "Farmacia",
    "direccion": "Avenida Joaquín Suárez 3188, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8715021,
    "longitud": -56.1963028
  },
  {
    "id": "el-balde",
    "nombre": "El Balde",
    "tipo": "Farmacia",
    "direccion": "Enrique Erro, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8195649,
    "longitud": -55.9390705
  },
  {
    "id": "pigalle-palermo",
    "nombre": "Pigalle (Palermo)",
    "tipo": "Farmacia",
    "direccion": "Doctor Carlos María Morales 946, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.912696,
    "longitud": -56.1832157
  },
  {
    "id": "congreso",
    "nombre": "Congreso",
    "tipo": "Farmacia",
    "direccion": "Avenida Libertador Brigadier General Lavalleja 1953, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8948237,
    "longitud": -56.1892275
  },
  {
    "id": "garibaldi",
    "nombre": "Garibaldi",
    "tipo": "Farmacia",
    "direccion": "Avenida General José Garibaldi 2250, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.880946,
    "longitud": -56.1706403
  },
  {
    "id": "brou-cordon",
    "nombre": "BROU (Cordón)",
    "tipo": "Banco",
    "direccion": "Avenida 18 de Julio 1670, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.903997,
    "longitud": -56.1797357
  },
  {
    "id": "brou-buceo",
    "nombre": "BROU (Buceo)",
    "tipo": "Banco",
    "direccion": "Solferino 4098, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8874604,
    "longitud": -56.1263957
  },
  {
    "id": "brou-centro",
    "nombre": "BROU (Centro)",
    "tipo": "Banco",
    "direccion": "Avenida General Rondeau 1754, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9038451,
    "longitud": -56.1914551
  },
  {
    "id": "brou-prado",
    "nombre": "BROU (Prado)",
    "tipo": "Banco",
    "direccion": "Avenida Joaquín Suárez 3781, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8587655,
    "longitud": -56.1965791
  },
  {
    "id": "brou-punta-gorda",
    "nombre": "BROU (Punta Gorda)",
    "tipo": "Banco",
    "direccion": "Bolonia, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8803909,
    "longitud": -56.0780536
  },
  {
    "id": "brou-aguada",
    "nombre": "BROU (Aguada)",
    "tipo": "Banco",
    "direccion": "Avenida General Rondeau 1754, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8981758,
    "longitud": -56.1920742
  },
  {
    "id": "brou-colon",
    "nombre": "BROU (Colón)",
    "tipo": "Banco",
    "direccion": "Avenida General Eugenio Garzón 1864, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.807882,
    "longitud": -56.2212226
  },
  {
    "id": "brou-cerro",
    "nombre": "BROU (Cerro)",
    "tipo": "Banco",
    "direccion": "Avenida Carlos María Ramírez, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8737376,
    "longitud": -56.2488852
  },
  {
    "id": "brou-brazo-oriental",
    "nombre": "BROU (Brazo Oriental)",
    "tipo": "Banco",
    "direccion": "Avenida General San Martín 3380, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8635037,
    "longitud": -56.1791723
  },
  {
    "id": "brou-jacinto-vera",
    "nombre": "BROU (Jacinto Vera)",
    "tipo": "Banco",
    "direccion": "Avenida Luis Alberto de Herrera, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8693784,
    "longitud": -56.1689418
  },
  {
    "id": "brou-la-figurita",
    "nombre": "BROU (La Figurita)",
    "tipo": "Banco",
    "direccion": "Avenida General Flores 2551, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8805294,
    "longitud": -56.1818594
  },
  {
    "id": "brou-pocitos",
    "nombre": "BROU (Pocitos)",
    "tipo": "Banco",
    "direccion": "Avenida Brasil 3049, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9130769,
    "longitud": -56.1499841
  },
  {
    "id": "brou-parque-miramar",
    "nombre": "BROU (Parque Miramar)",
    "tipo": "Banco",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8661354,
    "longitud": -56.0246851
  },
  {
    "id": "brou-villa-espanola",
    "nombre": "BROU (Villa Española)",
    "tipo": "Banco",
    "direccion": "Avenida Dámaso Antonio Larrañaga 3449, Villa Española",
    "barrio": "Villa Española",
    "ciudad": "Montevideo",
    "latitud": -34.8735054,
    "longitud": -56.1527477
  },
  {
    "id": "brou-paso-molino",
    "nombre": "BROU (Paso Molino)",
    "tipo": "Banco",
    "direccion": "Avenida Agraciada 3902, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8606162,
    "longitud": -56.2141906
  },
  {
    "id": "brou-piedras-blancas",
    "nombre": "BROU (Piedras Blancas)",
    "tipo": "Banco",
    "direccion": "Avenida José Belloni 4296, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8253784,
    "longitud": -56.1406003
  },
  {
    "id": "brou-punta-rieles",
    "nombre": "BROU (Punta Rieles)",
    "tipo": "Banco",
    "direccion": "Camino Maldonado 6847, Punta Rieles",
    "barrio": "Punta Rieles",
    "ciudad": "Montevideo",
    "latitud": -34.8234487,
    "longitud": -56.1017283
  },
  {
    "id": "brou-carrasco",
    "nombre": "BROU (Carrasco)",
    "tipo": "Banco",
    "direccion": "Avenida Alfredo Arocena 1637, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8879936,
    "longitud": -56.0579885
  },
  {
    "id": "brou-punta-carretas",
    "nombre": "BROU (Punta Carretas)",
    "tipo": "Banco",
    "direccion": "21 de Setiembre 2851, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.918878,
    "longitud": -56.155787
  },
  {
    "id": "brou-san-jose-de-carrasco",
    "nombre": "BROU (San José de Carrasco)",
    "tipo": "Banco",
    "direccion": "Bernardo O'Higgins, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8416668,
    "longitud": -55.9931565
  },
  {
    "id": "brou-las-piedras",
    "nombre": "BROU (Las Piedras)",
    "tipo": "Banco",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7267996,
    "longitud": -56.2161424
  },
  {
    "id": "brou-ciudad-vieja",
    "nombre": "BROU (Ciudad Vieja)",
    "tipo": "Banco",
    "direccion": "Piedras 369, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9054639,
    "longitud": -56.2086994
  },
  {
    "id": "brou-buceo-avenida-luis-alberto-de-herrera-1290",
    "nombre": "BROU (Buceo, Avenida Luis Alberto de Herrera 1290)",
    "tipo": "Banco",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9036677,
    "longitud": -56.1369076
  },
  {
    "id": "brou-barrio-sur",
    "nombre": "BROU (Barrio Sur)",
    "tipo": "Banco",
    "direccion": "Avenida 18 de Julio 1000, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9062902,
    "longitud": -56.1948592
  },
  {
    "id": "brou-union",
    "nombre": "BROU (Unión)",
    "tipo": "Banco",
    "direccion": "Avenida 8 de Octubre 3847, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8740021,
    "longitud": -56.1392023
  },
  {
    "id": "brou-punta-carretas-jose-ellauri-350",
    "nombre": "BROU (Punta Carretas, José Ellauri 350)",
    "tipo": "Banco",
    "direccion": "José Ellauri 350, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9240989,
    "longitud": -56.1588356
  },
  {
    "id": "brou-centro-avenida-uruguay-1002",
    "nombre": "BROU (Centro, Avenida Uruguay 1002)",
    "tipo": "Banco",
    "direccion": "Avenida Uruguay 1002, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9035086,
    "longitud": -56.1947728
  },
  {
    "id": "brou-pocitos-avenida-general-rivera-2700",
    "nombre": "BROU (Pocitos, Avenida General Rivera 2700)",
    "tipo": "Banco",
    "direccion": "Avenida General Rivera 2700, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9032863,
    "longitud": -56.1561847
  },
  {
    "id": "brou-cordon-constituyente-1450",
    "nombre": "BROU (Cordón, Constituyente 1450)",
    "tipo": "Banco",
    "direccion": "Constituyente 1450, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9057637,
    "longitud": -56.1847538
  },
  {
    "id": "hsbc",
    "nombre": "HSBC",
    "tipo": "Banco",
    "direccion": "Avenida Agraciada 2352, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8881251,
    "longitud": -56.1888486
  },
  {
    "id": "itau",
    "nombre": "Itaú",
    "tipo": "Banco",
    "direccion": "Bulevar General Artigas 3967, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.871661,
    "longitud": -56.1902628
  },
  {
    "id": "bbva",
    "nombre": "BBVA",
    "tipo": "Banco",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8391407,
    "longitud": -55.988789
  },
  {
    "id": "itau-la-figurita",
    "nombre": "Itaú (La Figurita)",
    "tipo": "Banco",
    "direccion": "Avenida General Flores 2966, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8728894,
    "longitud": -56.1765151
  },
  {
    "id": "itau-parque-miramar",
    "nombre": "Itaú (Parque Miramar)",
    "tipo": "Banco",
    "direccion": "Avenida de las Américas, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8698244,
    "longitud": -56.0310629
  },
  {
    "id": "scotiabank",
    "nombre": "Scotiabank",
    "tipo": "Banco",
    "direccion": "Avenida Millán 4434, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8430765,
    "longitud": -56.2068848
  },
  {
    "id": "bbva-aguada",
    "nombre": "BBVA (Aguada)",
    "tipo": "Banco",
    "direccion": "Galicia 1167, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.9001513,
    "longitud": -56.1912744
  },
  {
    "id": "scotiabank-colon",
    "nombre": "Scotiabank (Colón)",
    "tipo": "Banco",
    "direccion": "Avenida General Eugenio Garzón, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8040182,
    "longitud": -56.2227068
  },
  {
    "id": "bbva-jacinto-vera",
    "nombre": "BBVA (Jacinto Vera)",
    "tipo": "Banco",
    "direccion": "Avenida Luis Alberto de Herrera 3301, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8700376,
    "longitud": -56.1664098
  },
  {
    "id": "scotiabank-las-piedras",
    "nombre": "Scotiabank (Las Piedras)",
    "tipo": "Banco",
    "direccion": "Rivera, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7270807,
    "longitud": -56.2158235
  },
  {
    "id": "banco-santander",
    "nombre": "Banco Santander",
    "tipo": "Banco",
    "direccion": "Avenida Agraciada 4228, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8560564,
    "longitud": -56.2199395
  },
  {
    "id": "santander",
    "nombre": "Santander",
    "tipo": "Banco",
    "direccion": "Avenida 8 de Octubre 2738, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8889815,
    "longitud": -56.1593954
  },
  {
    "id": "bbva-ciudad-vieja",
    "nombre": "BBVA (Ciudad Vieja)",
    "tipo": "Banco",
    "direccion": "Sarandí 689, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9064536,
    "longitud": -56.2012689
  },
  {
    "id": "bbva-punta-gorda",
    "nombre": "BBVA (Punta Gorda)",
    "tipo": "Banco",
    "direccion": "Avenida Italia 5775, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8814063,
    "longitud": -56.0817779
  },
  {
    "id": "santander-carrasco",
    "nombre": "Santander (Carrasco)",
    "tipo": "Banco",
    "direccion": "Avenida Pedro Blanes Viale 6399, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8899121,
    "longitud": -56.0584246
  },
  {
    "id": "bbva-buceo",
    "nombre": "BBVA (Buceo)",
    "tipo": "Banco",
    "direccion": "Avenida Luis Alberto de Herrera 1248, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9053801,
    "longitud": -56.1364793
  },
  {
    "id": "bbva-union",
    "nombre": "BBVA (Unión)",
    "tipo": "Banco",
    "direccion": "Avenida 8 de Octubre 3858, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8741356,
    "longitud": -56.1384844
  },
  {
    "id": "bbva-tres-cruces",
    "nombre": "BBVA (Tres Cruces)",
    "tipo": "Banco",
    "direccion": "Bulevar General Artigas 1952, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8913705,
    "longitud": -56.1650957
  },
  {
    "id": "santander-punta-carretas",
    "nombre": "Santander (Punta Carretas)",
    "tipo": "Banco",
    "direccion": "21 de Setiembre 3021, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9196072,
    "longitud": -56.1517401
  },
  {
    "id": "itau-centro",
    "nombre": "Itaú (Centro)",
    "tipo": "Banco",
    "direccion": "Avenida General Rondeau 1502, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9029484,
    "longitud": -56.1915502
  },
  {
    "id": "itau-pocitos",
    "nombre": "Itaú (Pocitos)",
    "tipo": "Banco",
    "direccion": "Juan Benito Blanco 876, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9155517,
    "longitud": -56.1496798
  },
  {
    "id": "bbva-cordon",
    "nombre": "BBVA (Cordón)",
    "tipo": "Banco",
    "direccion": "Avenida 18 de Julio 1632, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9040222,
    "longitud": -56.1808831
  },
  {
    "id": "santander-lagomar",
    "nombre": "Santander (Lagomar)",
    "tipo": "Banco",
    "direccion": "Río Uruguay, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8373495,
    "longitud": -55.985679
  },
  {
    "id": "itau-aguada",
    "nombre": "Itaú (Aguada)",
    "tipo": "Banco",
    "direccion": "Avenida Libertador Brigadier General Lavalleja 2084, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.892965,
    "longitud": -56.1877975
  },
  {
    "id": "santander-jacinto-vera",
    "nombre": "Santander (Jacinto Vera)",
    "tipo": "Banco",
    "direccion": "Avenida General Flores 3208, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8696391,
    "longitud": -56.1735405
  },
  {
    "id": "santander-las-piedras",
    "nombre": "Santander (Las Piedras)",
    "tipo": "Banco",
    "direccion": "General Leandro Gómez, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7267809,
    "longitud": -56.2147367
  },
  {
    "id": "scotiabank-ciudad-vieja",
    "nombre": "Scotiabank (Ciudad Vieja)",
    "tipo": "Banco",
    "direccion": "Rincón, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9073338,
    "longitud": -56.2073571
  },
  {
    "id": "bbva-carrasco",
    "nombre": "BBVA (Carrasco)",
    "tipo": "Banco",
    "direccion": "Avenida Alfredo Arocena 1675, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8869861,
    "longitud": -56.0584731
  },
  {
    "id": "scotiabank-buceo",
    "nombre": "Scotiabank (Buceo)",
    "tipo": "Banco",
    "direccion": "Avenida Luis Alberto de Herrera 1248, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9047587,
    "longitud": -56.1368883
  },
  {
    "id": "scotiabank-union",
    "nombre": "Scotiabank (Unión)",
    "tipo": "Banco",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8735465,
    "longitud": -56.1383137
  },
  {
    "id": "hsbc-tres-cruces",
    "nombre": "HSBC (Tres Cruces)",
    "tipo": "Banco",
    "direccion": "Bulevar General Artigas 2073, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8893032,
    "longitud": -56.1659534
  },
  {
    "id": "hsbc-punta-carretas",
    "nombre": "HSBC (Punta Carretas)",
    "tipo": "Banco",
    "direccion": "Ramón Fernández 296, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9244319,
    "longitud": -56.1603995
  },
  {
    "id": "santander-centro",
    "nombre": "Santander (Centro)",
    "tipo": "Banco",
    "direccion": "Avenida 18 de Julio 1321, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9055021,
    "longitud": -56.1875398
  },
  {
    "id": "santander-pocitos",
    "nombre": "Santander (Pocitos)",
    "tipo": "Banco",
    "direccion": "Bulevar España 2640, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9132726,
    "longitud": -56.1570464
  },
  {
    "id": "itau-cordon",
    "nombre": "Itaú (Cordón)",
    "tipo": "Banco",
    "direccion": "Constituyente 1426, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9056971,
    "longitud": -56.1850917
  },
  {
    "id": "bps-cordon",
    "nombre": "BPS (Cordón)",
    "tipo": "Trámites",
    "direccion": "Colonia 1921, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.8999769,
    "longitud": -56.1751261
  },
  {
    "id": "bps-ciudad-vieja",
    "nombre": "BPS (Ciudad Vieja)",
    "tipo": "Trámites",
    "direccion": "Sarandí 570, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9071076,
    "longitud": -56.2034117
  },
  {
    "id": "bps-las-piedras",
    "nombre": "BPS (Las Piedras)",
    "tipo": "Trámites",
    "direccion": "Avenida Instrucciones del Año XIII, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7281377,
    "longitud": -56.2172236
  },
  {
    "id": "bps-belvedere",
    "nombre": "BPS (Belvedere)",
    "tipo": "Trámites",
    "direccion": "Juan B. Pandiani 26 BIS, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8546256,
    "longitud": -56.2224329
  },
  {
    "id": "centro-comunal-zonal-11",
    "nombre": "Centro Comunal Zonal 11",
    "tipo": "Trámites",
    "direccion": "Bage, Las Acacias",
    "barrio": "Las Acacias",
    "ciudad": "Montevideo",
    "latitud": -34.8455634,
    "longitud": -56.1543116
  },
  {
    "id": "centro-comunal-zonal-16",
    "nombre": "Centro Comunal Zonal 16",
    "tipo": "Trámites",
    "direccion": "Avenida Agraciada 3622, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8659166,
    "longitud": -56.208461
  },
  {
    "id": "centro-comunal-zonal-10",
    "nombre": "Centro Comunal Zonal 10",
    "tipo": "Trámites",
    "direccion": "Capitán Tula, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8216265,
    "longitud": -56.1409515
  },
  {
    "id": "centro-comunal-zonal-9",
    "nombre": "Centro Comunal Zonal 9",
    "tipo": "Trámites",
    "direccion": "Avenida 8 de Octubre, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8587508,
    "longitud": -56.133527
  },
  {
    "id": "ccz-4-municipio-ch",
    "nombre": "CCZ 4 Municipio CH",
    "tipo": "Trámites",
    "direccion": "Avenida Centenario 2886, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8885161,
    "longitud": -56.1536792
  },
  {
    "id": "centro-comunal-zonal-8",
    "nombre": "Centro Comunal Zonal 8",
    "tipo": "Trámites",
    "direccion": "Avenida Bolivia, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8782744,
    "longitud": -56.0884536
  },
  {
    "id": "centro-comunal-zonal-7",
    "nombre": "Centro Comunal Zonal 7",
    "tipo": "Trámites",
    "direccion": "Míchigan, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8950983,
    "longitud": -56.0991759
  },
  {
    "id": "correo-uruguayo-union",
    "nombre": "Correo Uruguayo (Unión)",
    "tipo": "Correo",
    "direccion": "Doctor Silvestre Pérez, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.87248,
    "longitud": -56.1359251
  },
  {
    "id": "correo-uruguayo-la-blanqueada",
    "nombre": "Correo Uruguayo (La Blanqueada)",
    "tipo": "Correo",
    "direccion": "Avenida 8 de Octubre 3082 bis, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.882718,
    "longitud": -56.1533356
  },
  {
    "id": "correo-uruguayo-centro",
    "nombre": "Correo Uruguayo (Centro)",
    "tipo": "Correo",
    "direccion": "Canelones 1358, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9084827,
    "longitud": -56.18629
  },
  {
    "id": "correo-uruguayo-belvedere",
    "nombre": "Correo Uruguayo (Belvedere)",
    "tipo": "Correo",
    "direccion": "Avenida Carlos María Ramírez 119, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8561366,
    "longitud": -56.2236423
  },
  {
    "id": "correo-uruguayo-malvin",
    "nombre": "Correo Uruguayo (Malvín)",
    "tipo": "Correo",
    "direccion": "Avenida Italia, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8837379,
    "longitud": -56.0848479
  },
  {
    "id": "correo-uruguayo-pocitos",
    "nombre": "Correo Uruguayo (Pocitos)",
    "tipo": "Correo",
    "direccion": "Juan Benito Blanco, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9134788,
    "longitud": -56.1485589
  },
  {
    "id": "correo-uruguayo-ciudad-vieja",
    "nombre": "Correo Uruguayo (Ciudad Vieja)",
    "tipo": "Correo",
    "direccion": "Misiones, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9081551,
    "longitud": -56.2055683
  },
  {
    "id": "correo-uruguayo-las-piedras",
    "nombre": "Correo Uruguayo (Las Piedras)",
    "tipo": "Correo",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7267886,
    "longitud": -56.2139149
  },
  {
    "id": "correo-uruguayo-parque-miramar",
    "nombre": "Correo Uruguayo (Parque Miramar)",
    "tipo": "Correo",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8658787,
    "longitud": -56.0241755
  },
  {
    "id": "correo-uruguayo-san-jose-de-carrasco",
    "nombre": "Correo Uruguayo (San José de Carrasco)",
    "tipo": "Correo",
    "direccion": "Viejo Pancho, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8406339,
    "longitud": -55.9941564
  },
  {
    "id": "correo-uruguayo-centro-avenida-libertador-brigadier-general-lavalleja-1440",
    "nombre": "Correo Uruguayo (Centro, Avenida Libertador Brigadier General Lavalleja 1440)",
    "tipo": "Correo",
    "direccion": "Avenida Libertador Brigadier General Lavalleja 1440, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9044277,
    "longitud": -56.1935955
  },
  {
    "id": "parroquia-san-isidro-labrador",
    "nombre": "Parroquia San Isidro Labrador",
    "tipo": "Iglesia",
    "direccion": "Flores 654, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.727687,
    "longitud": -56.2171315
  },
  {
    "id": "capilla-juan-pablo-ii",
    "nombre": "Capilla Juan Pablo II",
    "tipo": "Iglesia",
    "direccion": "Avenida Luis Alberto de Herrera 3813, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8635624,
    "longitud": -56.1780068
  },
  {
    "id": "iglesia-del-reducto",
    "nombre": "Iglesia del Reducto",
    "tipo": "Iglesia",
    "direccion": "Padre Andrés Coindre 1677, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8744358,
    "longitud": -56.1821465
  },
  {
    "id": "parroquia-de-la-sagrada-familia",
    "nombre": "Parroquia de la Sagrada Familia",
    "tipo": "Iglesia",
    "direccion": "Avenida Luis Alberto de Herrera 4246, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.858932,
    "longitud": -56.1895145
  },
  {
    "id": "capilla-hermanas-del-perpetuo-socorro",
    "nombre": "Capilla Hermanas del Perpetuo Socorro",
    "tipo": "Iglesia",
    "direccion": "General Enrique Martínez 1409, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8730571,
    "longitud": -56.1888294
  },
  {
    "id": "parroquia-nuestra-senora-de-la-asuncion-y-san-carlos-borromeo",
    "nombre": "Parroquia Nuestra Señora de la Asunción y San Carlos Borromeo",
    "tipo": "Iglesia",
    "direccion": "Avenida Millán 3307, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8668629,
    "longitud": -56.192695
  },
  {
    "id": "capilla-de-la-transfiguracion-del-senor",
    "nombre": "Capilla de la Transfiguración del Señor",
    "tipo": "Iglesia",
    "direccion": "Avenida General Flores 3476, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8641648,
    "longitud": -56.1692642
  },
  {
    "id": "parroquia-santa-magdalena-sofia-barat",
    "nombre": "Parroquia Santa Magdalena Sofía Barat",
    "tipo": "Iglesia",
    "direccion": "Bulevar José Batlle y Ordóñez 4667, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8516978,
    "longitud": -56.1842781
  },
  {
    "id": "parroquia-san-antonino",
    "nombre": "Parroquia San Antonino",
    "tipo": "Iglesia",
    "direccion": "Caraguatá 2086, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8770405,
    "longitud": -56.1713189
  },
  {
    "id": "capilla-misioneras-del-sagrado-corazon-de-jesus-y-maria",
    "nombre": "Capilla Misioneras del Sagrado Corazón de Jesús y María",
    "tipo": "Iglesia",
    "direccion": "Avenida Millán 3852, Aires Puros",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8564134,
    "longitud": -56.1961912
  },
  {
    "id": "parroquia-san-miguel-arcangel",
    "nombre": "Parroquia San Miguel Arcángel",
    "tipo": "Iglesia",
    "direccion": "Concepción Arenal, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.881776,
    "longitud": -56.1787598
  },
  {
    "id": "capilla-nuestra-senora-del-rosario-salesianos-maturana",
    "nombre": "Capilla Nuestra Señora del Rosario (Salesianos – Maturana)",
    "tipo": "Iglesia",
    "direccion": "Bulevar General Artigas 4365, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8726869,
    "longitud": -56.2011382
  },
  {
    "id": "parroquia-nuestra-senora-del-perpetuo-socorro-y-san-alfonso",
    "nombre": "Parroquia Nuestra Señora del Perpetuo Socorro y San Alfonso",
    "tipo": "Iglesia",
    "direccion": "Tapes 956, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8803403,
    "longitud": -56.1976448
  },
  {
    "id": "parroquia-nuestra-senora-de-la-merced-y-san-judas-tadeo",
    "nombre": "Parroquia Nuestra Señora de la Merced y San Judas Tadeo",
    "tipo": "Iglesia",
    "direccion": "Doctor Juan José de Amézaga 2018, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8856493,
    "longitud": -56.1743134
  },
  {
    "id": "iglesia-ortodoxa-griega-san-nicolas",
    "nombre": "Iglesia Ortodoxa Griega San Nicolas",
    "tipo": "Iglesia",
    "direccion": "Avenida 19 de Abril 3366, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8676995,
    "longitud": -56.2037278
  },
  {
    "id": "parroquia-de-nuestra-senora-de-bzommar",
    "nombre": "Parroquia de Nuestra Señora de Bzommar",
    "tipo": "Iglesia",
    "direccion": "Acevedo Díaz 2361, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8829947,
    "longitud": -56.1688773
  },
  {
    "id": "iglesia-evangelica-perez-castellanos",
    "nombre": "Iglesia Evangelica (Pérez Castellanos)",
    "tipo": "Iglesia",
    "direccion": "Avenida General Flores, Pérez Castellanos",
    "barrio": "Pérez Castellanos",
    "ciudad": "Montevideo",
    "latitud": -34.853889,
    "longitud": -56.1610274
  },
  {
    "id": "capilla-san-francisco",
    "nombre": "Capilla San Francisco",
    "tipo": "Iglesia",
    "direccion": "Doctor José María Silva 3980, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.841683,
    "longitud": -56.1863431
  },
  {
    "id": "iglesia-de-jesucristo-de-los-santos-de-los-ultimos-dias",
    "nombre": "Iglesia de Jesucristo de los Santos de los Últimos Días",
    "tipo": "Iglesia",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8131098,
    "longitud": -55.9432576
  },
  {
    "id": "templo-ti-osun",
    "nombre": "TEMPLO TI OSUN",
    "tipo": "Iglesia",
    "direccion": "De los Picaflores mz 139 s 4, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8114711,
    "longitud": -55.9434188
  },
  {
    "id": "capilla-santa-monica",
    "nombre": "Capilla Santa Mónica",
    "tipo": "Iglesia",
    "direccion": "Antonio María Márquez 5644, Conciliación",
    "barrio": "Conciliación",
    "ciudad": "Montevideo",
    "latitud": -34.8173057,
    "longitud": -56.2287958
  },
  {
    "id": "parroquia-nuestra-senora-de-la-guardia-y-san-luis-gonzaga",
    "nombre": "Parroquia Nuestra Señora de la Guardia y San Luis Gonzaga",
    "tipo": "Iglesia",
    "direccion": "Silvestre Ochoa 434, Santiago Vázquez",
    "barrio": "Santiago Vázquez",
    "ciudad": "Montevideo",
    "latitud": -34.7897019,
    "longitud": -56.3507549
  },
  {
    "id": "iglesia-de-dios-de-la-profecia",
    "nombre": "Iglesia de Dios de la profecía",
    "tipo": "Iglesia",
    "direccion": "Cuacziola 5641, Barrio Abayubá",
    "barrio": "Barrio Abayubá",
    "ciudad": "Montevideo",
    "latitud": -34.7674252,
    "longitud": -56.2240944
  },
  {
    "id": "capilla-santa-cruz",
    "nombre": "Capilla Santa Cruz",
    "tipo": "Iglesia",
    "direccion": "Camino la Boyada 1871, La Paloma Tomkinson",
    "barrio": "La Paloma Tomkinson",
    "ciudad": "Montevideo",
    "latitud": -34.8593197,
    "longitud": -56.2578495
  },
  {
    "id": "capilla-virgen-de-los-treinta-y-tres",
    "nombre": "Capilla Virgen de los Treinta y Tres",
    "tipo": "Iglesia",
    "direccion": "Avenida Profesor Jorge Chebataroff 2457, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8888879,
    "longitud": -56.2648313
  },
  {
    "id": "capilla-madre-paulina",
    "nombre": "Capilla Madre Paulina",
    "tipo": "Iglesia",
    "direccion": "Carmelo de Arzadum 6023, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.8282843,
    "longitud": -56.2431899
  },
  {
    "id": "capilla-casa-provincial",
    "nombre": "Capilla Casa Provincial",
    "tipo": "Iglesia",
    "direccion": "Avenida Lezica 6187, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.8007137,
    "longitud": -56.2436974
  },
  {
    "id": "iglesia-de-dios",
    "nombre": "Iglesia de Dios",
    "tipo": "Iglesia",
    "direccion": "Avenida General San Martín, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8747702,
    "longitud": -56.1847717
  },
  {
    "id": "iglesia-santa-maria-de-la-ayuda",
    "nombre": "Iglesia Santa Maria de la Ayuda",
    "tipo": "Iglesia",
    "direccion": "Bogotá 3585, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8875176,
    "longitud": -56.2522754
  },
  {
    "id": "capilla-san-vicente-pallotti",
    "nombre": "Capilla San Vicente Pallotti",
    "tipo": "Iglesia",
    "direccion": "Sancho Panza 3056, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8717495,
    "longitud": -56.1650357
  },
  {
    "id": "catedral-de-nuestra-senora-de-bzommar",
    "nombre": "Catedral de Nuestra Señora de Bzommar",
    "tipo": "Iglesia",
    "direccion": "Avenida 19 de Abril 3325, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8685276,
    "longitud": -56.2047477
  },
  {
    "id": "capilla-motserrat-teresas",
    "nombre": "Capilla Motserrat (Teresas)",
    "tipo": "Iglesia",
    "direccion": "Alaska 748, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8566488,
    "longitud": -56.2429207
  },
  {
    "id": "parroquia-san-francisco-de-asis",
    "nombre": "Parroquia San Francisco de Asís",
    "tipo": "Iglesia",
    "direccion": "Vitoria 59, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8517846,
    "longitud": -56.2287975
  },
  {
    "id": "iglesia-presbiteriana-del-uruguay",
    "nombre": "Iglesia Presbiteriana del Uruguay",
    "tipo": "Iglesia",
    "direccion": "General Farías 2764, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.878852,
    "longitud": -56.199418
  },
  {
    "id": "parroquia-nuestra-senora-de-la-guardia",
    "nombre": "Parroquia Nuestra Señora de la Guardia",
    "tipo": "Iglesia",
    "direccion": "Porongos 2278, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8866778,
    "longitud": -56.1810663
  },
  {
    "id": "parroquia-san-vicente-pallotti",
    "nombre": "Parroquia San Vicente Pallotti",
    "tipo": "Iglesia",
    "direccion": "Olazabal 1027, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8280312,
    "longitud": -56.2243858
  },
  {
    "id": "santuario-nacional-del-corazon-de-jesus",
    "nombre": "Santuario Nacional del Corazón de Jesús",
    "tipo": "Iglesia",
    "direccion": "Norberto Ortiz 3880, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8569236,
    "longitud": -56.1700779
  },
  {
    "id": "capilla-san-jose-salesianas",
    "nombre": "Capilla San José (Salesianas)",
    "tipo": "Iglesia",
    "direccion": "Avenida General Eugenio Garzón 1867, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8081955,
    "longitud": -56.2219418
  },
  {
    "id": "la-iglesia-de-jesucristo-de-los-santos-de-los-ultimos-dias",
    "nombre": "La Iglesia de Jesucristo de los Santos de los Últimos Días",
    "tipo": "Iglesia",
    "direccion": "Avenida General Flores, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8686719,
    "longitud": -56.1734529
  },
  {
    "id": "iglesia-adventista-del-septimo-dia",
    "nombre": "Iglesia Adventista del Septimo Día",
    "tipo": "Iglesia",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7275077,
    "longitud": -56.2263926
  },
  {
    "id": "capilla-domingo-savio-barrio-abayuba",
    "nombre": "Capilla Domingo Savio (Barrio Abayubá)",
    "tipo": "Iglesia",
    "direccion": "Siripo 3229, Barrio Abayubá",
    "barrio": "Barrio Abayubá",
    "ciudad": "Montevideo",
    "latitud": -34.7700498,
    "longitud": -56.2238391
  },
  {
    "id": "capilla-san-pedro-y-san-pablo",
    "nombre": "Capilla San Pedro y San Pablo",
    "tipo": "Iglesia",
    "direccion": "Fray Luis de León 2478, La Paloma Tomkinson",
    "barrio": "La Paloma Tomkinson",
    "ciudad": "Montevideo",
    "latitud": -34.848343,
    "longitud": -56.2738891
  },
  {
    "id": "parroquia-nuestra-senora-de-fatima",
    "nombre": "Parroquia Nuestra Señora de Fátima",
    "tipo": "Iglesia",
    "direccion": "Bélgica 1765, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8798219,
    "longitud": -56.2515476
  },
  {
    "id": "capilla-divino-espiritu-santo",
    "nombre": "Capilla Divino Espíritu Santo",
    "tipo": "Iglesia",
    "direccion": "Avenida Millán 5766, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.8241545,
    "longitud": -56.2386938
  },
  {
    "id": "santuario-nacional-de-maria-auxiliadora",
    "nombre": "Santuario Nacional de María Auxiliadora",
    "tipo": "Iglesia",
    "direccion": "Avenida Lezica 6375, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.796269,
    "longitud": -56.249439
  },
  {
    "id": "capilla-santa-clara-congregacion-de-las-religiosas-de-san-jose",
    "nombre": "Capilla Santa Clara (Congregación de las Religiosas de San José)",
    "tipo": "Iglesia",
    "direccion": "Bogotá 3275, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8930769,
    "longitud": -56.2510541
  },
  {
    "id": "parroquia-nuestra-senora-de-la-fundacion",
    "nombre": "Parroquia Nuestra Señora de la Fundación",
    "tipo": "Iglesia",
    "direccion": "Rafael Eguren 3362, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8624124,
    "longitud": -56.1615605
  },
  {
    "id": "la-iglesia-de-jesucristo-de-los-santos-de-los-ultimos-dias-prado",
    "nombre": "La Iglesia de Jesucristo de los Santos de los Últimos Días (Prado)",
    "tipo": "Iglesia",
    "direccion": "Pantaleón Sotelo, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8566762,
    "longitud": -56.1967549
  },
  {
    "id": "capilla-santuario-de-la-beata-francisca-rubatto",
    "nombre": "Capilla Santuario de la Beata Francisca Rubatto",
    "tipo": "Iglesia",
    "direccion": "Avenida Carlos María Ramírez 56, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.855391,
    "longitud": -56.223321
  },
  {
    "id": "catedral-san-nerses-shnorhali",
    "nombre": "Catedral San Nerses Shnorhali",
    "tipo": "Iglesia",
    "direccion": "Avenida Agraciada, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8781856,
    "longitud": -56.1959911
  },
  {
    "id": "iglesia-puerta-de-bendicion",
    "nombre": "Iglesia Puerta de Bendicion",
    "tipo": "Iglesia",
    "direccion": "Calle 3 Metros, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8771721,
    "longitud": -56.1745487
  },
  {
    "id": "capilla-de-las-hermanas-del-perpetuo-socorro",
    "nombre": "Capilla de las Hermanas del Perpetuo Socorro",
    "tipo": "Iglesia",
    "direccion": "Avenida Sayago 1090, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8325363,
    "longitud": -56.2150126
  },
  {
    "id": "parroquia-virgen-de-los-treinta-y-tres",
    "nombre": "Parroquia Virgen de los Treinta y Tres",
    "tipo": "Iglesia",
    "direccion": "Santiago Figueredo 4319, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8456735,
    "longitud": -56.1717998
  },
  {
    "id": "parroquia-santa-maria-madre-de-la-iglesia-y-san-juan-bosco",
    "nombre": "Parroquia Santa María Madre de la Iglesia y San Juan Bosco",
    "tipo": "Iglesia",
    "direccion": "Avenida General Eugenio Garzón 2024, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8020293,
    "longitud": -56.2226824
  },
  {
    "id": "capilla-divino-salvador",
    "nombre": "Capilla Divino Salvador",
    "tipo": "Iglesia",
    "direccion": "Calpino, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7462761,
    "longitud": -56.2230599
  },
  {
    "id": "biblioteca-popular-cina-cina",
    "nombre": "Biblioteca Popular Cina Cina",
    "tipo": "Biblioteca",
    "direccion": "Doctor Joaquín Requena 2716, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8772587,
    "longitud": -56.1729304
  },
  {
    "id": "espacio-cultural-bibliobarrio",
    "nombre": "Espacio Cultural Bibliobarrio",
    "tipo": "Biblioteca",
    "direccion": "Enriqueta Compte y Rique 1275, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.884026,
    "longitud": -56.1899694
  },
  {
    "id": "biblioteca-profesor-jose-luis-rebellato",
    "nombre": "Biblioteca \"Profesor José Luis Rebellato\"",
    "tipo": "Biblioteca",
    "direccion": "Tristán Narvaja 1674, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.8994083,
    "longitud": -56.178605
  },
  {
    "id": "biblioteca-nacional",
    "nombre": "Biblioteca Nacional",
    "tipo": "Biblioteca",
    "direccion": "Avenida 18 de Julio 1790, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9027376,
    "longitud": -56.1774677
  },
  {
    "id": "biblioteca-del-centro-cultural-de-espana",
    "nombre": "Biblioteca del Centro Cultural de España",
    "tipo": "Biblioteca",
    "direccion": "Rincón, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9057543,
    "longitud": -56.2027379
  },
  {
    "id": "francisco-schinca",
    "nombre": "Francisco Schinca",
    "tipo": "Biblioteca",
    "direccion": "Avenida 8 de Octubre 4210, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8686185,
    "longitud": -56.1344471
  },
  {
    "id": "biblioteca-infantil-jose-h-figueira",
    "nombre": "Biblioteca Infantil José H. Figueira",
    "tipo": "Biblioteca",
    "direccion": "Camacuá, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9098601,
    "longitud": -56.2016893
  },
  {
    "id": "biblioteca-barrio-26-de-octubre",
    "nombre": "Biblioteca Barrio 26 de Octubre",
    "tipo": "Biblioteca",
    "direccion": "Vehicular/ Peatonal, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8323539,
    "longitud": -56.2296784
  },
  {
    "id": "biblioteca-shangrila",
    "nombre": "Biblioteca Shangrilá",
    "tipo": "Biblioteca",
    "direccion": "Venezuela, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8521405,
    "longitud": -56.0054316
  },
  {
    "id": "plaza-inclusiva-las-cometas",
    "nombre": "Plaza Inclusiva Las Cometas",
    "tipo": "Plaza",
    "direccion": "La Tablada, Montevideo",
    "barrio": "La Tablada",
    "ciudad": "Montevideo",
    "latitud": -34.8100479,
    "longitud": -56.2465926
  },
  {
    "id": "parque-vacacional-de-b-s-e",
    "nombre": "Parque Vacacional de B.S.E",
    "tipo": "Plaza",
    "direccion": "Conciliación, Montevideo",
    "barrio": "Conciliación",
    "ciudad": "Montevideo",
    "latitud": -34.8183223,
    "longitud": -56.2163377
  },
  {
    "id": "parque-tomkinson",
    "nombre": "Parque Tomkinson",
    "tipo": "Plaza",
    "direccion": "La Paloma Tomkinson, Montevideo",
    "barrio": "La Paloma Tomkinson",
    "ciudad": "Montevideo",
    "latitud": -34.8467301,
    "longitud": -56.2800141
  },
  {
    "id": "plazoleta-quinta-de-la-paraguaya",
    "nombre": "Plazoleta Quinta de la Paraguaya",
    "tipo": "Plaza",
    "direccion": "Larrañaga, Montevideo",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8838155,
    "longitud": -56.1594697
  },
  {
    "id": "plaza-casavalle",
    "nombre": "Plaza Casavalle",
    "tipo": "Plaza",
    "direccion": "Casavalle, Montevideo",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8355704,
    "longitud": -56.1729317
  },
  {
    "id": "plaza-de-la-inmigracion",
    "nombre": "Plaza De La Inmigracion",
    "tipo": "Plaza",
    "direccion": "Cerro, Montevideo",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.887408,
    "longitud": -56.2514374
  },
  {
    "id": "plaza-congreso-de-abril",
    "nombre": "Plaza Congreso de Abril",
    "tipo": "Plaza",
    "direccion": "Peñarol, Montevideo",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8249874,
    "longitud": -56.2047039
  },
  {
    "id": "plazoleta-arquitecto-vittorio-meano",
    "nombre": "Plazoleta Arquitecto Vittorio Meano",
    "tipo": "Plaza",
    "direccion": "Arroyo Seco, Montevideo",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8898727,
    "longitud": -56.1881513
  },
  {
    "id": "espacio-libre-republica-de-eslovenia",
    "nombre": "Espacio Libre Republica De Eslovenia",
    "tipo": "Plaza",
    "direccion": "Atahualpa, Montevideo",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8664254,
    "longitud": -56.1963127
  },
  {
    "id": "parque-de-la-magistratura",
    "nombre": "Parque De La Magistratura",
    "tipo": "Plaza",
    "direccion": "Bolívar, Montevideo",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8682921,
    "longitud": -56.1673297
  },
  {
    "id": "plaza-1-de-mayo",
    "nombre": "Plaza 1º De Mayo",
    "tipo": "Plaza",
    "direccion": "Villa Muñoz, Montevideo",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8896505,
    "longitud": -56.1859993
  },
  {
    "id": "parque-batlle-parque-batlle",
    "nombre": "Parque Batlle (Parque Batlle)",
    "tipo": "Plaza",
    "direccion": "Parque Batlle, Montevideo",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8950582,
    "longitud": -56.1552253
  },
  {
    "id": "parque-prado",
    "nombre": "Parque Prado",
    "tipo": "Plaza",
    "direccion": "Prado, Montevideo",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8563528,
    "longitud": -56.2090178
  },
  {
    "id": "parque-de-calistenia",
    "nombre": "Parque de Calistenia",
    "tipo": "Plaza",
    "direccion": "Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8780936,
    "longitud": -56.0312057
  },
  {
    "id": "plaza-de-las-misiones",
    "nombre": "Plaza de las Misiones",
    "tipo": "Plaza",
    "direccion": "La Figurita, Montevideo",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8786985,
    "longitud": -56.1778637
  },
  {
    "id": "espacio-libre-plebiscito-del-30-11-1980",
    "nombre": "Espacio Libre Plebiscito del 30/11/1980",
    "tipo": "Plaza",
    "direccion": "Aguada, Montevideo",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8910378,
    "longitud": -56.1855248
  },
  {
    "id": "parque-bellan",
    "nombre": "Parque Bellán",
    "tipo": "Plaza",
    "direccion": "Paso Molino, Montevideo",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8568908,
    "longitud": -56.2211705
  },
  {
    "id": "plaza-sayago-norte",
    "nombre": "Plaza Sayago Norte",
    "tipo": "Plaza",
    "direccion": "Sayago, Montevideo",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8248743,
    "longitud": -56.2329275
  },
  {
    "id": "parque-safons",
    "nombre": "Parque Safons",
    "tipo": "Plaza",
    "direccion": "Colón, Montevideo",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8054348,
    "longitud": -56.2334325
  },
  {
    "id": "plaza-guruyu",
    "nombre": "Plaza Guruyu",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9113916,
    "longitud": -56.2112898
  },
  {
    "id": "plaza-de-la-restauracion",
    "nombre": "Plaza de la Restauración",
    "tipo": "Plaza",
    "direccion": "Unión, Montevideo",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8755335,
    "longitud": -56.1391535
  },
  {
    "id": "parque-general-liber-seregni",
    "nombre": "Parque General Líber Seregni",
    "tipo": "Plaza",
    "direccion": "Tres Cruces, Montevideo",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8968836,
    "longitud": -56.1719081
  },
  {
    "id": "plazoleta-lorenzo-justiniano-perez",
    "nombre": "Plazoleta Lorenzo Justiniano Pérez",
    "tipo": "Plaza",
    "direccion": "Centro, Montevideo",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9054073,
    "longitud": -56.1847264
  },
  {
    "id": "espacio-libre-arquitecto-ildefonso-arostegui",
    "nombre": "Espacio Libre Arquitecto Ildefonso Arostegui",
    "tipo": "Plaza",
    "direccion": "Cordón, Montevideo",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.8994902,
    "longitud": -56.1759483
  },
  {
    "id": "parque-debora-cespedes",
    "nombre": "Parque Débora Céspedes",
    "tipo": "Plaza",
    "direccion": "Cerro, Montevideo",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8816889,
    "longitud": -56.2471319
  },
  {
    "id": "espacio-libre",
    "nombre": "Espacio Libre",
    "tipo": "Plaza",
    "direccion": "Aguada, Montevideo",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8917163,
    "longitud": -56.1856039
  },
  {
    "id": "plaza-de-la-policia",
    "nombre": "Plaza de la Policía",
    "tipo": "Plaza",
    "direccion": "Paso Molino, Montevideo",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8625311,
    "longitud": -56.2112879
  },
  {
    "id": "plaza-andres-brandi",
    "nombre": "Plaza Andrés Brandi",
    "tipo": "Plaza",
    "direccion": "Sayago, Montevideo",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8229993,
    "longitud": -56.2237183
  },
  {
    "id": "plaza-francisco-vidiella",
    "nombre": "Plaza Francisco Vidiella",
    "tipo": "Plaza",
    "direccion": "Colón, Montevideo",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.805975,
    "longitud": -56.2215624
  },
  {
    "id": "plaza-jose-herrera-y-sotomayor",
    "nombre": "Plaza José Herrera Y Sotomayor",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9113455,
    "longitud": -56.2093826
  },
  {
    "id": "plaza-de-la-democracia",
    "nombre": "Plaza de La Democracia",
    "tipo": "Plaza",
    "direccion": "Tres Cruces, Montevideo",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8936737,
    "longitud": -56.1642968
  },
  {
    "id": "plazoleta-doctor-tomas-g-brena",
    "nombre": "Plazoleta Doctor Tomas G. Brena",
    "tipo": "Plaza",
    "direccion": "Centro, Montevideo",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9049343,
    "longitud": -56.193872
  },
  {
    "id": "feria-shangrila",
    "nombre": "Feria Shangrilá",
    "tipo": "Mercado",
    "direccion": "San Francisco, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8564629,
    "longitud": -56.0078309
  },
  {
    "id": "mercado-garzon",
    "nombre": "Mercado Garzón",
    "tipo": "Mercado",
    "direccion": "Avenida General Eugenio Garzón, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8491667,
    "longitud": -56.2236464
  },
  {
    "id": "mercado-agricola-de-montevideo",
    "nombre": "Mercado Agrícola de Montevideo",
    "tipo": "Mercado",
    "direccion": "José L. Terra 2220, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8869732,
    "longitud": -56.1834097
  },
  {
    "id": "feria-de-villa-biarritz",
    "nombre": "Feria de Villa Biarritz",
    "tipo": "Mercado",
    "direccion": "Doctor Juan Alejandro Apolant, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9200241,
    "longitud": -56.1553921
  },
  {
    "id": "mall-del-lago",
    "nombre": "Mall del Lago",
    "tipo": "Shopping",
    "direccion": "Río Santa Lucía, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8387865,
    "longitud": -55.9881339
  },
  {
    "id": "via-disegno",
    "nombre": "Via Disegno",
    "tipo": "Shopping",
    "direccion": "Camino de los Grillos, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8441774,
    "longitud": -56.0164403
  },
  {
    "id": "galeria-marquez-castro",
    "nombre": "Galería Márquez Castro",
    "tipo": "Shopping",
    "direccion": "Avenida Eduardo Márquez Castro, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8225928,
    "longitud": -55.9582248
  },
  {
    "id": "portal-americas",
    "nombre": "Portal Américas",
    "tipo": "Shopping",
    "direccion": "Avenida de las Américas 6000, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8700656,
    "longitud": -56.0311692
  },
  {
    "id": "portones-shopping-punta-gorda",
    "nombre": "Portones Shopping (Punta Gorda)",
    "tipo": "Shopping",
    "direccion": "Avenida Italia 5775, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8812008,
    "longitud": -56.0808727
  },
  {
    "id": "plaza-italia-shopping-outlet",
    "nombre": "Plaza Italia Shopping Outlet",
    "tipo": "Shopping",
    "direccion": "Avenida Italia 4206, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8880522,
    "longitud": -56.1178276
  },
  {
    "id": "tiendas-montevideo",
    "nombre": "Tiendas Montevideo",
    "tipo": "Shopping",
    "direccion": "Sarandí, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9074924,
    "longitud": -56.2041836
  },
  {
    "id": "shopping-tres-cruces",
    "nombre": "Shopping Tres Cruces",
    "tipo": "Shopping",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8937958,
    "longitud": -56.1664023
  },
  {
    "id": "cine-opera",
    "nombre": "Cine Opera",
    "tipo": "Cine",
    "direccion": "Avenida 18 de Julio, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.903412,
    "longitud": -56.1791542
  },
  {
    "id": "grupo-cine",
    "nombre": "Grupo Cine",
    "tipo": "Cine",
    "direccion": "Colonia, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9046342,
    "longitud": -56.1884205
  },
  {
    "id": "grupocine",
    "nombre": "GrupoCine",
    "tipo": "Cine",
    "direccion": "Ejido, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9052459,
    "longitud": -56.1870141
  },
  {
    "id": "complejo-cultural-plaza",
    "nombre": "Complejo Cultural Plaza",
    "tipo": "Cine",
    "direccion": "General Doctor Arturo J. Baliñas, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9053443,
    "longitud": -56.19183
  },
  {
    "id": "cinemateca",
    "nombre": "Cinemateca",
    "tipo": "Cine",
    "direccion": "Lorenzo Carnelli, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9066543,
    "longitud": -56.1813282
  },
  {
    "id": "cine-universitario",
    "nombre": "Cine Universitario",
    "tipo": "Cine",
    "direccion": "Canelones, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9086052,
    "longitud": -56.1881421
  },
  {
    "id": "salas-de-cinemateca-uruguaya",
    "nombre": "Salas de Cinemateca Uruguaya",
    "tipo": "Cine",
    "direccion": "Reconquista, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9085403,
    "longitud": -56.2008525
  },
  {
    "id": "movie-center",
    "nombre": "Movie Center",
    "tipo": "Cine",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9038284,
    "longitud": -56.136877
  },
  {
    "id": "auditorio-mario-benedetti",
    "nombre": "Auditorio Mario Benedetti",
    "tipo": "Teatro",
    "direccion": "Guatemala, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8921744,
    "longitud": -56.1943658
  },
  {
    "id": "la-trastienda",
    "nombre": "La Trastienda",
    "tipo": "Teatro",
    "direccion": "Avenida Daniel Fernández Crespo 1763, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.8984034,
    "longitud": -56.1784225
  },
  {
    "id": "teatro-victoria",
    "nombre": "Teatro Victoria",
    "tipo": "Teatro",
    "direccion": "Río Negro 1479, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9035984,
    "longitud": -56.1939918
  },
  {
    "id": "auditorio-nacional-adela-reta",
    "nombre": "Auditorio Nacional \"Adela Reta\"",
    "tipo": "Teatro",
    "direccion": "Andes 1455, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9042808,
    "longitud": -56.198708
  },
  {
    "id": "auditorio-nelly-goitino",
    "nombre": "Auditorio Nelly Goitiño",
    "tipo": "Teatro",
    "direccion": "Avenida 18 de Julio, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9064151,
    "longitud": -56.196285
  },
  {
    "id": "teatro-comedia",
    "nombre": "Teatro Comedía",
    "tipo": "Teatro",
    "direccion": "Doctor Joaquín Requena, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9074711,
    "longitud": -56.1686882
  },
  {
    "id": "sala-camacua",
    "nombre": "Sala Camacuá",
    "tipo": "Teatro",
    "direccion": "Camacuá, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9091366,
    "longitud": -56.2022073
  },
  {
    "id": "salla-jorge-lazaroff",
    "nombre": "Salla Jorge Lazaroff",
    "tipo": "Teatro",
    "direccion": "Camino Maldonado 4849, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8557662,
    "longitud": -56.1324931
  },
  {
    "id": "el-comedy",
    "nombre": "El Comedy",
    "tipo": "Teatro",
    "direccion": "Gabriel Pereira 3064, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9080217,
    "longitud": -56.1493297
  },
  {
    "id": "teatro-grupo-babilonia",
    "nombre": "Teatro grupo babilonia",
    "tipo": "Teatro",
    "direccion": "Costa Rica, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8044042,
    "longitud": -55.916188
  },
  {
    "id": "centro-cultural-guyunusa",
    "nombre": "Centro Cultural \"Guyunusa\"",
    "tipo": "Club",
    "direccion": "Avenida General San Martín, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.853617,
    "longitud": -56.1726648
  },
  {
    "id": "centro-social-y-deportivo-victoria",
    "nombre": "Centro Social y Deportivo Victoria",
    "tipo": "Club",
    "direccion": "Doctor Joaquín Requena 2716, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8774466,
    "longitud": -56.1730042
  },
  {
    "id": "centro-cultural-goes",
    "nombre": "Centro Cultural Goes",
    "tipo": "Club",
    "direccion": "Doctor Domingo Aramburú, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8823042,
    "longitud": -56.1827908
  },
  {
    "id": "club-s-y-d-gral-artigas",
    "nombre": "Club S. y D. Gral. Artigas",
    "tipo": "Club",
    "direccion": "Bulevar General Artigas 2665, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8779793,
    "longitud": -56.1672088
  },
  {
    "id": "centro-cultural-penarol",
    "nombre": "Centro Cultural (Peñarol)",
    "tipo": "Club",
    "direccion": "Avenida de las Instrucciones, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8368757,
    "longitud": -56.1931113
  },
  {
    "id": "centro-social-penarol",
    "nombre": "Centro Social Peñarol",
    "tipo": "Club",
    "direccion": "Camino Edison, Peñarol",
    "barrio": "Peñarol",
    "ciudad": "Montevideo",
    "latitud": -34.8265314,
    "longitud": -56.2079012
  },
  {
    "id": "sociedad-urbana-villa-dolores",
    "nombre": "Sociedad Urbana Villa Dolores",
    "tipo": "Club",
    "direccion": "Alejo Rosell y Rius, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.9006019,
    "longitud": -56.1465382
  },
  {
    "id": "club-lomas-1ra",
    "nombre": "Club Lomas 1ra",
    "tipo": "Club",
    "direccion": "Avenida Cruz del Sur, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8173111,
    "longitud": -55.9405752
  },
  {
    "id": "club-las-piedras",
    "nombre": "Club Las Piedras",
    "tipo": "Club",
    "direccion": "Batlle y Ordóñez, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7261812,
    "longitud": -56.2176118
  },
  {
    "id": "organizacion-nacional-de-jubilados-y-pensionistas-del-uruguay",
    "nombre": "Organizacion Nacional de Jubilados y Pensionistas del Uruguay",
    "tipo": "Centro de jubilados",
    "direccion": "Doctor Mario Cassinoni 1573, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8985361,
    "longitud": -56.1659463
  },
  {
    "id": "pizzeria-municipio",
    "nombre": "Pizzeria Municipio",
    "tipo": "Restaurante",
    "direccion": "Luis Batlle Berres, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7295517,
    "longitud": -56.2273443
  },
  {
    "id": "munche-s",
    "nombre": "Munche's",
    "tipo": "Restaurante",
    "direccion": "Luis Batlle Berres, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7340856,
    "longitud": -56.2274854
  },
  {
    "id": "churreria",
    "nombre": "Churreria",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Batlle Berres, Santiago Vázquez",
    "barrio": "Santiago Vázquez",
    "ciudad": "Montevideo",
    "latitud": -34.7941855,
    "longitud": -56.3327868
  },
  {
    "id": "bouza-bodega-boutique",
    "nombre": "Bouza Bodega Boutique",
    "tipo": "Restaurante",
    "direccion": "Camino de la Redención 7658 Bis, Melilla",
    "barrio": "Melilla",
    "ciudad": "Montevideo",
    "latitud": -34.7913199,
    "longitud": -56.2767495,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "grido",
    "nombre": "Grido",
    "tipo": "Restaurante",
    "direccion": "Avenida Lezica 6330, Lezica",
    "barrio": "Lezica",
    "ciudad": "Montevideo",
    "latitud": -34.7968591,
    "longitud": -56.2471997
  },
  {
    "id": "el-pobre-acuna",
    "nombre": "El Pobre Acuña",
    "tipo": "Restaurante",
    "direccion": "General Leandro Gómez, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7262668,
    "longitud": -56.2150045,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "polleria-los-lenos",
    "nombre": "Pollería Los Leños",
    "tipo": "Restaurante",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7272003,
    "longitud": -56.219523
  },
  {
    "id": "costa-azul",
    "nombre": "Costa Azul",
    "tipo": "Restaurante",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7271486,
    "longitud": -56.2172731
  },
  {
    "id": "pizzeria-los-hermanos",
    "nombre": "Pizzeria Los Hermanos",
    "tipo": "Restaurante",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7273056,
    "longitud": -56.2209167
  },
  {
    "id": "nuevo-patriota",
    "nombre": "Nuevo Patriota",
    "tipo": "Restaurante",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7268392,
    "longitud": -56.2150113
  },
  {
    "id": "pastas-nicola",
    "nombre": "Pastas Nicola",
    "tipo": "Restaurante",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7270201,
    "longitud": -56.2139181
  },
  {
    "id": "societa-italiana",
    "nombre": "Societa Italiana",
    "tipo": "Restaurante",
    "direccion": "Avenida Instrucciones del Año XIII, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7277913,
    "longitud": -56.2152769
  },
  {
    "id": "el-italiano",
    "nombre": "El Italiano",
    "tipo": "Restaurante",
    "direccion": "Avenida Instrucciones del Año XIII, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7279715,
    "longitud": -56.2147127
  },
  {
    "id": "monfra",
    "nombre": "MonfrÀ",
    "tipo": "Restaurante",
    "direccion": "Sendero de Paso, Toledo Chico",
    "barrio": "Toledo Chico",
    "ciudad": "Montevideo",
    "latitud": -34.7398997,
    "longitud": -56.1587725,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "luz-violeta",
    "nombre": "Luz Violeta",
    "tipo": "Restaurante",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7272061,
    "longitud": -56.2240048
  },
  {
    "id": "comidas-al-paso-m-y-n",
    "nombre": "Comidas al Paso M y N",
    "tipo": "Restaurante",
    "direccion": "Avenida Don Pedro de Mendoza, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8181138,
    "longitud": -56.1569043
  },
  {
    "id": "la-pasiva",
    "nombre": "La Pasiva",
    "tipo": "Restaurante",
    "direccion": "Avenida General Eugenio Garzón, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8055998,
    "longitud": -56.2220844
  },
  {
    "id": "pizzeria-mediterranea",
    "nombre": "Pizzeria Mediterranea",
    "tipo": "Restaurante",
    "direccion": "Avenida José Belloni, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8169879,
    "longitud": -56.1390362,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "parrillada-san-jorge",
    "nombre": "Parrillada San Jorge",
    "tipo": "Restaurante",
    "direccion": "Avenida Don Pedro de Mendoza, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8198504,
    "longitud": -56.1561655
  },
  {
    "id": "pizzeria-los-amigos",
    "nombre": "Pizzería Los Amigos",
    "tipo": "Restaurante",
    "direccion": "Francisco Pizarro, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8135468,
    "longitud": -56.2163016,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "pick-out",
    "nombre": "Pick&Out",
    "tipo": "Restaurante",
    "direccion": "Carnot, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8030671,
    "longitud": -56.2237974
  },
  {
    "id": "la-razon-sandwicheria",
    "nombre": "La Razon Sandwicheria",
    "tipo": "Restaurante",
    "direccion": "Avenida José Belloni, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8172726,
    "longitud": -56.1390359
  },
  {
    "id": "carrito-el-duende",
    "nombre": "Carrito El Duende",
    "tipo": "Restaurante",
    "direccion": "Avenida Don Pedro de Mendoza, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8062494,
    "longitud": -56.1614657
  },
  {
    "id": "heladeria-grido",
    "nombre": "Heladería Grido",
    "tipo": "Restaurante",
    "direccion": "Hudson, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.8071816,
    "longitud": -56.2215315
  },
  {
    "id": "pizza-a-la-pala",
    "nombre": "Pizza a La Pala",
    "tipo": "Restaurante",
    "direccion": "Calle 1, La Tablada",
    "barrio": "La Tablada",
    "ciudad": "Montevideo",
    "latitud": -34.8206506,
    "longitud": -56.2488892,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "granja-santa-rosa-2",
    "nombre": "Granja Santa Rosa 2",
    "tipo": "Restaurante",
    "direccion": "Santa Lucía, Nuevo París",
    "barrio": "Nuevo París",
    "ciudad": "Montevideo",
    "latitud": -34.8438887,
    "longitud": -56.2401837
  },
  {
    "id": "la-flor-de-italia",
    "nombre": "La Flor de Italia",
    "tipo": "Restaurante",
    "direccion": "Avenida General Eugenio Garzón, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.821127,
    "longitud": -56.2202073,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "la-facha",
    "nombre": "La Facha",
    "tipo": "Restaurante",
    "direccion": "Camino Ariel, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8327407,
    "longitud": -56.2178024
  },
  {
    "id": "neuvo-canton",
    "nombre": "Neuvo Canton",
    "tipo": "Restaurante",
    "direccion": "Bell, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.83551,
    "longitud": -56.2128815
  },
  {
    "id": "pizzeria-la-elena",
    "nombre": "Pizzería La Elena",
    "tipo": "Restaurante",
    "direccion": "Bulevar Doctor Manuel Herrera y Obes 4343, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.85754,
    "longitud": -56.227055,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "dos-avenidas",
    "nombre": "Dos Avenidas",
    "tipo": "Restaurante",
    "direccion": "Avenida Carlos María Ramírez, Belvedere",
    "barrio": "Belvedere",
    "ciudad": "Montevideo",
    "latitud": -34.8551577,
    "longitud": -56.2223277
  },
  {
    "id": "pizzeria-la-razon",
    "nombre": "Pizzería La razón",
    "tipo": "Restaurante",
    "direccion": "Avenida Carlos María Ramírez 514, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8611226,
    "longitud": -56.2301148
  },
  {
    "id": "los-lobizones",
    "nombre": "Los lobizones",
    "tipo": "Restaurante",
    "direccion": "Pedro Giralt 4310, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8646555,
    "longitud": -56.2349858,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "mccain",
    "nombre": "McCain",
    "tipo": "Restaurante",
    "direccion": "Camino Molinos de Raffo, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.846965,
    "longitud": -56.2126332
  },
  {
    "id": "pizzeria-los-yorio",
    "nombre": "Pizzería Los Yorio",
    "tipo": "Restaurante",
    "direccion": "Doctor Martín Berinduague, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8609272,
    "longitud": -56.2214699,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "pizzeria-chiviteria-parrillada",
    "nombre": "Pizzeria Chiviteria Parrillada",
    "tipo": "Restaurante",
    "direccion": "Avenida Millán, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8426572,
    "longitud": -56.2082505,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "los-gauchos",
    "nombre": "Los Gauchos",
    "tipo": "Restaurante",
    "direccion": "Avenida Carlos María Ramírez, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8689148,
    "longitud": -56.2391987
  },
  {
    "id": "don-napolitano",
    "nombre": "Don Napolitano",
    "tipo": "Restaurante",
    "direccion": "Avenida Agraciada, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8579545,
    "longitud": -56.2178025,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "juancho",
    "nombre": "Juancho",
    "tipo": "Restaurante",
    "direccion": "Avenida Carlos María Ramírez, Tres Ombúes",
    "barrio": "Tres Ombúes",
    "ciudad": "Montevideo",
    "latitud": -34.8734944,
    "longitud": -56.2477559
  },
  {
    "id": "pizza-coma",
    "nombre": "Pizza Coma",
    "tipo": "Restaurante",
    "direccion": "Avenida Carlos María Ramírez, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8741071,
    "longitud": -56.2500867
  },
  {
    "id": "la-fortaleza",
    "nombre": "La Fortaleza",
    "tipo": "Restaurante",
    "direccion": "Grecia, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8749327,
    "longitud": -56.2512763,
    "comida": [
      "pizza",
      "café"
    ]
  },
  {
    "id": "viandas-hotel-del-prado",
    "nombre": "Viandas Hotel del Prado",
    "tipo": "Restaurante",
    "direccion": "Avenida Gabriela Mistral 4223, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8545303,
    "longitud": -56.2077282
  },
  {
    "id": "parrillada-el-urraca",
    "nombre": "Parrillada El Urraca",
    "tipo": "Restaurante",
    "direccion": "Grecia, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8761532,
    "longitud": -56.2510486
  },
  {
    "id": "lo-de-clemente",
    "nombre": "Lo de Clemente",
    "tipo": "Restaurante",
    "direccion": "Avenida Doctor Juan Carlos Blanco 3459, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.867015,
    "longitud": -56.1997667
  },
  {
    "id": "esquina-cantina",
    "nombre": "Esquina Cantina",
    "tipo": "Restaurante",
    "direccion": "Avenida Doctor Juan Carlos Blanco 3499, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8662869,
    "longitud": -56.1990999,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "santo-pecado",
    "nombre": "Santo Pecado",
    "tipo": "Restaurante",
    "direccion": "Carlos Solé, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8717555,
    "longitud": -56.1992343
  },
  {
    "id": "horno-de-mathias",
    "nombre": "Horno de Mathias",
    "tipo": "Restaurante",
    "direccion": "Uruguayana, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8754289,
    "longitud": -56.2009091,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "bar-san-martin",
    "nombre": "Bar San Martin",
    "tipo": "Restaurante",
    "direccion": "Avenida Agraciada, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8755449,
    "longitud": -56.1990556
  },
  {
    "id": "carrito-el-26",
    "nombre": "Carrito el 26",
    "tipo": "Restaurante",
    "direccion": "Juan Bautista Saá, Sayago",
    "barrio": "Sayago",
    "ciudad": "Montevideo",
    "latitud": -34.8296787,
    "longitud": -56.2303107
  },
  {
    "id": "burger-king",
    "nombre": "Burger King",
    "tipo": "Restaurante",
    "direccion": "Avenida Agraciada 4252, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8557725,
    "longitud": -56.2204575,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "mcdonald-s",
    "nombre": "McDonald's",
    "tipo": "Restaurante",
    "direccion": "Avenida Agraciada 4168, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8568226,
    "longitud": -56.2190271,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "mostaza",
    "nombre": "Mostaza",
    "tipo": "Restaurante",
    "direccion": "Mariano Sagasta, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8574054,
    "longitud": -56.21912,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "vanessa-denis",
    "nombre": "Vanessa Denis",
    "tipo": "Restaurante",
    "direccion": "Emilio Romero, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8586106,
    "longitud": -56.2176153
  },
  {
    "id": "el-vasco-de-paysandu",
    "nombre": "El Vasco de Paysandú",
    "tipo": "Restaurante",
    "direccion": "Pilar Costa, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8592205,
    "longitud": -56.2167778
  },
  {
    "id": "mucho-gusto",
    "nombre": "Mucho Gusto",
    "tipo": "Restaurante",
    "direccion": "Marcelino Díaz García, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8598306,
    "longitud": -56.2159714
  },
  {
    "id": "viaducto",
    "nombre": "Viaducto",
    "tipo": "Restaurante",
    "direccion": "Avenida Agraciada, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8604388,
    "longitud": -56.2150395
  },
  {
    "id": "hidalgo",
    "nombre": "Hidalgo",
    "tipo": "Restaurante",
    "direccion": "Valentín Gómez, Capurro",
    "barrio": "Capurro",
    "ciudad": "Montevideo",
    "latitud": -34.8645061,
    "longitud": -56.2102896
  },
  {
    "id": "la-curva",
    "nombre": "La Curva",
    "tipo": "Restaurante",
    "direccion": "Avenida Carlos María Ramírez, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8738548,
    "longitud": -56.250794
  },
  {
    "id": "grido-la-teja",
    "nombre": "Grido (La Teja)",
    "tipo": "Restaurante",
    "direccion": "Avenida Carlos María Ramírez 771, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8647354,
    "longitud": -56.2341813
  },
  {
    "id": "salsa-pizca",
    "nombre": "Salsa Pizca",
    "tipo": "Restaurante",
    "direccion": "Juan B. Viacaba, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8880466,
    "longitud": -56.2520134
  },
  {
    "id": "pizzeria-lele",
    "nombre": "Pizzería Lele",
    "tipo": "Restaurante",
    "direccion": "Etiopía 2744, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8875972,
    "longitud": -56.2702527,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "empanadas-carolina",
    "nombre": "Empanadas Carolina",
    "tipo": "Restaurante",
    "direccion": "Piedras 237, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9056339,
    "longitud": -56.2118053
  },
  {
    "id": "lindolfo",
    "nombre": "Lindolfo",
    "tipo": "Restaurante",
    "direccion": "Juan Lindolfo Cuestas 1388, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9094932,
    "longitud": -56.2128599
  },
  {
    "id": "es-mercat",
    "nombre": "Es Mercat",
    "tipo": "Restaurante",
    "direccion": "Colón 1550, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9056184,
    "longitud": -56.2101719,
    "comida": [
      "pescado"
    ]
  },
  {
    "id": "la-fonda",
    "nombre": "La Fonda",
    "tipo": "Restaurante",
    "direccion": "Pérez Castellano 1422, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9078915,
    "longitud": -56.2103059
  },
  {
    "id": "primuseum",
    "nombre": "Primuseum",
    "tipo": "Restaurante",
    "direccion": "Pérez Castellano 1389, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9085101,
    "longitud": -56.2102355
  },
  {
    "id": "pizzeria-consul",
    "nombre": "Pizzería Consul",
    "tipo": "Restaurante",
    "direccion": "Ucrania 3700, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8873556,
    "longitud": -56.2663132,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "rotiseria-la-tuna",
    "nombre": "Rotisería La Tuna",
    "tipo": "Restaurante",
    "direccion": "Etiopía, Casabó",
    "barrio": "Casabó",
    "ciudad": "Montevideo",
    "latitud": -34.8883136,
    "longitud": -56.273131
  },
  {
    "id": "oriental",
    "nombre": "Oriental",
    "tipo": "Restaurante",
    "direccion": "Avenida General San Martín, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8651821,
    "longitud": -56.1798047
  },
  {
    "id": "el-rodeo",
    "nombre": "El Rodeo",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera 4054, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.861615,
    "longitud": -56.184792,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "don-corleone",
    "nombre": "Don Corleone",
    "tipo": "Restaurante",
    "direccion": "El Iniciador, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.870269,
    "longitud": -56.1822186
  },
  {
    "id": "benicio",
    "nombre": "Benicio",
    "tipo": "Restaurante",
    "direccion": "Bulevar General Artigas 3654, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8706019,
    "longitud": -56.1823372,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "el-reencuentro",
    "nombre": "El Reencuentro",
    "tipo": "Restaurante",
    "direccion": "Avenida General San Martín, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8607116,
    "longitud": -56.1779392
  },
  {
    "id": "la-esquina",
    "nombre": "La Esquina",
    "tipo": "Restaurante",
    "direccion": "Ciclovía Boulevard, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8703639,
    "longitud": -56.1785283
  },
  {
    "id": "oriental-bella-vista",
    "nombre": "Oriental (Bella Vista)",
    "tipo": "Restaurante",
    "direccion": "Ciclovía Boulevard, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8708908,
    "longitud": -56.1859192
  },
  {
    "id": "atahualpa",
    "nombre": "Atahualpa",
    "tipo": "Restaurante",
    "direccion": "Nelson, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8661917,
    "longitud": -56.1891066
  },
  {
    "id": "tertulia-food-drink",
    "nombre": "Tertulia - Food & Drink",
    "tipo": "Restaurante",
    "direccion": "Nelson 3200, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8689932,
    "longitud": -56.1900741
  },
  {
    "id": "parrilla-2-patos",
    "nombre": "Parrilla 2 Patos",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera 3551, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8664422,
    "longitud": -56.1728266
  },
  {
    "id": "don-bigote",
    "nombre": "Don Bigote",
    "tipo": "Restaurante",
    "direccion": "Doctor Carlos Vaz Ferreira 3700, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8594298,
    "longitud": -56.1896785
  },
  {
    "id": "bar-rover",
    "nombre": "Bar Rover",
    "tipo": "Restaurante",
    "direccion": "Avenida General San Martín 3652, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8577147,
    "longitud": -56.1758326
  },
  {
    "id": "monforte-bar-pizzeria",
    "nombre": "Monforte Bar & Pizzeria",
    "tipo": "Restaurante",
    "direccion": "Bulevar José Batlle y Ordóñez, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.8605176,
    "longitud": -56.1728311,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "britanico-parrillada",
    "nombre": "Británico Parrillada",
    "tipo": "Restaurante",
    "direccion": "Avenida Millán, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.872138,
    "longitud": -56.1899186
  },
  {
    "id": "pepe-boutique",
    "nombre": "Pepe Boutique",
    "tipo": "Restaurante",
    "direccion": "Pedernal, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8751829,
    "longitud": -56.178338
  },
  {
    "id": "al-dente-pastas",
    "nombre": "Al Dente Pastas",
    "tipo": "Restaurante",
    "direccion": "Doctor Gustavo Gallinal, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.873173,
    "longitud": -56.1736121,
    "comida": [
      "pastas"
    ]
  },
  {
    "id": "cervantes",
    "nombre": "Cervantes",
    "tipo": "Restaurante",
    "direccion": "Pedernal 2051, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.874982,
    "longitud": -56.1722159,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "primata-prado",
    "nombre": "Primata Prado",
    "tipo": "Restaurante",
    "direccion": "Caigua, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8648777,
    "longitud": -56.1961601
  },
  {
    "id": "jacinto-luna",
    "nombre": "Jacinto Luna",
    "tipo": "Restaurante",
    "direccion": "Pedernal, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.874858,
    "longitud": -56.1695421
  },
  {
    "id": "il-mondo-della-pizza",
    "nombre": "Il Mondo della Pizza",
    "tipo": "Restaurante",
    "direccion": "Avenida Millán 3800, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8580947,
    "longitud": -56.1958942,
    "comida": [
      "pizza",
      "parrilla",
      "helados",
      "hamburguesas"
    ]
  },
  {
    "id": "pizzeria-pancho-y-cisco",
    "nombre": "Pizzeria Pancho y Cisco",
    "tipo": "Restaurante",
    "direccion": "Cufré, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8768177,
    "longitud": -56.1709297
  },
  {
    "id": "d-la-ribera",
    "nombre": "D'la Ribera",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera 3303, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8700382,
    "longitud": -56.1665859,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "mykonos-bar",
    "nombre": "Mykonos Bar",
    "tipo": "Restaurante",
    "direccion": "Avenida General José Garibaldi 2152, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8795305,
    "longitud": -56.1730261,
    "comida": [
      "pizza",
      "hamburguesas"
    ]
  },
  {
    "id": "pizzeria-zapican",
    "nombre": "Pizzeria Zapican",
    "tipo": "Restaurante",
    "direccion": "Doctor Alfredo García Morales, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8790427,
    "longitud": -56.1925066,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "lassh",
    "nombre": "Lassh",
    "tipo": "Restaurante",
    "direccion": "Avenida General José Garibaldi, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8796715,
    "longitud": -56.1722183
  },
  {
    "id": "cafe-vaccaro",
    "nombre": "Cafe Vaccaro",
    "tipo": "Restaurante",
    "direccion": "Avenida General Flores, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8826452,
    "longitud": -56.1826216
  },
  {
    "id": "pizzeria-el-trovador",
    "nombre": "Pizzeria El Trovador",
    "tipo": "Restaurante",
    "direccion": "Doctor Domingo Aramburú, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8827343,
    "longitud": -56.1815497
  },
  {
    "id": "fainatico-s",
    "nombre": "Fainático's",
    "tipo": "Restaurante",
    "direccion": "Juan Paullier 2551, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8799099,
    "longitud": -56.1719429,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "restaurante-meson-del-scotch",
    "nombre": "Restaurante Mesón del Scotch",
    "tipo": "Restaurante",
    "direccion": "Avenida General San Martín, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8823517,
    "longitud": -56.1873308
  },
  {
    "id": "gago",
    "nombre": "Gago",
    "tipo": "Restaurante",
    "direccion": "Vilardebó, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8793417,
    "longitud": -56.1704469
  },
  {
    "id": "nueva-aurora",
    "nombre": "Nueva aurora",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8714925,
    "longitud": -56.1640246
  },
  {
    "id": "los-pepe-s",
    "nombre": "Los Pepe's",
    "tipo": "Restaurante",
    "direccion": "Santa Fé, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8818702,
    "longitud": -56.1918369,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "pizza-venecia",
    "nombre": "Pizza Venecia",
    "tipo": "Restaurante",
    "direccion": "Dulcinea, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8719296,
    "longitud": -56.1633147,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "la-terraza",
    "nombre": "La Terraza",
    "tipo": "Restaurante",
    "direccion": "Bulevar José Batlle y Ordóñez, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8689628,
    "longitud": -56.1618869
  },
  {
    "id": "il-buon-mangiare",
    "nombre": "Il Buon Mangiare",
    "tipo": "Restaurante",
    "direccion": "Canstatt, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8734773,
    "longitud": -56.1604109
  },
  {
    "id": "brother-s-bar",
    "nombre": "Brother's Bar",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera 2751, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8792564,
    "longitud": -56.1554602,
    "comida": [
      "pizza",
      "parrilla"
    ]
  },
  {
    "id": "pizzeria-el-tejado",
    "nombre": "Pizzería El Tejado",
    "tipo": "Restaurante",
    "direccion": "Juan Arrieta, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8726271,
    "longitud": -56.1613488
  },
  {
    "id": "las-palmeras",
    "nombre": "Las Palmeras",
    "tipo": "Restaurante",
    "direccion": "Doctor Luis Alberto Surraco, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8781963,
    "longitud": -56.1564823
  },
  {
    "id": "pizzeria-maktub",
    "nombre": "Pizzeria Maktub",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8770429,
    "longitud": -56.1566874
  },
  {
    "id": "pizzeria-31-de-enero",
    "nombre": "Pizzeria 31 de Enero",
    "tipo": "Restaurante",
    "direccion": "Avenida Don Pedro de Mendoza, Casavalle",
    "barrio": "Casavalle",
    "ciudad": "Montevideo",
    "latitud": -34.8297103,
    "longitud": -56.1547167,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "rotiseria-piria",
    "nombre": "Rotiseria Piria",
    "tipo": "Restaurante",
    "direccion": "Bulevar Aparicio Saravia, Jardines del Hipódromo",
    "barrio": "Jardines del Hipódromo",
    "ciudad": "Montevideo",
    "latitud": -34.8309072,
    "longitud": -56.1281169
  },
  {
    "id": "la-previa",
    "nombre": "La Previa",
    "tipo": "Restaurante",
    "direccion": "Francisco Sainz Rosas, Jardines del Hipódromo",
    "barrio": "Jardines del Hipódromo",
    "ciudad": "Montevideo",
    "latitud": -34.8460039,
    "longitud": -56.1354149
  },
  {
    "id": "mediterranea-2",
    "nombre": "Mediterránea 2",
    "tipo": "Restaurante",
    "direccion": "Avenida General Flores 5463, Piedras Blancas",
    "barrio": "Piedras Blancas",
    "ciudad": "Montevideo",
    "latitud": -34.8300225,
    "longitud": -56.1422654,
    "comida": [
      "hamburguesas",
      "sándwiches",
      "parrilla",
      "helados",
      "café",
      "pastas",
      "pizza",
      "pollo",
      "pescado"
    ]
  },
  {
    "id": "parrillada",
    "nombre": "Parrillada",
    "tipo": "Restaurante",
    "direccion": "Joanicó, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8749486,
    "longitud": -56.1423024
  },
  {
    "id": "el-club-de-la-papa-frita",
    "nombre": "El Club de la Papa Frita",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre 3650, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8765661,
    "longitud": -56.1429796,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "bar-san-pedro",
    "nombre": "Bar San Pedro",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8783242,
    "longitud": -56.1459573
  },
  {
    "id": "no-hay-2-sin-3",
    "nombre": "No hay 2 sin 3",
    "tipo": "Restaurante",
    "direccion": "Ramón de Santiago, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8691658,
    "longitud": -56.1861476,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "las-paulinas",
    "nombre": "Las Paulinas",
    "tipo": "Restaurante",
    "direccion": "Arquitecta Julia Guarino Fiechter 2996, Reducto",
    "barrio": "Reducto",
    "ciudad": "Montevideo",
    "latitud": -34.8716273,
    "longitud": -56.188507,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "la-tramoya",
    "nombre": "La Tramoya",
    "tipo": "Restaurante",
    "direccion": "Lorenzo Fernández, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8733503,
    "longitud": -56.1767884
  },
  {
    "id": "friends",
    "nombre": "Friends",
    "tipo": "Restaurante",
    "direccion": "Gualeguay, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8676026,
    "longitud": -56.1702898,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "rico-rincon",
    "nombre": "Rico Rincón",
    "tipo": "Restaurante",
    "direccion": "Yaguarí, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8761005,
    "longitud": -56.1760635
  },
  {
    "id": "mcdonald-s-jacinto-vera",
    "nombre": "McDonald's (Jacinto Vera)",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8697554,
    "longitud": -56.1697171,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "ipanema",
    "nombre": "Ipanema",
    "tipo": "Restaurante",
    "direccion": "Andrés Lamas, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8674076,
    "longitud": -56.1674925
  },
  {
    "id": "bocatti-empanadas",
    "nombre": "Bocatti Empanadas",
    "tipo": "Restaurante",
    "direccion": "Avenida Millán, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8596099,
    "longitud": -56.1954681
  },
  {
    "id": "don-pedro",
    "nombre": "Don Pedro",
    "tipo": "Restaurante",
    "direccion": "Bulevar José Batlle y Ordóñez 3883, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8647683,
    "longitud": -56.1671961,
    "comida": [
      "empanadas",
      "pizza"
    ]
  },
  {
    "id": "mcdonald-s-prado",
    "nombre": "McDonald's (Prado)",
    "tipo": "Restaurante",
    "direccion": "Avenida Joaquín Suárez 3774, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8589222,
    "longitud": -56.1959658,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "barnys",
    "nombre": "Barnys",
    "tipo": "Restaurante",
    "direccion": "Bulevar José Batlle y Ordóñez 3770, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8660679,
    "longitud": -56.1646614,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "los-lobos",
    "nombre": "Los Lobos",
    "tipo": "Restaurante",
    "direccion": "Bulevar General Artigas 2552, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8782313,
    "longitud": -56.1664302
  },
  {
    "id": "domino-s-pizza",
    "nombre": "Domino's Pizza",
    "tipo": "Restaurante",
    "direccion": "Monte Caseros, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8861998,
    "longitud": -56.163563,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "bro-chetas",
    "nombre": "Bro Chetas",
    "tipo": "Restaurante",
    "direccion": "Hocquart, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8888929,
    "longitud": -56.166934
  },
  {
    "id": "carrito-al-toque",
    "nombre": "Carrito \"Al Toque\"",
    "tipo": "Restaurante",
    "direccion": "Panamá, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8914022,
    "longitud": -56.1938333,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "mcdonald-s-tres-cruces",
    "nombre": "McDonald's (Tres Cruces)",
    "tipo": "Restaurante",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8939901,
    "longitud": -56.1664817,
    "comida": [
      "hamburguesas",
      "helados",
      "café"
    ]
  },
  {
    "id": "canton-chino",
    "nombre": "Cantón Chino",
    "tipo": "Restaurante",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.894338,
    "longitud": -56.1669178,
    "comida": [
      "china"
    ]
  },
  {
    "id": "el-imperio",
    "nombre": "El Imperio",
    "tipo": "Restaurante",
    "direccion": "Tristán Narvaja 1752, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.898098,
    "longitud": -56.1798052
  },
  {
    "id": "subway",
    "nombre": "Subway",
    "tipo": "Restaurante",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8944272,
    "longitud": -56.1664281,
    "comida": [
      "sándwiches"
    ]
  },
  {
    "id": "subway-tres-cruces",
    "nombre": "Subway (Tres Cruces)",
    "tipo": "Restaurante",
    "direccion": "Avelino Miranda, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8935075,
    "longitud": -56.1632878,
    "comida": [
      "sándwiches"
    ]
  },
  {
    "id": "bocatti",
    "nombre": "Bocatti",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.882493,
    "longitud": -56.1518568,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "la-fabrica-empanadas",
    "nombre": "La Fábrica Empanadas",
    "tipo": "Restaurante",
    "direccion": "Doctor Mario Cassinoni 1667, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8963914,
    "longitud": -56.1661742,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "don-pincho-shawarma-y-asado",
    "nombre": "Don Pincho - Shawarma y Asado",
    "tipo": "Restaurante",
    "direccion": "Mercedes 1863, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9001304,
    "longitud": -56.1769797,
    "comida": [
      "pollo"
    ]
  },
  {
    "id": "protein-bar",
    "nombre": "Protein Bar",
    "tipo": "Restaurante",
    "direccion": "Acevedo Díaz 1620, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8979073,
    "longitud": -56.1668379
  },
  {
    "id": "pide-house",
    "nombre": "Pide House",
    "tipo": "Restaurante",
    "direccion": "Colonia, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9014754,
    "longitud": -56.1780043
  },
  {
    "id": "mcdonald-s-larranaga",
    "nombre": "McDonald's (Larrañaga)",
    "tipo": "Restaurante",
    "direccion": "Bulevar José Batlle y Ordóñez, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8792966,
    "longitud": -56.1483289,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "bocatti-cordon",
    "nombre": "Bocatti (Cordón)",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 2046Bis, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9002548,
    "longitud": -56.1711579,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "el-rey-del-sabor",
    "nombre": "El rey del sabor",
    "tipo": "Restaurante",
    "direccion": "Eduardo Acevedo, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9017807,
    "longitud": -56.1763914,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "parrillada-jardines-del-hipodromo",
    "nombre": "Parrillada (Jardines del Hipódromo)",
    "tipo": "Restaurante",
    "direccion": "Avenida General Flores, Jardines del Hipódromo",
    "barrio": "Jardines del Hipódromo",
    "ciudad": "Montevideo",
    "latitud": -34.839609,
    "longitud": -56.1496253,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "heladeria-garcia",
    "nombre": "Heladería García",
    "tipo": "Restaurante",
    "direccion": "Avenida Millán 3229, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8677899,
    "longitud": -56.1921515
  },
  {
    "id": "marco",
    "nombre": "Marco",
    "tipo": "Restaurante",
    "direccion": "Doctor Silvestre Pérez, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8724441,
    "longitud": -56.1358711
  },
  {
    "id": "grido-brazo-oriental",
    "nombre": "Grido (Brazo Oriental)",
    "tipo": "Restaurante",
    "direccion": "Andrés Lamas, Brazo Oriental",
    "barrio": "Brazo Oriental",
    "ciudad": "Montevideo",
    "latitud": -34.865725,
    "longitud": -56.171212
  },
  {
    "id": "grido-larranaga",
    "nombre": "Grido (Larrañaga)",
    "tipo": "Restaurante",
    "direccion": "Thompson, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8761686,
    "longitud": -56.1579587
  },
  {
    "id": "grido-bella-vista",
    "nombre": "Grido (Bella Vista)",
    "tipo": "Restaurante",
    "direccion": "Ciclovía Boulevard, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8710872,
    "longitud": -56.1825037
  },
  {
    "id": "piu",
    "nombre": "PIU",
    "tipo": "Restaurante",
    "direccion": "Avenida Millán, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8602828,
    "longitud": -56.1951537
  },
  {
    "id": "chentola",
    "nombre": "Chentola",
    "tipo": "Restaurante",
    "direccion": "Avenida Agraciada 4018, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.859332,
    "longitud": -56.2160774
  },
  {
    "id": "grido-union",
    "nombre": "Grido (Unión)",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8787189,
    "longitud": -56.147403
  },
  {
    "id": "chentola-bella-vista",
    "nombre": "Chéntola (Bella Vista)",
    "tipo": "Restaurante",
    "direccion": "Buricayupi, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8751463,
    "longitud": -56.1988679
  },
  {
    "id": "parador-oriental",
    "nombre": "Parador Oriental",
    "tipo": "Restaurante",
    "direccion": "Camino Maldonado, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.842947,
    "longitud": -56.124653
  },
  {
    "id": "las-gardenas",
    "nombre": "Las Gardenas",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8559349,
    "longitud": -56.132023
  },
  {
    "id": "sweet-house",
    "nombre": "Sweet House",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8563299,
    "longitud": -56.1323759
  },
  {
    "id": "qiana-uctrial",
    "nombre": "Qiana Uctrial",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8589802,
    "longitud": -56.133533
  },
  {
    "id": "alacena",
    "nombre": "Alacena",
    "tipo": "Restaurante",
    "direccion": "Tacuari 1144, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8744773,
    "longitud": -56.0306927
  },
  {
    "id": "asencio-bar",
    "nombre": "Asencio Bar",
    "tipo": "Restaurante",
    "direccion": "Avenida Alfredo Arocena 1999, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8811163,
    "longitud": -56.0617736
  },
  {
    "id": "el-chavo",
    "nombre": "El Chavo",
    "tipo": "Restaurante",
    "direccion": "Canovas del Castillo, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8650349,
    "longitud": -56.1175268
  },
  {
    "id": "la-fiaca",
    "nombre": "La Fiaca",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8656455,
    "longitud": -56.023852,
    "comida": [
      "pizza",
      "sándwiches",
      "pastas"
    ]
  },
  {
    "id": "alberto-s",
    "nombre": "Alberto's",
    "tipo": "Restaurante",
    "direccion": "Vaimaca Perú, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.878145,
    "longitud": -56.030334
  },
  {
    "id": "kamikaze-sushi-house",
    "nombre": "Kamikaze Sushi House",
    "tipo": "Restaurante",
    "direccion": "Avenida a la Playa, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8657718,
    "longitud": -56.0215179,
    "comida": [
      "japonesa",
      "sushi"
    ]
  },
  {
    "id": "lo-de-monica",
    "nombre": "Lo de Mónica",
    "tipo": "Restaurante",
    "direccion": "Javier de Viana, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8713065,
    "longitud": -56.0230961
  },
  {
    "id": "la-nueva-chopera",
    "nombre": "La Nueva Chopera",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre, Villa Española",
    "barrio": "Villa Española",
    "ciudad": "Montevideo",
    "latitud": -34.8658684,
    "longitud": -56.1342965
  },
  {
    "id": "reyna",
    "nombre": "Reyna",
    "tipo": "Restaurante",
    "direccion": "Camino Corrales, Villa Española",
    "barrio": "Villa Española",
    "ciudad": "Montevideo",
    "latitud": -34.8642367,
    "longitud": -56.1375972
  },
  {
    "id": "pasta-pasta",
    "nombre": "Pasta & Pasta",
    "tipo": "Restaurante",
    "direccion": "Rostand 1560, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8895942,
    "longitud": -56.0558413,
    "comida": [
      "italiana"
    ]
  },
  {
    "id": "dackel",
    "nombre": "Dackel",
    "tipo": "Restaurante",
    "direccion": "Doctor Gabriel Otero 6438, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8893239,
    "longitud": -56.0575136
  },
  {
    "id": "restaurant-shang-hai",
    "nombre": "Restaurant Shang Hai",
    "tipo": "Restaurante",
    "direccion": "Rostand 1560, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8898519,
    "longitud": -56.0556932,
    "comida": [
      "china"
    ]
  },
  {
    "id": "la-peatonal",
    "nombre": "La Peatonal",
    "tipo": "Restaurante",
    "direccion": "Carlos Sáez 6697, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8899292,
    "longitud": -56.055332
  },
  {
    "id": "origen",
    "nombre": "Origen",
    "tipo": "Restaurante",
    "direccion": "Carlos Sáez 6433, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8902522,
    "longitud": -56.0570319
  },
  {
    "id": "los-redonditos",
    "nombre": "Los Redonditos",
    "tipo": "Restaurante",
    "direccion": "Camino Carrasco, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8709005,
    "longitud": -56.1151711
  },
  {
    "id": "la-clasica",
    "nombre": "La Clasica",
    "tipo": "Restaurante",
    "direccion": "General José Villagrán, Villa Española",
    "barrio": "Villa Española",
    "ciudad": "Montevideo",
    "latitud": -34.8684651,
    "longitud": -56.1348645
  },
  {
    "id": "la-redonda",
    "nombre": "La Redonda",
    "tipo": "Restaurante",
    "direccion": "Camino Carrasco, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8704737,
    "longitud": -56.111004,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "la-pasiva-punta-gorda",
    "nombre": "La Pasiva (Punta Gorda)",
    "tipo": "Restaurante",
    "direccion": "Avenida Italia 5775, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.881002,
    "longitud": -56.0815889
  },
  {
    "id": "la-pizzarrita",
    "nombre": "La Pizzarrita",
    "tipo": "Restaurante",
    "direccion": "Avenida General José María Paz 1444, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.892853,
    "longitud": -56.0797896
  },
  {
    "id": "como-la-vaca-al-toro",
    "nombre": "Como la vaca al toro",
    "tipo": "Restaurante",
    "direccion": "Avenida Bolivia 1505, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8924446,
    "longitud": -56.0687671,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "rodelu",
    "nombre": "Rodelu",
    "tipo": "Restaurante",
    "direccion": "Avenida Bolivia 1428, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8928281,
    "longitud": -56.0660387
  },
  {
    "id": "el-club-de-la-papa-frita-malvin",
    "nombre": "El Club de la Papa Frita (Malvín)",
    "tipo": "Restaurante",
    "direccion": "Avenida Enrique Legrand 5187, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8905796,
    "longitud": -56.0970168,
    "comida": [
      "pizza",
      "parrilla"
    ]
  },
  {
    "id": "la-criolla",
    "nombre": "La Criolla",
    "tipo": "Restaurante",
    "direccion": "Avenida Bolivia 1408, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8931202,
    "longitud": -56.065647
  },
  {
    "id": "alta-pizza",
    "nombre": "Alta Pizza",
    "tipo": "Restaurante",
    "direccion": "Missouri 1401, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8955901,
    "longitud": -56.0957015,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "decano",
    "nombre": "Decano",
    "tipo": "Restaurante",
    "direccion": "Orinoco 4943, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8957657,
    "longitud": -56.0998794,
    "comida": [
      "pizza",
      "parrilla"
    ]
  },
  {
    "id": "soprano-s",
    "nombre": "Soprano's",
    "tipo": "Restaurante",
    "direccion": "Río de la Plata 1395, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.895904,
    "longitud": -56.1022164
  },
  {
    "id": "mlcalentitas",
    "nombre": "MLCalentitas",
    "tipo": "Restaurante",
    "direccion": "Avenida de las Américas 6000, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8702853,
    "longitud": -56.0312615
  },
  {
    "id": "mcdonald-s-parque-miramar",
    "nombre": "McDonald's (Parque Miramar)",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio Local 4, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8660565,
    "longitud": -56.024766,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "el-chivito-de-oro",
    "nombre": "El Chivito de Oro",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8656071,
    "longitud": -56.0242707
  },
  {
    "id": "el-horno-de-juan",
    "nombre": "El Horno de Juan",
    "tipo": "Restaurante",
    "direccion": "Avenida Italia 5654, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8837612,
    "longitud": -56.0849627,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "grido-maronas",
    "nombre": "Grido (Maroñas)",
    "tipo": "Restaurante",
    "direccion": "Hipólito Yrigoyen, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8710743,
    "longitud": -56.1158522
  },
  {
    "id": "chivitos-lo-de-pepe",
    "nombre": "Chivitos Lo de Pepe",
    "tipo": "Restaurante",
    "direccion": "José L. Terra 2220, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.886448,
    "longitud": -56.1835374
  },
  {
    "id": "chekere-de-cuba",
    "nombre": "Chekere de Cuba",
    "tipo": "Restaurante",
    "direccion": "José L. Terra 2220, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8865985,
    "longitud": -56.1830901
  },
  {
    "id": "gran-arenal",
    "nombre": "Gran Arenal",
    "tipo": "Restaurante",
    "direccion": "Libres, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.88626,
    "longitud": -56.1807287
  },
  {
    "id": "alcala",
    "nombre": "Alcala",
    "tipo": "Restaurante",
    "direccion": "Avenida General Flores, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8890242,
    "longitud": -56.1864493
  },
  {
    "id": "quentin-bar",
    "nombre": "Quentin Bar",
    "tipo": "Restaurante",
    "direccion": "Marcelino Sosa 2125, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8877164,
    "longitud": -56.187326
  },
  {
    "id": "cocina-y-cafe",
    "nombre": "Cocina y café",
    "tipo": "Restaurante",
    "direccion": "Justicia, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8879032,
    "longitud": -56.1791508
  },
  {
    "id": "bar-silva",
    "nombre": "Bar Silva",
    "tipo": "Restaurante",
    "direccion": "Colombia 1347, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8900311,
    "longitud": -56.1886692,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "el-rey-del-sabor-villa-munoz",
    "nombre": "El rey del sabor (Villa Muñoz)",
    "tipo": "Restaurante",
    "direccion": "Doctor Juan José de Amézaga, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8865369,
    "longitud": -56.1771218
  },
  {
    "id": "la-tasca-dels-cuiners",
    "nombre": "La Tasca dels Cuiners",
    "tipo": "Restaurante",
    "direccion": "César Díaz 1254, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8894648,
    "longitud": -56.190723
  },
  {
    "id": "gaucho-s-grill",
    "nombre": "Gaucho's Grill",
    "tipo": "Restaurante",
    "direccion": "General Fausto Aguilar, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.883998,
    "longitud": -56.1909606
  },
  {
    "id": "ciudad-bar",
    "nombre": "Ciudad Bar",
    "tipo": "Restaurante",
    "direccion": "Miguelete, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8960406,
    "longitud": -56.1817828
  },
  {
    "id": "urumex",
    "nombre": "Urumex",
    "tipo": "Restaurante",
    "direccion": "Gaboto, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8963342,
    "longitud": -56.1825643
  },
  {
    "id": "charly",
    "nombre": "Charly",
    "tipo": "Restaurante",
    "direccion": "Paraguay 2141, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8913179,
    "longitud": -56.1947828,
    "comida": [
      "café"
    ]
  },
  {
    "id": "jueves-5",
    "nombre": "Jueves 5",
    "tipo": "Restaurante",
    "direccion": "Coquimbo, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8863193,
    "longitud": -56.170954
  },
  {
    "id": "el-vencedor",
    "nombre": "El Vencedor",
    "tipo": "Restaurante",
    "direccion": "Valparaíso, Aguada",
    "barrio": "Aguada",
    "ciudad": "Montevideo",
    "latitud": -34.8981031,
    "longitud": -56.1908095
  },
  {
    "id": "mi-casa",
    "nombre": "Mi Casa",
    "tipo": "Restaurante",
    "direccion": "Nueva Palmira 2076, Villa Muñoz",
    "barrio": "Villa Muñoz",
    "ciudad": "Montevideo",
    "latitud": -34.8885343,
    "longitud": -56.1700857
  },
  {
    "id": "nippon",
    "nombre": "Nippon",
    "tipo": "Restaurante",
    "direccion": "Magallanes 1566, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9005863,
    "longitud": -56.1810268
  },
  {
    "id": "la-tortuguita",
    "nombre": "La Tortuguita",
    "tipo": "Restaurante",
    "direccion": "Tristán Narvaja 1597, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.900899,
    "longitud": -56.178371,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "la-isla",
    "nombre": "La Isla",
    "tipo": "Restaurante",
    "direccion": "Ejido 1545, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9019302,
    "longitud": -56.1873567,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "touring",
    "nombre": "Touring",
    "tipo": "Restaurante",
    "direccion": "Minas 1487, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9028987,
    "longitud": -56.1811233,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "gran-sportman",
    "nombre": "Gran Sportman",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 1803, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9022081,
    "longitud": -56.1772152
  },
  {
    "id": "fans-cafe",
    "nombre": "Fans! Café",
    "tipo": "Restaurante",
    "direccion": "Constituyente 1515, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.905719,
    "longitud": -56.182667,
    "comida": [
      "sándwiches"
    ]
  },
  {
    "id": "el-club-de-la-papa-frita-centro",
    "nombre": "El Club de la Papa Frita (Centro)",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 1261, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9055834,
    "longitud": -56.1888136,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "comi-k",
    "nombre": "Comi.k",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 994, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9062876,
    "longitud": -56.1950264
  },
  {
    "id": "guacamole",
    "nombre": "Guacamole",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 1070, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9065723,
    "longitud": -56.1930103,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "biobar",
    "nombre": "Biobar",
    "tipo": "Restaurante",
    "direccion": "Circunvalación Doctor Enrique Tarigo 1126, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9065385,
    "longitud": -56.1918249
  },
  {
    "id": "el-fogon",
    "nombre": "El Fogón",
    "tipo": "Restaurante",
    "direccion": "San José 1080, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9071042,
    "longitud": -56.1929113
  },
  {
    "id": "la-pasiva-barrio-sur",
    "nombre": "La Pasiva (Barrio Sur)",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 899, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9061747,
    "longitud": -56.1971731,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "bar-madison",
    "nombre": "Bar Madison",
    "tipo": "Restaurante",
    "direccion": "Andes 1403, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9052839,
    "longitud": -56.1983786
  },
  {
    "id": "el-paraiso-de-eva",
    "nombre": "El Paraiso de Eva",
    "tipo": "Restaurante",
    "direccion": "José Germán Araújo 1280, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9078995,
    "longitud": -56.1978809
  },
  {
    "id": "bar-gula",
    "nombre": "Bar Gula",
    "tipo": "Restaurante",
    "direccion": "Canelones 1150, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9088236,
    "longitud": -56.1911718
  },
  {
    "id": "andale-taqueria-vegana",
    "nombre": "Andale Taqueria Vegana",
    "tipo": "Restaurante",
    "direccion": "Canelones 1552, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9081304,
    "longitud": -56.1819098
  },
  {
    "id": "palermo-viejo",
    "nombre": "Palermo Viejo",
    "tipo": "Restaurante",
    "direccion": "Avenida Gonzalo Ramírez 1446, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9126747,
    "longitud": -56.1838804
  },
  {
    "id": "santa-clara",
    "nombre": "Santa Clara",
    "tipo": "Restaurante",
    "direccion": "Canelones 1648, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9079854,
    "longitud": -56.1797244
  },
  {
    "id": "la-pasiva-buceo",
    "nombre": "La Pasiva (Buceo)",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9032568,
    "longitud": -56.1370037
  },
  {
    "id": "sirocco",
    "nombre": "Sirocco",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre 3110, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8824672,
    "longitud": -56.1528933,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "los-horneros",
    "nombre": "Los Horneros",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.881146,
    "longitud": -56.1530885
  },
  {
    "id": "pizzeria-belgrano",
    "nombre": "Pizzería Belgrano",
    "tipo": "Restaurante",
    "direccion": "Belgrano 2881, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8896572,
    "longitud": -56.15351,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "rocco-s-pizza",
    "nombre": "Rocco´s Pizza",
    "tipo": "Restaurante",
    "direccion": "Bulevar José Batlle y Ordóñez 2598, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8827505,
    "longitud": -56.1429529
  },
  {
    "id": "abril",
    "nombre": "Abril",
    "tipo": "Restaurante",
    "direccion": "Coronel Lucas Píriz, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.883646,
    "longitud": -56.1612959,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "el-club-de-la-papa-frita-la-blanqueada",
    "nombre": "El Club de la papa frita (La Blanqueada)",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre 2704, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8894063,
    "longitud": -56.159913,
    "comida": [
      "pizza",
      "sándwiches",
      "hamburguesas"
    ]
  },
  {
    "id": "pizzeria-braga",
    "nombre": "Pizzería Braga",
    "tipo": "Restaurante",
    "direccion": "Monte Caseros 2802, Larrañaga",
    "barrio": "Larrañaga",
    "ciudad": "Montevideo",
    "latitud": -34.8844962,
    "longitud": -56.1619386,
    "comida": [
      "sándwiches",
      "pizza"
    ]
  },
  {
    "id": "rodelu-la-blanqueada",
    "nombre": "Rodelu (La Blanqueada)",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre 2688, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8898766,
    "longitud": -56.1603124,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "casa-degli-italiani",
    "nombre": "Casa degli Italiani",
    "tipo": "Restaurante",
    "direccion": "Avenida 8 de Octubre 2651, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8901147,
    "longitud": -56.1611585
  },
  {
    "id": "el-arabito",
    "nombre": "El Arabito",
    "tipo": "Restaurante",
    "direccion": "Bulevar General Artigas, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8862947,
    "longitud": -56.1656674
  },
  {
    "id": "la-barra-de-gerardo",
    "nombre": "La Barra de Gerardo",
    "tipo": "Restaurante",
    "direccion": "Avenida Ramón Anador 3211, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8957036,
    "longitud": -56.147004
  },
  {
    "id": "bar-dublin",
    "nombre": "Bar Dublin",
    "tipo": "Restaurante",
    "direccion": "Avenida Ramón Anador 3431, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8952196,
    "longitud": -56.1424173,
    "comida": [
      "parrilla",
      "pizza"
    ]
  },
  {
    "id": "lo-de-silverio",
    "nombre": "Lo de Silverio",
    "tipo": "Restaurante",
    "direccion": "Alejo Rosell y Rius 1655, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8970743,
    "longitud": -56.147006,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "bar-los-4",
    "nombre": "Bar Los 4",
    "tipo": "Restaurante",
    "direccion": "Carlos Berg 2550, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9135863,
    "longitud": -56.1577594
  },
  {
    "id": "sushi-time",
    "nombre": "Sushi Time",
    "tipo": "Restaurante",
    "direccion": "Luis Franzini 970, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9131473,
    "longitud": -56.1588698,
    "comida": [
      "sushi"
    ]
  },
  {
    "id": "dilema-cafe-restobar",
    "nombre": "Dilema Café & Restobar",
    "tipo": "Restaurante",
    "direccion": "Tomás Diago 879, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9149983,
    "longitud": -56.1518302
  },
  {
    "id": "hugo-soca",
    "nombre": "Hugo Soca",
    "tipo": "Restaurante",
    "direccion": "Luis Franzini 955, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9134513,
    "longitud": -56.1590792
  },
  {
    "id": "parrilla-eladio",
    "nombre": "Parrilla Eladio",
    "tipo": "Restaurante",
    "direccion": "26 de Marzo, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9123776,
    "longitud": -56.1527191
  },
  {
    "id": "el-local-rotiseria",
    "nombre": "El Local - Rotisería",
    "tipo": "Restaurante",
    "direccion": "Libertad 2504, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.911305,
    "longitud": -56.1589383
  },
  {
    "id": "tintos-rubias",
    "nombre": "Tintos & Rubias",
    "tipo": "Restaurante",
    "direccion": "Pedro Francisco Berro 797, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9164188,
    "longitud": -56.1533256,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "hummus",
    "nombre": "Hummus",
    "tipo": "Restaurante",
    "direccion": "Doctor José Scosería 2500, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9155302,
    "longitud": -56.1588299
  },
  {
    "id": "primitivo",
    "nombre": "Primitivo",
    "tipo": "Restaurante",
    "direccion": "El Viejo Pancho 2457, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9101,
    "longitud": -56.1603718,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "soprano-s-pocitos",
    "nombre": "Soprano’s Pocitos",
    "tipo": "Restaurante",
    "direccion": "Bulevar España 2494, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9120118,
    "longitud": -56.1605837
  },
  {
    "id": "bruta",
    "nombre": "Bruta",
    "tipo": "Restaurante",
    "direccion": "Luis de la Torre 818, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9157895,
    "longitud": -56.155992
  },
  {
    "id": "la-barra-1114",
    "nombre": "La Barra 1114",
    "tipo": "Restaurante",
    "direccion": "Libertad 2436, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9125001,
    "longitud": -56.1608085
  },
  {
    "id": "himalayan",
    "nombre": "Himalayan",
    "tipo": "Restaurante",
    "direccion": "General Arquitecto Alfredo Baldomir 2463, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9086433,
    "longitud": -56.1603153
  },
  {
    "id": "la-otra-parrilla",
    "nombre": "La Otra Parrilla",
    "tipo": "Restaurante",
    "direccion": "Tomás Diago 758, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9174182,
    "longitud": -56.1524135,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "la-parrilla-de-williman",
    "nombre": "La Parrilla de Williman",
    "tipo": "Restaurante",
    "direccion": "Williman 602, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9172242,
    "longitud": -56.159277,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "uruguay-natural-parrilla-gourmet",
    "nombre": "Uruguay Natural Parrilla Gourmet",
    "tipo": "Restaurante",
    "direccion": "Doctor Héctor Miranda 2432, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9232235,
    "longitud": -56.160484,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "sin-berretines",
    "nombre": "Sin berretines",
    "tipo": "Restaurante",
    "direccion": "Juan D. Jackson 940, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.912083,
    "longitud": -56.1725575
  },
  {
    "id": "bar-rodo",
    "nombre": "Bar Rodo",
    "tipo": "Restaurante",
    "direccion": "Avenida Gonzalo Ramírez 2000, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9118622,
    "longitud": -56.1716719
  },
  {
    "id": "la-isla-palermo",
    "nombre": "La Isla (Palermo)",
    "tipo": "Restaurante",
    "direccion": "Avenida Gonzalo Ramírez, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9119638,
    "longitud": -56.1758576,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "blanes-restaurante",
    "nombre": "Blanes Restaurante",
    "tipo": "Restaurante",
    "direccion": "Juan Manuel Blanes 997, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9111772,
    "longitud": -56.1717784,
    "comida": [
      "italiana"
    ]
  },
  {
    "id": "il-trancio-ditalia",
    "nombre": "Il Trancio Ditalia",
    "tipo": "Restaurante",
    "direccion": "Avenida Gonzalo Ramírez 2113, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.911437,
    "longitud": -56.168928,
    "comida": [
      "pastas",
      "pizza"
    ]
  },
  {
    "id": "alberto-s-buceo",
    "nombre": "Alberto's (Buceo)",
    "tipo": "Restaurante",
    "direccion": "Avenida Luis Alberto de Herrera 1144, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9068831,
    "longitud": -56.1362621,
    "comida": [
      "parrilla",
      "pizza"
    ]
  },
  {
    "id": "hard-rock-cafe",
    "nombre": "Hard Rock Cafe",
    "tipo": "Restaurante",
    "direccion": "Rambla Armenia 1624, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9095741,
    "longitud": -56.134036
  },
  {
    "id": "la-pasiva-26",
    "nombre": "La Pasiva 26",
    "tipo": "Restaurante",
    "direccion": "Bulevar 26 de Marzo 3564, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9055798,
    "longitud": -56.1353116
  },
  {
    "id": "panini-s",
    "nombre": "Panini's",
    "tipo": "Restaurante",
    "direccion": "Bulevar 26 de Marzo 3586, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9055086,
    "longitud": -56.1348073,
    "comida": [
      "italiana",
      "pescado"
    ]
  },
  {
    "id": "pranzo-pocitos",
    "nombre": "Pranzo Pocitos",
    "tipo": "Restaurante",
    "direccion": "Basilio Pereira de la Luz 1354, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.9034355,
    "longitud": -56.1418108,
    "comida": [
      "pizza",
      "hamburguesas",
      "sándwiches"
    ]
  },
  {
    "id": "miniefoods",
    "nombre": "Miniefoods",
    "tipo": "Restaurante",
    "direccion": "Marco Bruto 1386, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.9020454,
    "longitud": -56.1395785
  },
  {
    "id": "venecia",
    "nombre": "Venecia",
    "tipo": "Restaurante",
    "direccion": "Avenida General Rivera 3351, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.9020771,
    "longitud": -56.1421819,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "chocara-mvd",
    "nombre": "ChocAra MVD",
    "tipo": "Restaurante",
    "direccion": "20 de Setiembre 1520, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.900425,
    "longitud": -56.1624726,
    "comida": [
      "hamburguesas",
      "café"
    ]
  },
  {
    "id": "papiros",
    "nombre": "Papiros",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 2092, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8997326,
    "longitud": -56.1699404,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "castrobo",
    "nombre": "Castrobo",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 2150, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8992995,
    "longitud": -56.1688003,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "a-punto",
    "nombre": "A Punto",
    "tipo": "Restaurante",
    "direccion": "Pedro Campbell 1449, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.9011903,
    "longitud": -56.1619892,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "la-guinda",
    "nombre": "La Guinda",
    "tipo": "Restaurante",
    "direccion": "Maldonado 1983, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9082435,
    "longitud": -56.1723463
  },
  {
    "id": "rocinante",
    "nombre": "Rocinante",
    "tipo": "Restaurante",
    "direccion": "Avenida Gonzalo Ramírez 1652, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9124008,
    "longitud": -56.1789598,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "katy-s",
    "nombre": "Katy's",
    "tipo": "Restaurante",
    "direccion": "San Salvador 1644, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.911641,
    "longitud": -56.1793558
  },
  {
    "id": "jhonny-s",
    "nombre": "Jhonny's",
    "tipo": "Restaurante",
    "direccion": "Agustín Abreu 2441, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8812664,
    "longitud": -56.1485296
  },
  {
    "id": "ragnar-burgers",
    "nombre": "Ragnar Burgers",
    "tipo": "Restaurante",
    "direccion": "Bulevar José Batlle y Ordóñez 2350, Unión",
    "barrio": "Unión",
    "ciudad": "Montevideo",
    "latitud": -34.8857077,
    "longitud": -56.1387777,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "heladeria-del-abuelo",
    "nombre": "Heladería Del Abuelo",
    "tipo": "Restaurante",
    "direccion": "Maldonado 1868, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9085812,
    "longitud": -56.1747407
  },
  {
    "id": "las-delicias",
    "nombre": "Las Delicias",
    "tipo": "Restaurante",
    "direccion": "21 de Setiembre 2829, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9168414,
    "longitud": -56.157861
  },
  {
    "id": "freddo",
    "nombre": "Freddo",
    "tipo": "Restaurante",
    "direccion": "Avenida Gonzalo Ramírez 2051, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9115095,
    "longitud": -56.1702128
  },
  {
    "id": "grido-helado",
    "nombre": "Grido Helado",
    "tipo": "Restaurante",
    "direccion": "Avenida Gonzalo Ramírez, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.912484,
    "longitud": -56.1833005
  },
  {
    "id": "la-cigale",
    "nombre": "La Cigale",
    "tipo": "Restaurante",
    "direccion": "Ejido, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9060716,
    "longitud": -56.1869629
  },
  {
    "id": "don-antonio",
    "nombre": "Don Antonio",
    "tipo": "Restaurante",
    "direccion": "Doctor Pablo de María, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9029874,
    "longitud": -56.1713088
  },
  {
    "id": "tienda-de-helados",
    "nombre": "Tienda de Helados",
    "tipo": "Restaurante",
    "direccion": "Avenida General Rivera, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.902301,
    "longitud": -56.1645619
  },
  {
    "id": "giovanni",
    "nombre": "Giovanni",
    "tipo": "Restaurante",
    "direccion": "Ana Monterroso de Lavalleja 2251, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.899836,
    "longitud": -56.1655681
  },
  {
    "id": "dolcezza",
    "nombre": "Dolcezza",
    "tipo": "Restaurante",
    "direccion": "Avenida General Rivera 3191, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9027542,
    "longitud": -56.1464044
  },
  {
    "id": "freddo-punta-carretas",
    "nombre": "Freddo (Punta Carretas)",
    "tipo": "Restaurante",
    "direccion": "José Ellauri, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9229266,
    "longitud": -56.159479
  },
  {
    "id": "la-chicharra",
    "nombre": "La Chicharra",
    "tipo": "Restaurante",
    "direccion": "Avenida General Rivera 2588, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9031973,
    "longitud": -56.1594988
  },
  {
    "id": "helar",
    "nombre": "Helar",
    "tipo": "Restaurante",
    "direccion": "Avenida General San Martín 2100, Arroyo Seco",
    "barrio": "Arroyo Seco",
    "ciudad": "Montevideo",
    "latitud": -34.8881325,
    "longitud": -56.1885768
  },
  {
    "id": "la-cigale-pocitos",
    "nombre": "La Cigale (Pocitos)",
    "tipo": "Restaurante",
    "direccion": "Juan Benito Blanco 1196, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.910882,
    "longitud": -56.1452956
  },
  {
    "id": "la-cigale-centro",
    "nombre": "La Cigale (Centro)",
    "tipo": "Restaurante",
    "direccion": "Avenida 18 de Julio 1179, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.90572,
    "longitud": -56.1906913
  },
  {
    "id": "piu-parque-rodo",
    "nombre": "Piu (Parque Rodó)",
    "tipo": "Restaurante",
    "direccion": "Constituyente 2039, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9078406,
    "longitud": -56.1721665
  },
  {
    "id": "los-trovadores",
    "nombre": "Los Trovadores",
    "tipo": "Restaurante",
    "direccion": "Gabriel Pereira 3202, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9099552,
    "longitud": -56.147457
  },
  {
    "id": "la-cigale-la-comercial",
    "nombre": "La Cigale (La Comercial)",
    "tipo": "Restaurante",
    "direccion": "Avenida General José Garibaldi, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8851443,
    "longitud": -56.165274
  },
  {
    "id": "la-madriguera-heladeria",
    "nombre": "la Madriguera heladería",
    "tipo": "Restaurante",
    "direccion": "Doctor Alejandro Schroeder 1666, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.887251,
    "longitud": -56.0593385
  },
  {
    "id": "la-nueva-roma",
    "nombre": "La Nueva Roma",
    "tipo": "Restaurante",
    "direccion": "Candelaria, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8880667,
    "longitud": -56.1111589
  },
  {
    "id": "grido-buceo",
    "nombre": "Grido (Buceo)",
    "tipo": "Restaurante",
    "direccion": "Avenida General Rivera, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8961552,
    "longitud": -56.1219426
  },
  {
    "id": "grido-helado-punta-gorda",
    "nombre": "Grido Helado (Punta Gorda)",
    "tipo": "Restaurante",
    "direccion": "Doctor Carlos Travieso, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.884578,
    "longitud": -56.0825765
  },
  {
    "id": "grot",
    "nombre": "Grot",
    "tipo": "Restaurante",
    "direccion": "Avenida Alfredo Arocena, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8899712,
    "longitud": -56.0564829
  },
  {
    "id": "las-delicias-carrasco",
    "nombre": "Las Delicias (Carrasco)",
    "tipo": "Restaurante",
    "direccion": "Doctor Alejandro Schroeder, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.887604,
    "longitud": -56.0577124
  },
  {
    "id": "polleria-kikiriki",
    "nombre": "Polleria KIKIRIKI",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio 141-19, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8117138,
    "longitud": -55.9404796
  },
  {
    "id": "caprese",
    "nombre": "Caprese",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8135785,
    "longitud": -55.9423922,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "vuffet",
    "nombre": "Vuffet",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8071939,
    "longitud": -55.9307115
  },
  {
    "id": "la-9",
    "nombre": "La '9",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8059352,
    "longitud": -55.928624,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "empanadas-don-pedro",
    "nombre": "Empanadas Don Pedro",
    "tipo": "Restaurante",
    "direccion": "Avenida Doroteo García Lagos, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8165187,
    "longitud": -55.9469426
  },
  {
    "id": "mar-abierto",
    "nombre": "Mar Abierto",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8030065,
    "longitud": -55.9234578
  },
  {
    "id": "pizza-top",
    "nombre": "Pizza Top",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.802468,
    "longitud": -55.9222664,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "spetus",
    "nombre": "Spetus",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8020928,
    "longitud": -55.9215997
  },
  {
    "id": "mamma-pizza",
    "nombre": "Mamma Pizza",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8201028,
    "longitud": -55.9537458
  },
  {
    "id": "las-casuarinas",
    "nombre": "Las Casuarinas",
    "tipo": "Restaurante",
    "direccion": "Indiana, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8133161,
    "longitud": -55.9224443,
    "comida": [
      "parrilla"
    ]
  },
  {
    "id": "parador-solymar-beach",
    "nombre": "Parador Solymar Beach",
    "tipo": "Restaurante",
    "direccion": "Bajada 26, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8259194,
    "longitud": -55.9351286
  },
  {
    "id": "portugalia",
    "nombre": "Portugalia",
    "tipo": "Restaurante",
    "direccion": "Robles, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8231364,
    "longitud": -55.9594413,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "araza-resto",
    "nombre": "Arazá Restó",
    "tipo": "Restaurante",
    "direccion": "Haití, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8088595,
    "longitud": -55.9129948
  },
  {
    "id": "restaurante-buffet-jurere",
    "nombre": "Restaurante Buffet Jureré",
    "tipo": "Restaurante",
    "direccion": "Bajada 22, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8337272,
    "longitud": -55.9512785
  },
  {
    "id": "de-la-espiga",
    "nombre": "De la Espiga",
    "tipo": "Restaurante",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8028796,
    "longitud": -55.9096762,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "origami",
    "nombre": "Origami",
    "tipo": "Restaurante",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8035213,
    "longitud": -55.9071772,
    "comida": [
      "sushi"
    ]
  },
  {
    "id": "la-mas-sabrosa",
    "nombre": "La Más Sabrosa",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8275792,
    "longitud": -55.9676088
  },
  {
    "id": "y",
    "nombre": "Y",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8276585,
    "longitud": -55.969757
  },
  {
    "id": "rustica",
    "nombre": "Rústica",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8285302,
    "longitud": -55.9712618
  },
  {
    "id": "armenia",
    "nombre": "Armenia",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8299733,
    "longitud": -55.9719227
  },
  {
    "id": "marisqueria-el-italiano",
    "nombre": "Marisquería El Italiano",
    "tipo": "Restaurante",
    "direccion": "Bajada 19, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8395354,
    "longitud": -55.9613275,
    "comida": [
      "pescado"
    ]
  },
  {
    "id": "gran-asador",
    "nombre": "Gran Asador",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8324514,
    "longitud": -55.9785917
  },
  {
    "id": "sushi-time-lagomar",
    "nombre": "Sushi Time (Lagomar)",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8330941,
    "longitud": -55.9797109,
    "comida": [
      "sushi"
    ]
  },
  {
    "id": "pizzeria-y-chiviteria-di-calabria",
    "nombre": "Pizzería y Chivitería Di Calabria",
    "tipo": "Restaurante",
    "direccion": "Atahualpa del Cioppo, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8232122,
    "longitud": -55.9884014
  },
  {
    "id": "bar-tv",
    "nombre": "Bar TV",
    "tipo": "Restaurante",
    "direccion": "Emilio de Franco, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8356894,
    "longitud": -55.9815553,
    "comida": [
      "pizza",
      "parrilla"
    ]
  },
  {
    "id": "29-de-julio",
    "nombre": "29 de Julio",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8347688,
    "longitud": -55.9824972
  },
  {
    "id": "panne",
    "nombre": "Panne",
    "tipo": "Restaurante",
    "direccion": "Avenida Ricardo Becu, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8433408,
    "longitud": -55.9767245
  },
  {
    "id": "pizzeria-luigi-s",
    "nombre": "Pizzeria Luigi's",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8362971,
    "longitud": -55.9853032,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "la-pasiva-san-jose-de-carrasco",
    "nombre": "La Pasiva (San José de Carrasco)",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.84138,
    "longitud": -55.9931755,
    "comida": [
      "chivitos",
      "milanesas"
    ]
  },
  {
    "id": "bali",
    "nombre": "Bali",
    "tipo": "Restaurante",
    "direccion": "Avenida General José Artigas, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8420847,
    "longitud": -55.9927439,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "rapidos-y-sabrositos",
    "nombre": "Rápidos y Sabrositos",
    "tipo": "Restaurante",
    "direccion": "25 de Agosto, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.7961188,
    "longitud": -55.9357494
  },
  {
    "id": "dona-martina",
    "nombre": "Doña Martina",
    "tipo": "Restaurante",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8010348,
    "longitud": -55.918103,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "sushi-ven",
    "nombre": "sushi ven",
    "tipo": "Restaurante",
    "direccion": "Real de Azua, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8253518,
    "longitud": -55.9668251
  },
  {
    "id": "bocatti-el-pinar",
    "nombre": "Bocatti (El Pinar)",
    "tipo": "Restaurante",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8048598,
    "longitud": -55.9032557,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "mcdonald-s-solymar",
    "nombre": "McDonald's (Solymar)",
    "tipo": "Restaurante",
    "direccion": "Ruta Interbalnearia General Líber Seregni, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.817514,
    "longitud": -55.9797704,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "burger-time",
    "nombre": "Burger Time",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8361579,
    "longitud": -55.983368,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "bocatti-lagomar",
    "nombre": "Bocatti (Lagomar)",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8364017,
    "longitud": -55.9838203,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "empanadas-de-la-espiga",
    "nombre": "Empanadas de la Espiga",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8378804,
    "longitud": -55.9864265,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "el-horno-de-juan-lagomar",
    "nombre": "El Horno de Juan (Lagomar)",
    "tipo": "Restaurante",
    "direccion": "Manuel Nelson Varela Cáceres, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8380761,
    "longitud": -55.987065,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "el-horno-de-jose-ii",
    "nombre": "El Horno de José II",
    "tipo": "Restaurante",
    "direccion": "Avenida General José Artigas, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8452062,
    "longitud": -55.9886758,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "mostaza-san-jose-de-carrasco",
    "nombre": "Mostaza (San José de Carrasco)",
    "tipo": "Restaurante",
    "direccion": "Viejo Pancho, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8405001,
    "longitud": -55.9936524,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "mcdonald-s-san-jose-de-carrasco",
    "nombre": "McDonald's (San José de Carrasco)",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8412194,
    "longitud": -55.9936124,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "burger-king-san-jose-de-carrasco",
    "nombre": "Burger King (San José de Carrasco)",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8415459,
    "longitud": -55.9934698,
    "comida": [
      "hamburguesas"
    ]
  },
  {
    "id": "dona-martina-san-jose-de-carrasco",
    "nombre": "Doña Martina (San José de Carrasco)",
    "tipo": "Restaurante",
    "direccion": "Rambla General Liber Seregni, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8520268,
    "longitud": -55.9833501,
    "comida": [
      "empanadas"
    ]
  },
  {
    "id": "tunquelen",
    "nombre": "Tunquelen",
    "tipo": "Restaurante",
    "direccion": "Del Poniente, Shangrila, Ciudad de la Costa",
    "barrio": "Shangrila",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8509897,
    "longitud": -55.9946781
  },
  {
    "id": "la-parrilla",
    "nombre": "La Parrilla",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Shangrila, Ciudad de la Costa",
    "barrio": "Shangrila",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8466408,
    "longitud": -56.002561
  },
  {
    "id": "salsa-y-pimienta",
    "nombre": "Salsa y Pimienta",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8486128,
    "longitud": -56.0050618,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "lago-marintimo",
    "nombre": "Lago Maríntimo",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8487384,
    "longitud": -56.0063996
  },
  {
    "id": "cuervo",
    "nombre": "Cuervo",
    "tipo": "Restaurante",
    "direccion": "Santa María, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.860472,
    "longitud": -56.0004805
  },
  {
    "id": "sin-bombo",
    "nombre": "Sin Bombo",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8530822,
    "longitud": -56.0085864
  },
  {
    "id": "rinconada-pizza-bar",
    "nombre": "Rinconada Pizza-Bar",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8562645,
    "longitud": -56.0109177,
    "comida": [
      "pizza",
      "sándwiches",
      "hamburguesas"
    ]
  },
  {
    "id": "grido-solymar",
    "nombre": "Grido (Solymar)",
    "tipo": "Restaurante",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.828381,
    "longitud": -55.9690962
  },
  {
    "id": "biga",
    "nombre": "Biga",
    "tipo": "Restaurante",
    "direccion": "Fernando de Magallanes, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.7990084,
    "longitud": -55.8900328,
    "comida": [
      "pizza"
    ]
  },
  {
    "id": "patronus",
    "nombre": "Patronus",
    "tipo": "Restaurante",
    "direccion": "Las Piedras M302 S16, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.7972898,
    "longitud": -55.8840537,
    "comida": [
      "pastas",
      "pizza",
      "sándwiches"
    ]
  },
  {
    "id": "crab-s",
    "nombre": "Crab's",
    "tipo": "Restaurante",
    "direccion": "Avenida Juan María Pérez y Fuentes, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.7932473,
    "longitud": -55.8806789
  },
  {
    "id": "kneipe-finca",
    "nombre": "Kneipe & Finca",
    "tipo": "Café",
    "direccion": "Camino Paja Brava, Rincón de Melilla",
    "barrio": "Rincón de Melilla",
    "ciudad": "Montevideo",
    "latitud": -34.7208842,
    "longitud": -56.3160274
  },
  {
    "id": "kneipe-finca-rincon-de-melilla",
    "nombre": "Kneipe & Finca (Rincón de Melilla)",
    "tipo": "Café",
    "direccion": "Camino la Totora, Rincón de Melilla",
    "barrio": "Rincón de Melilla",
    "ciudad": "Montevideo",
    "latitud": -34.7198893,
    "longitud": -56.3137169
  },
  {
    "id": "si-faro",
    "nombre": "Si Faro",
    "tipo": "Café",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.726913,
    "longitud": -56.217296,
    "comida": [
      "helados"
    ]
  },
  {
    "id": "el-varon-del-tango",
    "nombre": "El Varón del Tango",
    "tipo": "Café",
    "direccion": "Avenida General Artigas, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7270919,
    "longitud": -56.2212723
  },
  {
    "id": "varaderos-ii",
    "nombre": "Varaderos II",
    "tipo": "Café",
    "direccion": "Avenida Carlos María Ramírez, La Teja",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8606313,
    "longitud": -56.2296333
  },
  {
    "id": "lo-de-carmelita-charlas-de-cafe",
    "nombre": "lo de Carmelita - Charlas de cafe",
    "tipo": "Café",
    "direccion": "Octavio Lapido, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.8690082,
    "longitud": -56.1997023
  },
  {
    "id": "los-gallieguitos",
    "nombre": "Los Gallieguitos",
    "tipo": "Café",
    "direccion": "Avenida Joaquín Suárez, Bella Vista",
    "barrio": "Bella Vista",
    "ciudad": "Montevideo",
    "latitud": -34.87089,
    "longitud": -56.1967503
  },
  {
    "id": "grido-helado-cerro",
    "nombre": "Grido Helado (Cerro)",
    "tipo": "Café",
    "direccion": "Grecia, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8829566,
    "longitud": -56.2497059,
    "comida": [
      "helados"
    ]
  },
  {
    "id": "sinestesia",
    "nombre": "Sinestesia",
    "tipo": "Café",
    "direccion": "Yacaré 1568, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9055442,
    "longitud": -56.2110619
  },
  {
    "id": "the-lab-coffee-roasters",
    "nombre": "The Lab coffee roasters",
    "tipo": "Café",
    "direccion": "Sarandí 285, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9088759,
    "longitud": -56.209166
  },
  {
    "id": "pan-comido-cafe",
    "nombre": "Pan Comido Cafe",
    "tipo": "Café",
    "direccion": "Carmelo, Atahualpa",
    "barrio": "Atahualpa",
    "ciudad": "Montevideo",
    "latitud": -34.8640453,
    "longitud": -56.1882709,
    "comida": [
      "café"
    ]
  },
  {
    "id": "cafe-33",
    "nombre": "Cafe 33",
    "tipo": "Café",
    "direccion": "José María Guerra, Jardines del Hipódromo",
    "barrio": "Jardines del Hipódromo",
    "ciudad": "Montevideo",
    "latitud": -34.8396119,
    "longitud": -56.1494571
  },
  {
    "id": "confiteria-service",
    "nombre": "Confiteria Service",
    "tipo": "Café",
    "direccion": "Camino Maldonado, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8454628,
    "longitud": -56.125423
  },
  {
    "id": "pickas-caffeur",
    "nombre": "Pickas Caffeur",
    "tipo": "Café",
    "direccion": "Eusebio Vidal, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8541079,
    "longitud": -56.1244265
  },
  {
    "id": "8-pm-cofee-time",
    "nombre": "8 PM Cofee Time",
    "tipo": "Café",
    "direccion": "Porongos, La Figurita",
    "barrio": "La Figurita",
    "ciudad": "Montevideo",
    "latitud": -34.8756488,
    "longitud": -56.1761177
  },
  {
    "id": "mccafe",
    "nombre": "McCafé",
    "tipo": "Café",
    "direccion": "Avenida Joaquín Suárez 3774, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8589634,
    "longitud": -56.1962047,
    "comida": [
      "café"
    ]
  },
  {
    "id": "cafetto-prado",
    "nombre": "Cafetto Prado",
    "tipo": "Café",
    "direccion": "Avenida Joaquín Suárez 3640, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8612377,
    "longitud": -56.1962754
  },
  {
    "id": "monkeys",
    "nombre": "Monkeys",
    "tipo": "Café",
    "direccion": "Rafael Barradas, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8760994,
    "longitud": -56.0386443
  },
  {
    "id": "el-palacio-del-cafe",
    "nombre": "El Palacio del Café",
    "tipo": "Café",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8655982,
    "longitud": -56.0245329
  },
  {
    "id": "saint-germain-cafe-parisien",
    "nombre": "Saint Germain Café Parisien",
    "tipo": "Café",
    "direccion": "Avenida General Rivera 6690, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8861289,
    "longitud": -56.0572532,
    "comida": [
      "café"
    ]
  },
  {
    "id": "la-madriguera",
    "nombre": "La madriguera",
    "tipo": "Café",
    "direccion": "Doctor Alejandro Schroeder 1666, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8873647,
    "longitud": -56.0592443
  },
  {
    "id": "starbucks",
    "nombre": "Starbucks",
    "tipo": "Café",
    "direccion": "Avenida Alfredo Arocena 1590, Carrasco",
    "barrio": "Carrasco",
    "ciudad": "Montevideo",
    "latitud": -34.8891916,
    "longitud": -56.0567202,
    "comida": [
      "café"
    ]
  },
  {
    "id": "arrayan",
    "nombre": "Arrayan",
    "tipo": "Café",
    "direccion": "Camino Carrasco, Maroñas",
    "barrio": "Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8704495,
    "longitud": -56.1114356
  },
  {
    "id": "starbucks-punta-gorda",
    "nombre": "Starbucks (Punta Gorda)",
    "tipo": "Café",
    "direccion": "Avenida Italia 5775, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8804819,
    "longitud": -56.0794302,
    "comida": [
      "café"
    ]
  },
  {
    "id": "brot-haus",
    "nombre": "Brot Haus",
    "tipo": "Café",
    "direccion": "Líbano 1428, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8939342,
    "longitud": -56.0713244
  },
  {
    "id": "portofino",
    "nombre": "Portofino",
    "tipo": "Café",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8508951,
    "longitud": -56.0080413
  },
  {
    "id": "cafe-roy",
    "nombre": "Café Roy",
    "tipo": "Café",
    "direccion": "Agustín Abreu, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8806845,
    "longitud": -56.1498917
  },
  {
    "id": "gracie-cafe",
    "nombre": "Gracie café",
    "tipo": "Café",
    "direccion": "Alejandro Fleming 1662, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8892697,
    "longitud": -56.0941073
  },
  {
    "id": "la-pantalla",
    "nombre": "La Pantalla",
    "tipo": "Café",
    "direccion": "Míchigan 1404, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8957734,
    "longitud": -56.0996194,
    "comida": [
      "café"
    ]
  },
  {
    "id": "craft-cafe",
    "nombre": "Craft Café",
    "tipo": "Café",
    "direccion": "Avenida 8 de Octubre, La Blanqueada",
    "barrio": "La Blanqueada",
    "ciudad": "Montevideo",
    "latitud": -34.8875362,
    "longitud": -56.1588999
  },
  {
    "id": "medialunas-calentitas",
    "nombre": "Medialunas Calentitas",
    "tipo": "Café",
    "direccion": "Avenida General José Garibaldi 2465, La Comercial",
    "barrio": "La Comercial",
    "ciudad": "Montevideo",
    "latitud": -34.8850192,
    "longitud": -56.1654464
  },
  {
    "id": "la-ronda-cafe",
    "nombre": "La Ronda Cafe",
    "tipo": "Café",
    "direccion": "Ciudadela 1182, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9096247,
    "longitud": -56.2000541
  },
  {
    "id": "telizzia-cat-cafe",
    "nombre": "Telizzia Cat Cafe",
    "tipo": "Café",
    "direccion": "Avenida Ingeniero Luis P. Ponce 1497, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.9004196,
    "longitud": -56.1598689
  },
  {
    "id": "ramona-cafe",
    "nombre": "Ramona Cafe",
    "tipo": "Café",
    "direccion": "Avenida Luis Alberto de Herrera 1196, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9059283,
    "longitud": -56.1366039
  },
  {
    "id": "nectarena-smoothies-cafe-tradicional",
    "nombre": "Nectarena. Smoothies & Café Tradicional",
    "tipo": "Café",
    "direccion": "Bacacay 1338, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9068536,
    "longitud": -56.201276
  },
  {
    "id": "saint-germain-boulangerie",
    "nombre": "Saint Germain Boulangerie",
    "tipo": "Café",
    "direccion": "Presidente General Oscar Diego Gestido 2805, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9058371,
    "longitud": -56.1534443,
    "comida": [
      "café"
    ]
  },
  {
    "id": "cafe-montana",
    "nombre": "Café Montaña",
    "tipo": "Café",
    "direccion": "Avenida 18 de Julio 1980, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9009345,
    "longitud": -56.1731631
  },
  {
    "id": "starbucks-centro",
    "nombre": "Starbucks (Centro)",
    "tipo": "Café",
    "direccion": "Ejido, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9054496,
    "longitud": -56.1869928
  },
  {
    "id": "el-cafecito",
    "nombre": "El Cafecito",
    "tipo": "Café",
    "direccion": "Doctor José Scosería 2435, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9159391,
    "longitud": -56.1593215
  },
  {
    "id": "cafe-gourmand",
    "nombre": "Café Gourmand",
    "tipo": "Café",
    "direccion": "Constituyente 2026, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9079132,
    "longitud": -56.172613
  },
  {
    "id": "gemitus",
    "nombre": "Gemitus",
    "tipo": "Café",
    "direccion": "Avenida General Rivera 3934, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.8990816,
    "longitud": -56.127933
  },
  {
    "id": "porto-vanila",
    "nombre": "Porto Vanila",
    "tipo": "Café",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8942586,
    "longitud": -56.1669284
  },
  {
    "id": "patrimonio",
    "nombre": "Patrimonio",
    "tipo": "Café",
    "direccion": "Juan Paullier 1294, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.90407,
    "longitud": -56.1676705
  },
  {
    "id": "starbucks-tres-cruces",
    "nombre": "Starbucks (Tres Cruces)",
    "tipo": "Café",
    "direccion": "Palmar, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.9010466,
    "longitud": -56.1649666,
    "comida": [
      "café",
      "sándwiches"
    ]
  },
  {
    "id": "bulka",
    "nombre": "Bulka",
    "tipo": "Café",
    "direccion": "Guipúzcoa 416, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9239436,
    "longitud": -56.1561398
  },
  {
    "id": "donut-city",
    "nombre": "Donut City",
    "tipo": "Café",
    "direccion": "21 de Setiembre 2689, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9159297,
    "longitud": -56.1589268
  },
  {
    "id": "sienna",
    "nombre": "Sienna",
    "tipo": "Café",
    "direccion": "Eduardo Acevedo 1046, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9103839,
    "longitud": -56.1741425
  },
  {
    "id": "paraiso-cafe",
    "nombre": "Paraíso Café",
    "tipo": "Café",
    "direccion": "Constituyente 1866, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9071212,
    "longitud": -56.1759629
  },
  {
    "id": "nonna",
    "nombre": "Nonna",
    "tipo": "Café",
    "direccion": "Juan Benito Blanco 1097, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9118159,
    "longitud": -56.1470858
  },
  {
    "id": "macoco-cafe",
    "nombre": "Macoco Café",
    "tipo": "Café",
    "direccion": "Maldonado 1775, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9085275,
    "longitud": -56.1767046
  },
  {
    "id": "escaramuza",
    "nombre": "Escaramuza",
    "tipo": "Café",
    "direccion": "Doctor Pablo de María 1185, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9064978,
    "longitud": -56.1710095,
    "comida": [
      "café"
    ]
  },
  {
    "id": "rincon-ruski-by-uruvarenik",
    "nombre": "Rincón Ruski by UruVarenik",
    "tipo": "Café",
    "direccion": "Durazno 1451, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9100074,
    "longitud": -56.1840241
  },
  {
    "id": "la-casa-de-abajo",
    "nombre": "La Casa de Abajo",
    "tipo": "Café",
    "direccion": "Nuestra Señora de la Encina 1663, Palermo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.909427,
    "longitud": -56.1790761
  },
  {
    "id": "chesterhouse",
    "nombre": "ChesterHouse",
    "tipo": "Café",
    "direccion": "Ciudadela 1397, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9051398,
    "longitud": -56.2001129
  },
  {
    "id": "bilu-guidai",
    "nombre": "Bilú Guidaí",
    "tipo": "Café",
    "direccion": "Soriano 757, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9083389,
    "longitud": -56.1997956
  },
  {
    "id": "starbucks-barrio-sur",
    "nombre": "Starbucks (Barrio Sur)",
    "tipo": "Café",
    "direccion": "Julio Herrera y Obes, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.906269,
    "longitud": -56.1946279,
    "comida": [
      "café"
    ]
  },
  {
    "id": "inocencio-cafe",
    "nombre": "Inocencio Café",
    "tipo": "Café",
    "direccion": "Constituyente 1794, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9067537,
    "longitud": -56.1776179
  },
  {
    "id": "iki",
    "nombre": "Iki",
    "tipo": "Café",
    "direccion": "Río Branco 1449, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.904444,
    "longitud": -56.1961571
  },
  {
    "id": "farmacia-cafe",
    "nombre": "Farmacia Café",
    "tipo": "Café",
    "direccion": "Cerrito 550, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9047418,
    "longitud": -56.2050893
  },
  {
    "id": "praga",
    "nombre": "Praga",
    "tipo": "Café",
    "direccion": "Plaza Independencia, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9061948,
    "longitud": -56.1985345
  },
  {
    "id": "starbucks-cordon",
    "nombre": "Starbucks (Cordón)",
    "tipo": "Café",
    "direccion": "Avenida 18 de Julio 1749, Cordón",
    "barrio": "Cordón",
    "ciudad": "Montevideo",
    "latitud": -34.9027983,
    "longitud": -56.178761
  },
  {
    "id": "healthyway",
    "nombre": "Healthyway",
    "tipo": "Café",
    "direccion": "Colonia 1260, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9048369,
    "longitud": -56.1889819
  },
  {
    "id": "oro-del-rhin-centro",
    "nombre": "Oro del Rhin (Centro)",
    "tipo": "Café",
    "direccion": "Colonia 887, Centro",
    "barrio": "Centro",
    "ciudad": "Montevideo",
    "latitud": -34.9052475,
    "longitud": -56.1972412
  },
  {
    "id": "cafe-vincent",
    "nombre": "Café Vincent",
    "tipo": "Café",
    "direccion": "Pedro Bustamante 1238, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9019612,
    "longitud": -56.1336018
  },
  {
    "id": "pivo-helados",
    "nombre": "Pivo Helados",
    "tipo": "Café",
    "direccion": "Avenida General Rivera 3245, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.9023077,
    "longitud": -56.1452692
  },
  {
    "id": "carmesi-cafe",
    "nombre": "Carmesí Café",
    "tipo": "Café",
    "direccion": "Simón Bolívar, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.9021068,
    "longitud": -56.158953
  },
  {
    "id": "soy-cafe",
    "nombre": "Soy Café",
    "tipo": "Café",
    "direccion": "Avenida General Rivera 2201, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9020028,
    "longitud": -56.167868
  },
  {
    "id": "the-lab",
    "nombre": "The Lab",
    "tipo": "Café",
    "direccion": "Avenida Luis Alberto de Herrera 1109, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9075626,
    "longitud": -56.1364042
  },
  {
    "id": "starbucks-punta-carretas",
    "nombre": "Starbucks (Punta Carretas)",
    "tipo": "Café",
    "direccion": "José Ellauri 606, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9192269,
    "longitud": -56.1560165
  },
  {
    "id": "tavoli",
    "nombre": "Tavoli",
    "tipo": "Café",
    "direccion": "Santiago de Anca 1420, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8945715,
    "longitud": -56.1114783
  },
  {
    "id": "bake",
    "nombre": "bake",
    "tipo": "Café",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Lomas de Solymar, Ciudad de la Costa",
    "barrio": "Lomas de Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8094487,
    "longitud": -55.9346632
  },
  {
    "id": "marantao",
    "nombre": "Marantao",
    "tipo": "Café",
    "direccion": "Ceibos 3508, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8261194,
    "longitud": -55.9561171
  },
  {
    "id": "sundari",
    "nombre": "Sundari",
    "tipo": "Café",
    "direccion": "Océano Atlántico, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8038576,
    "longitud": -55.9099416
  },
  {
    "id": "dorotea-s",
    "nombre": "Dorotea’s",
    "tipo": "Café",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8038662,
    "longitud": -55.9078778
  },
  {
    "id": "casa-cafe",
    "nombre": "Casa-Café",
    "tipo": "Café",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8038504,
    "longitud": -55.9059682
  },
  {
    "id": "cafe-del-museo",
    "nombre": "Café Del Museo",
    "tipo": "Café",
    "direccion": "Avenida Guillermo Pérez Butler, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8044116,
    "longitud": -55.9056327
  },
  {
    "id": "starbucks-solymar",
    "nombre": "Starbucks (Solymar)",
    "tipo": "Café",
    "direccion": "Ruta Interbalnearia General Líber Seregni, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8176706,
    "longitud": -55.9802312,
    "comida": [
      "café"
    ]
  },
  {
    "id": "cafe-rock",
    "nombre": "Cafe Rock",
    "tipo": "Café",
    "direccion": "Avenida Ingeniero Luis Giannattasio 233, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.831088,
    "longitud": -55.9741781
  },
  {
    "id": "fuentes",
    "nombre": "Fuentes",
    "tipo": "Café",
    "direccion": "Hernandarias, El Pinar, Ciudad de la Costa",
    "barrio": "El Pinar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.7988142,
    "longitud": -55.8901954
  },
  {
    "id": "saint-germain",
    "nombre": "Saint Germain",
    "tipo": "Café",
    "direccion": "Bulevar General Artigas 1229, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9051122,
    "longitud": -56.1641262
  },
  {
    "id": "bano-publico-santiago-vazquez",
    "nombre": "Baño público (Santiago Vázquez)",
    "tipo": "Baño",
    "direccion": "Avenida Luis Batlle Berres, Santiago Vázquez",
    "barrio": "Santiago Vázquez",
    "ciudad": "Montevideo",
    "latitud": -34.7859189,
    "longitud": -56.354682,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-cerro",
    "nombre": "Baño público (Cerro)",
    "tipo": "Baño",
    "direccion": "Romeo Bezzoso Tabárez, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.8734501,
    "longitud": -56.2496542,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-bolivar",
    "nombre": "Baño público (Bolívar)",
    "tipo": "Baño",
    "direccion": "Domingo J. Cruz, Bolívar",
    "barrio": "Bolívar",
    "ciudad": "Montevideo",
    "latitud": -34.8716703,
    "longitud": -56.154124,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-parque-batlle",
    "nombre": "Baño público (Parque Batlle)",
    "tipo": "Baño",
    "direccion": "Líber Arce, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.8992893,
    "longitud": -56.1450795,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-prado",
    "nombre": "Baño público (Prado)",
    "tipo": "Baño",
    "direccion": "Sendero Semicircular 1 Botánico, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8581992,
    "longitud": -56.199972,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-parque-miramar",
    "nombre": "Baño público (Parque Miramar)",
    "tipo": "Baño",
    "direccion": "Avenida Ingeniero Luis Giannattasio, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8655118,
    "longitud": -56.0240446,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-punta-gorda",
    "nombre": "Baño público (Punta Gorda)",
    "tipo": "Baño",
    "direccion": "Rambla O'Higgins, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.895474,
    "longitud": -56.0925831,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-paso-molino",
    "nombre": "Baño público (Paso Molino)",
    "tipo": "Baño",
    "direccion": "Avenida Agraciada, Paso Molino",
    "barrio": "Paso Molino",
    "ciudad": "Montevideo",
    "latitud": -34.8609904,
    "longitud": -56.2135819,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-parque-rodo",
    "nombre": "Baño público (Parque Rodó)",
    "tipo": "Baño",
    "direccion": "Avenida Gonzalo Ramírez, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9115291,
    "longitud": -56.1667916,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-malvin",
    "nombre": "Baño público (Malvín)",
    "tipo": "Baño",
    "direccion": "Sendero paralela a Bolivia, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8771678,
    "longitud": -56.0913322,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-punta-carretas",
    "nombre": "Baño público (Punta Carretas)",
    "tipo": "Baño",
    "direccion": "Senda Nelson Landoni, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9167721,
    "longitud": -56.1674882,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-pocitos",
    "nombre": "Baño público (Pocitos)",
    "tipo": "Baño",
    "direccion": "Rambla República del Perú, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9105326,
    "longitud": -56.1439906,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-santiago-vazquez-avenida-luis-batlle-berres",
    "nombre": "Baño público (Santiago Vázquez, Avenida Luis Batlle Berres)",
    "tipo": "Baño",
    "direccion": "Avenida Luis Batlle Berres, Santiago Vázquez",
    "barrio": "Santiago Vázquez",
    "ciudad": "Montevideo",
    "latitud": -34.7945372,
    "longitud": -56.33309,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-parque-batlle-dolores-pereira-de-rosell",
    "nombre": "Baño público (Parque Batlle, Dolores Pereira de Rosell)",
    "tipo": "Baño",
    "direccion": "Dolores Pereira de Rosell, Parque Batlle",
    "barrio": "Parque Batlle",
    "ciudad": "Montevideo",
    "latitud": -34.9022518,
    "longitud": -56.1438522,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-prado-sendero-6-botanico",
    "nombre": "Baño público (Prado, Sendero 6 Botánico)",
    "tipo": "Baño",
    "direccion": "Sendero 6 Botánico, Prado",
    "barrio": "Prado",
    "ciudad": "Montevideo",
    "latitud": -34.8610995,
    "longitud": -56.1984658,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-punta-gorda-rambla-o-higgins",
    "nombre": "Baño público (Punta Gorda, Rambla O'Higgins)",
    "tipo": "Baño",
    "direccion": "Rambla O'Higgins, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8969976,
    "longitud": -56.098655,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-parque-rodo-doctor-antonio-maria-rodriguez",
    "nombre": "Baño público (Parque Rodó, Doctor Antonio María Rodríguez)",
    "tipo": "Baño",
    "direccion": "Doctor Antonio María Rodríguez, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.913745,
    "longitud": -56.1687542,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-malvin-joaquin-torres-garcia",
    "nombre": "Baño público (Malvín, Joaquín Torres García)",
    "tipo": "Baño",
    "direccion": "Joaquín Torres García, Malvín",
    "barrio": "Malvín",
    "ciudad": "Montevideo",
    "latitud": -34.8810571,
    "longitud": -56.0927307,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-punta-carretas-sendero-fay-crocker",
    "nombre": "Baño público (Punta Carretas, Sendero Fay Crocker)",
    "tipo": "Baño",
    "direccion": "Sendero Fay Crocker, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9218245,
    "longitud": -56.1653839,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-pocitos-rambla-presidente-charles-de-gaulle",
    "nombre": "Baño público (Pocitos, Rambla Presidente Charles de Gaulle)",
    "tipo": "Baño",
    "direccion": "Rambla Presidente Charles de Gaulle, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9098142,
    "longitud": -56.1420671,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-parque-rodo-rambla-wilson",
    "nombre": "Baño público (Parque Rodó, Rambla Wilson)",
    "tipo": "Baño",
    "direccion": "Rambla Wilson, Parque Rodó",
    "barrio": "Parque Rodó",
    "ciudad": "Montevideo",
    "latitud": -34.9168438,
    "longitud": -56.1692568,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-punta-carretas-rambla-wilson",
    "nombre": "Baño público (Punta Carretas, Rambla Wilson)",
    "tipo": "Baño",
    "direccion": "Rambla Wilson, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9236674,
    "longitud": -56.1659697,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-pocitos-rambla-republica-del-peru",
    "nombre": "Baño público (Pocitos, Rambla República del Perú)",
    "tipo": "Baño",
    "direccion": "Rambla República del Perú, Pocitos",
    "barrio": "Pocitos",
    "ciudad": "Montevideo",
    "latitud": -34.9150209,
    "longitud": -56.1484676,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "bano-publico-punta-carretas-jawaharlal-pandit-nehru",
    "nombre": "Baño público (Punta Carretas, Jawaharlal Pandit Nehru)",
    "tipo": "Baño",
    "direccion": "Jawaharlal Pandit Nehru, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9209566,
    "longitud": -56.1546263,
    "fuente": "OpenStreetMap: baño público (amenity=toilets)"
  },
  {
    "id": "costa-urbana-shopping-bano",
    "nombre": "Costa Urbana Shopping (baño)",
    "tipo": "Baño",
    "direccion": "Avenida General José Artigas, San José de Carrasco, Ciudad de la Costa",
    "barrio": "San José de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8409537,
    "longitud": -55.9941516,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "almenara-mall-bano",
    "nombre": "Almenara Mall (baño)",
    "tipo": "Baño",
    "direccion": "Ruta Interbalnearia General Líber Seregni, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8268744,
    "longitud": -55.9973379,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "portal-americas-bano",
    "nombre": "Portal Américas (baño)",
    "tipo": "Baño",
    "direccion": "Avenida de las Américas 6000, Parque Miramar, Ciudad de la Costa",
    "barrio": "Parque Miramar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8700656,
    "longitud": -56.0311692,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "portones-shopping-bano",
    "nombre": "Portones Shopping (baño)",
    "tipo": "Baño",
    "direccion": "Avenida Italia 5775, Punta Gorda",
    "barrio": "Punta Gorda",
    "ciudad": "Montevideo",
    "latitud": -34.8812008,
    "longitud": -56.0808727,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "nuevocentro-shopping-bano",
    "nombre": "Nuevocentro Shopping (baño)",
    "tipo": "Baño",
    "direccion": "Avenida Luis Alberto de Herrera, Jacinto Vera",
    "barrio": "Jacinto Vera",
    "ciudad": "Montevideo",
    "latitud": -34.8688546,
    "longitud": -56.1697834,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "montevideo-shopping-bano",
    "nombre": "Montevideo Shopping (baño)",
    "tipo": "Baño",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "barrio": "Buceo",
    "ciudad": "Montevideo",
    "latitud": -34.9030628,
    "longitud": -56.1363655,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "plaza-italia-shopping-outlet-bano",
    "nombre": "Plaza Italia Shopping Outlet (baño)",
    "tipo": "Baño",
    "direccion": "Avenida Italia 4206, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8880522,
    "longitud": -56.1178276,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "shopping-tres-cruces-bano",
    "nombre": "Shopping Tres Cruces (baño)",
    "tipo": "Baño",
    "direccion": "Bulevar General Artigas 1825, Tres Cruces",
    "barrio": "Tres Cruces",
    "ciudad": "Montevideo",
    "latitud": -34.8937958,
    "longitud": -56.1664023,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "punta-carretas-shopping-bano",
    "nombre": "Punta Carretas Shopping (baño)",
    "tipo": "Baño",
    "direccion": "Víctor Soliño, Punta Carretas",
    "barrio": "Punta Carretas",
    "ciudad": "Montevideo",
    "latitud": -34.9239559,
    "longitud": -56.158593,
    "fuente": "OpenStreetMap: el lugar tiene baño (toilets=yes)"
  },
  {
    "id": "las-piedras-shopping-bano",
    "nombre": "Las Piedras Shopping (baño)",
    "tipo": "Baño",
    "direccion": "Sauce, Las Piedras",
    "barrio": "Las Piedras",
    "ciudad": "Las Piedras",
    "latitud": -34.7253315,
    "longitud": -56.2036048,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "intercambiador-belloni-bano",
    "nombre": "Intercambiador Belloni (baño)",
    "tipo": "Baño",
    "direccion": "Avenida 8 de Octubre, Flor de Maroñas",
    "barrio": "Flor de Maroñas",
    "ciudad": "Montevideo",
    "latitud": -34.8556102,
    "longitud": -56.1326495,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "via-disegno-bano",
    "nombre": "Via Disegno (baño)",
    "tipo": "Baño",
    "direccion": "Camino de los Grillos, Parque de Carrasco, Ciudad de la Costa",
    "barrio": "Parque de Carrasco",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8441774,
    "longitud": -56.0164403,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "terminal-del-cerro-bano",
    "nombre": "Terminal del Cerro (baño)",
    "tipo": "Baño",
    "direccion": "Doctor Pedro Castellino, Cerro",
    "barrio": "Cerro",
    "ciudad": "Montevideo",
    "latitud": -34.873439,
    "longitud": -56.2490217,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "terminal-colon-bano",
    "nombre": "Terminal Colón (baño)",
    "tipo": "Baño",
    "direccion": "Vehicular/ Peatonal, Colón",
    "barrio": "Colón",
    "ciudad": "Montevideo",
    "latitud": -34.7995396,
    "longitud": -56.2223665,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "mall-del-lago-bano",
    "nombre": "Mall del Lago (baño)",
    "tipo": "Baño",
    "direccion": "Río Santa Lucía, Lagomar, Ciudad de la Costa",
    "barrio": "Lagomar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8387865,
    "longitud": -55.9881339,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "galeria-marquez-castro-bano",
    "nombre": "Galería Márquez Castro (baño)",
    "tipo": "Baño",
    "direccion": "Avenida Eduardo Márquez Castro, Solymar, Ciudad de la Costa",
    "barrio": "Solymar",
    "ciudad": "Ciudad de la Costa",
    "latitud": -34.8225928,
    "longitud": -55.9582248,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "terminal-baltasar-brum-bano",
    "nombre": "Terminal Baltasar Brum (baño)",
    "tipo": "Baño",
    "direccion": "Andes, Barrio Sur",
    "barrio": "Barrio Sur",
    "ciudad": "Montevideo",
    "latitud": -34.9001731,
    "longitud": -56.1971876,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "terminal-plaza-espana-bano",
    "nombre": "Terminal Plaza España (baño)",
    "tipo": "Baño",
    "direccion": "Camacuá, Ciudad Vieja",
    "barrio": "Ciudad Vieja",
    "ciudad": "Montevideo",
    "latitud": -34.9096369,
    "longitud": -56.201515,
    "fuente": "OpenStreetMap (shopping o terminal); el mapa no dice si el baño es público",
    "sinConfirmar": "el mapa no confirma que el baño esté abierto al público"
  },
  {
    "id": "cementerio-del-norte",
    "nombre": "Cementerio Del Norte",
    "tipo": "Cementerio",
    "direccion": "Aires Puros, Montevideo",
    "barrio": "Aires Puros",
    "ciudad": "Montevideo",
    "latitud": -34.8419451,
    "longitud": -56.1787544
  },
  {
    "id": "cementerio-central",
    "nombre": "Cementerio Central",
    "tipo": "Cementerio",
    "direccion": "Palermo, Montevideo",
    "barrio": "Palermo",
    "ciudad": "Montevideo",
    "latitud": -34.9131956,
    "longitud": -56.1874516
  },
  {
    "id": "cementerio-de-la-teja",
    "nombre": "Cementerio de La Teja",
    "tipo": "Cementerio",
    "direccion": "La Teja, Montevideo",
    "barrio": "La Teja",
    "ciudad": "Montevideo",
    "latitud": -34.8578116,
    "longitud": -56.2298074
  }
]

/** Los que quedaron afuera porque el mapa no los pudo confirmar. */
export const QUEDARON_AFUERA: readonly string[] = [
  "Plaza Cagancha (Plaza Libertad): el mapa encontró uno con ese nombre pero en otro barrio (Ituzaingó, Montevideo), no en Centro",
  "Plaza Seregni: el mapa no lo encontró por su nombre",
  "Plaza Virgilio: el mapa devolvió otro lugar (\"Plaza de la Armada\")",
  "Café Bacacay: el mapa devolvió otro lugar (\"Nectarena. Smoothies & Café Tradicional\")",
  "Bar Fun Fun: el mapa no lo encontró por su nombre",
  "Bar Los Yuyos: el mapa devolvió otro lugar (\"Los Yuyos\")",
  "Confitería La Americana: el mapa devolvió otro lugar (\"Edificio Confitería La Americana\")",
  "El Hacha: el mapa no lo encontró por su nombre",
  "Café Las Misiones: el mapa devolvió otro lugar (\"Las Misiones\")",
  "Géant (Jacinto Vera): revisado a mano: el mapa la pone en Gualeguay 3350 y no pudimos confirmar que sea un Géant"
]
