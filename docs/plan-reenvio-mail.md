# Plan: protección de mail con reenvío automático de Gmail

Estado: **aprobado por Inés (2026-10-23)**, con las decisiones de la sección 7. Todavía no hay nada programado.

## La idea en una frase

Cada abuelo le reenvía una copia de sus mails a un Gmail central de Contigo, a una dirección con el código de su familia (`GMAIL_CENTRAL` + `+CODIGO`). Un script en ese Gmail revisa las copias cada 5 minutos, le pregunta a la app si tiene que analizar cada una, y si es una estafa o es dudoso, avisa en la app. Sin OAuth: el abuelo solo cambia una opción en su Gmail.

```
Gmail del abuelo ──(reenviar una copia a central+PEREZ@gmail.com)──► Gmail central (script cada 5 min)
                                                                        │
                                                    ├─► app: ¿lo analizo? (¿ya lo revisé? ¿de confianza? ¿tope?)
                                                    ├─► IA (claude-haiku-5-5), solo el principio del mail
                                                    └─► app: guardar el aviso + notificación al celular
```

**`GMAIL_CENTRAL`:** la dirección del Gmail central. **Falta que Inés la pase.** En este plan, `central+PEREZ@gmail.com` es un ejemplo.

**El script de `gmail/` no se toca.** La versión que corre en la cuenta de carloscontigo2 tiene que seguir andando igual, como plan B. El script central va en una carpeta nueva, **`gmail-central/`**.

---

## 1. Por qué antes se analizaban los mismos mails una y otra vez

No llegamos a ver el registro de ejecuciones del script viejo, así que esto sale de leer el código. Encontré estas causas:

1. **El modelo era Opus 5.5** desde el primer día (`gmail/clasificar-mail.gs`) hasta que Felipe lo cambió a Haiku. Opus sale unas 40 veces más caro.
2. **Las funciones de prueba repiten siempre los mismos mails.** `protegerUltimosMails`, `etiquetarUltimosMails` y `clasificarUltimoMail` le mandan a la IA los últimos mails de la bandeja cada vez que se corren, aunque ya se hayan revisado. `protegerUltimosMails` les pone la marca "IA-revisado", pero nunca la mira antes de analizar. Y `evaluarCalidad` manda los 18 mails de la planilla cada vez que se corre.
3. **En la revisión automática, la marca "ya revisado" se ponía después de la IA, no antes.** Si algo fallaba después de que la IA ya contestó (y ya había cobrado), el mail se volvía a analizar hasta 3 veces. Puede fallar por ejemplo al mandar el mail de aviso (Google deja mandar a 100 personas por día), si Gmail da error o si la IA tarda más de lo que espera el script.
4. **Si Google cortaba el script por tiempo** (6 minutos como máximo), ni siquiera se anotaba el fallo. El mail quedaba sin marca y se volvía a analizar en la corrida siguiente, sin límite.
5. **Se analizaba todo**: cada mail de la bandeja y de Spam, con el texto completo (los newsletters pueden ser larguísimos), cada 1 minuto y sin tope por día.

### Cómo lo evitamos en el script nuevo

- **Primero se anota, después se analiza.** Antes de llamar a la IA, el script le pregunta a la app (puerta `puedo-revisar`). La app anota el Message-ID como revisado en ese mismo momento, de una sola vez. Si después algo falla o Google corta el script, ese mail no se vuelve a analizar nunca. En el peor caso se pierde la revisión de un mail, pero nunca se paga dos veces.
- **No se reintenta.** Si la IA da error, se anota en el registro y se sigue con el siguiente.
- **El Message-ID se guarda en la app, no en Gmail.** El Message-ID es un número único que trae cada mail. Así no importa si la copia se borra, se mueve o llega dos veces.
- **Topes:** 30 mails por familia por día, 300 entre todas las familias por día y 20 por corrida.
- **Solo el principio del mail:** los primeros 1500 caracteres. La respuesta de la IA también tiene un máximo chico (hoy el máximo es 16.000 tokens, o pedazos de palabra; lo bajamos a 500).
- **No pasan por la IA:** los remitentes de confianza, los familiares, el mail de confirmación de Google y los mails que no son un reenvío de verdad.
- **IA simulada para probar:** si la propiedad `IA_SIMULADA` del script dice `ESTAFA`, `DUDOSO` o `LEGITIMO`, el script no llama a la IA y usa esa respuesta. Así se prueba todo sin gastar.
- **El proyecto central no tiene funciones de prueba que repitan mails.**

