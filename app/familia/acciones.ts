'use server'

import { leerConfiguracion, type ConfiguracionAbuelo } from '@/lib/datos'
import { charlarConLaIA, type RespuestaIA } from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'
import { guardarAbuelo, HERRAMIENTA_GUARDAR_ABUELO } from './abuelo'
import { buscarEnElMapa, esDelMapa, guardarLugarDelMapa, HERRAMIENTA_BUSCAR_EN_EL_MAPA, preguntarPermisoDelMapa } from './buscar-en-el-mapa'
import { borrar, HERRAMIENTA_BORRAR, HERRAMIENTA_PROPONER_BORRAR, proponerBorrar, type PedidoBorrar } from './borrar'
import { guardarComercio, HERRAMIENTA_GUARDAR_COMERCIO } from './comercios'
import { guardarFamiliar, HERRAMIENTA_GUARDAR_FAMILIAR } from './familiares'
import { guardadoParaLaIA, INSTRUCCIONES_FAMILIA, quienEscribeParaLaIA } from './instrucciones'
import { HERRAMIENTA_UBICAR_CON_LINK, ubicarConLink } from './google-maps'
import { guardarLugar, HERRAMIENTA_GUARDAR_LUGAR } from './lugares'
import { guardarReglas, HERRAMIENTA_GUARDAR_REGLAS, HERRAMIENTA_MOSTRAR_REGLAS, mostrarReglas, type TablaReglas } from './reglas'
import {
  catalogoParaLaIA,
  guardarLugarSugerido,
  HERRAMIENTA_GUARDAR_LUGAR_SUGERIDO,
  herramientaSugerirLugares,
  preguntarPermiso,
  sugerirLugares,
  type LugarSugerido,
} from './sugerencias'
import {
  catalogoComerciosParaLaIA,
  guardarComercioSugerido,
  HERRAMIENTA_GUARDAR_COMERCIO_SUGERIDO,
  herramientaSugerirComercios,
  preguntarPedido,
  sugerirComercios,
  type ComercioSugerido,
} from './sugerencias-comercios'
import { sugerenciasSolas, sugerirPorBoton } from './sugerencias-solas'

const MAXIMO_MENSAJES = 80
const MAXIMO_LETRAS = 2000

export interface MensajeCharla {
  role: 'user' | 'assistant'
  content: string
  /** Si la IA mostró la tabla de reglas en este mensaje. */
  tabla?: TablaReglas
  /** IA: botones con lugares del catálogo para sugerir, o los que encontró el mapa (no se guarda nada si no toca ninguno). */
  sugerencias?: LugarSugerido[]
  /** Sistema: pregunta "¿Puede ir solo o necesita permiso?" por un lugar sugerido que el hijo tocó. */
  preguntaPermiso?: LugarSugerido
  /** IA: botones con comercios del catálogo para sugerir (no se guarda nada si no toca ninguno). */
  comerciosSugeridos?: ComercioSugerido[]
  /** Sistema: pregunta "¿Qué le pide siempre?" por un comercio sugerido que el hijo tocó. */
  preguntaPedido?: ComercioSugerido
  /** IA: botones "Sí, borrar" / "No" para algo que el hijo pidió borrar. */
  pedidoBorrar?: PedidoBorrar
  /** Hijo: tocó una sugerencia (id del catálogo, o "mapa:…" si la encontró el mapa). */
  eligio?: string
  /** Hijo: tocó un comercio sugerido (id del catálogo de comercios). */
  eligioComercio?: string
  /** Hijo: contestó con un botón si puede ir solo o necesita permiso. */
  permiso?: { id: string; necesitaPermiso: boolean }
  /** Hijo: contestó con un botón si borra o no. */
  confirmaBorrar?: boolean
  /** Hijo: tocó "Sugerirme lugares" o "Sugerirme comercios" (siempre están, debajo de la charla). */
  pidio?: 'lugares' | 'comercios'
}

/** Lo que muestran los recuadros de /familia. */
export type Guardado = Pick<ConfiguracionAbuelo, 'codigoFamilia' | 'abuelo' | 'lugares' | 'comercios' | 'familiares' | 'reglas'>

