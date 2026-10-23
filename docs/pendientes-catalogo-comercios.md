# Pendientes: catálogo de comercios, lugares cercanos y "Llamar al comercio"

Rama `felipelyonnet/catalogo-comercios` (sale de main 9944c42). **No está juntada con main.** Notas del 2026-10-23.

## Qué está hecho (en esta rama)

- **Catálogo de comercios** (`app/familia/catalogo-comercios.ts`): 21 comercios cargados, todos con `verificado: false`, salvo el
  "Comercio de prueba (equipo)" (+598 92 625 554, se pide llamando). Solo se sugieren y se guardan los verificados.
- **/abuelo: "Llamar a [comercio]"**: para los comercios de tipo llamada, la tarjeta muestra el texto para leer
  ("Hola, quiero pedir … para …") y un botón grande para llamar. La IA nunca llama.
- **Permiso por comercio**: al guardar un comercio nuevo hay que decir si puede pedir solo o necesita permiso
  (se verifica con lo que escribió el hijo, igual que los lugares). Los comercios viejos sin el dato quedan con permiso.
- **Distancia**: lugares y comercios se sugieren solo a menos de 10 km de la casa (`KM_MAXIMOS` en `app/familia/distancia.ts`),
  del más cerca al más lejos, con "a 1,2 km". Los comercios además respetan la zona de envío.
- **Sugerencias solas** (`app/familia/sugerencias-solas.ts`): mientras se arma el perfil, al llegar a los lugares
  se muestran los cercanos (uno por tipo), y al llegar a los comercios, los verificados cercanos.
  Botones "Sugerirme lugares" y "Sugerirme comercios" siempre disponibles. La casa se ubica en el mapa apenas se guarda.
- **Mapa (`lib/mapas.ts`)**: 1 búsqueda por segundo entre todos los procesos (candado en archivo), nombre de la app en
  cada pedido, caché en archivo, pausa de 1 minuto si OpenStreetMap contesta 429.
- **Familia DEMO**: la casa de Don Carlos pasó a "Juan Benito Blanco 780, Montevideo" (Pocitos), que el mapa sí encuentra.

## Pendiente

1. **Correr el catálogo de lugares** (unos 100 lugares). OpenStreetMap nos bloqueó (429) el 2026-10-23 a las 13:46
   porque corrieron dos scripts a la vez (ya está arreglado: ahora no pueden correr dos).
   - Primero ver si el mapa ya responde. Si contesta 200, correr UNA vez:
     `npx tsx@4.20.3 --conditions=react-server scripts/verificar-catalogo.ts`
   - Si el mapa falla aunque sea una vez, el script NO escribe el catálogo (queda el de git, con 36 lugares).
   - La última corrida que salió completa dio 102 lugares, pero tenía un error al detectar repetidos (ya corregido).
     Revisar cuántos entran ahora, por tipo y por barrio, y qué quedó afuera.
2. **Una charla corta con la IA real** para confirmar que, cuando la IA pregunta por los lugares, las sugerencias
   aparecen solas (depende de cómo escribe la IA: `HABLA_DE_LUGARES` y `HABLA_DE_COMERCIOS` en `sugerencias-solas.ts`).
   Todavía no se hizo ninguna llamada a la IA para esto.
3. **Probar en el celu**: `npm run dev -- -H 0.0.0.0 -p 3000` y abrir `http://<IP de la compu>:3000`.
   Ver los botones "Sugerirme…", la distancia en las sugerencias y la tarjeta "Llamar a…" en /abuelo
   (elegir "Comercio de prueba (equipo)" en /familia y pedirle "lo de siempre" en /abuelo).
4. **Avisarle a Lara** que cambió la familia DEMO en `lib/datos.ts` (dirección de Don Carlos, `necesitaPermiso: false`
   en la pizzería, campos nuevos `pedidoPor` y `telefono`). Si la DEMO en Redis tiene la dirección vieja: "Restaurar DEMO" en /prueba.
5. **Antes de la demo con comercios reales**: sacar o poner en `verificado: false` el "Comercio de prueba (equipo)",
   y verificar (llamando) los comercios reales que se quieran sugerir.
6. **Juntar con main** cuando esté probado: `git push origin HEAD:main` desde esta rama (main está abierto en otra carpeta).
7. Hay un proceso de **vite** corriendo en esta carpeta desde el 2026-10-17 (`vite --host`) que no levantó esta charla:
   ver si alguien lo usa.