---

## 2. Cómo funciona, paso a paso

**Una sola vez por familia (pantalla de activación de Felipe, en /familia):**

1. La pantalla le muestra al hijo la dirección exacta para su familia, por ejemplo `central+PEREZ@gmail.com`, con un botón para copiarla.
2. Le explica cómo entrar al Gmail del abuelo: Configuración → Reenvío → "Agregar una dirección de reenvío", y pegar esa dirección.
3. Google le manda al Gmail central un mail con un código de confirmación. Ese mail también llega a la dirección con el código de la familia, así que el script sabe de qué familia es. El script lo confirma solo. Si no puede, la app le muestra el código al hijo para que lo escriba en el Gmail del abuelo.
4. El hijo elige "Reenviar una copia" y guarda.
5. La pantalla muestra "Protección activa" y el Gmail del abuelo, que la app saca del mail de confirmación.

**Cada 5 minutos (script en el Gmail central), con cada copia que llegó:**

1. Si es el mail de confirmación de Google (`forwarding-noreply@google.com`), lo confirma, le avisa a la app y lo manda a la papelera. **Sin IA.**
2. Lee el código de la familia en la dirección a la que llegó: lo que va después del `+` en `Delivered-To`. Si no tiene código, lo anota y lo manda a la papelera. **Sin IA.**
3. Lee el Gmail del abuelo en `X-Forwarded-For` y el Message-ID. Si no tiene `X-Forwarded-For`, no es un reenvío: alguien escribió directo a la dirección central. Lo anota y lo manda a la papelera. **Sin IA.**
4. Le pregunta a la app con la puerta `puedo-revisar`. La app contesta que no si: no existe esa familia, la protección no está activa, el Gmail del abuelo no es el que se confirmó, ya revisó ese mail, el remitente es de confianza o se llegó a un tope del día. Si contesta que no, lo manda a la papelera. **Sin IA.**
5. Le manda a la IA (`claude-haiku-5-5`) el remitente, el asunto y los primeros 1500 caracteres. **Una sola vez.**
6. Si es **ESTAFA** o **DUDOSO**, se lo manda a la app con la puerta `aviso`.
7. Manda la copia a la papelera. Así el Gmail central no junta los mails de los abuelos, y Gmail la borra sola a los 30 días.

**Lo que ve cada uno:**

| Resultado | Abuelo (en /abuelo) | Familia (en /familia) | Celular de la familia |
|---|---|---|---|
| ESTAFA | Cartel rojo: "Le llegó un mail falso de [remitente]" y el motivo | El aviso, con remitente, motivo y fecha | Notificación: "Mail falso a [abuelo]: [remitente]. [motivo]" |
| DUDOSO | Cartel amarillo: "Llegó un mail dudoso de [remitente], tenga cuidado" | "Llegó un mail dudoso de [remitente], tené cuidado" | No |
| LEGITIMO | Nada | Nada | No |

**Nunca se guarda el texto del mail.** La app guarda solo el aviso (remitente, motivo, fecha) y el Message-ID para no repetir. Del remitente se guarda el nombre que muestra el mail ("BROU Seguridad"), no la dirección, igual que hoy en `nombreDelRemitente`. Del motivo se borran links, mails y teléfonos, igual que hoy en `quitarDatosDeContacto`.

---

## 3. Nombres exactos que vamos a usar los tres

