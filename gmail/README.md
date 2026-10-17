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
