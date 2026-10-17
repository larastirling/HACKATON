'use server'

import { leerConfiguracion, type ConfiguracionAbuelo } from '@/lib/datos'
import { charlarConLaIA, type RespuestaIA } from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'
import { guardarAbuelo, HERRAMIENTA_GUARDAR_ABUELO } from './abuelo'
import { guardarComercio, HERRAMIENTA_GUARDAR_COMERCIO } from './comercios'
import { guardarFamiliar, HERRAMIENTA_GUARDAR_FAMILIAR } from './familiares'
import { guardadoParaLaIA, INSTRUCCIONES_FAMILIA, quienEscribeParaLaIA } from './instrucciones'
import { HERRAMIENTA_OFRECER_GMAIL, ofrecerConexionGmail } from './gmail'
import { guardarLugar, HERRAMIENTA_GUARDAR_LUGAR } from './lugares'
import { estadoProteccion, proteccionParaLaIA } from './proteccion'
import { guardarReglas, HERRAMIENTA_GUARDAR_REGLAS, HERRAMIENTA_MOSTRAR_REGLAS, mostrarReglas, type TablaReglas } from './reglas'

const MAXIMO_MENSAJES = 80
const MAXIMO_LETRAS = 2000

export interface MensajeCharla {
  role: 'user' | 'assistant'
  content: string
  /** Si la IA mostró la tabla de reglas en este mensaje. */
  tabla?: TablaReglas
  /** Si la IA mostró el botón para conectar el Gmail de la persona mayor. */
  gmail?: { mail: string }
}

/** Lo que muestran los recuadros de /familia. */
export type Guardado = Pick<ConfiguracionAbuelo, 'codigoFamilia' | 'abuelo' | 'lugares' | 'comercios' | 'familiares' | 'reglas'>

export type RespuestaFamilia = RespuestaIA & { guardado?: Guardado; tabla?: TablaReglas; gmail?: { mail: string } }

export async function responder(mensajes: MensajeCharla[]): Promise<RespuestaFamilia> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return { ok: false, error: 'Tenés que entrar como familiar' }
  if (!esCharlaValida(mensajes)) return { ok: false, error: 'La charla es demasiado larga o vino vacía' }
  const codigo = sesion.codigoFamilia

  const configuracion = await leerConfiguracion(codigo)
  if (!configuracion) return { ok: false, error: 'No encontramos la configuración de tu familia' }

  let tabla: TablaReglas | undefined
  let gmail: { mail: string } | undefined
  const proteccion = await estadoProteccion(codigo)
  const conLaTabla = async (usar: (c: ConfiguracionAbuelo) => Promise<{ texto: string; tabla?: TablaReglas }> | { texto: string; tabla?: TablaReglas }) => {
    const actual = await leerConfiguracion(codigo)
    if (!actual) return 'No encontré la configuración de esta familia.'
    const resultado = await usar(actual)
    if (resultado.tabla) tabla = resultado.tabla
    return resultado.texto
  }

  // La IA ve lo que ya está guardado, así no lo repite y puede corregirlo.
  const instrucciones =
    `${INSTRUCCIONES_FAMILIA}\n\n${quienEscribeParaLaIA(configuracion, sesion.mail)}\n\n${guardadoParaLaIA(configuracion)}` +
    `\n\n${proteccionParaLaIA(proteccion)}`
  const pedir = () => charlarConLaIA(instrucciones, mensajes.map(paraLaIA), {
    tools: [HERRAMIENTA_GUARDAR_ABUELO, HERRAMIENTA_GUARDAR_LUGAR, HERRAMIENTA_GUARDAR_COMERCIO, HERRAMIENTA_GUARDAR_FAMILIAR, HERRAMIENTA_MOSTRAR_REGLAS, HERRAMIENTA_GUARDAR_REGLAS, HERRAMIENTA_OFRECER_GMAIL],
    usarHerramienta: (bloque) => {
      switch (bloque.name) {
        case HERRAMIENTA_GUARDAR_ABUELO.name:
          return guardarAbuelo(codigo, bloque.input)
        case HERRAMIENTA_GUARDAR_LUGAR.name:
          return guardarLugar(codigo, bloque.input)
        case HERRAMIENTA_GUARDAR_COMERCIO.name:
          return guardarComercio(codigo, bloque.input)
        case HERRAMIENTA_GUARDAR_FAMILIAR.name:
          return guardarFamiliar(codigo, bloque.input)
        case HERRAMIENTA_MOSTRAR_REGLAS.name:
          return conLaTabla((c) => mostrarReglas(c, bloque.input))
        case HERRAMIENTA_GUARDAR_REGLAS.name:
          return conLaTabla((c) => guardarReglas(codigo, c, bloque.input))
        case HERRAMIENTA_OFRECER_GMAIL.name:
          return ofrecerConexionGmail(codigo, bloque.input).then((r) => {
            if (r.mail) gmail = { mail: r.mail }
            return r.texto
          })
        default:
          return `No existe la herramienta "${bloque.name}".`
      }
    },
  })
  let respuesta = await pedir()
  // A veces el modelo se traba (escribe sus notas o repite lo mismo sin parar): se pide una vez más.
  if (respuesta.ok && estaTrabada(respuesta.texto)) {
    console.error('[familia] respuesta trabada de la IA, se pide de nuevo:', respuesta.texto.slice(0, 120))
    respuesta = await pedir()
    if (respuesta.ok && estaTrabada(respuesta.texto)) respuesta = { ok: false, error: 'La IA se trabó. Probá mandar el mensaje de nuevo.' }
  }
  if (respuesta.ok) respuesta = await dejarUnaSolaPregunta(respuesta)

  const actualizada = await leerConfiguracion(codigo)
  return { ...respuesta, ...(tabla && { tabla }), ...(gmail && { gmail }), guardado: actualizada ? soloGuardado(actualizada) : undefined }
}