### 3.1 Puertas nuevas de la app (Lara)

Las tres piden el mismo encabezado que `/api/configuracion` usa hoy: `Authorization: Bearer <CONFIG_API_TOKEN>`.

**`POST /api/mail/puedo-revisar`**: "¿analizo este mail?". La app lo anota como revisado en ese mismo momento.

```json
// Lo que manda el script
{ "codigoFamilia": "PEREZ", "gmailAbuelo": "carlos@gmail.com",
  "messageId": "<abc123@mail.algo.com>",
  "remitente": "avisos@brou.com.uy", "remitenteVerificado": true }

// Respuesta si hay que analizarlo
{ "revisar": true }

// Respuesta si no
{ "revisar": false, "motivo": "ya-revisado" }
// motivo puede ser: familia-desconocida | proteccion-apagada | otro-gmail | ya-revisado
//                   | remitente-de-confianza | tope-familia | tope-total
```

- `gmailAbuelo` sale de `X-Forwarded-For`. Si no es el que quedó guardado al confirmar el reenvío, la respuesta es `otro-gmail`. Así nadie puede usar la dirección de una familia para mandar mails que no vienen del abuelo.
- `remitenteVerificado` dice si Gmail comprobó que el remitente es de verdad quien dice ser (`dmarc=pass` en el encabezado `Authentication-Results`). Un remitente de confianza solo se saltea si viene verificado, porque un estafador puede poner como remitente una dirección que no es suya.

**`POST /api/mail/aviso`**: guarda el aviso y, si es estafa, manda la notificación al celular.

```json
{ "codigoFamilia": "PEREZ", "messageId": "<abc123@mail.algo.com>",
  "categoria": "ESTAFA", "remitente": "BROU Seguridad",
  "motivo": "Pide su clave con apuro. El BROU nunca pide la clave por mail.",
  "fecha": "2026-10-23T14:05:00-03:00" }
// Respuesta: { "ok": true, "notificados": ["Ana", "Pedro"] }
```

**`POST /api/mail/reenvio`**: el script avisa que llegó el mail de confirmación de Google.

```json
{ "codigoFamilia": "PEREZ", "gmailAbuelo": "carlos@gmail.com",
  "codigoConfirmacion": "123456789", "confirmado": true }
// Respuesta: { "ok": true }
```

`confirmado: false` quiere decir que el script no lo pudo confirmar solo: la pantalla de Felipe le muestra el código al hijo.

### 3.2 Datos nuevos por familia (en `ConfiguracionAbuelo`, `lib/datos.ts`)

| Campo | Qué es | Quién lo carga |
|---|---|---|
| `proteccionMail` | `{ estado, gmailAbuelo?, codigoConfirmacion?, desde? }`. `estado` puede ser `"sin-activar"`, `"esperando-confirmacion"`, `"activa"` o `"apagada"`. `gmailAbuelo` es el Gmail que pidió el reenvío, en minúsculas | La app, con lo que avisa el script. El hijo solo la apaga o la prende |
| `remitentesDeConfianza` | Lista de direcciones exactas que no se analizan, por ejemplo `["medico@clinica.com.uy"]`. Los mails de los familiares cuentan solos | El hijo, en la pantalla de activación |

Ya no hace falta que el hijo escriba el Gmail del abuelo: la familia sale de la dirección con `+CODIGO`, y el Gmail del abuelo, del mail de confirmación de Google.

### 3.3 Datos que se guardan aparte (en Redis, como los avisos de hoy)

| Clave | Qué guarda | Cuánto dura |
|---|---|---|
| `mail-revisado:<CODIGO>:<messageId>` | Que ese mail ya se revisó | 30 días |
| `mails-del-dia:<fecha>:<CODIGO>` | Cuántos mails se analizaron hoy de esa familia | 2 días |
| `mails-del-dia:<fecha>:TOTAL` | Cuántos mails se analizaron hoy entre todas las familias | 2 días |
| `avisos-mail:<CODIGO>` | Los últimos 20 avisos `{ categoria, remitente, motivo, fecha, messageId }` | Los últimos 20 |

