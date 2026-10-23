import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { fechaDeHoy, leerConfiguracion, leerNumerosReportados, PENDIENTE, reportarNumero, type Comercio, type ConfiguracionAbuelo } from '@/lib/datos'
import { CATALOGO_COMERCIOS, type ComercioDelCatalogo } from './catalogo-comercios'
import { comercioConNumero, escribirComercio, propiedadesDelPermiso, textoDelPermiso } from './comercios'
import { dondeVive, kmEntre, KM_MAXIMOS, textoDistancia } from './distancia'
import { cambiarConfiguracion, limpiarApodos, mismoNombre, normalizarTelefono, normalizarTelefonoParaLlamar } from './guardar'

// Sugerencias de comercios del catálogo (catalogo-comercios.ts). Igual que con los lugares, nada se guarda solo:
//   1. Se sugieren solos (o la IA con sugerir_comercios) solo los "confirmado por su web" que entregan donde vive la persona
//      mayor: a menos de KM_MAXIMOS de su casa y, si la fuente dice la zona de envío, dentro de esa zona. Del más cerca al más lejos.
//      Con "Ver todos los cercanos" el hijo ve además los "sin confirmar", con el aviso "número sin confirmar".
//   2. Si toca uno confirmado, el sistema le cuenta de dónde salió el número y le pregunta qué le pide siempre (sin la IA).
//      Si toca uno sin confirmar, primero le pregunta "¿ya le pidieron por acá y funciona?" (botones): solo si dice que sí
//      sigue, y queda "confirmado por la familia" para ESA familia, con la fecha.
//   3. La IA le pregunta si puede pedir solo o necesita permiso, y lo guarda (guardar_comercio_sugerido) con el número
//      del catálogo. El servidor verifica que el hijo haya dicho lo del permiso, igual que con los lugares.
// Si un hijo dice que el número de un comercio no anda (reportar_numero_que_no_anda), ese número deja de sugerirse a
// todas las familias hasta que lo revisemos (lib/datos.ts, en /prueba).

export interface ComercioSugerido {
  id: string
  nombre: string
  tipo: string
  /** La dirección del local, o "Pedido a la central" si es una cadena. */
  direccion: string
  /** A cuánto queda el local de la casa ("a 1,2 km"). Las cadenas no tienen. */
  distancia?: string
  /** El número todavía no está confirmado (se muestra el aviso "número sin confirmar"). */
  sinConfirmar?: boolean
}

export const MAXIMO_SUGERENCIAS_COMERCIOS = 4

/** Vercel define VERCEL en la app publicada: ahí no aparecen los comercios de prueba (soloEnLaCompu). */
const enLaAppPublicada = Boolean(process.env.VERCEL)

/** Los del catálogo con algún número para pedir (sin los de prueba en la app publicada). */
const EN_EL_CATALOGO = CATALOGO_COMERCIOS.filter((c) => (c.whatsapp || c.llamada.length > 0) && !(c.soloEnLaCompu && enLaAppPublicada))

const estaConfirmado = (c: ComercioDelCatalogo) => c.confirmacion.estado !== 'sin confirmar'

const buscarEnElCatalogo = (id: unknown) => EN_EL_CATALOGO.find((c) => c.id === id)

const yaGuardado = (c: ConfiguracionAbuelo, comercio: ComercioDelCatalogo) => c.comercios.some((x) => mismoNombre(x.nombre, comercio.nombre))

/** Por WhatsApp si tiene; si no, llamando al primer teléfono. */
const comoSePide = (c: ComercioDelCatalogo) =>
  c.whatsapp ? { pedidoPor: 'whatsapp' as const, numero: c.whatsapp } : { pedidoPor: 'llamada' as const, numero: c.llamada[0] }

const soloDigitos = (numero: string) => numero.replace(/\D/g, '')

/** Los números que algún hijo reportó que no andan (para todas las familias). */
async function numerosQueNoAndan(): Promise<Set<string>> {
  return new Set((await leerNumerosReportados()).map((r) => soloDigitos(r.numero)))
}

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

interface Disponible {
  comercio: ComercioDelCatalogo
  /** A cuántos km de la casa queda el local (null en las cadenas). */
  km: number | null
}

/**
 * Los comercios que se pueden mostrar ahora, del más cerca al más lejos (las cadenas, sin local, al final).
 * Con local: solo si se sabe dónde vive y el local queda a menos de KM_MAXIMOS. Con zona de envío: solo si vive en esa zona.
 * Nunca los ya guardados ni los de números reportados. Los "sin confirmar", solo si se piden (para "Ver todos").
 */
