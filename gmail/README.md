# Gmail: listar los últimos 5 mails

Script de Google Apps Script que muestra en el registro los 5 hilos más recientes de tu bandeja de entrada (remitente, asunto, fecha y los primeros 200 caracteres del texto). No usa IA, ni claves, ni servicios externos.

## Cómo usarlo

1. Entrá a [script.google.com](https://script.google.com) con la cuenta de Gmail que querés leer.
2. Hacé clic en **Nuevo proyecto**.
3. Borrá todo lo que aparece en el editor (`function myFunction() {}`).
4. Copiá el contenido de `listar-mails.gs` y pegalo en el editor.
5. Guardá (ícono del disquete o `Ctrl + S`).
6. Arriba, en el menú desplegable de funciones, elegí **listarUltimosMails**.
7. Hacé clic en **Ejecutar**.
8. La primera vez Google te va a pedir permisos:
   - Clic en **Revisar permisos** y elegí tu cuenta.
   - Si aparece "Google no verificó esta app", clic en **Configuración avanzada** → **Ir a (nombre del proyecto)**.
   - Clic en **Permitir**.
9. Abajo se abre el **Registro de ejecución** con los mails. Si la bandeja está vacía, lo dice ahí.

# Gmail: clasificar un mail con IA

Script `clasificar-mail.gs`: le pasa un mail a la IA (Claude, de Anthropic) y muestra en el registro si es **ESTAFA**, **DUDOSO** o **LEGITIMO**, y por qué. Todavía no etiqueta ni mueve nada: solo muestra el resultado.

## Cómo usarlo

1. En el mismo proyecto de [script.google.com](https://script.google.com), clic en el **+** al lado de "Archivos" → **Secuencia de comandos** y llamalo `clasificar-mail`.
2. Pegá el contenido de `clasificar-mail.gs` y guardá.
3. Cargá la clave de Anthropic (nunca en el código):
   - Clic en el ícono del engranaje (**Configuración del proyecto**), a la izquierda.
   - Abajo de todo, **Agregar propiedad de la secuencia de comandos**.
   - Propiedad: `ANTHROPIC_API_KEY`. Valor: la clave que te pasó Felipe.
   - **Guardar propiedades de la secuencia de comandos**.
4. Volvé al editor, elegí **probarConMailTrucho** en el menú de funciones y hacé clic en **Ejecutar**. La primera vez pide permiso para "conectarse a un servicio externo": aceptalo igual que antes.
5. En el registro tiene que aparecer `Resultado: ESTAFA` y el motivo.
6. Para probar con un mail real, elegí **clasificarUltimoMail**: clasifica el mail más reciente de la bandeja.

# Gmail: etiquetas ESTAFA y DUDOSO

Script `etiquetar-mails.gs`: crea las etiquetas **ESTAFA** (roja) y **DUDOSO** (amarilla) y se las pone a los mails según lo que diga la IA. Los legítimos quedan sin etiqueta. Todavía no saca mails de la bandeja ni avisa a nadie. Usa la función `clasificarConIA` de `clasificar-mail.gs`, así que los dos archivos tienen que estar en el mismo proyecto.

## Cómo usarlo

1. En el mismo proyecto de Apps Script, clic en el **+** al lado de "Archivos" → **Secuencia de comandos** y llamalo `etiquetar-mails`.
2. Pegá el contenido de `etiquetar-mails.gs` y guardá.
3. Activá el servicio de Gmail para que las etiquetas tengan color:
   - A la izquierda, al lado de **Servicios**, clic en el **+**.
   - Elegí **Gmail API** y clic en **Agregar**.
4. Elegí **crearEtiquetas** y clic en **Ejecutar**. Aceptá los permisos nuevos si los pide.
5. Abrí Gmail y fijate que a la izquierda aparezcan ESTAFA en rojo y DUDOSO en amarillo.
6. Mandate un mail trucho al Gmail de la demo (por ejemplo, uno que imite al BROU pidiendo la clave).
7. Elegí **etiquetarUltimosMails** y clic en **Ejecutar**. Revisa los últimos 5 mails: en el registro se ve el resultado de cada uno, y en Gmail el mail trucho tiene que quedar con la etiqueta roja.

# Gmail: proteger (sacar estafas de la bandeja y avisar al abuelo)

Script `proteger-mails.gs`: hace todo junto con cada mail.

- **ESTAFA:** etiqueta roja, lo saca de la bandeja (lo archiva, nunca lo borra) y le manda al dueño de la cuenta un mail con letra grande que explica por qué es falso y qué hacer. Ese aviso no incluye links, mails ni teléfonos del mail falso.
- **DUDOSO:** etiqueta amarilla, queda en la bandeja.
- **LEGITIMO:** no hace nada.

Los avisos que manda el script llevan la etiqueta "Avisos del asistente" y nunca se analizan, para que no se arme un círculo. Si un mail falla, lo anota en el registro y sigue con el siguiente. Usa funciones de `clasificar-mail.gs` y `etiquetar-mails.gs`: los tres archivos van en el mismo proyecto.

## Cómo usarlo

1. En el mismo proyecto de Apps Script, clic en el **+** al lado de "Archivos" → **Secuencia de comandos** y llamalo `proteger-mails`.
2. Pegá el contenido de `proteger-mails.gs` y guardá.
3. Elegí **protegerUltimosMails** y clic en **Ejecutar**. Aceptá los permisos nuevos (ahora también manda mails).
4. En el registro se ve qué hizo con cada uno de los últimos 5 mails.
5. En Gmail: el mail trucho ya no está en Recibidos (aparece buscando `label:ESTAFA`) y llegó el aviso "⚠️ Cuidado: le llegó un mail falso".

## Aviso a la familia (ESTAFA)

Cuando un mail es ESTAFA, `proteger-mails.gs` además le manda a 2 familiares el aviso "⚠️ Su familiar recibió un mail falso": de quién decía venir, su asunto, por qué la IA cree que es falso, que ya se sacó de la bandeja y que el abuelo ya recibió una explicación, y la sugerencia de llamarlo. No incluye links, mails ni teléfonos del mail falso. DUDOSO y LEGITIMO no avisan a la familia.

Los mails de los familiares no van en el código. Se cargan en **Configuración del proyecto** (engranaje) → **Propiedades de la secuencia de comandos**:

| Propiedad | Valor |
|---|---|
| `FAMILIAR_1` | mail del primer familiar |
| `FAMILIAR_2` | mail del segundo familiar |

Si falta alguno, el registro lo dice y se avisa igual al que esté. El registro también dice a quién se mandó cada aviso.

# Subir el código a Apps Script con clasp (sin copiar y pegar)

La carpeta `gmail/` está conectada al proyecto de Apps Script de la cuenta de la demo (`gmail/.clasp.json`). Se suben solo los `.gs` y `appsscript.json` (ver `gmail/.claspignore`).

1. Una sola vez por compu: `npm install -g @google/clasp` y `clasp login` con la cuenta de Gmail de la demo.
2. Desde la carpeta `gmail/`: `clasp status` muestra qué se va a subir.
3. `clasp push` sube todo y **reemplaza** el código online por el de `gmail/`. Las Propiedades del script (clave y familiares) no se tocan.

El login queda en `C:\Users\<usuario>\.clasprc.json`, fuera del repo. Nunca subirlo.

# Gmail: revisión automática cada minuto

Script `revisar-automatico.gs`. Un activador corre `revisarMailsNuevos` cada minuto:

- Revisa **todos** los mails nuevos de la bandeja y de **Spam** que todavía no pasaron por la IA. La primera vez, solo los de las últimas 24 horas (la fecha queda guardada en la propiedad `REVISAR_DESDE`).
- Revisa hasta 10 por corrida (y corta a los 4 minutos); los que quedan se revisan en la siguiente.
- Marca cada mail revisado con la etiqueta oculta **IA-revisado** (no se ve en la lista de etiquetas). Para verlos: buscar `label:IA-revisado` en Gmail.
- Bandeja: mismas reglas que `proteger-mails.gs`. Spam: si es ESTAFA, etiqueta y avisa al abuelo y a la familia pero lo deja en Spam; si es DUDOSO o LEGITIMO, no hace nada.
- Un mail nunca queda con ESTAFA y DUDOSO a la vez.
- Los avisos del asistente nunca se analizan.
- Si un mail falla, se reintenta en la próxima corrida; después de 3 fallos se da por revisado.
- Si una corrida empieza antes de que termine la anterior, no hace nada.

Funciones: `instalarActivador` (no crea dos), `sacarActivador`, y `revisarMailsNuevos` para correrla a mano.

# Gmail: prueba de calidad de la IA

Script `evaluar-calidad.gs`. La función `evaluarCalidad` le pasa a la IA cada mail de la planilla de prueba (Google Sheets), compara lo que dice con la respuesta correcta y escribe en la hoja **Resultados IA** de la misma planilla:

- Aciertos (cantidad y porcentaje).
- Estafas detectadas (de las que eran estafa, cuántas marcó como ESTAFA).
- Mails legítimos marcados como ESTAFA (falsas alarmas).
- El detalle de cada mail: qué se esperaba, qué dijo la IA, si acertó (verde/rojo) y su motivo.

## Formato de la planilla

En la **primera hoja**, la primera fila con estos títulos (en cualquier orden; no importan mayúsculas ni tildes):

| Remitente | Asunto (opcional) | Texto | Esperado |
|---|---|---|---|
| BROU Seguridad &lt;avisos@...&gt; | Su cuenta será bloqueada | Estimado cliente... | ESTAFA |

"Esperado" tiene que decir ESTAFA, DUDOSO o LEGITIMO (también acepta "Estafa", "legítimo", etc.). También reconoce "Categoría" o "Clasificación" en vez de "Esperado", y "Cuerpo" en vez de "Texto".

## Cómo usarlo

1. Compartí la planilla con la cuenta de Gmail de la demo (puede ser solo lectura, pero para escribir los resultados necesita poder editar).
2. En Propiedades del script, agregá `PLANILLA_PRUEBA` con el link de la planilla.
3. Ejecutá **evaluarCalidad**. Con 20 mails tarda unos 2 minutos.
