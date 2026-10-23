# Pendientes: catálogo de comercios, lugares cercanos y "Llamar al comercio"

Trabajo de las ramas `felipelyonnet/catalogo-comercios`, `confirmar-comercios` y `familia-rapida`, ya subido a main. Notas del 2026-10-23.

## Qué está hecho

- **Catálogo de comercios** (`app/familia/catalogo-comercios.ts`): 21 comercios, cada uno con su confirmación:
  - "confirmado por su web" (su web oficial dice explícitamente que toman pedidos; con link, fecha y la frase): Disco,
    Piazza Italia (Centro y Pocitos), La Fábrica (Centro y Tres Cruces) y El Hidalgo (delivery propio y "Llámanos o
    escríbenos por WhatsApp"), revisados el 2026-10-23. Solo estos se sugieren solos.
  - "sin confirmar": todos los demás. Fundamento también: no encontramos en su web las preguntas frecuentes que dirían
    que se pide por WhatsApp (no están en el sitemap, /preguntas-frecuentes y /faq dan 404, y las páginas de cada local
    solo tienen un botón de WhatsApp sin texto). Si aparece el link, revisarlo y marcarlo. Aparecen en
    "Ver todos los cercanos" con el aviso "Número sin confirmar". Si el hijo elige uno, el sistema pregunta si ya le pidieron
    por ahí y funciona: solo con un "sí" se guarda, como "confirmado por la familia" (vale solo para esa familia).
  - El "Comercio de prueba (equipo)" (+598 92 625 554, se pide llamando) tiene `soloEnLaCompu`: aparece al correr la app
    en una compu, nunca en la app publicada en Vercel.
- **"El número no anda"**: el hijo lo puede decir en /familia (`reportar_numero_que_no_anda`). El número deja de sugerirse
  a todas las familias hasta que alguien lo revise en /prueba → "Números reportados" (con la clave CONFIG_API_TOKEN).
- **"Ver todos los cercanos"**: debajo de las sugerencias (lugares y comercios), muestra todos los que están a menos de
  10 km, del más cerca al más lejos, sin preguntarle nada a la IA ni al servidor (la lista llega con las sugerencias).
- **/abuelo: "Llamar a [comercio]"**: para los comercios de tipo llamada, la tarjeta muestra el texto para leer
  ("Hola, quiero pedir … para …") y un botón grande para llamar. La IA nunca llama.
- **Permiso por comercio**: al guardar un comercio nuevo hay que decir si puede pedir solo o necesita permiso
  (se verifica con lo que escribió el hijo, igual que los lugares). Los comercios viejos sin el dato quedan con permiso.
- **Distancia**: lugares y comercios se sugieren solo a menos de 10 km de la casa (`KM_MAXIMOS` en `app/familia/distancia.ts`),
  del más cerca al más lejos, con "a 1,2 km". Los comercios además respetan la zona de envío.
- **Carga en 6 pasos guiados** (`app/familia/pasos.ts` y `Tarjetas.tsx`, desde el 2026-10-23): reemplaza a las
  "sugerencias solas" (se borró `sugerencias-solas.ts`). Cada paso es una tarjeta que se completa con botones y campos,
  sin la IA: 1) sus datos, 2) cómo se maneja (botones de tecnología y plata), 3) lugares y 4) comercios (marcar varios
  de una, con "Va solo" / "Con permiso", por defecto con permiso), 5) familiares, 6) reglas (nivel propuesto según el
  paso 2). Arriba: "Paso N de 6", barrita de avance y "Seguir". "Completar después" en los pasos 2, 3, 4 y 6; el avance
  queda guardado (`armado`, `comoEs` en la configuración). La IA atiende solo lo que el hijo escribe (un lugar que
  falta, correcciones, "quiero cambiar algo"). Con el perfil completo, "Sugerirme lugares / comercios" abre la misma
  tarjeta. Cargar un abuelo: 17 toques y 8 campos, 0 mensajes a la IA (antes, ~17 mensajes escritos y ~22 respuestas
  de la IA). La casa se ubica en el mapa apenas se guarda.
  Un paso dejado "para después" sigue pendiente aunque después se guarden las reglas (solo las familias de antes de
  los pasos, con reglas y sin `armado`, cuentan como hechas). Si queda alguno, el cierre no dice "todo cargado": dice
  "Casi listo: todavía falta …" con un botón "Completar …" (tarjeta `falta`).