export type RespuestaFamilia = RespuestaIA & {
  guardado?: Guardado
  tabla?: TablaReglas
  sugerencias?: LugarSugerido[]
  preguntaPermiso?: LugarSugerido
  comerciosSugeridos?: ComercioSugerido[]
  preguntaPedido?: ComercioSugerido
  pedidoBorrar?: PedidoBorrar
}

export async function responder(mensajes: MensajeCharla[]): Promise<RespuestaFamilia> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return { ok: false, error: 'Tenés que entrar como familiar' }
  if (!esCharlaValida(mensajes)) return { ok: false, error: 'La charla es demasiado larga o vino vacía' }
  const codigo = sesion.codigoFamilia

  const configuracion = await leerConfiguracion(codigo)
  if (!configuracion) return { ok: false, error: 'No encontramos la configuración de tu familia' }

  const ultimo = mensajes.at(-1)!
  const anterior = mensajes.at(-2)

  // Tocó una sugerencia: antes de guardar SIEMPRE se pregunta si puede ir solo o necesita permiso (sin la IA).
  if (ultimo.eligio) {
    const { texto, preguntaPermiso } = esDelMapa(ultimo.eligio)
      ? preguntarPermisoDelMapa(configuracion, anterior?.sugerencias?.find((s) => s.id === ultimo.eligio))
      : preguntarPermiso(configuracion, ultimo.eligio)
    return { ok: true, texto, ...(preguntaPermiso && { preguntaPermiso }), guardado: soloGuardado(configuracion) }
  }
  // Tocó un comercio sugerido: el sistema le dice de dónde salió el número y le pregunta qué pide (sin la IA).
  if (ultimo.eligioComercio) {
    const { texto, preguntaPedido } = preguntarPedido(configuracion, ultimo.eligioComercio)
    return { ok: true, texto, ...(preguntaPedido && { preguntaPedido }), guardado: soloGuardado(configuracion) }
  }
  // Tocó "Sugerirme lugares" o "Sugerirme comercios": el sistema muestra los cercanos (sin la IA).
  if (ultimo.pidio === 'lugares' || ultimo.pidio === 'comercios') {
    return { ok: true, ...(await sugerirPorBoton(configuracion, mensajes, ultimo.pidio)), guardado: soloGuardado(configuracion) }
  }
  // Contestó la pregunta del permiso con un botón: recién ahora se guarda.
  if (ultimo.permiso && anterior?.preguntaPermiso?.id === ultimo.permiso.id) {
    if (esDelMapa(ultimo.permiso.id)) await guardarLugarDelMapa(codigo, anterior.preguntaPermiso, ultimo.permiso.necesitaPermiso)
    else await guardarLugarSugerido(codigo, ultimo.permiso.id, ultimo.permiso.necesitaPermiso)
  }
  // Confirmó (o no) el borrado con un botón.
  if (ultimo.confirmaBorrar === true && anterior?.pedidoBorrar) {
    await borrar(codigo, anterior.pedidoBorrar)
  }
  const configuracionAhora = (await leerConfiguracion(codigo)) ?? configuracion

  let tabla: TablaReglas | undefined
  let sugerencias: LugarSugerido[] | undefined
  let comerciosSugeridos: ComercioSugerido[] | undefined
  let pedidoBorrar: PedidoBorrar | undefined
  const conLaTabla = async (usar: (c: ConfiguracionAbuelo) => Promise<{ texto: string; tabla?: TablaReglas }> | { texto: string; tabla?: TablaReglas }) => {
    const actual = await leerConfiguracion(codigo)
    if (!actual) return 'No encontré la configuración de esta familia.'
    const resultado = await usar(actual)
    if (resultado.tabla) tabla = resultado.tabla
    return resultado.texto
  }

  // La IA ve lo que ya está guardado, así no lo repite y puede corregirlo.
  // Lo que escribió el hijo (sin el mensaje oculto del inicio): guardar_lugar verifica ahí lo que dijo del permiso.
  const loQueEscribioElHijo = mensajes.filter((m) => m.role === 'user' && !m.content.startsWith('(Abrí la pantalla')).map((m) => m.content)
  const instrucciones = [
    INSTRUCCIONES_FAMILIA,
    quienEscribeParaLaIA(configuracionAhora, sesion.mail),
    guardadoParaLaIA(configuracionAhora),
    await catalogoParaLaIA(configuracionAhora),
    await catalogoComerciosParaLaIA(configuracionAhora),
  ].join('\n\n')
  const herramientaSugerir = herramientaSugerirLugares()
  const herramientaSugerirComercio = herramientaSugerirComercios()
  // Del catálogo solo se pueden guardar los comercios que el hijo eligió tocando su botón.
  const comerciosElegidos = mensajes.flatMap((m) => (m.eligioComercio ? [m.eligioComercio] : []))
  const usadas = new Set<string>()
  let respuesta =await charlarConLaIA(instrucciones, mensajes.map(paraLaIA), {
    tools: [
      HERRAMIENTA_GUARDAR_ABUELO,
      HERRAMIENTA_GUARDAR_LUGAR,
      HERRAMIENTA_UBICAR_CON_LINK,
      HERRAMIENTA_BUSCAR_EN_EL_MAPA,
      ...(herramientaSugerir ? [herramientaSugerir, HERRAMIENTA_GUARDAR_LUGAR_SUGERIDO] : []),
      HERRAMIENTA_GUARDAR_COMERCIO,
      ...(herramientaSugerirComercio ? [herramientaSugerirComercio, HERRAMIENTA_GUARDAR_COMERCIO_SUGERIDO] : []),
      HERRAMIENTA_GUARDAR_FAMILIAR,
      HERRAMIENTA_PROPONER_BORRAR,
      HERRAMIENTA_BORRAR,
      HERRAMIENTA_MOSTRAR_REGLAS,
      HERRAMIENTA_GUARDAR_REGLAS,
    ],
    usarHerramienta: (bloque) => {
      usadas.add(bloque.name)
      switch (bloque.name) {
        case HERRAMIENTA_GUARDAR_ABUELO.name:
          return guardarAbuelo(codigo, bloque.input)
        case HERRAMIENTA_UBICAR_CON_LINK.name:
          return ubicarConLink(codigo, bloque.input, loQueEscribioElHijo)
        case HERRAMIENTA_GUARDAR_LUGAR.name:
          return guardarLugar(codigo, bloque.input, loQueEscribioElHijo)
        case 'sugerir_lugares':
          return sugerirLugares(configuracionAhora, bloque.input).then((resultado) => {
            if (resultado.sugerencias) sugerencias = resultado.sugerencias
            return resultado.texto
          })
        case HERRAMIENTA_BUSCAR_EN_EL_MAPA.name:
          return buscarEnElMapa(configuracionAhora, bloque.input).then((resultado) => {
            if (resultado.sugerencias) sugerencias = resultado.sugerencias
            return resultado.texto
          })
        case HERRAMIENTA_GUARDAR_LUGAR_SUGERIDO.name: {
          // Solo vale si el mensaje anterior fue la pregunta del permiso por ESE lugar (nunca libre por defecto).
          const { id, necesitaPermiso } = bloque.input as { id?: unknown; necesitaPermiso?: unknown }
          if (anterior?.preguntaPermiso?.id !== id || typeof necesitaPermiso !== 'boolean') {
            return 'No se guardó: primero el sistema tiene que preguntarle si puede ir solo o necesita permiso, y el hijo contestar. Si querés guardar uno del catálogo, sugerilo con sugerir_lugares.'
          }
          if (esDelMapa(id)) return guardarLugarDelMapa(codigo, anterior?.preguntaPermiso, necesitaPermiso)
          return guardarLugarSugerido(codigo, id, necesitaPermiso)
        }
        case HERRAMIENTA_PROPONER_BORRAR.name: {
          const resultado = proponerBorrar(configuracionAhora, bloque.input)
          if (resultado.pedidoBorrar) pedidoBorrar = resultado.pedidoBorrar
          return resultado.texto
        }
        case HERRAMIENTA_BORRAR.name: {
          // Solo vale si el mensaje anterior preguntó "¿Seguro?" por ESO mismo.
          const { tipo, nombre } = bloque.input as { tipo?: unknown; nombre?: unknown }
          const propuesto = anterior?.pedidoBorrar
          if (!propuesto || propuesto.tipo !== tipo || propuesto.nombre !== nombre) {
            return 'No se borró: primero usá proponer_borrar y esperá a que el hijo confirme.'
          }
          return borrar(codigo, propuesto)
        }
        case HERRAMIENTA_GUARDAR_COMERCIO.name:
          return guardarComercio(codigo, bloque.input, loQueEscribioElHijo)
        case 'sugerir_comercios':
          return sugerirComercios(configuracionAhora, bloque.input).then((resultado) => {
            if (resultado.comerciosSugeridos) comerciosSugeridos = resultado.comerciosSugeridos
            return resultado.texto
          })
        case HERRAMIENTA_GUARDAR_COMERCIO_SUGERIDO.name:
          return guardarComercioSugerido(codigo, bloque.input, comerciosElegidos, loQueEscribioElHijo)
        case HERRAMIENTA_GUARDAR_FAMILIAR.name:
          return guardarFamiliar(codigo, bloque.input)
        case HERRAMIENTA_MOSTRAR_REGLAS.name:
          return conLaTabla((c) => mostrarReglas(c, bloque.input))
        case HERRAMIENTA_GUARDAR_REGLAS.name:
          return conLaTabla((c) => guardarReglas(codigo, c, bloque.input))
        default:
          return `No existe la herramienta "${bloque.name}".`
      }
    },
  })
  if (respuesta.ok) respuesta = await dejarUnaSolaPregunta(respuesta)

  const actualizada = await leerConfiguracion(codigo)
  // Perfil nuevo: cuando la charla llega a los lugares (o a los comercios), las sugerencias cercanas aparecen solas.
  if (respuesta.ok && actualizada && !tabla && !pedidoBorrar && !sugerencias && !comerciosSugeridos) {
    const solas = await sugerenciasSolas(actualizada, mensajes, respuesta.texto, usadas)
    sugerencias = solas.sugerencias
    comerciosSugeridos = solas.comerciosSugeridos
  }
  return {
    ...respuesta,
    ...(tabla && { tabla }),
    ...(sugerencias && { sugerencias }),
    ...(comerciosSugeridos && { comerciosSugeridos }),
    ...(pedidoBorrar && { pedidoBorrar }),
    guardado: actualizada ? soloGuardado(actualizada) : undefined,
  }
}

