# Formato de configuración de cada abuelo

Cada abuelo tiene **una configuración**: quién es, a dónde va, a qué comercios les pide cosas, quiénes son sus familiares y qué reglas hay que seguir.

La usan:

- **/abuelo** (Lara): para entender lo que pide el abuelo ("llevame a lo de la nena", "pedí lo de siempre").
- **/familia** (Felipe): la familia la completa charlando con la IA.
- **El script de Gmail** (Inés): lee los familiares desde `/api/configuracion`.

En el código, el formato está en `lib/datos.ts`. Ese archivo es el único que lee y guarda configuraciones, y controla que respeten este formato.

---

## Cómo leer las tablas

- **Obligatorio = Sí**: el campo tiene que estar siempre.
- Cuando todavía no se conoce un dato, se escribe **`"PENDIENTE"`** (así, en mayúsculas). Sirve para textos, teléfonos, mails y coordenadas.
- `true` significa **sí** y `false` significa **no**.
- Una **lista** va entre corchetes: `["lo de Inés", "lo de la nena"]`.

---

## 1. Familia

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `codigoFamilia` | Código para entrar a la app. Se guarda en mayúsculas. | Sí | `"DEMO"` |

## 2. Abuelo (`abuelo`)

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | Nombre y apellido. | Sí | `"Carlos Pérez"` |
| `comoLeGustaQueLeHablen` | Cómo prefiere que le hable la IA: el nombre que usa y si de "vos" o de "usted". | Sí | `"Don Carlos, de usted"` |
| `telefono` | Su teléfono, con código de país. | Sí (puede ser `"PENDIENTE"`) | `"+598 9X XXX XXX"` |
| `direccion` | Dónde vive: calle, número y ciudad. Se pone en los pedidos por WhatsApp para que sepan a dónde llevar. **No inventarla.** | Sí (puede ser `"PENDIENTE"`) | `"Calle 1234, Montevideo"` |
| `ubicacion` | Dónde queda la casa en el mapa, para sugerir lugares y comercios cercanos: `latitud`, `longitud`, `direccionDelMapa` y `fuente` (`"IDE Uruguay"`, `"OpenStreetMap"` o `"Google Maps"`). La pone el sistema; **nunca la IA**. | No (si falta, se busca la dirección) | `{ "latitud": -34.9087, "longitud": -56.1478, "direccionDelMapa": "26 de Marzo 1271, Pocitos, Montevideo", "fuente": "IDE Uruguay" }` |
| `matricula` | Si maneja: la matrícula del auto, en mayúsculas y sin espacios. Sirve para pagar el estacionamiento tarifado desde /abuelo: la app abre el WhatsApp de la Intendencia (099 019 500) con "estacionamiento" escrito y le recuerda la matrícula; al irse, con "fin". Si dijo los minutos, también ofrece un SMS de respaldo (466, "E MATRÍCULA MINUTOS", **a confirmar en la web de la Intendencia de Montevideo**). Datos y fuentes en `lib/estacionamiento-config.ts`. Mientras está estacionado, la app anota desde cuándo (aparte, clave `estacionamiento-abierto:<CÓDIGO>`, no en la configuración) y le avisa si pasó más de una hora. El auto tiene que estar registrado en el sistema de estacionamiento de la Intendencia (matrícula, padrón y su celular): eso lo hace la familia una vez. | No | `"SBA1234"` |

## 3. Lugares (`lugares`) — una lista

Lugares a los que el abuelo suele ir.

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | Nombre claro del lugar. | Sí | `"Casa de Inés"` |
| `apodos` | Otras formas en que el abuelo lo llama. Puede tener varios. Si dos lugares comparten un apodo, la IA tiene que preguntar cuál. | Sí (puede ser `[]`) | `["lo de Inés", "lo de la nena"]` |
| `direccion` | Calle, número y barrio. | Sí (puede ser `"PENDIENTE"`) | `"Av. Luis Alberto de Herrera 1290, Buceo, Montevideo"` |
| `latitud` | Coordenada del mapa (número con punto decimal). **Sacarla de un mapa real, no inventarla.** | Sí (puede ser `"PENDIENTE"`) | `-34.9030628` |
| `longitud` | Coordenada del mapa (número con punto decimal). **Sacarla de un mapa real, no inventarla.** | Sí (puede ser `"PENDIENTE"`) | `-56.1363655` |
| `necesitaPermiso` | `true` si la familia tiene que aprobar antes de que vaya. | Sí | `true` |

