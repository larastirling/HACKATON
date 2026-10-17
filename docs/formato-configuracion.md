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
- Una **lista** va entre corchetes: `["lo de Laura", "lo de la nena"]`.

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

## 3. Lugares (`lugares`) — una lista

Lugares a los que el abuelo suele ir.

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | Nombre claro del lugar. | Sí | `"Casa de Laura"` |
| `apodos` | Otras formas en que el abuelo lo llama. Puede tener varios. Si dos lugares comparten un apodo, la IA tiene que preguntar cuál. | Sí (puede ser `[]`) | `["lo de Laura", "lo de la nena"]` |
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
| `whatsapp` | Número de WhatsApp, con código de país. | Sí (puede ser `"PENDIENTE"`) | `"+598 9X XXX XXX"` |
| `pedidoHabitual` | Lo que pide siempre ("lo de siempre"). | Sí | `"Una muzzarella grande y una fainá"` |

## 5. Familiares (`familiares`) — una lista, mínimo uno

| Campo | Qué significa | Obligatorio | Ejemplo |
|---|---|---|---|
| `nombre` | Nombre del familiar. | Sí | `"Inés"` |
| `relacion` | Qué es del abuelo. | Sí | `"Hija"` |
| `mail` | Su mail. Lo usa el script de Gmail. | Sí (puede ser `"PENDIENTE"`) | `"laura@example.com"` |
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

## Ejemplo completo: familia DEMO (Montevideo)

Es lo que devuelve `/api/configuracion?codigo=DEMO`:

```json
{
  "codigoFamilia": "DEMO",
  "abuelo": {
    "nombre": "Carlos Pérez",
    "comoLeGustaQueLeHablen": "Don Carlos, de usted",
    "telefono": "+598 92 158 202"
  },
  "lugares": [
    {
      "nombre": "Casa de Laura",
      "apodos": ["lo de Laura", "lo de la nena"],
      "direccion": "Av. Sarmiento 2640, Montevideo",
      "latitud": -34.914315,
      "longitud": -56.1553672,
      "necesitaPermiso": false
    },
    {
      "nombre": "Casa de Sofía",
      "apodos": ["lo de Sofía", "lo de la nena"],
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
      "whatsapp": "PENDIENTE",
      "pedidoHabitual": "Una muzzarella grande y una fainá"
    }
  ],
  "familiares": [
    { "nombre": "Inés", "relacion": "Hija", "mail": "inesbertolotti06@gmail.com", "telefono": "+598 97 412 006", "orden": 1 },
    { "nombre": "Lara", "relacion": "Hija", "mail": "laristirling29@gmail.com", "telefono": "+598 91 437 402", "orden": 2 }
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
  }
}
```

**Para probar a la IA:** "lo de la nena" es apodo de **dos** lugares (Casa de Laura y Casa de Sofía). Si el abuelo dice "llevame a lo de la nena", la IA tiene que preguntarle a cuál.

### De dónde salieron los datos del ejemplo

- **Montevideo Shopping:** dirección y coordenadas de OpenStreetMap, buscadas con Nominatim ([objeto 37684509](https://www.openstreetmap.org/way/37684509)).
- **Casa de Laura** (Av. Sarmiento 2640) y **Casa de Sofía** (José Ellauri 407): las direcciones las pasó el equipo. Las coordenadas son de OpenStreetMap, buscadas con Nominatim, que encontró el número de puerta exacto ([objeto 944843090](https://www.openstreetmap.org/node/944843090) y [objeto 944322391](https://www.openstreetmap.org/node/944322391)).
- **Teléfono del abuelo** y **mails y teléfonos de los familiares**: los pasó el equipo.
- **WhatsApp** de la pizzería: `"PENDIENTE"`. Se completa con datos del equipo.
