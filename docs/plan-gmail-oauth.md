# Plan: protección de mail para cualquier familia (Gmail con permiso de Google)

Hoy la protección de mail funciona **solo en el Gmail de la demo**: es un Google Apps Script (`gmail/`) que vive dentro de esa cuenta. La idea es que **cualquier familia** pueda conectar el Gmail de su abuelo desde `/familia`, y que la app revise sus mails sola.

**OAuth** (en una línea): es el botón "Iniciar sesión con Google → Permitir". El abuelo (o la familia, con él al lado) le da permiso a la app para manejar su Gmail, sin pasarle la contraseña. Google le da a la app un **permiso guardable** (se llama *refresh token*) que sirve para entrar al Gmail cuando haga falta.

## Quién hace qué

| Quién | Qué | Dónde en el código |
|---|---|---|
| **Lara** | Crear el proyecto en Google Cloud (pantalla de permiso, credenciales) y cargar las variables en Vercel. Confirmar si Vercel deja revisar cada minuto en nuestro plan (ver "Cada cuánto se revisa"). | Google Cloud, Vercel, `.env.example` |
| **Felipe** | Botón **"Conectar Gmail"** en `/familia`: manda al abuelo a Google, recibe la vuelta, guarda el permiso. También "Desconectar" y mostrar si está conectado. | `app/api/gmail/conectar/`, `app/api/gmail/vuelta/`, `app/api/gmail/desconectar/`, `app/familia/` |
| **Inés** | El **motor**: cada minuto, para cada familia conectada, busca mails nuevos, los clasifica con la IA, etiqueta, saca de la bandeja y avisa. | `lib/gmail.ts`, `lib/proteccion-mail.ts`, `app/api/gmail/revisar/`, funciones nuevas en `lib/datos.ts` y `lib/ia.ts` |

Las funciones de guardar y leer la conexión (en `lib/datos.ts`) las escribe **Inés primero**, así Felipe ya las puede usar.

---

## 1. Nombres exactos (los usamos los tres igual)

### 1.1 Lo que se guarda en la base, por familia

Va en `lib/datos.ts`, que es el **único** lugar que lee y guarda datos (como dice ese archivo). Mismo estilo que `configuracion:DEMO`.

| Clave en la base | Qué guarda | Lo escribe | Lo lee |
|---|---|---|---|
| `gmail:<CODIGO>` | La conexión de Gmail de esa familia (ver tipo `ConexionGmail` abajo). | Felipe (al conectar), Inés (actualiza `revisarDesde` y `ultimoError`) | Inés, Felipe (para mostrar "Conectado") |
| `gmail-familias` | Lista de códigos de familia que tienen Gmail conectado. Así el motor sabe a quién revisar sin recorrer toda la base. | Felipe (al conectar y desconectar, a través de las funciones de abajo) | Inés |
| `gmail-oauth-estado:<texto al azar>` | Código de familia mientras el abuelo está en la pantalla de Google. Vence a los 10 minutos. Sirve para saber, a la vuelta, de qué familia era (y que nadie la falsifique). | Felipe | Felipe |
| `gmail-fallos:<CODIGO>:<id del mail>` | Cuántas veces falló un mail (para reintentar hasta 3). Vence a los 7 días. | Inés | Inés |
| `candado:gmail:<CODIGO>` | Que no corran dos revisiones a la vez para la misma familia. Usa `tomarCandado` / `soltarCandado` que ya existen. | Inés | Inés |

`<CODIGO>` siempre pasado por `normalizarCodigo` (mayúsculas), como el resto.

### 1.2 El tipo `ConexionGmail` (en `lib/datos.ts`)

```ts
export interface ConexionGmail {
  /** Gmail del abuelo, tal como lo devuelve Google. */
  mailAbuelo: string
  /** Permiso guardable de Google (refresh token). Se guarda CIFRADO, nunca en texto plano. */
  permisoCifrado: string
  /** Cuándo se conectó (fecha ISO, ej. "2026-10-17T21:00:00.000Z"). */
  conectadoEl: string
  /** Desde cuándo buscar mails, en segundos. Al conectar: ahora menos 24 horas. */
  revisarDesde: number
  /** Si la última revisión falló entera (ej. el abuelo sacó el permiso), por qué. Si anduvo bien, no está. */
  ultimoError?: string
}
```

### 1.3 Funciones de `lib/datos.ts` (las escribe Inés, las usan los dos)