Las estafas también se anotan en el diario (`anotarEnElDiario`, tipo `estafa`), así salen en el resumen de la noche.

### 3.4 Variables nuevas en Vercel (Lara)

| Variable | Qué es | Si queda vacía |
|---|---|---|
| `TOPE_MAILS_POR_FAMILIA_POR_DIA` | Máximo de mails que se analizan por familia por día | 30 |
| `TOPE_MAILS_TOTAL_POR_DIA` | Máximo de todas las familias juntas por día | 300 |
| `GMAIL_CENTRAL` | La dirección del Gmail central, para que la pantalla de activación arme `central+CODIGO@gmail.com` | No se muestra la pantalla de activación |

### 3.5 Propiedades del script central (Inés)

| Propiedad | Qué es | Obligatoria |
|---|---|---|
| `ANTHROPIC_API_KEY` | La clave de la IA (igual que hoy) | Sí |
| `URL_APP` | La dirección de la app (igual que hoy) | Sí |
| `CONFIG_API_TOKEN` | La contraseña de las puertas (igual que hoy) | Sí |
| `TOPE_POR_CORRIDA` | Máximo de mails que se analizan en cada corrida | No (20) |
| `CARACTERES_PARA_LA_IA` | Cuánto del principio del mail se manda | No (1500) |
| `IA_SIMULADA` | `ESTAFA`, `DUDOSO` o `LEGITIMO` para probar sin gastar | No (vacía = IA real) |

### 3.6 Carpeta `gmail-central/` y sus funciones (Inés)

Es un proyecto de Apps Script aparte, en la cuenta del Gmail central, con su propio `.clasp.json`. Apps Script no deja usar el código de otro proyecto sin más, así que las funciones que se reutilizan de `gmail/` se copian (`gmail/` no se toca).

| Función | Qué hace | ¿Usa la IA? |
|---|---|---|
| `revisarReenvios` | La que corre el activador cada 5 minutos | Sí, solo con los mails que la app aprueba |
| `instalarActivador` / `sacarActivador` | Prenden y apagan el activador (copiadas de `gmail/`) | No |
| `codigoDeFamilia` | Lee el código después del `+` en `Delivered-To` | No |
| `confirmarReenvio` | Confirma el mail de Google y le avisa a la app | No |
| `clasificarConIA` | La de `gmail/`, mandando solo el principio del mail y con respuesta corta | Sí |
| `probarEncabezados` | Muestra en el registro los encabezados de las últimas 5 copias | No |
| `probarConfirmarReenvio` | Prueba la confirmación con el último mail de Google | No |

**Qué se copia de `gmail/`:** `clasificarConIA`, las instrucciones de la IA y el formato de respuesta, `nombreDelRemitente`, `quitarDatosDeContacto`, el candado para que no corran dos a la vez, el corte por tiempo, `instalarActivador`/`sacarActivador` y la forma de hablar con la app (de `leer-configuracion.gs`).

**Qué no va en el central:** las etiquetas ESTAFA/DUDOSO, archivar mails, los mails de aviso (ahora los avisos van por la app, y así no chocamos con el límite de 100 mails por día de Google) y las funciones de prueba que repiten mails.

---

## 4. Quién hace qué

### Lara: las puertas, las notificaciones y los avisos
1. Las tres puertas: `/api/mail/puedo-revisar`, `/api/mail/aviso` y `/api/mail/reenvio`.
2. Los datos aparte (sección 3.3) y los topes (sección 3.4). Lo más importante: que "ya revisado" y el contador del día se anoten de una sola vez, con `SET NX` de Redis, como hoy en `tomarCandado`.
3. La notificación de estafa al celular, con `notificarAFamiliar` (ya existe en `lib/notificaciones.ts`), y anotarla en el diario.
4. Los carteles de ESTAFA y DUDOSO en /abuelo.
5. La lista de avisos de mail en /familia (leyendo `avisos-mail:<CODIGO>`).

