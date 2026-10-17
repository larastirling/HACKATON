# Asistente de confianza

App web, pensada primero para el celular, que ayuda a **personas mayores que no saben usar tecnología**, con la **familia conectada**.

- **/abuelo**: el abuelo le pide cosas a una inteligencia artificial (IA).
- **/familia**: el hijo o la hija configura todo charlando con una IA.

La IA es la de Anthropic (Claude). Esta versión es la **plantilla base**: las pantallas del abuelo y de la familia todavía dicen "En construcción".

---

## Quién toca qué

| Parte | Carpeta | Responsable |
|---|---|---|
| Pantalla del abuelo | `app/abuelo/` | **Lara** |
| Pantalla de la familia | `app/familia/` | **Felipe** |
| Script de Gmail | `gmail/` | **Inés** |

Archivos compartidos (avisar al equipo antes de cambiarlos):

| Archivo | Para qué sirve |
|---|---|
| `lib/datos.ts` | **Único lugar** que lee y guarda la configuración de cada abuelo. |
| `lib/ia.ts` | **Único lugar** que habla con la IA (solo desde el servidor). |
| `lib/sesion.ts` | Login: quién entró y si es abuelo o familiar. |
| `components/BarraNavegacion.tsx` | Barra de botones de abajo. |
| `app/globals.css` | Diseño: letra grande, botones grandes, mucho contraste. |
| `app/api/configuracion/` | Ruta que usa el script de Gmail para leer la configuración. |
| `app/prueba/` | Página para comprobar que todo funciona. |

---

## Cómo entrar

1. Escribir el **código de familia**. Para probar: `DEMO`.
2. Tocar **"Soy el abuelo"** o **"Soy familiar"**.

El abuelo solo puede ver `/abuelo` y el familiar solo `/familia`. La sesión dura un año, así que un familiar puede iniciar sesión una vez en el celular del abuelo y queda abierta.

> Es un login simple para la hackatón: quien sepa el código puede elegir cualquiera de los dos roles.

---

## Cómo correrla en tu compu (paso a paso)

Solo la primera vez:

1. Instalá **Node.js** (versión 20 o más nueva) desde https://nodejs.org (botón "LTS").
2. Abrí la app **Terminal** y entrá a la carpeta del proyecto:
   ```bash
   cd ruta/a/la/carpeta/HACKATON
   ```
3. Instalá lo que necesita la app:
   ```bash
   npm install
   ```
4. Copiá el archivo de ejemplo de variables:
   ```bash
   cp .env.example .env.local
   ```
5. Abrí `.env.local` con cualquier editor de texto y completá los valores (ver la sección siguiente). Si dejás alguno vacío, la app igual arranca y `/prueba` te avisa qué falta.

Cada vez que quieras usarla:

6. En la Terminal, dentro de la carpeta:
   ```bash
   npm run dev
   ```
7. Abrí http://localhost:3000 en el navegador.
8. Para probarla desde el celular (conectado al mismo Wi‑Fi), usá la dirección que aparece como **Network** en la Terminal.
9. Para apagarla: en la Terminal, apretá `Ctrl + C`.

---

## Variables de entorno

Son datos secretos que **nunca** se suben a GitHub. En tu compu van en `.env.local`; en Vercel se cargan en la configuración del proyecto.