/** La tabla que se mostró va en el texto que lee la IA: así en el próximo mensaje sabe qué propuso. */
function paraLaIA(mensaje: MensajeCharla) {
  const { role, content, tabla } = mensaje
  const notas = [
    mensaje.sugerencias && `[Botones de sugerencia que vio el hijo: ${mensaje.sugerencias.map((l) => `${l.nombre} (${l.id})`).join(', ')} y "Ninguno". Si no toca ninguno, no se guarda nada.]`,
    mensaje.preguntaPermiso && `[Pregunta del sistema por el lugar ${mensaje.preguntaPermiso.id}. Con lo que conteste, usá guardar_lugar_sugerido.]`,
    mensaje.comerciosSugeridos &&
      `[Botones de comercios sugeridos que vio el hijo: ${mensaje.comerciosSugeridos.map((c) => `${c.nombre} (${c.id})`).join(', ')} y "Ninguno". Si no toca ninguno, no se guarda nada.]`,
    mensaje.preguntaPedido && `[Pregunta del sistema por el comercio del catálogo ${mensaje.preguntaPedido.id}. Con lo que conteste, usá guardar_comercio_sugerido.]`,
    mensaje.pedidoBorrar && `[Botones "Sí, borrar" y "No" por ${mensaje.pedidoBorrar.tipo} "${mensaje.pedidoBorrar.nombre}". NO está borrado todavía.]`,
    mensaje.eligio && `[El hijo tocó la sugerencia ${mensaje.eligio}.]`,
    mensaje.eligioComercio && `[El hijo tocó el comercio sugerido ${mensaje.eligioComercio}.]`,
    mensaje.permiso && `[El hijo tocó el botón: ${mensaje.permiso.necesitaPermiso ? 'necesita permiso' : 'puede ir solo'}. El sistema YA lo guardó así; mirá LO QUE YA ESTÁ GUARDADO. Contale en una frase cómo quedó y preguntá si va a algún otro lugar.]`,
    mensaje.confirmaBorrar === true && '[El hijo tocó "Sí, borrar". El sistema YA lo borró; contáselo en una frase.]',
    mensaje.confirmaBorrar === false && '[El hijo tocó "No". No se borró nada; contáselo en una frase.]',
    mensaje.pidio && `[El hijo tocó el botón "Sugerirme ${mensaje.pidio}". El sistema le mostró los cercanos en botones.]`,
  ].filter(Boolean)
  const conNotas = notas.length > 0 ? `${content}\n\n${notas.join('\n')}` : content
  if (!tabla) return { role, content: conNotas }
  const lista = (titulo: string, items: string[]) => `${titulo}: ${items.length ? items.join('; ') : 'nada'}`
  const resumen = [
    `[Tabla de reglas que se le mostró al hijo${tabla.guardada ? ', YA GUARDADA' : ', todavía SIN guardar'}]`,
    `Nivel: ${tabla.nivel}`,
    lista('Se aprueba', tabla.seAprueba),
    lista('Solo se avisa', tabla.seAvisa),
    lista('Libre', tabla.libre),
  ].join('\n')
  return { role, content: `${conNotas}\n\n${resumen}` }
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
        (m.sugerencias === undefined || (Array.isArray(m.sugerencias) && m.sugerencias.length <= 10 && m.sugerencias.every(esLugarSugerido))) &&
        (m.preguntaPermiso === undefined || esLugarSugerido(m.preguntaPermiso)) &&
        (m.comerciosSugeridos === undefined ||
          (Array.isArray(m.comerciosSugeridos) && m.comerciosSugeridos.length <= 10 && m.comerciosSugeridos.every(esLugarSugerido))) &&
        (m.preguntaPedido === undefined || esLugarSugerido(m.preguntaPedido)) &&
        (m.pedidoBorrar === undefined || esPedidoBorrar(m.pedidoBorrar)) &&
        (m.eligio === undefined || (m.role === 'user' && typeof m.eligio === 'string' && m.eligio.length <= 100)) &&
        (m.eligioComercio === undefined || (m.role === 'user' && typeof m.eligioComercio === 'string' && m.eligioComercio.length <= 100)) &&
        (m.permiso === undefined ||
          (m.role === 'user' && typeof m.permiso?.id === 'string' && typeof m.permiso?.necesitaPermiso === 'boolean')) &&
        (m.confirmaBorrar === undefined || (m.role === 'user' && typeof m.confirmaBorrar === 'boolean')) &&
        (m.pidio === undefined || (m.role === 'user' && (m.pidio === 'lugares' || m.pidio === 'comercios'))),
    ) &&
    mensajes.at(-1)?.role === 'user'
  )
}