| Función | Qué hace |
|---|---|
| `guardarConexionGmail(codigoFamilia, conexion)` | Guarda la conexión y suma la familia a `gmail-familias`. |
| `leerConexionGmail(codigoFamilia)` | Devuelve la `ConexionGmail` o `null`. |
| `borrarConexionGmail(codigoFamilia)` | La borra y saca la familia de `gmail-familias`. |
| `listarFamiliasConGmail()` | Devuelve los códigos de `gmail-familias`. |

Y en `lib/gmail.ts` (Inés): `cifrarPermiso(texto)` y `descifrarPermiso(texto)`. Felipe usa `cifrarPermiso` antes de guardar.

### 1.4 Variables de entorno (las carga Lara en Vercel y en `.env.example`)

| Variable | Qué es |
|---|---|
| `GOOGLE_CLIENT_ID` | Identificador de la app en Google Cloud. |
| `GOOGLE_CLIENT_SECRET` | Contraseña de la app en Google Cloud. **Secreta.** |
| `GMAIL_CLAVE_CIFRADO` | Clave para cifrar los permisos guardados. 32 bytes al azar en base64 (se genera con `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`). **Secreta.** Si se cambia, todas las familias tienen que volver a conectar. |
| `CRON_SECRET` | Contraseña que tiene que traer quien llama a `/api/gmail/revisar`. Vercel la manda sola en sus cron (como `Authorization: Bearer <CRON_SECRET>`). **Secreta.** |
| `URL_APP` | Ya existe. De acá sale la dirección de vuelta de Google. |

### 1.5 Direcciones (rutas) de la app

| Ruta | Quién | Qué hace |
|---|---|---|
| `GET /api/gmail/conectar` | Felipe | Exige sesión de familiar, arma el `gmail-oauth-estado` y manda a la pantalla de Google. |
| `GET /api/gmail/vuelta` | Felipe | Google vuelve acá. Cambia el código por el permiso, pregunta el mail del abuelo, guarda la `ConexionGmail` y vuelve a `/familia`. |
| `POST /api/gmail/desconectar` | Felipe | Le avisa a Google que se saca el permiso y llama a `borrarConexionGmail`. |
| `GET /api/gmail/revisar` | Inés | El motor. Lo llama el cron cada minuto con `Authorization: Bearer <CRON_SECRET>`. |

**Dirección de vuelta** que Lara carga en Google Cloud (tiene que ser exacta): `<URL_APP>/api/gmail/vuelta`, por ejemplo `https://algo.vercel.app/api/gmail/vuelta`. Para probar en la compu, agregar también `http://localhost:3000/api/gmail/vuelta`.

### 1.6 Permisos que se le piden a Google (*scopes*)

- `https://www.googleapis.com/auth/gmail.modify` — leer, etiquetar, sacar de la bandeja y mandar mails. **No** permite borrar para siempre.
- `openid` y `email` — para saber cuál es el Gmail del abuelo.

En la ida a Google, Felipe pide además `access_type=offline` y `prompt=consent`: sin eso Google no da el permiso guardable.

### 1.7 Nombres dentro del Gmail del abuelo (iguales a los de hoy)

| Nombre | Para qué |
|---|---|
| `ESTAFA` (roja `#cc3a21`) | Mail falso. |
| `DUDOSO` (amarilla `#fad165`) | Mail raro, queda en la bandeja. |
| `IA-revisado` (oculta) | Ya pasó por la IA: no repetir. |
| `Avisos del asistente` | Los avisos que manda el asistente: nunca se analizan. |
| Asunto `⚠️ Cuidado: le llegó un mail falso` | Aviso al abuelo. |
| Asunto `⚠️ Su familiar recibió un mail falso` | Aviso a la familia. |

Se mantienen iguales a propósito: si la demo pasa de Apps Script a la app, no queda nada repetido ni mezclado.

---

## 2. Cómo pasa cada parte de `gmail/` a la app

La lógica es **la misma**. Cambia por dónde se habla con Gmail: en vez de `GmailApp` (que solo existe en Apps Script), se usa la **API de Gmail** (pedidos por internet a Google) con el permiso de cada abuelo. Se usa `fetch` directo, sin instalar la librería de Google (que es muy pesada).