| Variable | Qué es | ¿Obligatoria? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Clave de la IA. Se saca en https://platform.claude.com/settings/keys | Sí, para usar la IA |
| `SESSION_SECRET` | Texto secreto largo inventado (40 letras y números al azar). Protege el login. | Sí en Vercel. En tu compu, opcional |
| `CONFIG_API_TOKEN` | Otro texto secreto largo inventado. El script de Gmail lo usa para leer la configuración. | Sí, para Gmail |
| `KV_REST_API_URL` y `KV_REST_API_TOKEN` | Dirección y clave de la base de datos Upstash Redis. **En Vercel se cargan solas.** | En Vercel sí. En tu compu, opcional |
| `GMAIL_USUARIO` | El Gmail de la demo que manda los pedidos de aprobación a la familia. | Sí en Vercel. En tu compu, opcional (sin esto, el mail se muestra en la Terminal) |
| `GMAIL_CONTRASENA_APP` | "Contraseña de aplicación" de ese Gmail (16 letras). Ver abajo cómo sacarla. | Igual que la anterior |
| `URL_APP` | Dirección pública de la app (por ejemplo `https://tu-app.vercel.app`), para los links de los mails. | Recomendada en Vercel |
| `MINUTOS_PARA_CONTESTAR` | Minutos que tiene cada familiar para aprobar un pedido antes de preguntarle al siguiente (si no está: 5). Para la demo se puede poner `1`. | No |

Si en tu compu no ponés la base de datos, los datos se guardan **en memoria** y se borran al apagar la app.

**Cómo sacar la contraseña de aplicación de Gmail** (con el Gmail de la demo):
1. Entrá a https://myaccount.google.com/security y activá la **Verificación en dos pasos** (si no está activada).
2. Entrá a https://myaccount.google.com/apppasswords
3. En "Nombre de la app" escribí `Asistente de confianza` y tocá **Crear**.
4. Copiá las 16 letras que aparecen: esa es `GMAIL_CONTRASENA_APP`.

Para inventar un texto secreto largo, en la Terminal:
```bash
openssl rand -hex 24
```

---

## Página de prueba: `/prueba`

Entrá como familiar y tocá **Prueba** en la barra de abajo. Ahí se ve:

- si la base de datos está conectada, y un botón que guarda y lee un dato;
- si está la clave de la IA, y un botón que le hace una pregunta corta. Si falta la clave, dice **"Falta la clave de la IA"**.

---

## Ruta para el script de Gmail

```
GET https://TU-APP.vercel.app/api/configuracion?codigo=DEMO
Header:  Authorization: Bearer <CONFIG_API_TOKEN>
```

Ejemplo en Google Apps Script:
```js
const respuesta = UrlFetchApp.fetch('https://TU-APP.vercel.app/api/configuracion?codigo=DEMO', {
  headers: { Authorization: 'Bearer ' + PropertiesService.getScriptProperties().getProperty('CONFIG_API_TOKEN') },
})
const configuracion = JSON.parse(respuesta.getContentText())
```

Respuestas: `200` con la configuración, `401` si el token está mal, `404` si no existe esa familia.

> El formato de la configuración (abuelo, lugares, comercios, familiares y reglas) está explicado en [`docs/formato-configuracion.md`](docs/formato-configuracion.md). Los familiares vienen en `familiares`; el campo `orden` dice a quién se le pregunta primero.

---

## Cómo publicarla en Vercel

1. Entrá a https://vercel.com e iniciá sesión con tu cuenta de GitHub.
2. Tocá **Add New… → Project**, buscá el repo **larastirling/HACKATON** y tocá **Import**. No cambies nada y tocá **Deploy**.
3. Cuando termine, entrá al proyecto y andá a la pestaña **Storage** → **Create Database** → elegí **Upstash** → **Redis** → seguí los pasos (plan gratis) y conectala a este proyecto. Vercel carga solas las variables de la base de datos.
4. Andá a **Settings → Environment Variables** y agregá, una por una: `ANTHROPIC_API_KEY`, `SESSION_SECRET`, `CONFIG_API_TOKEN`, `GMAIL_USUARIO`, `GMAIL_CONTRASENA_APP` y `URL_APP` (la dirección de tu app en Vercel).
5. Andá a **Deployments**, tocá los tres puntitos del último y elegí **Redeploy** (para que tome las variables nuevas).
6. Abrí la dirección de tu app, entrá con `DEMO` como familiar y revisá `/prueba`.

Después de esto, **cada vez que se suba algo a `main`, Vercel publica la nueva versión sola.**