async function disponibles(configuracion: ConfiguracionAbuelo, { conSinConfirmar = false } = {}): Promise<Disponible[]> {
  const noAndan = await numerosQueNoAndan()
  const candidatos = EN_EL_CATALOGO.filter(
    (c) => !yaGuardado(configuracion, c) && !noAndan.has(soloDigitos(comoSePide(c).numero)) && (conSinConfirmar || estaConfirmado(c)),
  )
  const hayQueUbicar = candidatos.some((c) => c.direccion || c.zonaDeEnvio)
  const casa = hayQueUbicar ? await dondeVive(configuracion) : null

  const lista: Disponible[] = []
  for (const comercio of candidatos) {
    if (comercio.zonaDeEnvio && !(casa && comercio.zonaDeEnvio.some((b) => sinTildes(casa.direccionDelMapa).includes(sinTildes(b))))) continue
    if (!comercio.direccion) {
      lista.push({ comercio, km: null })
      continue
    }
    if (!casa || comercio.latitud === null || comercio.longitud === null) continue // no se sabe a qué distancia queda
    const km = kmEntre(casa, { latitud: comercio.latitud, longitud: comercio.longitud })
    if (km <= KM_MAXIMOS) lista.push({ comercio, km })
  }
  return lista.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity))
}

const paraMostrar = ({ comercio, km }: Disponible): ComercioSugerido => ({
  id: comercio.id,
  nombre: comercio.nombre,
  tipo: comercio.tipo,
  direccion: comercio.direccion ?? 'Pedido a la central',
  ...(km !== null && { distancia: textoDistancia(km) }),
  ...(!estaConfirmado(comercio) && { sinConfirmar: true }),
})

/**
 * Los que muestra el sistema solo (al llegar a los comercios o con el botón "Sugerirme comercios"):
 * los confirmados más cercanos que todavía no vio en esta charla (si ya vio todos, vuelve a empezar).
 */
export async function comerciosCercanos(configuracion: ConfiguracionAbuelo, yaMostrados: string[]): Promise<ComercioSugerido[]> {
  const lista = await disponibles(configuracion)
  const nuevos = lista.filter((d) => !yaMostrados.includes(d.comercio.id))
  return (nuevos.length > 0 ? nuevos : lista).slice(0, MAXIMO_SUGERENCIAS_COMERCIOS).map(paraMostrar)
}

/** Para "Ver todos los cercanos": todos a menos de KM_MAXIMOS, también los sin confirmar (con el aviso), del más cerca al más lejos. */
export async function todosLosComerciosCercanos(configuracion: ConfiguracionAbuelo): Promise<ComercioSugerido[]> {
  return (await disponibles(configuracion, { conSinConfirmar: true })).map(paraMostrar)
}

/** La lista que ve la IA: solo puede sugerir estos (confirmados, ya filtrados y ordenados del más cerca al más lejos). */
export async function catalogoComerciosParaLaIA(configuracion: ConfiguracionAbuelo): Promise<string> {
  const lista = await disponibles(configuracion)
  if (lista.length === 0) return 'CATÁLOGO DE COMERCIOS PARA SUGERIR: no hay ninguno confirmado para sugerir ahora.'
  return [
    'CATÁLOGO DE COMERCIOS PARA SUGERIR (comercios con el número confirmado que entregan donde vive, del más cerca al más lejos; son los ÚNICOS que podés sugerir):',
    ...lista.map((d) => {
      const { id, nombre, tipo } = d.comercio
      const { direccion, distancia } = paraMostrar(d)
      return `- ${id} | ${nombre} | ${tipo} | ${direccion}${distancia ? ` | ${distancia}` : ''} | se pide ${comoSePide(d.comercio).pedidoPor === 'whatsapp' ? 'por WhatsApp' : 'llamando'}`
    }),
  ].join('\n')
}