| Hoy en `gmail/` | En la app | Cómo |
|---|---|---|
| Clave de la IA en Propiedades del script | `ANTHROPIC_API_KEY` de Vercel | Ya está cargada. |
| `clasificarConIA` (`clasificar-mail.gs`) | `clasificarMail(remitente, asunto, texto)` en `lib/ia.ts` | Mismas instrucciones y mismo formato `{ categoria, motivo }`. Va en `lib/ia.ts` porque es el único lugar que habla con la IA. |
| Entrar al Gmail | `pedirAccesoGmail(conexion)` en `lib/gmail.ts` | Con el permiso guardado le pide a Google un **pase de 1 hora** (*access token*). Si Google dice que el permiso ya no vale, se guarda `ultimoError` y esa familia se saltea hasta que vuelva a conectar. |
| `buscarMailsNuevos` | `buscarMailsNuevos(acceso, revisarDesde)` | Misma búsqueda: `(in:inbox OR in:spam) after:<revisarDesde> -label:IA-revisado -label:Avisos-del-asistente`, incluyendo Spam. Del más viejo al más nuevo. |
| Leer el mail (`getFrom`, `getSubject`, `getPlainBody`) | `leerMail(acceso, id)` | Se pide el mail completo y se saca remitente, asunto y texto. Si no tiene texto plano, se usa el HTML sin etiquetas. Se recorta a un largo máximo antes de mandarlo a la IA. |
| `obtenerEtiqueta`, `colorearEtiqueta`, `idEtiquetaRevisado` | `asegurarEtiquetas(acceso)` | Crea las 4 etiquetas si faltan (con color y la oculta como oculta) y devuelve sus identificadores. |
| `ponerEtiquetaUnica` | Igual, con la API | Pone una y saca la otra en el mismo pedido: nunca queda ESTAFA y DUDOSO juntas. |
| `hilo.moveToArchive()` | Sacar la etiqueta `INBOX` del hilo | Sale de la bandeja, **no se borra**. En Spam no se toca. |
| `esAvisoPropio` | Igual | Por etiqueta `Avisos del asistente`, o porque lo mandó el propio abuelo con uno de los dos asuntos. |
| `mandarExplicacion` (aviso al abuelo) | `mandarAvisoAlAbuelo(...)` | Se manda **desde el Gmail del abuelo a sí mismo** (como hoy) y se le pone `Avisos del asistente`. Mismo texto, letra grande, sin links, mails ni teléfonos (`quitarDatosDeContacto`, `nombreDelRemitente`, `escaparHtml` se copian igual). |
| `avisarFamilia` + `leer-configuracion.gs` | `avisarALaFamilia(...)` | Los familiares salen directo de `leerConfiguracion(codigo)`, sin pasar por `/api/configuracion`. Los 2 primeros según `orden`, salteando los `PENDIENTE` (como hoy). **Decidido:** este aviso sale del **Gmail del producto** (`enviarMail` de `lib/mail.ts`, con `GMAIL_USUARIO`, el mismo que manda los pedidos de aprobación), **no** del Gmail del abuelo. Así a la familia no le llega un mail "del abuelo" que él no escribió. |
| Respaldo `FAMILIAR_1` / `FAMILIAR_2` | Se borra | Ya no hace falta: la configuración siempre está en la base. |
| `marcarRevisado`, `anotarFallo` (3 intentos) | Igual | Etiqueta `IA-revisado` + `gmail-fallos:...` en la base. |
| `REVISAR_DESDE` | `revisarDesde` dentro de `ConexionGmail` | Uno por familia. |
| `LockService` (candado) | `tomarCandado('gmail:<CODIGO>', 300)` | Ya existe en `lib/datos.ts`. |
| `TOPE_POR_CORRIDA` = 10, `TIEMPO_MAXIMO_MS` | Igual, pero el tiempo se reparte entre todas las familias | Si se acaba el tiempo, los que faltan quedan para el minuto siguiente. |
| `revisarMailsNuevos` (el activador) | `GET /api/gmail/revisar` | Recorre `listarFamiliasConGmail()` y, para cada una, hace lo mismo que hoy. Si una familia falla, sigue con la siguiente. |
| `evaluar-calidad.gs` | Se queda en Apps Script | No tiene que ver con OAuth. Sigue sirviendo para medir la IA. |

**Reglas que no cambian** (las mismas de hoy, una por una):

- **ESTAFA** en la bandeja: etiqueta roja, sale de la bandeja, aviso al abuelo y a la familia.
- **ESTAFA** en Spam: etiqueta roja, se queda en Spam, aviso al abuelo y a la familia.
- **DUDOSO** en la bandeja: etiqueta amarilla, se queda. Sin avisos.
- **DUDOSO o LEGITIMO** en Spam, y **LEGITIMO** en la bandeja: no se hace nada.
- Nunca se borra un mail.
- Los avisos nunca llevan links, mails ni teléfonos del mail falso.

---

## 3. Cada cuánto se revisa (lo decide Lara)

El motor es una dirección (`/api/gmail/revisar`) que alguien tiene que llamar cada minuto.

**Decidido:**

