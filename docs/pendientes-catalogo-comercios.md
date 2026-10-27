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

- **Catálogo de lugares** (`app/familia/catalogo-lugares.ts`): 321 lugares verificados con el mapa el 2026-10-23, en
  Montevideo (276), Ciudad de la Costa (35) y Las Piedras (10), cada uno con `tipo`, `barrio` y `ciudad`
  (supermercados 62, pagos 60, salud 41, farmacias 39, bancos 20, plazas 16, iglesias 15, clubes 10, correo 10,
  teatros 9, cafés 8, shoppings 7, bibliotecas 7, trámites 6, cines 5, cementerios 3, mercados 2, centros de jubilados 1).
  Las cadenas y los tipos de lugar se le piden al mapa por zonas, uno por barrio, primero los barrios con menos lugares.
  Lo que ya estaba en el catálogo entra primero: volver a correr el script nunca saca lugares (están los 107 de antes).
  Las policlínicas entran solo si el mapa dice que las atiende ASSE. La mitad no tiene número de puerta en el mapa
  (la ubicación sí es la real). Quedaron afuera Plaza Cagancha, Plaza Seregni, Plaza Virgilio y 6 cafés tradicionales
  que el mapa no confirmó, y "Disco (Malvín)" y "Géant (Jacinto Vera)" (lista `NO_INCLUIR` del script).
  Para volver a armarlo, correr UNA vez `npx tsx@4.20.3 --conditions=react-server scripts/verificar-catalogo.ts`
  (si el mapa falla, para y no escribe nada; lo ya buscado queda en la caché).
- **Buscador en "Ver todos los cercanos"** (`app/familia/buscar.ts`): caja con lupa y botones de categoría; filtra en el
  navegador (sin IA ni servidor) por nombre, tipo, barrio, dirección y tipo de comida (`comida` en el catálogo de
  comercios, solo si la fuente lo dice). La IA ve solo los 5 más cercanos de cada tipo (antes, todos).

## Pendiente (al 2026-10-23, después de subir a main cd0c84a)

**Agenda: activar los recordatorios (Felipe, una vez)**
0. Sin esto, el aviso de "te agregaron algo" llega igual, pero los de "un día antes" y "2 horas antes" no salen.
   - En Vercel: el proyecto → Settings → Environment Variables → que exista `CRON_SECRET` (ya la usa el resumen
     diario). Copiar su valor.
   - Crear una cuenta gratis en https://cron-job.org → "Create cronjob":
     URL `https://hackaton-felain.vercel.app/api/recordatorios`, "Every 10 minutes", y en "Advanced" → Headers:
     `Authorization` = `Bearer <el valor de CRON_SECRET>`. Guardar.
   - Probar con "Test run": tiene que contestar 200 con `{"mandados":0,"llegaron":0}` (o los que haya mandado).
     Si contesta 401, la clave está mal copiada.
   - El abuelo tiene que activar los avisos una vez, en su celular: botón "Agenda" → "Activar avisos" (en iPhone,
     con la app instalada en la pantalla de inicio).

**Inés**
1. **`clasp push`** de `gmail/` (`avisar-a-la-app.gs` nuevo y dos líneas en `proteger-mails.gs`): sin eso, los mails
   ESTAFA o DUDOSO no aparecen en /familia → "Lo que pasó". Después, probar con `protegerUltimosMails`.
2. **Conectar el Gmail del abuelo** (OAuth): la rama `felipelyonnet/gmail-conectar` está en GitHub pero NO en main.
   Espera que se junte `ibertolotti/gmail-oauth`, y hoy choca con main: hay que resolver el choque y probarla.

**Lara**
3. Leer `docs/trato-en-la-pantalla-del-abuelo.md`: los textos fijos de /abuelo ahora van en usted o vos con
   `t('…', '…')`. Todo texto nuevo para el abuelo tiene que escribirse en las dos formas.

**Estacionamiento**
4. **Confirmar con la web de la Intendencia** el WhatsApp 099 019 500 y las palabras "estacionamiento" / "fin" (dato
   que pasó Felipe), y el SMS de respaldo (466, "E MATRÍCULA MINUTOS"). Anotar el link y la fecha en
   `lib/estacionamiento-config.ts` y poner `confirmado: true` en el SMS recién con la fuente oficial (hasta entonces
   el botón "mandar SMS" NO se le muestra al abuelo).
5. Probarlo en un celular de verdad: que el link abra WhatsApp con la palabra escrita y que el SMS abra los mensajes.

**Catálogo y comercios**
6. Revisar a mano: "Oro del Rhin" (el mapa lo pone en Pocitos), "Bar Hispano" y "Bar Andorra" (sin calle), y nombres
   con errores que vienen del mapa ("Salla Jorge Lazaroff", "Teatro Comedía"). La mitad de los lugares no tiene número
   de puerta en el mapa. Centros de jubilados: el mapa casi no los tiene (entró solo la ONAJPU).
7. **Cerro y Parque Rodó** tienen pocos lugares (el mapa no devolvió sucursales de cadenas ahí).
8. **Comercios**: revisar de vez en cuando las webs de los "confirmado por su web" (la frase puede cambiar) y si algún
   "sin confirmar" lo empieza a decir. La Pasiva no tiene tipo de comida (su fuente no lo dice). Si alguien ya guardó
   el "Comercio de prueba (equipo)" en una familia de la app publicada, borrarlo desde /familia.

**Probar y la demo**
9. **Probar en la app publicada con la IA real**, de punta a punta: la carga de un hijo nuevo (con correcciones
   escritas), estacionamiento, dudas del día a día y "Lo que pasó" con datos reales (solo se ve lo que pase desde ahora).
10. **Antes de la demo**: "Restaurar DEMO" en /prueba (necesita la clave CONFIG_API_TOKEN de Vercel, que no es la de
    `.env.local`). Restaurar también vacía "Lo que pasó" y el estacionamiento abierto de DEMO.
11. Los avisos de las reglas ("se avisa cuando sale de su casa") todavía no se mandan en ningún lado.
