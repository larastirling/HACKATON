# Prueba de calidad del asistente del abuelo

Le pasa 35 frases al asistente de `/abuelo` y compara lo que hizo con lo que **debería** hacer:
25 frases de la familia DEMO (Don Carlos) y 10 de una familia inventada (Marta, con un solo hijo, Pablo).
La lista, en formato para WhatsApp, está en [`frases.md`](frases.md).

## Qué controla

- **El botón** que muestra la pantalla (Uber, WhatsApp, pedido de aprobación, emergencia o ninguno). Lo compara el script, de forma exacta.
- **Lo que dice**, cuando importa (por ejemplo: "pregunta cuál de las dos casas", "no da consejos médicos", "le dice que lo hable con la familia"). Lo evalúa una segunda IA que hace de **juez** y anota el motivo.
- Una frase vale ✅ solo si están bien **las dos cosas**.

Usa la **misma función** que usa la app (`conversarConElAbuelo` de `lib/ia.ts`), con las mismas instrucciones y herramientas. Lo único que saltea es el login. No cambia nada de `/abuelo` ni de `lib/`.

## Es seguro: no manda nada de verdad

- **No manda mails.** Antes de arrancar, el script borra los datos de Gmail. Sin esos datos, la app entra sola en su "modo prueba": el mail se arma pero no se envía. El script cuenta esos mails y al final muestra "0 enviados de verdad".
- **No manda notificaciones al celular.** Borra las claves de notificaciones y, sin base real, no hay ningún celular anotado.
- **No toca la base de datos real.** También borra los datos de la base, así los pedidos de aprobación quedan en la memoria de la compu y se borran al terminar.
- **La familia de Marta es inventada.** Solo existe dentro de la prueba y sus mails terminan en `.invalid`, que no existe.
- **No pide autos ni manda WhatsApp.** La app tampoco lo hace sola: solo arma el botón.

## Cómo correrla (paso a paso)

1. Abrí la Terminal en la carpeta principal del proyecto (`HACKATON`).
2. Solo la primera vez, instalá lo que necesita:
   ```bash
   npm install
   ```
3. Cargá la clave de Anthropic en el archivo `.env.local`, en la carpeta principal (si no existe, crealo):
   ```
   ANTHROPIC_API_KEY=tu-clave
   ```
   Este archivo está en el `.gitignore` (la regla `.env*`): **nunca se sube a GitHub**. El script lee de ahí **solo** esa clave.
4. Corré la prueba:
   ```bash
   npx tsx@4.20.3 --conditions=react-server evaluacion/abuelo/evaluar.ts
   ```
   - `tsx` es un programa que corre archivos TypeScript sin armar la app. `npx` lo baja solo la primera vez.
   - `--conditions=react-server` le avisa a la app que está corriendo "del lado del servidor". Sin eso no arranca.
5. Para probar solo algunas frases, agregá sus números al final:
   ```bash
   npx tsx@4.20.3 --conditions=react-server evaluacion/abuelo/evaluar.ts --solo=1,26
   ```

Cada corrida usa la IA de verdad, así que **cuesta un poco de crédito de Anthropic** y tarda unos minutos (las frases van de a una).

## Qué muestra

En la Terminal:
- Una tabla con la frase, lo esperado, el resultado y ✅ o ❌.
- Para cada ❌, por qué falló y qué contestó el asistente.
- El porcentaje de aciertos de **cada familia** y el **total**.

Además guarda todo en `evaluacion/abuelo/resultados.md`, con lo que contestó en cada frase y el motivo del juez. Ese archivo se puede mostrar al jurado.

## Reglas de esta prueba

- Lo esperado sale de la configuración real de cada familia (qué lugares necesitan permiso, cuál es el pedido habitual, etc.).
- En las consultas médicas (22, 23 y 34) **el botón no se evalúa**: las instrucciones dicen que ante algo de salud se muestre emergencia. Solo se evalúa que no dé consejos médicos.
- Cada frase se prueba sola, como una charla nueva.
- **No se cambian las instrucciones del asistente según los resultados.** El porcentaje tiene que ser honesto.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `frases.md` | La lista de frases para revisar con el equipo (formato WhatsApp). |
| `casos.ts` | Las mismas frases, con lo esperado, para el script. |
| `familias.ts` | La familia inventada (Marta). |
| `evaluar.ts` | El script que corre la prueba. |
| `resultados.md` | Se crea al correrla: el resultado de la última corrida. |

## Notas para Lara (cosas que encontramos, no se cambiaron)

- En las instrucciones de la IA, el ejemplo de apodo repetido es "lo de la nena" (`lib/ia.ts`), justo el de la familia DEMO. Por eso la frase 26 ("el club") prueba lo mismo con un apodo que la IA no vio en sus instrucciones.
- Los textos están escritos para un hombre: "Tratalo así" y "él toca el botón" (`lib/ia.ts`), "¿En qué lo ayudo?" (`app/abuelo/page.tsx`), "Quédese tranquilo" (`app/abuelo/Charla.tsx`) y "Llamalo" (`lib/emergencia.ts`). Con una abuela pueden quedar en masculino.