- **Si Vercel lo permite cada minuto** en nuestro plan: se usa el **cron de Vercel** (agregar `vercel.json`).
- **Si no lo permite** (creemos que el plan gratis lo deja correr solo una vez por día): se usa el **activador de Apps Script que ya tenemos** para que llame a la app cada minuto.
- **Lara confirma** cuál de los dos según el plan de Vercel que tengamos.

Si es Apps Script, así queda (lo hace Inés en `gmail/`):

1. Una función nueva `llamarALaApp` en `gmail/llamar-a-la-app.gs`. Lo único que hace es llamar a `<URL_APP>/api/gmail/revisar` con el encabezado `Authorization: Bearer <CRON_SECRET>` y anotar en el registro qué respondió la app. No lee ni toca ningún mail.
2. Propiedades del script que usa: `URL_APP` (ya existe) y `CRON_SECRET` nueva (la misma que está en Vercel; pedírsela a Lara en privado).
3. Un activador cada minuto para `llamarALaApp`, con funciones para instalarlo y sacarlo, igual que `instalarActivador` y `sacarActivador`.
4. Cuando el Gmail de la demo se conecte por la app, se saca el activador viejo (`revisarMailsNuevos`) y queda solo el de `llamarALaApp`. Si quedan los dos, el Gmail de la demo se revisaría dos veces (ver sección 5).

Este activador corre en la cuenta de la demo, pero sirve para **todas** las familias: solo despierta a la app, y la app revisa cada Gmail conectado con su propio permiso.

- Para más adelante existe que Google le avise a la app apenas llega un mail (*push*), pero es bastante más trabajo. No para ahora.

---

## 4. Cosas de Google que hay que saber (Lara)

- `gmail.modify` es un permiso que Google considera **delicado**. Mientras la app esté en modo **"Prueba"** en Google Cloud:
  - Solo pueden conectar los Gmail que Lara cargue como **usuarios de prueba** (hasta 100). Hay que cargar el de la demo y el de cada abuelo que pruebe.
  - Google muestra el cartel "Google no verificó esta app": hay que tocar "Continuar".
  - **El permiso vence a los 7 días.** Después hay que volver a tocar "Conectar Gmail". Para la hackatón alcanza.
- Para que lo use cualquiera sin esos límites, Google pide una verificación con revisión de seguridad, que lleva semanas. Queda para después de la hackatón.

---

## 5. La demo mientras tanto

- El Apps Script de `gmail/` **sigue funcionando** hasta que la app esté probada. No se borra.
- El día que conectemos el Gmail de la demo por la app, primero hay que correr **`sacarActivador`** en Apps Script. Si no, los dos revisan el mismo Gmail a la vez. (Usan las mismas etiquetas, así que no se repetirían casi nunca, pero podrían chocar con un mail justo en el mismo momento.)

---

## 6. Pasos de Inés, en orden

1. En `lib/datos.ts`: el tipo `ConexionGmail` y las 4 funciones. Avisar a Felipe apenas esté en GitHub, porque las necesita.
2. `lib/gmail.ts`: cifrar/descifrar el permiso, pedir el pase de 1 hora, buscar, leer, etiquetar, sacar de la bandeja, mandar.
3. En `lib/ia.ts`: `clasificarMail`, con las mismas instrucciones de `clasificar-mail.gs`.
4. `lib/proteccion-mail.ts`: `protegerMail(...)` con las reglas de la sección 2, y `revisarFamilia(codigo)`.
5. `app/api/gmail/revisar/route.ts`: chequea `CRON_SECRET` y llama a `revisarFamilia` para cada familia.
6. Según lo que confirme Lara: `vercel.json` con el cron, o `gmail/llamar-a-la-app.gs` con su activador (sección 3).
7. Probar en la compu con un Gmail de prueba (no el del abuelo real), cuando el botón de Felipe y las credenciales de Lara estén listos:
   - mandar un mail trucho y uno normal, llamar a `/api/gmail/revisar` y ver que el trucho sale de la bandeja con ESTAFA y llegan los dos avisos (el del abuelo desde su propio Gmail, el de la familia desde el Gmail del producto);
   - volver a llamar y ver que **no** se repite nada;
   - probar uno en Spam;
   - sacar el permiso desde la cuenta de Google y ver que aparece `ultimoError` y no se cae nada.

## 7. Qué necesito de cada uno para poder probar

- **Lara:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_CLAVE_CIFRADO`, `CRON_SECRET` (en privado), mi Gmail de prueba cargado como usuario de prueba, y si Vercel deja revisar cada minuto o usamos Apps Script.
- **Felipe:** el botón andando y guardando con `guardarConexionGmail` y `cifrarPermiso`.
