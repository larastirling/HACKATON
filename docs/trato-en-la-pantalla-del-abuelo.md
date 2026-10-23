# Textos fijos de /abuelo en usted o vos (para Lara)

Desde el 2026-10-23 los textos fijos de la pantalla del abuelo siguen el trato que eligió la familia en /familia
("de usted" o "de vos", en `abuelo.comoLeGustaQueLeHablen`). Si no eligió, quedan de usted, como antes.

**Cómo funciona:** la página (`app/abuelo/page.tsx`) lee el trato y envuelve todo en `<ConTrato>` (`app/abuelo/trato.tsx`).
Cada componente hace `const t = useTrato()` y escribe el texto en las dos formas: `t('Toque acá', 'Tocá acá')`.
**Si agregás un texto nuevo para el abuelo, escribilo así, en las dos formas.** Los textos sin trato (por ejemplo
"Llamar al 911", "Ir en Uber", "Enviar") quedaron igual. El trato de la IA está en `lib/trato.ts` y `lib/ia.ts`.

Son 35 textos en 6 archivos:

## `app/abuelo/Charla.tsx`

| De usted (como estaba) | De vos (nuevo) |
|---|---|
| Toque “Abrir WhatsApp” y después apriete Enviar para terminar el estacionamiento. | Tocá “Abrir WhatsApp” y después apretá Enviar para terminar el estacionamiento. |
| Toque “Hablar” y dígame lo que necesita, o escríbalo abajo. / Escriba abajo lo que necesita y toque Enviar. | Tocá “Hablar” y decime lo que necesitás, o escribilo abajo. / Escribí abajo lo que necesitás y tocá Enviar. |
| Usted (quién escribió) | Vos |
| No pude responder, pruebe de nuevo. | No pude responder, probá de nuevo. |
| Escriba su mensaje (para lectores de pantalla) | Escribí tu mensaje |
| Escriba acá o toque Hablar… / Escriba acá… | Escribí acá o tocá Hablar… / Escribí acá… |
| Escuchando... toque para terminar | Escuchando... tocá para terminar |
| Le abro el mapa para ir caminando. Cuando se abra, toque "Iniciar" y siga la flecha azul. / Le abro el mapa con los colectivos. Ahí le muestra qué colectivo tomar, dónde está la parada y dónde bajarse. | Te abro el mapa para ir caminando. Cuando se abra, tocá "Iniciar" y seguí la flecha azul. / Te abro el mapa con los colectivos. Ahí te muestra qué colectivo tomar, dónde está la parada y dónde bajarte. |
| No dé ningún dato, clave ni código. / No mande plata. / Corte y hable con su familia. | No des ningún dato, clave ni código. / No mandes plata. / Cortá y hablá con tu familia. |
| Cuando atiendan, lea esto | Cuando atiendan, leé esto |
| Después toque “Enviar” en WhatsApp. | Después tocá “Enviar” en WhatsApp. |
| Le pregunté a [familiares], espere un momento... | Le pregunté a [familiares], esperá un momento... |
| [quién] aprobó el viaje. Toque cómo quiere ir. | [quién] aprobó el viaje. Tocá cómo querés ir. |
| [quién] aprobó el pedido. Toque el botón verde para llamar y, cuando atiendan, lea el texto. / … Toque el botón verde para abrir WhatsApp y después apriete enviar. | [quién] aprobó el pedido. Tocá el botón verde para llamar y, cuando atiendan, leé el texto. / … Tocá el botón verde para abrir WhatsApp y después apretá enviar. |
| [quién] dijo que sí. Si quiere organizarlo, puede llamar a [quién]. | [quién] dijo que sí. Si querés organizarlo, podés llamar a [quién]. |
| [quién] dijo que esta vez no. Quédese tranquilo: si quiere, puede llamar a [quién] para hablarlo. | [quién] dijo que esta vez no. Quedate tranquilo: si querés, podés llamar a [quién] para hablarlo. |
| Nadie pudo contestar ahora. ¿Quiere llamar a [familiar]? / … Pruebe de nuevo en un rato. | Nadie pudo contestar ahora. ¿Querés llamar a [familiar]? / … Probá de nuevo en un rato. |
| No pude saber si la familia contestó. Pruebe llamarlos. | No pude saber si la familia contestó. Probá llamarlos. |

## `app/abuelo/voz.ts`

| De usted (como estaba) | De vos (nuevo) |
|---|---|
| Para dictar, use el micrófono del teclado. | Para dictar, usá el micrófono del teclado. |
| No le escuché. Toque "Hablar" y hable de nuevo. | No te escuché. Tocá "Hablar" y hablá de nuevo. |
| No pude escuchar. Pruebe de nuevo o para dictar, use el micrófono del teclado. | No pude escuchar. Probá de nuevo o para dictar, usá el micrófono del teclado. |

## `app/abuelo/BotonAyuda.tsx`

| De usted (como estaba) | De vos (nuevo) |
|---|---|
| ¿Le atendió? | ¿Te atendió? |

## `app/abuelo/InvitarAInstalar.tsx`

| De usted (como estaba) | De vos (nuevo) |
|---|---|
| ¿Quiere tener el Asistente como una app? Toque aquí y le mostramos cómo | ¿Querés tener el Asistente como una app? Tocá acá y te mostramos cómo |
| Después, abra el Asistente desde el ícono nuevo: el corazón azul. | Después, abrí el Asistente desde el ícono nuevo: el corazón azul. |
| Abra esta página en Safari. | Abrí esta página en Safari. |
| Toque el botón Compartir… | Tocá el botón Compartir… |
| Elija “Agregar a pantalla de inicio”. Si no lo ve, deslice la lista hacia arriba. | Elegí “Agregar a pantalla de inicio”. Si no lo ves, deslizá la lista hacia arriba. |
| Toque “Agregar”. (iPhone) | Tocá “Agregar”. |
| Abra esta página en Chrome. | Abrí esta página en Chrome. |
| Toque los tres puntitos (⋮)… | Tocá los tres puntitos (⋮)… |
| Elija “Agregar a pantalla de inicio” o “Instalar app”. | Elegí “Agregar a pantalla de inicio” o “Instalar app”. |
| Toque “Agregar” o “Instalar”. | Tocá “Agregar” o “Instalar”. |

## `components/BotonSalir.tsx`

| De usted (como estaba) | De vos (nuevo) |
|---|---|
| ¿Quiere salir? / Si sale, para volver a entrar va a tener que tocar “Soy el abuelo” y “Entrar” de nuevo. | ¿Querés salir? / Si salís, para volver a entrar vas a tener que tocar “Soy el abuelo” y “Entrar” de nuevo. |

## `app/abuelo/page.tsx`

| De usted (como estaba) | De vos (nuevo) |
|---|---|
| ¿En qué lo ayudo? (título) | ¿En qué te ayudo? |
| Le recuerdo que estaba esperando que la familia conteste para [qué]. | Te recuerdo que estabas esperando que la familia conteste para [qué]. |