export function herramientaSugerirComercios(): Anthropic.Beta.BetaTool | null {
  if (!EN_EL_CATALOGO.some(estaConfirmado)) return null
  return {
    name: 'sugerir_comercios',
    description:
      'Le muestra al hijo, debajo de tu mensaje, botones con comercios del CATÁLOGO DE COMERCIOS para que elija si su papá o mamá les pide algo. ' +
      'NO guarda nada: si el hijo toca uno, el sistema le pregunta qué le pide siempre. Solo se muestran los que entregan donde vive.',
    input_schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          // Sin "enum" con los ids, igual que sugerir_lugares: un catálogo grande hace que la API rechace las herramientas strict.
          // sugerirComercios descarta los ids que no están entre los que se pueden sugerir.
          items: { type: 'string' },
          description: `Entre 1 y ${MAXIMO_SUGERENCIAS_COMERCIOS} ids del CATÁLOGO DE COMERCIOS (tal cual aparecen en la lista), los que más le puedan servir según lo que contó el hijo.`,
        },
      },
      required: ['ids'],
      additionalProperties: false,
    },
    // Sin strict: Haiku rechaza la charla si hay muchas herramientas strict ("The compiled grammar is too large").
    // Strict queda solo en las que guardan datos; lo que llega por acá lo revisa el servidor igual.
    strict: false,
  }
}

/** Ejecuta sugerir_comercios: arma los botones (sin guardar nada), del más cerca al más lejos, y le dice a la IA qué se muestra. */
export async function sugerirComercios(configuracion: ConfiguracionAbuelo, dato: unknown): Promise<{ texto: string; comerciosSugeridos?: ComercioSugerido[] }> {
  const ids = (dato as { ids?: unknown } | null)?.ids
  if (!Array.isArray(ids)) return { texto: 'No se mostró nada: faltan los ids del catálogo de comercios.' }
  const lista = await disponibles(configuracion)
  const sugerencias = lista.filter((d) => ids.includes(d.comercio.id)).slice(0, MAXIMO_SUGERENCIAS_COMERCIOS).map(paraMostrar)
  if (sugerencias.length === 0) {
    return { texto: 'No se mostró nada: esos comercios no están en el catálogo para sugerir (sin confirmar, ya guardados, lejos o fuera de su zona de envío).' }
  }
  const noSeMostraron = ids.filter((id) => typeof id === 'string' && !sugerencias.some((s) => s.id === id))
  return {
    comerciosSugeridos: sugerencias,
    texto:
      `Listo: debajo de tu mensaje el hijo ve botones con ${sugerencias.map((s) => s.nombre).join(', ')} y uno de "Ninguno". NO se guardó nada.` +
      (noSeMostraron.length ? ` No se mostraron ${noSeMostraron.join(', ')}: no entregan donde vive o ya están guardados.` : '') +
      ' En tu mensaje preguntale, en una frase, si su papá o mamá le pide a alguno de estos. No los listes: ya están en los botones.',
  }
}

/** De dónde salió el número, para que el hijo sepa cuánto confiar. */
function origenDelNumero(c: ComercioDelCatalogo): string {
  if (c.confirmacion.estado === 'de prueba') return 'es un comercio de prueba: atiende alguien del equipo'
  if (c.confirmacion.estado === 'confirmado por su web') return 'está confirmado por su web oficial'
  const donde = { oficial: 'de su web oficial', redes: 'de sus redes', directorio: 'de una guía de internet', prueba: 'del equipo' }[c.fuente.tipo]
  return `lo sacamos ${donde}`
}

const sugeridoDe = (c: ComercioDelCatalogo): ComercioSugerido => ({
  id: c.id,
  nombre: c.nombre,
  tipo: c.tipo,
  direccion: c.direccion ?? 'Pedido a la central',
  ...(!estaConfirmado(c) && { sinConfirmar: true }),
})

const comoSePideTexto = (c: ComercioDelCatalogo) => {
  const { pedidoPor, numero } = comoSePide(c)
  return pedidoPor === 'whatsapp' ? `El WhatsApp que tenemos es ${numero}` : `Se le pide llamando al ${numero}`
}

/**
 * El hijo tocó un comercio sugerido. Si el número está confirmado, el sistema le cuenta de dónde salió y le pregunta
 * qué pide siempre. Si no está confirmado, primero le pregunta si ya le pidieron por ahí y funciona (botones Sí / No).
 */