### Felipe: la pantalla de activación en /familia
1. La dirección de la familia (`GMAIL_CENTRAL` con `+CODIGO`) con botón para copiarla.
2. El paso a paso para activar el reenvío en el Gmail del abuelo.
3. El estado (`proteccionMail.estado`) y el Gmail del abuelo cuando ya está activa.
4. El código de confirmación en grande, si el script no lo pudo confirmar solo.
5. Un botón para apagar y prender la protección.
6. Los remitentes de confianza (`remitentesDeConfianza`): agregar y sacar. **A confirmar** con Felipe que entra en su pantalla.

### Inés: el script central
1. Crear el proyecto de Apps Script en el Gmail central y conectarlo con clasp en `gmail-central/`.
2. Las pruebas de la primera hora (sección 6).
3. Programar el script (sección 3.6), copiando lo que sirve de `gmail/`.
4. Un `gmail-central/README.md` y actualizar `docs/formato-configuracion.md`.

---

## 5. Límites de Google Apps Script que nos pueden afectar

Son límites por día, de la cuenta del Gmail central. Se comparten entre **todas** las familias. Están en la [página de cuotas de Google](https://developers.google.com/apps-script/guides/services/quotas).

| Límite | Cuenta Gmail común | Google Workspace (pago) | ¿Nos afecta? |
|---|---|---|---|
| Tiempo total de los activadores | **90 minutos por día** | 6 horas por día | **Es el primero que se acaba** |
| Tiempo por corrida | 6 minutos | 6 minutos | Lo cuidamos cortando a los 4 minutos |
| Llamadas a afuera (IA y app) | 20.000 por día | 100.000 por día | Holgado: hasta 3 llamadas por mail |
| Lecturas y cambios en Gmail | 20.000 por día | 50.000 por día | Holgado: unas 5 a 8 por copia |
| Mails enviados | 100 destinatarios por día | 1.500 por día | Ya no nos afecta: no mandamos mails |
| Propiedades del script | 50.000 por día | 500.000 por día | Casi no se usan |

**La cuenta con el tiempo:** cada 5 minutos son 288 corridas por día. Una corrida sin mails nuevos tarda unos 2 segundos, o sea unos 10 minutos por día. Quedan unos 80 minutos para los mails. Un mail analizado tarda unos 5 segundos (IA más dos llamadas a la app) y uno salteado, 1 o 2 segundos. **Calculamos que alcanza para unas 600 a 900 copias por día entre todas las familias**, por ejemplo unas 15 familias de 50 mails por día. Son números estimados: hay que medirlos en la prueba.

**Si nos quedamos cortos:** pasar el Gmail central a Google Workspace (6 horas por día), o repartir las familias en dos Gmail centrales.

**Lo que cuesta la IA:** con Haiku, cada mail analizado (remitente, asunto y 1500 caracteres) sale alrededor de 0,0002 dólares. Con el tope de 300 mails por día entre todas las familias, son unos 0,06 dólares por día.

**Otras cosas de Gmail para tener en cuenta:**
- Gmail **no reenvía** los mails que ya mandó a Spam en la cuenta del abuelo. Esos no se revisan, pero ya están fuera de la bandeja.
- Después de activar el reenvío, el Gmail del abuelo muestra un aviso de "se están reenviando tus mails" durante unos días. El hijo tiene que saberlo para que el abuelo no se asuste.

---

## 6. Pruebas de la primera hora (las tres dudas)

Se hacen con un Gmail de prueba como "abuelo" (no el de un abuelo de verdad) y con el Gmail central. Como "familia" se usa un código de prueba, por ejemplo `PRUEBA`. **Ninguna usa la IA real.**

### Duda 1: ¿el script puede confirmar el reenvío solo? (unos 20 minutos)
1. En el Gmail de prueba del abuelo: Configuración → Reenvío → agregar `central+PRUEBA@gmail.com`.
2. En el Gmail central, mirar el mail de Google: de quién viene, el asunto, el link, el código y si llegó a la dirección con `+PRUEBA`.
3. Correr `probarConfirmarReenvio`: abre el link desde el script y anota en el registro qué contestó Google.
4. En el Gmail del abuelo, recargar Configuración → Reenvío: ¿ya figura como confirmado?
- **Si funciona:** queda automático.
- **Si no** (por ejemplo, porque el link abre una página con un botón "Confirmar"): plan B. El script le pasa el código a la app (`/api/mail/reenvio`, con `confirmado: false`) y la pantalla de Felipe se lo muestra al hijo para que lo escriba en el Gmail del abuelo. Es un paso más, pero sigue sin OAuth.

### Duda 2: ¿el script sabe de qué familia es cada copia? (unos 20 minutos)
1. Con el reenvío activo, mandarle al Gmail de prueba del abuelo 3 mails: uno normal, uno donde el abuelo va en copia oculta (CCO) y uno de una lista o newsletter.
2. Correr `probarEncabezados`: muestra `Delivered-To`, `X-Forwarded-For`, `To`, `Message-ID` y `Authentication-Results` de cada copia.
- **Funciona si** en los 3 casos `Delivered-To` trae `central+PRUEBA@gmail.com` y `X-Forwarded-For` trae el Gmail del abuelo. También se mira si `Authentication-Results` trae `dmarc=pass`, para los remitentes de confianza.
- **Si no:** la otra forma es leer el Gmail del abuelo en `X-Forwarded-For` y buscar su familia en la app (la idea del plan anterior).

### Duda 3: ¿las notificaciones llegan al celular en Android y en iPhone? (unos 20 minutos)
Esto ya existe en la app: la página **/avisos** tiene "Activar avisos" y "Probar aviso".
1. **Android:** abrir la app en Chrome → /avisos → activar → "Probar aviso". Probar también con la app cerrada y el celular bloqueado.
2. **iPhone:** necesita iOS 16.4 o más nuevo. En Safari: Compartir → "Agregar a inicio", abrir la app desde el ícono → /avisos → activar → "Probar aviso". Probar también con la app cerrada y el celular bloqueado.
3. Cuando Lara tenga la puerta `aviso`, repetir con un aviso de estafa de mentira (`IA_SIMULADA` = `ESTAFA`).
- **Si en iPhone no llega:** revisar la versión de iOS y que se haya abierto desde el ícono, no desde Safari. El aviso queda igual en /familia.

**Llamadas a la IA real en la primera hora: 0.** Recién al final, con todo andando, 1 o 2 mails reales para confirmar.

---

## 7. Decisiones

**Tomadas por Inés (2026-10-23):**
1. El script central va en la carpeta nueva `gmail-central/`. `gmail/` no se toca: la versión de carloscontigo2 sigue andando igual, como plan B.
2. Topes: 30 mails por familia por día y 300 en total.
3. La lista de avisos de mail en /familia la hace Lara. Felipe hace la pantalla de activación en /familia.
4. La familia de cada copia sale de la dirección con el código (`central+CODIGO@gmail.com`), no de los encabezados. Igual se corre `probarEncabezados` para confirmarlo.

**Pendientes:**
1. **La dirección del Gmail central** (`GMAIL_CENTRAL`).
2. **El código de la familia también sirve para entrar a la app como abuelo** (`app/acciones.ts`). Ponerlo en la dirección de reenvío lo deja escrito en la configuración del Gmail del abuelo. Los que mandan mails no lo ven, así que el riesgo es bajo. Si lo prefieren, se puede usar un código aparte solo para el mail, por ejemplo `proteccionMail.codigoMail` con 10 letras al azar.
3. Confirmar con Felipe que los remitentes de confianza entran en su pantalla de activación.