## 4. Comercios (`comercios`) — una lista

Comercios a los que el abuelo les pide cosas.

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | Nombre del comercio. | Sí | `"Pizzería Don José"` |
| `apodos` | Otras formas en que el abuelo lo llama. | Sí (puede ser `[]`) | `["lo de siempre"]` |
| `pedidoPor` | Cómo se le pide: `"whatsapp"` (el abuelo manda el mensaje armado) o `"llamada"` (el abuelo toca "Llamar a…" y lee el pedido). | No (si falta, `"whatsapp"`) | `"llamada"` |
| `whatsapp` | Número de WhatsApp, con código de país. | Sí (puede ser `"PENDIENTE"`; en los de llamada lo es) | `"+598 9X XXX XXX"` |
| `telefono` | Teléfono para llamar. | Solo si `pedidoPor` es `"llamada"` (puede ser `"PENDIENTE"`) | `"0800 4242"` |
| `pedidoHabitual` | Lo que pide siempre ("lo de siempre"). | Sí | `"Una muzzarella grande y una fainá"` |
| `necesitaPermiso` | `true` si la familia tiene que aprobar cada pedido. | No (si falta, se toma como `true`: nunca libre por defecto) | `false` |
| `confirmacion` | Solo en los que salieron del catálogo: quién confirmó que el número toma pedidos. `estado`: `"confirmado por su web"` (con `link`) o `"confirmado por la familia"` (vale solo para esta familia), y `fecha`. | No | `{ "estado": "confirmado por la familia", "fecha": "2026-10-23" }` |
| `numeroNoAnda` | Fecha en que el hijo avisó que el número no anda: no se le arman pedidos hasta que pase otro número. | No | `"2026-10-23"` |

## 5. Familiares (`familiares`) — una lista, mínimo uno

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | Nombre del familiar. | Sí | `"Inés"` |
| `relacion` | Qué es del abuelo. | Sí | `"Hija"` |
| `mail` | Su mail. Lo usa el script de Gmail. | Sí (puede ser `"PENDIENTE"`) | `"ines@example.com"` |
| `telefono` | Su teléfono, con código de país. | Sí (puede ser `"PENDIENTE"`) | `"+598 9X XXX XXX"` |
| `orden` | A quién se le pregunta primero: `1` es el primero, `2` el segundo, etc. | Sí | `1` |

## 6. Reglas (`reglas`)

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `nivel` | Cuánta ayuda necesita. Uno de estos tres textos, escrito igual: **`"Independiente"`** (hace casi todo solo; a la familia solo se le avisa), **`"Acompañado"`** (algunas cosas necesitan el OK de la familia) o **`"Cuidado cercano"`** (casi todo pasa por la familia). | Sí | `"Acompañado"` |
| `seAvisa` | Lista de cosas que se le **avisan** a la familia (no hace falta que respondan). | Sí (puede ser `[]`) | `["Cuando sale de su casa hacia un lugar"]` |
| `seAprueba` | Lista de cosas que la familia tiene que **aprobar** antes. | Sí (puede ser `[]`) | `["Ir a un lugar que necesita permiso"]` |
| `abueloAceptoAvisos` | `true` si el abuelo está de acuerdo con que se le avise a la familia lo que dice `seAvisa`. | Sí | `true` |
| `fijas` | Reglas fijas (ver abajo). **No se completan ni se cambian**: la app siempre las pone sola. | — | — |

### Reglas fijas: siempre activas, no se pueden cambiar

Estas reglas valen para **todos** los abuelos y no se pueden apagar. Aunque alguien intente guardar otras, la app las ignora y siempre devuelve estas:

1. En una emergencia, siempre se ayuda a llamar al 911 y se avisa a la familia.
2. Nunca se manda ni se transfiere plata.
3. Si algo parece una estafa, siempre se avisa a la familia.
4. Nunca se dan consejos médicos: se sugiere hablar con un médico o con la familia.

---

## 7. Formas de viajar (`formasDeViajar`)

Cómo puede ir la persona mayor a los lugares. La familia activa las que quiera; el asistente **solo ofrece las activadas**.