export async function preguntarPedido(
  configuracion: ConfiguracionAbuelo,
  id: unknown,
): Promise<{ texto: string; preguntaPedido?: ComercioSugerido; preguntaNumero?: ComercioSugerido }> {
  const comercio = buscarEnElCatalogo(id)
  if (!comercio || (await numerosQueNoAndan()).has(soloDigitos(comoSePide(comercio).numero))) {
    return { texto: 'Ese comercio no está en la lista. ¿Me contás a qué comercio le pide?' }
  }
  if (yaGuardado(configuracion, comercio)) return { texto: `${comercio.nombre} ya está guardado. ¿Le pide a algún otro comercio?` }
  if (!estaConfirmado(comercio)) {
    return {
      texto: `${comercio.nombre}: ${comoSePideTexto(comercio)} (${origenDelNumero(comercio)}). Este número no está confirmado: ¿ya le pidieron por acá y funciona?`,
      preguntaNumero: sugeridoDe(comercio),
    }
  }
  return {
    texto: `Buenísimo: ${comercio.nombre}. ${comoSePideTexto(comercio)}: ${origenDelNumero(comercio)}. ¿Qué le pide siempre?`,
    preguntaPedido: sugeridoDe(comercio),
  }
}

/** El hijo contestó si el número sin confirmar funciona. Sin la IA. */
export function respuestaDelNumero(id: string, funciona: boolean): { texto: string; preguntaPedido?: ComercioSugerido } {
  const comercio = buscarEnElCatalogo(id)
  if (!comercio) return { texto: 'Ese comercio no está en la lista. ¿Me contás a qué comercio le pide?' }
  if (!funciona) {
    return {
      texto: `Entonces no guardo ${comercio.nombre} con ese número. Si tienen un número que sepan que funciona, contámelo y lo anoto. ¿Le pide a algún otro comercio?`,
    }
  }
  return {
    texto: `¡Bien! Lo anoto como confirmado por ustedes (vale solo para su familia). ¿Qué le pide siempre a ${comercio.nombre}?`,
    preguntaPedido: sugeridoDe(comercio),
  }
}

/** "sí", "si, funciona", "anda", "ya le pedimos"… (y no "no", "no sé"). */
// (?!\p{L}) en vez de \b: \b no entiende las letras con tilde ("Sí" no tenía "fin de palabra").
export const esUnSi = (texto: string) =>
  !esUnNo(texto) && /^\s*(s[ií](?!\p{L})|sip(?!\p{L})|claro|funciona|anda(?!\p{L})|ya le (pedimos|pidieron|pide))/iu.test(texto)
export const esUnNo = (texto: string) => /^\s*no(?!\p{L})/iu.test(texto)

interface MensajeConConfirmacion {
  role: 'user' | 'assistant'
  content: string
  preguntaNumero?: { id: string }
  confirmaNumero?: { id: string; funciona: boolean }
}

/** Los comercios sin confirmar que el hijo dijo que funcionan en ESTA charla (con el botón "Sí" o escribiendo "sí"). */
export function confirmadosPorElHijo(mensajes: MensajeConConfirmacion[]): string[] {
  return mensajes.flatMap((m, i) => {
    const pregunta = mensajes[i - 1]?.preguntaNumero
    if (m.role !== 'user' || !pregunta) return []
    if (m.confirmaNumero) return m.confirmaNumero.id === pregunta.id && m.confirmaNumero.funciona ? [pregunta.id] : []
    return esUnSi(m.content) ? [pregunta.id] : []
  })
}

/** Para guardar un comercio del catálogo después de que el hijo lo eligió, contó qué pide y si necesita permiso. */
export const HERRAMIENTA_GUARDAR_COMERCIO_SUGERIDO: Anthropic.Beta.BetaTool = {
  name: 'guardar_comercio_sugerido',
  description:
    'Guarda un comercio del catálogo que el hijo eligió tocando su botón, con el número del catálogo. ' +
    'Usala recién cuando el hijo te dijo qué le pide siempre Y si puede pedir solo o necesita permiso. Si no lo eligió con el botón, no la uses.',
  input_schema: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'El id del comercio del catálogo que eligió el hijo.' },
      apodos: {
        type: 'array',
        items: { type: 'string' },
        description: 'Cómo lo llama la persona mayor, tal cual lo dijo el hijo. Puede ser [].',
      },
      pedidoHabitual: { type: 'string', description: 'Lo que pide siempre, con las palabras del hijo.' },
      ...propiedadesDelPermiso,
    },
    required: ['id', 'apodos', 'pedidoHabitual', 'necesitaPermiso', 'fraseDelHijo'],
    additionalProperties: false,
  },
  // Sin strict: Haiku rechaza la charla si hay muchas herramientas strict ("The compiled grammar is too large").
  // Strict queda solo en las que guardan datos; lo que llega por acá lo revisa el servidor igual.
  strict: false,
}

