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