| Valor | Qué hace el asistente |
|---|---|
| `"uber"` | Botón **"Ir en Uber"**: abre Uber con el destino puesto. El auto lo pide la persona mayor. |
| `"caminando"` | Botón **"Ir caminando"**: le explica en voz alta y abre Google Maps caminando con el destino puesto. Solo se ofrece si el lugar queda a menos de 1,5 km de su casa. |
| `"colectivo"` | Botón **"Ir en colectivo"**: le explica en voz alta y abre Google Maps en modo colectivo (muestra qué colectivo tomar, la parada y dónde bajarse). |

- Es una lista, por ejemplo `["uber", "caminando", "colectivo"]`. Puede ir vacía (no se ofrecen viajes).
- **No es obligatorio:** si falta (familias guardadas antes de que existiera), se toma como `["uber"]`.
- **Dónde se elige:** en /familia, en la tarjeta de lugares (paso 3, "¿Cómo puede ir?"), con el mismo "Listo". Arranca
  con lo guardado (o solo Uber). Si el hijo lo cambia escribiendo, la IA usa `guardar_formas_de_viajar`.
- **Los permisos no cambian:** si un lugar tiene `necesitaPermiso: true`, primero se le pregunta a la familia, vaya como vaya.

---

## 8. Cómo se maneja (`comoEs`) y cómo va la carga (`armado`)

Los usa /familia para cargar a la persona mayor en 6 pasos (`app/familia/pasos.ts`). **Ninguno es obligatorio.**

| Campo | Qué significa | Ejemplo |
|---|---|---|
| `comoEs.tecnologia` | Cómo se maneja con el celular (paso 2, con botones): `"Se maneja bien"`, `"Le cuesta un poco"` o `"Le cuesta mucho"`. Sirve para proponer el nivel. | `"Le cuesta un poco"` |
| `comoEs.plata` | Cómo maneja la plata: `"La maneja bien"`, `"A veces se confunde"` o `"Ya lo estafaron o casi"`. | `"A veces se confunde"` |
| `armado.hechos` | Los pasos terminados (`"datos"`, `"como-es"`, `"lugares"`, `"comercios"`, `"familiares"`, `"reglas"`). | `["lugares"]` |
| `armado.despues` | Los pasos que el hijo dejó para después ("Completar después"). | `["comercios"]` |

Si falta `armado` (familias cargadas antes de los pasos), los pasos se deducen de lo guardado: una familia con reglas guardadas ya está cargada.

## 9. "Lo que pasó" (se guarda aparte, NO va en la configuración)

Lo que ve el hijo en **/familia/lo-que-paso** (botón "Lo que pasó" de la barra de abajo). Lo anota la app sola, no se
escribe a mano ni va en este archivo de configuración: es una lista por familia (clave `lo-que-paso:<CÓDIGO>`), de la
más nueva a la más vieja, con las últimas 300 cosas. "Restaurar DEMO" la vacía. Código: `lib/lo-que-paso.ts`.

| Campo | Qué significa | Ejemplo |
|---|---|---|
| `cuando` | Fecha y hora (ISO). | `"2026-10-23T18:22:00.000Z"` |
| `tipo` | `"viaje"`, `"pedido"` (por WhatsApp), `"llamada"` (pedido por teléfono), `"estacionamiento"` (estacionó o se fue), `"permiso"`, `"aviso"` (a la familia) o `"mail"`. | `"permiso"` |
| `texto` | Una frase para el hijo. | `"Carlos quiere ir a Montevideo Shopping"` |
| `detalle` | Opcional: qué pidió, a quién se le preguntó, a quiénes les llegó el aviso. | `"Se les preguntó a Inés y Lara"` |
| `aprobacionId` | Solo `permiso`: el pedido de aprobación. El estado (aprobado, rechazado, nadie contestó, esperando) se lee de ahí al mostrarlo, así siempre está al día. | `"9f2c…"` |
| `mail` | Solo `mail`: `categoria` (`"ESTAFA"` o `"DUDOSO"`), `motivo` (por qué, una frase), y opcionales `de` (solo el nombre) y `asunto`. **Nunca** links, mails ni teléfonos del mail: se reemplazan por `[link]`, `[mail]`, `[teléfono]`. | `{ "categoria": "ESTAFA", "motivo": "Pide la clave del banco" }` |

