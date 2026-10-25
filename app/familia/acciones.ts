'use server'

import type Anthropic from '@anthropic-ai/sdk'
import { leerConfiguracion, type ConfiguracionAbuelo } from '@/lib/datos'
import { charlarConLaIA, type RespuestaIA } from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'
import { guardarAbuelo, HERRAMIENTA_GUARDAR_ABUELO } from './abuelo'
import { guardarMatricula, HERRAMIENTA_GUARDAR_MATRICULA } from './auto'
import { buscarEnElMapa, esDelMapa, guardarLugarDelMapa, HERRAMIENTA_BUSCAR_EN_EL_MAPA, preguntarPermisoDelMapa } from './buscar-en-el-mapa'
import { borrar, HERRAMIENTA_BORRAR, HERRAMIENTA_PROPONER_BORRAR, proponerBorrar, type PedidoBorrar } from './borrar'
import { guardarComercio, HERRAMIENTA_GUARDAR_COMERCIO } from './comercios'
import { guardarFamiliar, HERRAMIENTA_GUARDAR_FAMILIAR } from './familiares'
import { guardadoParaLaIA, INSTRUCCIONES_FAMILIA, quienEscribeParaLaIA } from './instrucciones'
import { guardarFormasDeViajar, HERRAMIENTA_GUARDAR_FORMAS_DE_VIAJAR } from './formas-de-viajar'
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
  todosLosLugaresCercanos,
  type LugarSugerido,
} from './sugerencias'
import {
  catalogoComerciosParaLaIA,
  confirmadosPorElHijo,
  esUnNo,
  esUnSi,
  guardarComercioSugerido,
  HERRAMIENTA_GUARDAR_COMERCIO_SUGERIDO,
  HERRAMIENTA_REPORTAR_NUMERO,
  herramientaSugerirComercios,
  preguntarPedido,
  reportarNumeroQueNoAnda,
  respuestaDelNumero,
  sugerirComercios,
  todosLosComerciosCercanos,
  type ComercioSugerido,
} from './sugerencias-comercios'
import {
  esRespuestaDeTarjeta,
  estadoDelArmado,
  loQueSigue,
  responderTarjeta,
  tarjetaDelPaso,
  TITULOS,
  type EstadoDelArmado,
  type RespuestaDeTarjeta,
  type Tarjeta,
} from './pasos'

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
  /**
   * "Ver todos los cercanos": todos los lugares / comercios a menos de 10 km, del más cerca al más lejos.
   * Llegan con las sugerencias y la pantalla los muestra sin preguntarle a nadie; NO se mandan de vuelta al servidor.
   */
  todosLosLugares?: LugarSugerido[]
  todosLosComercios?: ComercioSugerido[]
  /** Sistema: pregunta "¿Qué le pide siempre?" por un comercio sugerido que el hijo tocó. */
  preguntaPedido?: ComercioSugerido
  /** Sistema: "Este número no está confirmado: ¿ya le pidieron por acá y funciona?" (botones Sí / No). */
  preguntaNumero?: ComercioSugerido
  /** Hijo: contestó con un botón si el número sin confirmar funciona. */
  confirmaNumero?: { id: string; funciona: boolean }
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
  /** Hijo: tocó "Sugerirme lugares" o "Sugerirme comercios" (están cuando el perfil ya está cargado). */
  pidio?: 'lugares' | 'comercios'
  /** Sistema: la tarjeta de un paso de la carga (pasos.ts). Al servidor vuelve solo el tipo. */
  tarjeta?: Tarjeta | { tipo: Tarjeta['tipo'] }
  /** Hijo: lo que completó en la tarjeta (o "Completar después" / "Seguir"). */
  respuesta?: RespuestaDeTarjeta
}

/** Lo que muestran los recuadros de /familia. */
export type Guardado = Pick<ConfiguracionAbuelo, 'codigoFamilia' | 'abuelo' | 'lugares' | 'comercios' | 'familiares' | 'reglas' | 'formasDeViajar'>

export type RespuestaFamilia = RespuestaIA & {
  guardado?: Guardado
  tabla?: TablaReglas
  sugerencias?: LugarSugerido[]
  preguntaPermiso?: LugarSugerido
  comerciosSugeridos?: ComercioSugerido[]
  todosLosLugares?: LugarSugerido[]
  todosLosComercios?: ComercioSugerido[]
  preguntaPedido?: ComercioSugerido
  preguntaNumero?: ComercioSugerido
  pedidoBorrar?: PedidoBorrar
  tarjeta?: Tarjeta
  /** En qué paso de la carga está (para "Paso 3 de 6" arriba). */
  paso?: EstadoDelArmado
}

