# Pendientes: catálogo de comercios, lugares cercanos y "Llamar al comercio"

Trabajo de la rama `felipelyonnet/catalogo-comercios`, ya subido a main. Notas del 2026-10-23.

## Qué está hecho

- **Catálogo de comercios** (`app/familia/catalogo-comercios.ts`): 21 comercios cargados, todos con `verificado: false`, salvo el
  "Comercio de prueba (equipo)" (+598 92 625 554, se pide llamando). Solo se sugieren y se guardan los verificados.
  El de prueba tiene `soloEnLaCompu`: aparece al correr la app en una compu, nunca en la app publicada en Vercel.
- **/abuelo: "Llamar a [comercio]"**: para los comercios de tipo llamada, la tarjeta muestra el texto para leer
  ("Hola, quiero pedir … para …") y un botón grande para llamar. La IA nunca llama.
- **Permiso por comercio**: al guardar un comercio nuevo hay que decir si puede pedir solo o necesita permiso
  (se verifica con lo que escribió el hijo, igual que los lugares). Los comercios viejos sin el dato quedan con permiso.
- **Distancia**: lugares y comercios se sugieren solo a menos de 10 km de la casa (`KM_MAXIMOS` en `app/familia/distancia.ts`),
  del más cerca al más lejos, con "a 1,2 km". Los comercios además respetan la zona de envío.
- **Sugerencias solas** (`app/familia/sugerencias-solas.ts`): mientras se arma el perfil, al llegar a los lugares
  se muestran los cercanos (uno por tipo), y al llegar a los comercios, los verificados cercanos.
  Botones "Sugerirme lugares" y "Sugerirme comercios" siempre disponibles. La casa se ubica en el mapa apenas se guarda.
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

- **Catálogo de lugares** (`app/familia/catalogo-lugares.ts`): 107 lugares verificados con el mapa el 2026-10-23
  (salud 26, supermercados 21, farmacias 19, plazas 16, trámites 7, bancos 7, shoppings 5, clubes 3, paseos 3).
  Quedaron afuera Plaza Cagancha, Plaza Seregni y Plaza Virgilio (el mapa no las confirmó) y, revisados a mano,
  "Disco (Malvín)" y "Géant (Jacinto Vera)" (lista `NO_INCLUIR` del script). Para volver a armarlo, correr UNA vez
  `npx tsx@4.20.3 --conditions=react-server scripts/verificar-catalogo.ts` (si el mapa falla, no escribe nada).

## Pendiente

1. **Cerro y Parque Rodó** tienen pocos lugares en el catálogo (el mapa no devolvió sucursales de cadenas ahí).
2. **Una charla corta con la IA real** para confirmar que, cuando la IA pregunta por los lugares, las sugerencias
   aparecen solas (depende de cómo escribe la IA: `HABLA_DE_LUGARES` y `HABLA_DE_COMERCIOS` en `sugerencias-solas.ts`).
   Todavía no se hizo ninguna llamada a la IA para esto.
3. **Probar en el celu**: `npm run dev -- -H 0.0.0.0 -p 3000` y abrir `http://<IP de la compu>:3000`.
   Ver los botones "Sugerirme…", la distancia en las sugerencias y la tarjeta "Llamar a…" en /abuelo
   (elegir "Comercio de prueba (equipo)" en /familia y pedirle "lo de siempre" en /abuelo).
4. **Avisarle a Lara** que cambió la familia DEMO en `lib/datos.ts` (dirección de Don Carlos, `necesitaPermiso: false`
   en la pizzería, campos nuevos `pedidoPor` y `telefono`). Si la DEMO en Redis tiene la dirección vieja: "Restaurar DEMO" en /prueba.
5. **Comercios reales**: verificar (llamando) los que se quieran sugerir y ponerles `verificado: true`. Si alguien ya
   guardó el "Comercio de prueba (equipo)" en una familia de la app publicada, borrarlo desde /familia.
6. Hay un proceso de **vite** corriendo en esta carpeta desde el 2026-10-17 (`vite --host`) que no levantó esta charla:
   ver si alguien lo usa.