Quién anota cada cosa: viajes, pedidos y estacionamiento, `app/abuelo/acciones.ts`; permisos, `lib/aprobaciones.ts`; avisos de
emergencia, ubicación, posible estafa y pedido de plata, `lib/emergencia.ts`; resumen del día, `lib/resumen.ts`
(un aviso se anota solo si le llegó a alguien). Los mails los manda el script de Gmail
(`gmail/avisar-a-la-app.gs`) a `POST /api/mail-marcado`, con la misma clave que `/api/configuracion`:

```
POST /api/mail-marcado
Authorization: Bearer <CONFIG_API_TOKEN>
{ "codigo": "DEMO", "categoria": "ESTAFA", "motivo": "Pide la clave del banco", "de": "BROU Seguridad", "asunto": "Su cuenta será bloqueada" }
```

---

## Ejemplo completo: familia DEMO (Montevideo)

Es lo que devuelve `/api/configuracion?codigo=DEMO`:

```json
{
  "codigoFamilia": "DEMO",
  "abuelo": {
    "nombre": "Carlos Pérez",
    "comoLeGustaQueLeHablen": "Don Carlos, de usted",
    "telefono": "+598 92 158 202",
    "direccion": "Juan Benito Blanco 780, Montevideo"
  },
  "lugares": [
    {
      "nombre": "Casa de Inés",
      "apodos": ["lo de Inés", "lo de la nena"],
      "direccion": "Av. Sarmiento 2640, Montevideo",
      "latitud": -34.914315,
      "longitud": -56.1553672,
      "necesitaPermiso": false
    },
    {
      "nombre": "Casa de Lara",
      "apodos": ["lo de Lara", "lo de la nena"],
      "direccion": "José Ellauri 407, 11300 Montevideo",
      "latitud": -34.9226593,
      "longitud": -56.1591087,
      "necesitaPermiso": false
    },
    {
      "nombre": "Montevideo Shopping",
      "apodos": ["el shopping"],
      "direccion": "Av. Luis Alberto de Herrera 1290, Buceo, Montevideo",
      "latitud": -34.9030628,
      "longitud": -56.1363655,
      "necesitaPermiso": true
    }
  ],
  "comercios": [
    {
      "nombre": "Pizzería Don José",
      "apodos": ["lo de siempre"],
      "whatsapp": "+598 92 625 554",
      "pedidoHabitual": "Una muzzarella grande y una fainá",
      "necesitaPermiso": false
    }
  ],
  "familiares": [
    { "nombre": "Inés", "relacion": "Hija", "mail": "inesbertolotti06@gmail.com", "telefono": "+598 97 412 006", "orden": 1 },
    { "nombre": "Lara", "relacion": "Hija", "mail": "larastirlingterra29@gmail.com", "telefono": "+598 91 437 402", "orden": 2 }
  ],
  "reglas": {
    "nivel": "Acompañado",
    "seAvisa": ["Cuando sale de su casa hacia un lugar", "Cuando hace un pedido a un comercio"],
    "seAprueba": ["Ir a un lugar que necesita permiso", "Pedir algo que no es el pedido habitual"],
    "abueloAceptoAvisos": true,
    "fijas": [
      "En una emergencia, siempre se ayuda a llamar al 911 y se avisa a la familia.",
      "Nunca se manda ni se transfiere plata.",
      "Si algo parece una estafa, siempre se avisa a la familia.",
      "Nunca se dan consejos médicos: se sugiere hablar con un médico o con la familia."
    ]
  },
  "formasDeViajar": ["uber", "caminando", "colectivo"]
}
```

**Para probar a la IA:** "lo de la nena" es apodo de **dos** lugares (Casa de Inés y Casa de Lara). Si el abuelo dice "llevame a lo de la nena", la IA tiene que preguntarle a cuál.

### De dónde salieron los datos del ejemplo

- **Montevideo Shopping:** dirección y coordenadas de OpenStreetMap, buscadas con Nominatim ([objeto 37684509](https://www.openstreetmap.org/way/37684509)).
- **Casa de Inés** (Av. Sarmiento 2640) y **Casa de Lara** (José Ellauri 407): las direcciones las pasó el equipo. Las coordenadas son de OpenStreetMap, buscadas con Nominatim, que encontró el número de puerta exacto ([objeto 944843090](https://www.openstreetmap.org/node/944843090) y [objeto 944322391](https://www.openstreetmap.org/node/944322391)).
- **Teléfono y dirección del abuelo**, **mails y teléfonos de los familiares** y **WhatsApp** de la pizzería: los pasó el equipo.