export async function responder(charla: MensajeCharla[]): Promise<RespuestaFamilia> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'familiar') return { ok: false, error: 'Tenés que entrar como familiar' }
  // Las listas de "Ver todos" y el contenido de las tarjetas son solo para la pantalla: si vinieran, no se usan.
  const mensajes = Array.isArray(charla)
    ? charla.map((m) => {
        if (!m || typeof m !== 'object') return m
        const { todosLosLugares: _lugares, todosLosComercios: _comercios, tarjeta, ...resto } = m
        return (tarjeta && typeof tarjeta === 'object' ? { ...resto, tarjeta: { tipo: tarjeta.tipo } } : resto) as MensajeCharla
      })
    : charla
  if (!esCharlaValida(mensajes)) return { ok: false, error: 'La charla es demasiado larga o vino vacía' }
  const codigo = sesion.codigoFamilia

  const configuracion = await leerConfiguracion(codigo)
  if (!configuracion) return { ok: false, error: 'No encontramos la configuración de tu familia' }

  const ultimo = mensajes.at(-1)!
  const anterior = mensajes.at(-2)
  const conGuardado = async <T extends object>(r: T) => {
    const actual = (await leerConfiguracion(codigo)) ?? configuracion
    return { ok: true as const, ...r, guardado: soloGuardado(actual) }
  }

  // Abrió la pantalla: el saludo y el paso que toca, sin la IA.
  if (mensajes.length === 1) {
    const nombre = quienEscribe(configuracion, sesion.mail)
    const estado = estadoDelArmado(configuracion, sesion.mail)
    const hola = `¡Hola${nombre ? ` ${nombre}` : ''}!`
    if (!estado.actual && estado.paraDespues.length === 0) {
      return conGuardado({
        texto: `${hola} El perfil de ${configuracion.abuelo.nombre} está completo. ¿Querés cambiar algo? Escribime.`,
        paso: estado,
      })
    }
    const intro = estado.numero === 1 ? `${hola} Vamos a cargar a tu papá o mamá: son ${estado.total} pasos cortos.` : `${hola} Seguimos donde quedamos.`
    return conGuardado(await loQueSigue(configuracion, sesion.mail, intro))
  }
  // Completó una tarjeta de los pasos (o tocó "Completar después" / "Seguir"): se guarda y sigue, sin la IA.
  if (ultimo.respuesta) {
    return conGuardado(await responderTarjeta(codigo, sesion.mail, ultimo.respuesta))
  }

  // Tocó una sugerencia: antes de guardar SIEMPRE se pregunta si puede ir solo o necesita permiso (sin la IA).
  if (ultimo.eligio) {
    const { texto, preguntaPermiso } = esDelMapa(ultimo.eligio)
      ? preguntarPermisoDelMapa(configuracion, anterior?.sugerencias?.find((s) => s.id === ultimo.eligio))
      : preguntarPermiso(configuracion, ultimo.eligio)
    return { ok: true, texto, ...(preguntaPermiso && { preguntaPermiso }), guardado: soloGuardado(configuracion) }
  }
  // Tocó un comercio sugerido: el sistema le dice de dónde salió el número y le pregunta qué pide (sin la IA).
  // Si el número no está confirmado, antes le pregunta si ya le pidieron por ahí y funciona.
  if (ultimo.eligioComercio) {
    const { texto, preguntaPedido, preguntaNumero } = await preguntarPedido(configuracion, ultimo.eligioComercio)
    return {
      ok: true,
      texto,
      ...(preguntaPedido && { preguntaPedido }),
      ...(preguntaNumero && { preguntaNumero }),
      guardado: soloGuardado(configuracion),
    }
  }
  // Contestó si el número sin confirmar funciona (con el botón, o escribiendo "sí" / "no"): sigue el sistema, sin la IA.
  if (anterior?.preguntaNumero) {
    const id = anterior.preguntaNumero.id
    const funciona =
      ultimo.confirmaNumero?.id === id ? ultimo.confirmaNumero.funciona : esUnSi(ultimo.content) ? true : esUnNo(ultimo.content) ? false : undefined
    if (funciona !== undefined) {
      const { texto, preguntaPedido } = respuestaDelNumero(id, funciona)
      return { ok: true, texto, ...(preguntaPedido && { preguntaPedido }), guardado: soloGuardado(configuracion) }
    }
  }
  // Tocó "Sugerirme lugares" o "Sugerirme comercios": la misma tarjeta del paso, para marcar varios (sin la IA).
  if (ultimo.pidio === 'lugares' || ultimo.pidio === 'comercios') {
    return conGuardado({ ...(await tarjetaDelPaso(configuracion, ultimo.pidio, sesion.mail)), paso: estadoDelArmado(configuracion, sesion.mail) })
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
  const pasoAntes = estadoDelArmado(configuracionAhora, sesion.mail).actual

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
  // En bloques, para que la API cachee lo que no cambia (releerlo cuesta el 10%):
  //   1. las instrucciones (iguales para todas las familias),
  //   2. los catálogos (cambian solo al guardar un lugar o comercio), y solo cuando sirven: en el paso de lugares o de
  //      comercios, o con la carga terminada (el hijo puede pedir que le sugieran algo). En los otros pasos, no se mandan.
  //   3. lo que cambia en cada mensaje: quién escribe, cómo va la carga y lo guardado.
  const armado = estadoDelArmado(configuracionAhora, sesion.mail)
  const conLugares = armado.actual === 'lugares' || armado.actual === null
  const conComercios = armado.actual === 'comercios' || armado.actual === null
  const catalogos = [
    conLugares
      ? await catalogoParaLaIA(configuracionAhora)
      : 'CATÁLOGO DE LUGARES: no se manda en este paso (los lugares se eligen en la tarjeta del paso 3). No uses sugerir_lugares ahora.',
    conComercios
      ? await catalogoComerciosParaLaIA(configuracionAhora)
      : 'CATÁLOGO DE COMERCIOS: no se manda en este paso (los comercios se eligen en la tarjeta del paso 4). No uses sugerir_comercios ahora.',
  ].join('\n\n')
  const instrucciones: Anthropic.Beta.BetaTextBlockParam[] = [
    { type: 'text', text: INSTRUCCIONES_FAMILIA, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: catalogos, cache_control: { type: 'ephemeral' } },
    {
      type: 'text',
      text: [quienEscribeParaLaIA(configuracionAhora, sesion.mail), cargaParaLaIA(armado), guardadoParaLaIA(configuracionAhora)].join('\n\n'),
    },
  ]
  const herramientaSugerir = herramientaSugerirLugares()
  const herramientaSugerirComercio = herramientaSugerirComercios()
  // Del catálogo solo se pueden guardar los comercios que el hijo eligió tocando su botón.
  const comerciosElegidos = mensajes.flatMap((m) => (m.eligioComercio ? [m.eligioComercio] : []))
  // Los sin confirmar que el hijo dijo que funcionan (solo esos se pueden guardar, y quedan "confirmado por la familia").
  const comerciosConfirmados = confirmadosPorElHijo(mensajes)
  let respuesta = await charlarConLaIA(instrucciones, mensajes.map(paraLaIA), {
    tools: [
      HERRAMIENTA_GUARDAR_ABUELO,
      HERRAMIENTA_GUARDAR_MATRICULA,
      HERRAMIENTA_GUARDAR_LUGAR,
      HERRAMIENTA_UBICAR_CON_LINK,
      HERRAMIENTA_BUSCAR_EN_EL_MAPA,
      HERRAMIENTA_GUARDAR_FORMAS_DE_VIAJAR,
      ...(herramientaSugerir ? [herramientaSugerir, HERRAMIENTA_GUARDAR_LUGAR_SUGERIDO] : []),
      HERRAMIENTA_GUARDAR_COMERCIO,
      HERRAMIENTA_REPORTAR_NUMERO,
      ...(herramientaSugerirComercio ? [herramientaSugerirComercio, HERRAMIENTA_GUARDAR_COMERCIO_SUGERIDO] : []),
      HERRAMIENTA_GUARDAR_FAMILIAR,
      HERRAMIENTA_PROPONER_BORRAR,
      HERRAMIENTA_BORRAR,
      HERRAMIENTA_MOSTRAR_REGLAS,
      HERRAMIENTA_GUARDAR_REGLAS,
    ],
    usarHerramienta: (bloque) => {
      switch (bloque.name) {
        case HERRAMIENTA_GUARDAR_MATRICULA.name:
          return guardarMatricula(codigo, bloque.input)
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
        case HERRAMIENTA_GUARDAR_FORMAS_DE_VIAJAR.name:
          return guardarFormasDeViajar(codigo, bloque.input)
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
          return guardarComercioSugerido(codigo, bloque.input, comerciosElegidos, comerciosConfirmados, loQueEscribioElHijo)
        case HERRAMIENTA_REPORTAR_NUMERO.name:
          return reportarNumeroQueNoAnda(codigo, bloque.input, loQueEscribioElHijo)
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
  const paso = actualizada ? estadoDelArmado(actualizada, sesion.mail) : undefined
  // Si con lo que escribió terminó un paso (por ejemplo, escribió los datos en vez de usar la tarjeta), sigue la tarjeta del próximo.
  let tarjeta: Tarjeta | undefined
  if (respuesta.ok && actualizada && paso?.actual && paso.actual !== pasoAntes && !tabla && !pedidoBorrar && !sugerencias && !comerciosSugeridos) {
    tarjeta = (await tarjetaDelPaso(actualizada, paso.actual, sesion.mail)).tarjeta
  }
  const sugeridas = actualizada ? await conTodosLosCercanos(actualizada, { sugerencias, comerciosSugeridos }) : {}
  return {
    ...respuesta,
    ...(tabla && { tabla }),
    ...sugeridas,
    ...(pedidoBorrar && { pedidoBorrar }),
    ...(tarjeta && { tarjeta }),
    ...(paso && { paso }),
    guardado: actualizada ? soloGuardado(actualizada) : undefined,
  }
}

/** Cuántas sugerencias se muestran primero; el resto, con "Ver todos los cercanos". */
const PRIMERO_SE_MUESTRAN = 4

/**
 * A las sugerencias les agrega la lista de "Ver todos los cercanos" (todos a menos de 10 km, del más cerca al más lejos).
 * Lugares: si hay 4 o menos, se muestran todos de entrada y no hace falta el botón.
 * Comercios: de entrada solo los confirmados; con el botón se ven también los sin confirmar (con el aviso).
 * Lo que encontró buscar_lugar_en_el_mapa (ids "mapa:…") va tal cual y sin "Ver todos": son resultados de esa búsqueda,
 * no lugares cercanos (y al tocar uno se lo busca entre estas mismas sugerencias).
 */
async function conTodosLosCercanos(
  configuracion: ConfiguracionAbuelo,
  { sugerencias, comerciosSugeridos }: { sugerencias?: LugarSugerido[]; comerciosSugeridos?: ComercioSugerido[] },
): Promise<Pick<RespuestaFamilia, 'sugerencias' | 'todosLosLugares' | 'comerciosSugeridos' | 'todosLosComercios'>> {
  const resultado: Pick<RespuestaFamilia, 'sugerencias' | 'todosLosLugares' | 'comerciosSugeridos' | 'todosLosComercios'> = {}
  if (sugerencias?.length && sugerencias.some((s) => esDelMapa(s.id))) {
    resultado.sugerencias = sugerencias
  } else if (sugerencias?.length) {
    const todos = await todosLosLugaresCercanos(configuracion)
    if (todos.length > PRIMERO_SE_MUESTRAN) {
      resultado.sugerencias = sugerencias
      resultado.todosLosLugares = todos
    } else {
      resultado.sugerencias = todos.length ? todos : sugerencias
    }
  }
  if (comerciosSugeridos?.length) {
    resultado.comerciosSugeridos = comerciosSugeridos
    const todos = await todosLosComerciosCercanos(configuracion)
    if (todos.some((t) => !comerciosSugeridos.some((s) => s.id === t.id))) resultado.todosLosComercios = todos
  }
  return resultado
}

/** En qué paso de la carga está, para la IA. */
function cargaParaLaIA({ actual, numero, total, titulo, paraDespues }: EstadoDelArmado): string {
  const despues = paraDespues.length ? ` Dejados para después: ${paraDespues.map((p) => TITULOS[p]).join(', ')}.` : ''
  return actual
    ? `CÓMO VA LA CARGA: paso ${numero} de ${total} (${titulo}). La tarjeta de ese paso la muestra la pantalla.${despues}`
    : `CÓMO VA LA CARGA: ya están todos los pasos${paraDespues.length ? ' (salvo los dejados para después)' : ''}.${despues}`
}

/** El familiar que está escribiendo (por el mail con el que entró). */
const quienEscribe = ({ familiares }: ConfiguracionAbuelo, mail: string | undefined) =>
  mail ? familiares.find((f) => f.mail.toLowerCase() === mail.toLowerCase())?.nombre : undefined

/** La tabla que se mostró va en el texto que lee la IA: así en el próximo mensaje sabe qué propuso. */
function paraLaIA(mensaje: MensajeCharla) {
  const { role, content, tabla } = mensaje
  const notas = [
    mensaje.tarjeta &&
      (mensaje.tarjeta.tipo === 'falta'
        ? '[El sistema le dijo qué quedó para después y le ofreció completarlo con un botón.]'
        : `[El sistema mostró la tarjeta del paso "${TITULOS[mensaje.tarjeta.tipo]}" (el hijo la completa con botones).]`),
    mensaje.respuesta && `[El hijo usó los botones de la tarjeta (${mensaje.respuesta.tipo}). El sistema ya lo guardó y contestó.]`,
    mensaje.sugerencias && `[Botones de sugerencia que vio el hijo: ${mensaje.sugerencias.map((l) => `${l.nombre} (${l.id})`).join(', ')} y "Ninguno". Si no toca ninguno, no se guarda nada.]`,
    mensaje.preguntaPermiso && `[Pregunta del sistema por el lugar ${mensaje.preguntaPermiso.id}. Con lo que conteste, usá guardar_lugar_sugerido.]`,
    mensaje.comerciosSugeridos &&
      `[Botones de comercios sugeridos que vio el hijo: ${mensaje.comerciosSugeridos.map((c) => `${c.nombre} (${c.id})`).join(', ')} y "Ninguno". Si no toca ninguno, no se guarda nada.]`,
    mensaje.preguntaPedido && `[Pregunta del sistema por el comercio del catálogo ${mensaje.preguntaPedido.id}. Con lo que conteste, usá guardar_comercio_sugerido.]`,
    mensaje.preguntaNumero &&
      `[Pregunta del sistema: el número de ${mensaje.preguntaNumero.id} no está confirmado; botones "Sí, funciona" y "No". No lo guardes si el hijo no dice que funciona.]`,
    mensaje.confirmaNumero &&
      `[El hijo tocó: ${mensaje.confirmaNumero.funciona ? 'sí, el número funciona (queda confirmado por la familia)' : 'no funciona o no sabe (no se guarda con ese número)'}.]`,
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

function soloGuardado({ codigoFamilia, abuelo, lugares, comercios, familiares, reglas, formasDeViajar }: ConfiguracionAbuelo): Guardado {
  return { codigoFamilia, abuelo, lugares, comercios, familiares, reglas, formasDeViajar }
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
        (m.preguntaNumero === undefined || esLugarSugerido(m.preguntaNumero)) &&
        (m.confirmaNumero === undefined ||
          (m.role === 'user' && typeof m.confirmaNumero?.id === 'string' && typeof m.confirmaNumero?.funciona === 'boolean')) &&
        (m.pedidoBorrar === undefined || esPedidoBorrar(m.pedidoBorrar)) &&
        (m.eligio === undefined || (m.role === 'user' && typeof m.eligio === 'string' && m.eligio.length <= 100)) &&
        (m.eligioComercio === undefined || (m.role === 'user' && typeof m.eligioComercio === 'string' && m.eligioComercio.length <= 100)) &&
        (m.permiso === undefined ||
          (m.role === 'user' && typeof m.permiso?.id === 'string' && typeof m.permiso?.necesitaPermiso === 'boolean')) &&
        (m.confirmaBorrar === undefined || (m.role === 'user' && typeof m.confirmaBorrar === 'boolean')) &&
        (m.pidio === undefined || (m.role === 'user' && (m.pidio === 'lugares' || m.pidio === 'comercios'))) &&
        (m.tarjeta === undefined || (m.role === 'assistant' && typeof m.tarjeta?.tipo === 'string' && (m.tarjeta.tipo in TITULOS || m.tarjeta.tipo === 'falta'))) &&
        (m.respuesta === undefined || (m.role === 'user' && esRespuestaDeTarjeta(m.respuesta) && JSON.stringify(m.respuesta).length <= 20_000)),
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