/** La tabla que se mostró va en el texto que lee la IA: así en el próximo mensaje sabe qué propuso. */
function paraLaIA({ role, content, tabla, gmail }: MensajeCharla) {
  if (gmail) content = `${content}\n\n[Se le mostró al hijo el botón para conectar el Gmail ${gmail.mail}]`
  if (!tabla) return { role, content }
  const lista = (titulo: string, items: string[]) => `${titulo}: ${items.length ? items.join('; ') : 'nada'}`
  const resumen = [
    `[Tabla de reglas que se le mostró al hijo${tabla.guardada ? ', YA GUARDADA' : ', todavía SIN guardar'}]`,
    `Nivel: ${tabla.nivel}`,
    lista('Se aprueba', tabla.seAprueba),
    lista('Solo se avisa', tabla.seAvisa),
    lista('Libre', tabla.libre),
  ].join('\n')
  return { role, content: `${content}\n\n${resumen}` }
}

/** Una respuesta que no es para mostrar: notas internas, muy larga, o la misma cosa repetida muchas veces. */
function estaTrabada(texto: string): boolean {
  return texto.startsWith('💭') || texto.length > 2500 || /(.{1,6}?)\1{25,}/s.test(texto)
}

/** Si la IA hizo más de una pregunta, le pide que deje solo la más importante (una pregunta por mensaje). */
async function dejarUnaSolaPregunta(respuesta: Extract<RespuestaIA, { ok: true }>): Promise<Extract<RespuestaIA, { ok: true }>> {
  const preguntas = respuesta.texto.match(/\?/g)?.length ?? 0
  if (preguntas <= 1) return respuesta
  const reescrita = await charlarConLaIA(
    'Reescribís mensajes de un asistente. Devolvé SOLO el mensaje reescrito, sin comillas ni explicaciones.',
    [
      {
        role: 'user',
        content:
          'Este mensaje tiene más de una pregunta. Reescribilo dejando UNA sola pregunta (la más importante, al final). ' +
          `No cambies nada más: mismo tono, mismos datos, sin agregar información.\n\n${respuesta.texto}`,
      },
    ],
  )
  const quedaUna = reescrita.ok && (reescrita.texto.match(/\?/g)?.length ?? 0) === 1
  return quedaUna ? reescrita : respuesta
}

function soloGuardado({ codigoFamilia, abuelo, lugares, comercios, familiares, reglas }: ConfiguracionAbuelo): Guardado {
  return { codigoFamilia, abuelo, lugares, comercios, familiares, reglas }
}

function esCharlaValida(mensajes: unknown): mensajes is MensajeCharla[] {
  return (
    Array.isArray(mensajes) &&
    mensajes.length > 0 &&
    mensajes.length <= MAXIMO_MENSAJES &&
    mensajes.every(
      (m) =>
        (m?.role === 'user' || m?.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length <= MAXIMO_LETRAS &&
        (m.tabla === undefined || (m.role === 'assistant' && esTablaValida(m.tabla))) &&
        (m.gmail === undefined || (m.role === 'assistant' && typeof m.gmail?.mail === 'string' && m.gmail.mail.length <= 200)),
    ) &&
    mensajes.at(-1)?.role === 'user'
  )
}

function esTablaValida(tabla: unknown): tabla is TablaReglas {
  const t = tabla as Partial<TablaReglas> | null
  const textos = (v: unknown) => Array.isArray(v) && v.length <= 50 && v.every((x) => typeof x === 'string' && x.length <= 300)
  return !!t && typeof t.nivel === 'string' && textos(t.seAprueba) && textos(t.seAvisa) && textos(t.libre) && typeof t.guardada === 'boolean'
}