- **Formas de viajar en /familia** (PR #24 de Lara, juntado en main el 2026-10-23): "¿Cómo puede ir?" con botones
  (Uber / Caminando / Colectivo) en la tarjeta de lugares (paso 3), guardados con el mismo "Listo". Si el hijo lo cambia
  escribiendo, la IA usa `guardar_formas_de_viajar`. No entró su commit a32b4ef (tocaba `sugerencias-solas.ts`, borrado).
- **Mapa (`lib/mapas.ts`)**: busca primero en IDE Uruguay (direcciones.ide.uy, solo coincidencias exactas con el mismo
  número de puerta) y, si no, en OpenStreetMap. Si ninguno encuentra la dirección, en /familia la IA ofrece pegar un link
  de Google Maps (herramienta `ubicar_con_link_de_google_maps`; las coordenadas salen del link, y OpenStreetMap confirma que
  el punto es de Uruguay). 1 pedido por segundo a cada servicio entre todos los procesos (candado en archivo), nombre de
  la app en cada pedido, caché en archivo, pausa de 1 minuto si un servicio contesta 429.
  Prueba del 2026-10-23: "26 de Marzo 1271" y "Arocena 1644" las encontró IDE (Arocena, OpenStreetMap no);
  "Costa Rica 621" y "Juan Benito Blanco 900" no las encontró ninguno (IDE solo daba puertas aproximadas).
- **Ubicación de la casa guardada** (`abuelo.ubicacion`): la pone el sistema al guardar la dirección o con el link de
  Google Maps; se borra si cambia la dirección.
- **Familia DEMO**: la casa de Don Carlos pasó a "Juan Benito Blanco 780, Montevideo" (Pocitos), que el mapa sí encuentra.

- **Catálogo de lugares** (`app/familia/catalogo-lugares.ts`): 299 lugares verificados con el mapa el 2026-10-23, en
  Montevideo (254), Ciudad de la Costa (35) y Las Piedras (10), cada uno con `tipo`, `barrio` y `ciudad`
  (pagos 59, supermercados 51, salud 40, farmacias 35, plazas 16, bancos 15, iglesias 15, clubes 10, correo 10,
  teatros 9, cafés 8, shoppings 7, bibliotecas 7, trámites 6, cines 5, cementerios 3, mercados 2, centros de jubilados 1).
  Las cadenas y los tipos de lugar se le piden al mapa por zonas, uno por barrio, primero los barrios con menos lugares.
  Las policlínicas entran solo si el mapa dice que las atiende ASSE. La mitad no tiene número de puerta en el mapa
  (la ubicación sí es la real). Quedaron afuera Plaza Cagancha, Plaza Seregni, Plaza Virgilio y 6 cafés tradicionales
  que el mapa no confirmó, y "Disco (Malvín)" y "Géant (Jacinto Vera)" (lista `NO_INCLUIR` del script).
  Para volver a armarlo, correr UNA vez `npx tsx@4.20.3 --conditions=react-server scripts/verificar-catalogo.ts`
  (si el mapa falla, para y no escribe nada; lo ya buscado queda en la caché).
- **Buscador en "Ver todos los cercanos"** (`app/familia/buscar.ts`): caja con lupa y botones de categoría; filtra en el
  navegador (sin IA ni servidor) por nombre, tipo, barrio, dirección y tipo de comida (`comida` en el catálogo de
  comercios, solo si la fuente lo dice). La IA ve solo los 5 más cercanos de cada tipo (antes, todos).

## Pendiente

1. **Cerro y Parque Rodó** tienen pocos lugares en el catálogo (el mapa no devolvió sucursales de cadenas ahí).
2. **Probar la carga nueva en la app publicada con la IA real**, como un hijo nuevo, de punta a punta. Probado en
   tamaño celular sin la IA (anduvo entero) y con 1 charla real a mitad del paso 3 (anduvo bien); falta una charla
   completa con correcciones escritas ("quiero cambiar algo" en las reglas, un lugar que falta).
3. **Antes de la demo**: "Restaurar DEMO" en /prueba (la DEMO de Redis puede tener datos viejos).
4. **Comercios**: revisar de vez en cuando las webs de los "confirmado por su web" (la frase puede cambiar) y si algún
   "sin confirmar" lo empieza a decir. Si alguien ya guardó el "Comercio de prueba (equipo)" en una familia de la app
   publicada, borrarlo desde /familia.
5. Hay un proceso de **vite** corriendo en esta carpeta desde el 2026-10-17 (`vite --host`) que no levantó esta charla:
   ver si alguien lo usa.