function esTablaValida(tabla: unknown): tabla is TablaReglas {
  const t = tabla as Partial<TablaReglas> | null
  const textos = (v: unknown) => Array.isArray(v) && v.length <= 50 && v.every((x) => typeof x === 'string' && x.length <= 300)
  return !!t && typeof t.nivel === 'string' && textos(t.seAprueba) && textos(t.seAvisa) && textos(t.libre) && typeof t.guardada === 'boolean'
}

const textoCorto = (v: unknown) => typeof v === 'string' && v.length <= 300

/** También sirve para los comercios sugeridos: tienen los mismos campos. */
function esLugarSugerido(dato: unknown): dato is LugarSugerido {
  const d = dato as Partial<LugarSugerido> | null
  return (
    !!d &&
    textoCorto(d.id) &&
    textoCorto(d.nombre) &&
    textoCorto(d.tipo) &&
    textoCorto(d.direccion) &&
    (d.distancia === undefined || textoCorto(d.distancia))
  )
}

function esPedidoBorrar(dato: unknown): dato is PedidoBorrar {
  const d = dato as Partial<PedidoBorrar> | null
  return !!d && (d.tipo === 'lugar' || d.tipo === 'comercio' || d.tipo === 'familiar') && textoCorto(d.nombre) && textoCorto(d.detalle)
}