/**
 * Guarda un comercio del catálogo. `elegidos`: los ids que el hijo tocó en esta charla (solo esos se pueden guardar).
 * `confirmados`: los sin confirmar que el hijo dijo que funcionan (sin eso, uno sin confirmar no se guarda).
 * `loQueEscribioElHijo`: para verificar que dijo si puede pedir solo o necesita permiso.
 */
export async function guardarComercioSugerido(
  codigoFamilia: string,
  dato: unknown,
  elegidos: string[],
  confirmados: string[],
  loQueEscribioElHijo: string[],
): Promise<string> {
  console.log('[familia] la IA pidió guardar_comercio_sugerido:', JSON.stringify(dato))
  const { id, apodos, pedidoHabitual, necesitaPermiso, fraseDelHijo } = (dato ?? {}) as Record<string, unknown>
  const del = buscarEnElCatalogo(id)
  if (!del || (await numerosQueNoAndan()).has(soloDigitos(comoSePide(del).numero))) {
    return 'No se guardó: ese comercio no está entre los que se pueden sugerir.'
  }
  if (!elegidos.includes(del.id)) {
    return 'No se guardó: el hijo no eligió ese comercio con el botón. Si querés ofrecérselo, sugerilo con sugerir_comercios.'
  }
  if (!estaConfirmado(del) && !confirmados.includes(del.id)) {
    return 'No se guardó: el número de ese comercio no está confirmado y el hijo no dijo que ya le pidieron por ahí y funciona. Preguntáselo antes de guardarlo.'
  }
  const pedido = typeof pedidoHabitual === 'string' ? pedidoHabitual.trim() : ''
  if (!pedido || pedido.toUpperCase() === PENDIENTE) return 'No se guardó: falta el pedido habitual. Preguntale al hijo qué pide siempre.'
  if (typeof necesitaPermiso !== 'boolean' || typeof fraseDelHijo !== 'string') {
    return 'No se guardó: falta si puede pedir solo o necesita permiso. Preguntáselo al hijo.'
  }

  const { pedidoPor, numero } = comoSePide(del)
  const normalizado = (pedidoPor === 'llamada' ? normalizarTelefonoParaLlamar(numero) : normalizarTelefono(numero)) ?? PENDIENTE
  const confirmacion: Comercio['confirmacion'] =
    del.confirmacion.estado === 'confirmado por su web'
      ? { estado: 'confirmado por su web', fecha: del.confirmacion.fecha, link: del.confirmacion.link }
      : del.confirmacion.estado === 'sin confirmar'
        ? { estado: 'confirmado por la familia', fecha: fechaDeHoy() }
        : undefined
  const comercio: Comercio = {
    ...comercioConNumero(
      {
        nombre: del.nombre,
        apodos: Array.isArray(apodos) ? limpiarApodos(apodos.filter((a): a is string => typeof a === 'string')) : [],
        pedidoHabitual: pedido,
        necesitaPermiso,
      },
      pedidoPor,
      normalizado,
    ),
    ...(confirmacion && { confirmacion }),
  }
  const resultado = await escribirComercio(codigoFamilia, comercio, fraseDelHijo, loQueEscribioElHijo)
  if ('error' in resultado) return resultado.error
  const como = pedidoPor === 'llamada' ? `para pedir llamando al ${normalizado}` : `con el WhatsApp ${normalizado}`
  return (
    `${resultado.yaExistia ? 'Actualizado' : 'Guardado'} "${comercio.nombre}" ${como}, el pedido "${pedido}" y ${textoDelPermiso(resultado.necesitaPermiso)}. ` +
    'Contáselo en una frase y preguntale si le pide a algún otro comercio.'
  )
}

// ── "El número de X no anda" ────────────────────────────────

export const HERRAMIENTA_REPORTAR_NUMERO: Anthropic.Beta.BetaTool = {
  name: 'reportar_numero_que_no_anda',
  description:
    'Cuando el hijo dice que el número de un comercio no anda (no contesta, está equivocado, no existe). ' +
    'Si el comercio está en el catálogo, ese número deja de sugerirse a todas las familias hasta que lo revisemos. ' +
    'Si es un comercio guardado de esta familia, no se le arman pedidos hasta que el hijo pase otro número.',
  input_schema: {
    type: 'object',
    properties: {
      comercio: { type: 'string', description: 'El nombre del comercio tal cual lo dijo el hijo o como figura guardado o en el catálogo.' },
      fraseDelHijo: { type: 'string', description: 'Las palabras EXACTAS que escribió el hijo diciendo que el número no anda.' },
    },
    required: ['comercio', 'fraseDelHijo'],
    additionalProperties: false,
  },
  // Sin strict (no suma a la gramática de Haiku); el servidor verifica la frase contra lo que escribió el hijo.
  strict: false,
}

