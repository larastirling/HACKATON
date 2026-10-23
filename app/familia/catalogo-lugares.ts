// Catálogo de lugares comunes de Montevideo que /familia le puede SUGERIR al hijo.
  // Lo genera scripts/verificar-catalogo.ts: cada lugar se verificó con el mapa (lib/mapas.ts).
  // La IA nunca inventa lugares: solo puede sugerir los de esta lista. No editar a mano.
  // Verificado el 2026-10-23.

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
    "latitud": -34.894275,
    "longitud": -56.1630004
  },
  {
    "id": "hospital-italiano",
    "nombre": "Hospital Italiano",
    "tipo": "Salud",
    "direccion": "Bulevar Artigas 1632",
    "latitud": -34.896532,
    "longitud": -56.1645594
  },
  {
    "id": "hospital-maciel",
    "nombre": "Hospital Maciel",
    "tipo": "Salud",
    "direccion": "25 de Mayo 174",
    "latitud": -34.9080025,
    "longitud": -56.2120333
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
    "direccion": "Asilo, Unión",
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
    "id": "hospital-policial",
    "nombre": "Hospital Policial",
    "tipo": "Salud",
    "direccion": "Bulevar José Batlle y Ordóñez 3574, Bolívar",
    "latitud": -34.8685636,
    "longitud": -56.1607557
  },
  {
    "id": "hospital-militar",
    "nombre": "Hospital Militar",
    "tipo": "Salud",
    "direccion": "Avenida 8 de Octubre, La Blanqueada",
    "latitud": -34.8845639,
    "longitud": -56.1540567
  },
  {
    "id": "hospital-espanol",
    "nombre": "Hospital Español",
    "tipo": "Salud",
    "direccion": "Avenida General José Garibaldi 1729, La Figurita",
    "latitud": -34.8750288,
    "longitud": -56.1814005
  },
  {
    "id": "sanatorio-smi",
    "nombre": "Sanatorio SMI",
    "tipo": "Salud",
    "direccion": "Avenida Luis Alberto de Herrera 2275, La Blanqueada",
    "latitud": -34.8854599,
    "longitud": -56.1503468
  },
  {
    "id": "bps-atencion-ciudadana",
    "nombre": "BPS (Atención Ciudadana)",
    "tipo": "Trámites",
    "direccion": "Colonia 1851",
    "latitud": -34.9007962,
    "longitud": -56.176835
  },
  {
    "id": "intendencia-de-montevideo",
    "nombre": "Intendencia de Montevideo",
    "tipo": "Trámites",
    "direccion": "Avenida 18 de Julio 1360",
    "latitud": -34.9056963,
    "longitud": -56.186173
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
    "direccion": "Avenida 18 de Julio 1969, Cordón",
    "latitud": -34.900729,
    "longitud": -56.1733151
  },
  {
    "id": "montevideo-shopping",
    "nombre": "Montevideo Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Luis Alberto de Herrera 1290",
    "latitud": -34.904097,
    "longitud": -56.137255
  },
  {
    "id": "punta-carretas-shopping",
    "nombre": "Punta Carretas Shopping",
    "tipo": "Shopping",
    "direccion": "José Ellauri 350",
    "latitud": -34.9236262,
    "longitud": -56.159748
  },
  {
    "id": "tres-cruces-shopping-y-terminal",
    "nombre": "Tres Cruces (shopping y terminal)",
    "tipo": "Shopping",
    "direccion": "Bulevar Artigas 1825",
    "latitud": -34.8943095,
    "longitud": -56.165202
  },
  {
    "id": "portones-shopping",
    "nombre": "Portones Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Italia 5775",
    "latitud": -34.8824435,
    "longitud": -56.0827562
  },
  {
    "id": "nuevocentro-shopping",
    "nombre": "Nuevocentro Shopping",
    "tipo": "Shopping",
    "direccion": "Avenida Luis Alberto de Herrera 3365",
    "latitud": -34.8688111,
    "longitud": -56.168912
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
    "id": "plaza-zabala",
    "nombre": "Plaza Zabala",
    "tipo": "Plaza",
    "direccion": "Ciudad Vieja, Montevideo",
    "latitud": -34.9076019,
    "longitud": -56.2081314
  },
  {
    "id": "plaza-fabini",
    "nombre": "Plaza Fabini",
    "tipo": "Plaza",
    "direccion": "Centro, Montevideo",
    "latitud": -34.9056266,
    "longitud": -56.1942305
  },
  {
    "id": "plaza-de-los-treinta-y-tres",
    "nombre": "Plaza de los Treinta y Tres",
    "tipo": "Plaza",
    "direccion": "Cordón, Montevideo",
    "latitud": -34.9030168,
    "longitud": -56.1803077
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
    "id": "parque-villa-biarritz",
    "nombre": "Parque Villa Biarritz",
    "tipo": "Plaza",
    "direccion": "Punta Carretas, Montevideo",
    "latitud": -34.9211501,
    "longitud": -56.1539465
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
    "id": "parque-rivera",
    "nombre": "Parque Rivera",
    "tipo": "Plaza",
    "direccion": "Malvín, Montevideo",
    "latitud": -34.8797061,
    "longitud": -56.0921249
  },
  {
    "id": "parque-baroffio",
    "nombre": "Parque Baroffio",
    "tipo": "Plaza",
    "direccion": "Malvín, Montevideo",
    "latitud": -34.8939581,
    "longitud": -56.0901465
  },
  {
    "id": "plaza-de-la-armada",
    "nombre": "Plaza de la Armada",
    "tipo": "Plaza",
    "direccion": "Punta Gorda, Montevideo",
    "latitud": -34.8989781,
    "longitud": -56.0811901
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
    "id": "parque-capurro",
    "nombre": "Parque Capurro",
    "tipo": "Plaza",
    "direccion": "Capurro, Montevideo",
    "latitud": -34.8729595,
    "longitud": -56.2144365
  },
  {
    "id": "parque-vaz-ferreira",
    "nombre": "Parque Vaz Ferreira",
    "tipo": "Plaza",
    "direccion": "Cerro, Montevideo",
    "latitud": -34.8959705,
    "longitud": -56.2578414
  },
  {
    "id": "plaza-samuel-lafone",
    "nombre": "Plaza Samuel Lafone",
    "tipo": "Plaza",
    "direccion": "Tres Ombúes, Montevideo",
    "latitud": -34.8676301,
    "longitud": -56.2371127
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
    "latitud": -34.9074063,
    "longitud": -56.2012162
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
    "latitud": -34.8867762,
    "longitud": -56.1839119
  },
  {
    "id": "farmashop-punta-carretas",
    "nombre": "Farmashop (Punta Carretas)",
    "tipo": "Farmacia",
    "direccion": "Luis Franzini 806, Punta Carretas",
    "latitud": -34.9161293,
    "longitud": -56.1585115
  },
  {
    "id": "farmashop-centro",
    "nombre": "Farmashop (Centro)",
    "tipo": "Farmacia",
    "direccion": "San José 1052, Centro",
    "latitud": -34.9070711,
    "longitud": -56.1934197
  },
  {
    "id": "farmashop-cordon",
    "nombre": "Farmashop (Cordón)",
    "tipo": "Farmacia",
    "direccion": "Colonia 1800, Cordón",
    "latitud": -34.9016448,
    "longitud": -56.1778873
  },
  {
    "id": "farmashop-malvin",
    "nombre": "Farmashop (Malvín)",
    "tipo": "Farmacia",
    "direccion": "Avenida Enrique Legrand 5085, Malvín",
    "latitud": -34.8895577,
    "longitud": -56.0988068
  },
  {
    "id": "farmashop-buceo",
    "nombre": "Farmashop (Buceo)",
    "tipo": "Farmacia",
    "direccion": "Avenida Mariscal Francisco Solano López, Buceo",
    "latitud": -34.8921033,
    "longitud": -56.1254065
  },
  {
    "id": "farmashop-union",
    "nombre": "Farmashop (Unión)",
    "tipo": "Farmacia",
    "direccion": "Avenida 8 de Octubre, Unión",
    "latitud": -34.8786437,
    "longitud": -56.1472606
  },
  {
    "id": "farmashop-tres-cruces",
    "nombre": "Farmashop (Tres Cruces)",
    "tipo": "Farmacia",
    "direccion": "Avenida Italia 2490, Tres Cruces",
    "latitud": -34.8936989,
    "longitud": -56.1615849
  },
  {
    "id": "farmacia-san-roque-pocitos",
    "nombre": "Farmacia San Roque (Pocitos)",
    "tipo": "Farmacia",
    "direccion": "Gabriel Pereira 3298, Pocitos",
    "latitud": -34.9112263,
    "longitud": -56.1462412
  },
  {
    "id": "farmacia-san-roque-punta-carretas",
    "nombre": "Farmacia San Roque (Punta Carretas)",
    "tipo": "Farmacia",
    "direccion": "José Ellauri 512, Punta Carretas",
    "latitud": -34.9211904,
    "longitud": -56.1572953
  },
  {
    "id": "farmacia-san-roque-centro",
    "nombre": "Farmacia San Roque (Centro)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 1252, Centro",
    "latitud": -34.9058643,
    "longitud": -56.188981
  },
  {
    "id": "farmacia-san-roque-cordon",
    "nombre": "Farmacia San Roque (Cordón)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio 1799, Cordón",
    "latitud": -34.9023056,
    "longitud": -56.1774454
  },
  {
    "id": "farmacia-san-roque-malvin",
    "nombre": "Farmacia San Roque (Malvín)",
    "tipo": "Farmacia",
    "direccion": "Missisipi 1647, Malvín",
    "latitud": -34.8914191,
    "longitud": -56.0963442
  },
  {
    "id": "farmacia-san-roque-buceo",
    "nombre": "Farmacia San Roque (Buceo)",
    "tipo": "Farmacia",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "latitud": -34.9031978,
    "longitud": -56.1370059
  },
  {
    "id": "farmacia-san-roque-carrasco",
    "nombre": "Farmacia San Roque (Carrasco)",
    "tipo": "Farmacia",
    "direccion": "Avenida Alfredo Arocena 1681, Carrasco",
    "latitud": -34.8867722,
    "longitud": -56.0586393
  },
  {
    "id": "farmacia-el-tunel-pocitos",
    "nombre": "Farmacia El Túnel (Pocitos)",
    "tipo": "Farmacia",
    "direccion": "26 de Marzo 3397, Pocitos",
    "latitud": -34.9061866,
    "longitud": -56.1396877
  },
  {
    "id": "farmacia-el-tunel-punta-carretas",
    "nombre": "Farmacia El Túnel (Punta Carretas)",
    "tipo": "Farmacia",
    "direccion": "21 de Setiembre 2816, Punta Carretas",
    "latitud": -34.9187319,
    "longitud": -56.1565129
  },
  {
    "id": "farmacia-el-tunel-malvin",
    "nombre": "Farmacia El Túnel (Malvín)",
    "tipo": "Farmacia",
    "direccion": "Hipólito Yrigoyen 1599, Malvín Nuevo",
    "latitud": -34.8914295,
    "longitud": -56.1090522
  },
  {
    "id": "farmacia-el-tunel-carrasco",
    "nombre": "Farmacia El Túnel (Carrasco)",
    "tipo": "Farmacia",
    "direccion": "Avenida Doctor Juan Bautista Alberdi 6597, Carrasco Norte",
    "latitud": -34.8796535,
    "longitud": -56.0636243
  },
  {
    "id": "farmacia-el-tunel-barrio-sur",
    "nombre": "Farmacia El Túnel (Barrio Sur)",
    "tipo": "Farmacia",
    "direccion": "Avenida 18 de Julio, Barrio Sur",
    "latitud": -34.9061176,
    "longitud": -56.1960202
  },
  {
    "id": "disco-pocitos",
    "nombre": "Disco (Pocitos)",
    "tipo": "Supermercado",
    "direccion": "Avenida Doctor Francisco Soca 1318, Pocitos",
    "latitud": -34.9055318,
    "longitud": -56.1547295
  },
  {
    "id": "disco-punta-carretas",
    "nombre": "Disco (Punta Carretas)",
    "tipo": "Supermercado",
    "direccion": "Obligado 968, Punta Carretas",
    "latitud": -34.9132726,
    "longitud": -56.1601252
  },
  {
    "id": "disco-centro",
    "nombre": "Disco (Centro)",
    "tipo": "Supermercado",
    "direccion": "Ejido 1530, Centro",
    "latitud": -34.9021589,
    "longitud": -56.1867062
  },
  {
    "id": "disco-cordon",
    "nombre": "Disco (Cordón)",
    "tipo": "Supermercado",
    "direccion": "Avenida Daniel Fernández Crespo 1727, Cordón",
    "latitud": -34.8990703,
    "longitud": -56.1776808
  },
  {
    "id": "disco-buceo",
    "nombre": "Disco (Buceo)",
    "tipo": "Supermercado",
    "direccion": "Avenida Mariscal Francisco Solano López, Buceo",
    "latitud": -34.8916336,
    "longitud": -56.1250928
  },
  {
    "id": "devoto-centro",
    "nombre": "Devoto (Centro)",
    "tipo": "Supermercado",
    "direccion": "Carlos Quijano, Centro",
    "latitud": -34.9084842,
    "longitud": -56.1887585
  },
  {
    "id": "devoto-malvin",
    "nombre": "Devoto (Malvín)",
    "tipo": "Supermercado",
    "direccion": "Hipólito Yrigoyen 1444, Malvín Nuevo",
    "latitud": -34.8948828,
    "longitud": -56.1075481
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
    "id": "devoto-union",
    "nombre": "Devoto (Unión)",
    "tipo": "Supermercado",
    "direccion": "Avenida 8 de Octubre 3621, Unión",
    "latitud": -34.8765368,
    "longitud": -56.1437821
  },
  {
    "id": "devoto-punta-gorda",
    "nombre": "Devoto (Punta Gorda)",
    "tipo": "Supermercado",
    "direccion": "Avenida Italia 5779, Punta Gorda",
    "latitud": -34.8803924,
    "longitud": -56.0808892
  },
  {
    "id": "tienda-inglesa-pocitos",
    "nombre": "Tienda Inglesa (Pocitos)",
    "tipo": "Supermercado",
    "direccion": "Libertad 2479, Pocitos",
    "latitud": -34.9116169,
    "longitud": -56.1597503
  },
  {
    "id": "tienda-inglesa-cordon",
    "nombre": "Tienda Inglesa (Cordón)",
    "tipo": "Supermercado",
    "direccion": "Mercedes 1615, Cordón",
    "latitud": -34.8994948,
    "longitud": -56.1755488
  },
  {
    "id": "tienda-inglesa-buceo",
    "nombre": "Tienda Inglesa (Buceo)",
    "tipo": "Supermercado",
    "direccion": "Avenida Luis Alberto de Herrera 1290, Buceo",
    "latitud": -34.90265,
    "longitud": -56.1363019
  },
  {
    "id": "tienda-inglesa-carrasco",
    "nombre": "Tienda Inglesa (Carrasco)",
    "tipo": "Supermercado",
    "direccion": "Doctor Alejandro Schroeder 6436, Carrasco",
    "latitud": -34.8879461,
    "longitud": -56.0582581
  },
  {
    "id": "tienda-inglesa-union",
    "nombre": "Tienda Inglesa (Unión)",
    "tipo": "Supermercado",
    "direccion": "Avenida 8 de Octubre 4086, Unión",
    "latitud": -34.8708636,
    "longitud": -56.1349453
  },
  {
    "id": "ta-ta-pocitos",
    "nombre": "Ta-Ta (Pocitos)",
    "tipo": "Supermercado",
    "direccion": "Libertad 2545, Pocitos",
    "latitud": -34.9106252,
    "longitud": -56.158107
  },
  {
    "id": "ta-ta-punta-carretas",
    "nombre": "Ta-Ta (Punta Carretas)",
    "tipo": "Supermercado",
    "direccion": "José H. Figueira 2301, Punta Carretas",
    "latitud": -34.9156954,
    "longitud": -56.1638021
  },
  {
    "id": "ta-ta-centro",
    "nombre": "Ta-Ta (Centro)",
    "tipo": "Supermercado",
    "direccion": "Avenida 18 de Julio 1280, Centro",
    "latitud": -34.9058685,
    "longitud": -56.1884551
  },
  {
    "id": "ta-ta-cordon",
    "nombre": "Ta-Ta (Cordón)",
    "tipo": "Supermercado",
    "direccion": "Constituyente 1570, Cordón",
    "latitud": -34.906057,
    "longitud": -56.1817806
  },
  {
    "id": "ta-ta-malvin",
    "nombre": "Ta-Ta (Malvín)",
    "tipo": "Supermercado",
    "direccion": "Camino Carrasco 4656, Malvín Norte",
    "latitud": -34.8719626,
    "longitud": -56.1176035
  },
  {
    "id": "geant-sayago",
    "nombre": "Géant (Sayago)",
    "tipo": "Supermercado",
    "direccion": "Camino Ariel 4626, Sayago",
    "latitud": -34.8353493,
    "longitud": -56.2109722
  },
  {
    "id": "brou-pocitos",
    "nombre": "BROU (Pocitos)",
    "tipo": "Banco",
    "direccion": "Avenida Brasil 3049, Pocitos",
    "latitud": -34.9130769,
    "longitud": -56.1499841
  },
  {
    "id": "brou-punta-carretas",
    "nombre": "BROU (Punta Carretas)",
    "tipo": "Banco",
    "direccion": "21 de Setiembre 2851, Punta Carretas",
    "latitud": -34.918878,
    "longitud": -56.155787
  },
  {
    "id": "brou-centro",
    "nombre": "BROU (Centro)",
    "tipo": "Banco",
    "direccion": "Avenida General Rondeau 1754, Centro",
    "latitud": -34.9038451,
    "longitud": -56.1914551
  },
  {
    "id": "brou-cordon",
    "nombre": "BROU (Cordón)",
    "tipo": "Banco",
    "direccion": "Avenida 18 de Julio 1670, Cordón",
    "latitud": -34.903997,
    "longitud": -56.1797357
  },
  {
    "id": "brou-buceo",
    "nombre": "BROU (Buceo)",
    "tipo": "Banco",
    "direccion": "Solferino 4098, Buceo",
    "latitud": -34.8874604,
    "longitud": -56.1263957
  },
  {
    "id": "brou-carrasco",
    "nombre": "BROU (Carrasco)",
    "tipo": "Banco",
    "direccion": "Avenida Alfredo Arocena 1637, Carrasco",
    "latitud": -34.8879936,
    "longitud": -56.0579885
  },
  {
    "id": "brou-prado",
    "nombre": "BROU (Prado)",
    "tipo": "Banco",
    "direccion": "Avenida Joaquín Suárez 3781, Prado",
    "latitud": -34.8587655,
    "longitud": -56.1965791
  },
  {
    "id": "bps-cordon",
    "nombre": "BPS (Cordón)",
    "tipo": "Trámites",
    "direccion": "Colonia 1921, Cordón",
    "latitud": -34.8999769,
    "longitud": -56.1751261
  },
  {
    "id": "bps-ciudad-vieja",
    "nombre": "BPS (Ciudad Vieja)",
    "tipo": "Trámites",
    "direccion": "Sarandí 570, Ciudad Vieja",
    "latitud": -34.9071076,
    "longitud": -56.2034117
  },
  {
    "id": "bps-belvedere",
    "nombre": "BPS (Belvedere)",
    "tipo": "Trámites",
    "direccion": "Juan B. Pandiani 26 BIS, Belvedere",
    "latitud": -34.8546256,
    "longitud": -56.2224329
  },
  {
    "id": "casmu-malvin",
    "nombre": "CASMU (Malvín)",
    "tipo": "Salud",
    "direccion": "Avenida Italia, Malvín",
    "latitud": -34.8835632,
    "longitud": -56.0836616
  },
  {
    "id": "casmu-colon",
    "nombre": "CASMU (Colón)",
    "tipo": "Salud",
    "direccion": "Avenida Lezica 5704, Colón",
    "latitud": -34.804216,
    "longitud": -56.2240559
  },
  {
    "id": "casmu-tres-cruces",
    "nombre": "CASMU (Tres Cruces)",
    "tipo": "Salud",
    "direccion": "Bulevar General Artigas 1910, Tres Cruces",
    "latitud": -34.8924106,
    "longitud": -56.1649706
  },
  {
    "id": "asociacion-espanola-prado",
    "nombre": "Asociación Española (Prado)",
    "tipo": "Salud",
    "direccion": "Avenida 19 de Abril 3322, Prado",
    "latitud": -34.8686328,
    "longitud": -56.2044088
  },
  {
    "id": "asociacion-espanola-colon",
    "nombre": "Asociación Española (Colón)",
    "tipo": "Salud",
    "direccion": "Margarita, Colón",
    "latitud": -34.8025152,
    "longitud": -56.2241313
  },
  {
    "id": "asociacion-espanola-paso-molino",
    "nombre": "Asociación Española (Paso Molino)",
    "tipo": "Salud",
    "direccion": "Doctor Pedro Visca 4223, Paso Molino",
    "latitud": -34.8563375,
    "longitud": -56.2218356
  },
  {
    "id": "medica-uruguaya-tres-ombues",
    "nombre": "Médica Uruguaya (Tres Ombúes)",
    "tipo": "Salud",
    "direccion": "Avenida Carlos María Ramírez, Tres Ombúes",
    "latitud": -34.8679376,
    "longitud": -56.2387644
  },
  {
    "id": "medica-uruguaya-colon",
    "nombre": "Médica Uruguaya (Colón)",
    "tipo": "Salud",
    "direccion": "Avenida General Eugenio Garzón 1907, Colón",
    "latitud": -34.806193,
    "longitud": -56.2223104
  },
  {
    "id": "medica-uruguaya-perez-castellanos",
    "nombre": "Médica Uruguaya (Pérez Castellanos)",
    "tipo": "Salud",
    "direccion": "Avenida General Flores, Pérez Castellanos",
    "latitud": -34.8531832,
    "longitud": -56.1613646
  },
  {
    "id": "cosem-malvin",
    "nombre": "COSEM (Malvín)",
    "tipo": "Salud",
    "direccion": "Avenida Italia 4206, Malvín Nuevo",
    "latitud": -34.8874739,
    "longitud": -56.1197775
  },
  {
    "id": "cosem-tres-cruces",
    "nombre": "COSEM (Tres Cruces)",
    "tipo": "Salud",
    "direccion": "Doctor Gastón Ramón 2330, Tres Cruces",
    "latitud": -34.8998894,
    "longitud": -56.163191
  },
  {
    "id": "circulo-catolico-palermo",
    "nombre": "Círculo Católico (Palermo)",
    "tipo": "Salud",
    "direccion": "Minas 1250, Palermo",
    "latitud": -34.9071943,
    "longitud": -56.1794883
  },
  {
    "id": "circulo-catolico-colon",
    "nombre": "Círculo Católico (Colón)",
    "tipo": "Salud",
    "direccion": "Avenida Lezica, Colón",
    "latitud": -34.8041585,
    "longitud": -56.2244282
  }
]

  /** Los que quedaron afuera porque el mapa no los pudo confirmar. */
  export const QUEDARON_AFUERA: readonly string[] = [
  "Plaza Cagancha (Plaza Libertad): el mapa encontró uno con ese nombre pero en otro barrio (Ituzaingó, Montevideo), no en Centro",
  "Plaza Seregni: el mapa no lo encontró por su nombre",
  "Plaza Virgilio: el mapa devolvió otro lugar (\"Plaza de la Armada\")",
  "Disco (Malvín): revisado a mano: el mapa la pone en Avenida Italia 11400, un número que no corresponde a Malvín",
  "Géant (Jacinto Vera): revisado a mano: el mapa la pone en Gualeguay 3350 y no pudimos confirmar que sea un Géant"
]
  