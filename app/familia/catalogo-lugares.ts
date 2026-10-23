// Catálogo de lugares comunes (Montevideo, Ciudad de la Costa y Las Piedras) que /familia le puede SUGERIR al hijo.
// Lo genera scripts/verificar-catalogo.ts: cada lugar se verificó con el mapa (lib/mapas.ts).
// La IA nunca inventa lugares: solo puede sugerir los de esta lista. No editar a mano.
// Verificado el 2026-10-23.

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
    "id": "redpagos-malvin-nuevo",
    "nombre": "RedPagos (Malvín Nuevo)",
    "tipo": "Pagos",
    "direccion": "Avenida Italia 4206, Malvín Nuevo",
    "barrio": "Malvín Nuevo",
    "ciudad": "Montevideo",
    "latitud": -34.8879241,
    "longitud": -56.1177325
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
    "id": "parroquia-san-miguel-arcangel",
    "nombre": "Parroquia San Miguel Arcángel",
    "tipo": "Iglesia",
    "direccion": "Concepción Arenal 1893, La Figurita",
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
  "Café Las Misiones: el mapa devolvió otro lugar (\"Las Misiones\")"
]