/** Que el hijo haya dicho de verdad que el número no anda (no vale que la IA lo deduzca). */
const DICE_QUE_NO_ANDA = /\bno (anda|funciona|contesta|atiende|existe|es (el|de))\b|equivocad|incorrect|da apagado|fuera de servicio|no (me|nos) (contestan|atienden)/i

export async function reportarNumeroQueNoAnda(codigoFamilia: string, dato: unknown, loQueEscribioElHijo: string[]): Promise<string> {
  console.log('[familia] la IA pidió reportar_numero_que_no_anda:', JSON.stringify(dato))
  const { comercio, fraseDelHijo } = (dato ?? {}) as { comercio?: unknown; fraseDelHijo?: unknown }
  if (typeof comercio !== 'string' || !comercio.trim() || typeof fraseDelHijo !== 'string') {
    return 'No se reportó: falta qué comercio y lo que dijo el hijo.'
  }
  const dijoQueNoAnda = DICE_QUE_NO_ANDA.test(fraseDelHijo) && loQueEscribioElHijo.some((m) => m.toLowerCase().includes(fraseDelHijo.trim().toLowerCase()))
  if (!dijoQueNoAnda) {
    return 'No se reportó: el hijo no dijo con esas palabras que el número no anda. Si no está claro, preguntale.'
  }

  // El nombre puede venir corto ("Piazza Italia"): valen todos los del catálogo cuyo nombre lo contiene.
  const buscado = sinTildes(comercio.trim())
  const configuracion = await leerConfiguracion(codigoFamilia)
  const guardado = configuracion?.comercios.find((c) => sinTildes(c.nombre) === buscado || sinTildes(c.nombre).includes(buscado))
  const delCatalogo = EN_EL_CATALOGO.filter((c) => sinTildes(c.nombre) === buscado || sinTildes(c.nombre).includes(buscado))

  // Los números a reportar: los del catálogo que coinciden y, si está guardado, el número que tiene guardado.
  const numeroGuardado = guardado ? (guardado.pedidoPor === 'llamada' ? guardado.telefono : guardado.whatsapp) : undefined
  const numeros = new Map<string, string>() // dígitos → nombre del comercio
  for (const c of delCatalogo) numeros.set(soloDigitos(comoSePide(c).numero), c.nombre)
  const enElCatalogo = (digitos: string) => EN_EL_CATALOGO.some((c) => soloDigitos(comoSePide(c).numero) === digitos)
  if (numeroGuardado && numeroGuardado !== PENDIENTE && enElCatalogo(soloDigitos(numeroGuardado))) numeros.set(soloDigitos(numeroGuardado), guardado!.nombre)
  if (numeros.size === 0 && !guardado) {
    return `No encontré "${comercio}" ni entre los comercios guardados ni en el catálogo. Preguntale de qué comercio habla.`
  }

  const cuando = new Date().toISOString()
  const ultimoMensaje = loQueEscribioElHijo.at(-1) ?? fraseDelHijo
  for (const [digitos, nombre] of numeros) {
    const c = EN_EL_CATALOGO.find((x) => soloDigitos(comoSePide(x).numero) === digitos)
    await reportarNumero({ numero: c ? comoSePide(c).numero : digitos, comercio: nombre, cuando, codigoFamilia, loQueDijo: ultimoMensaje.slice(0, 300) })
  }
  if (guardado) {
    await cambiarConfiguracion(codigoFamilia, (c) => ({
      ...c,
      comercios: c.comercios.map((x) => (x.nombre === guardado.nombre ? { ...x, numeroNoAnda: fechaDeHoy() } : x)),
    }))
  }
  return (
    'Anotado. ' +
    (numeros.size > 0
      ? `El número de ${[...new Set(numeros.values())].join(', ')} quedó reportado: no se va a sugerir a ninguna familia hasta que lo revisemos. `
      : '') +
    (guardado ? `"${guardado.nombre}" quedó guardado como "número que no anda": no se le arman pedidos hasta tener otro número. ` : '') +
    'Contáselo en una frase y preguntale si tiene un número que sepa que funciona (si lo da, guardalo con guardar_comercio). Nunca inventes ni completes números.'
  )
}
