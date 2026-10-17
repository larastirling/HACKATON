import { useCallback, useEffect, useRef, useState } from 'react'

// Voz del abuelo: dictado (reconocimiento de voz del navegador) y respuestas en voz alta (speechSynthesis).
// Todo es del navegador: no usa servicios pagos. Si algo no está disponible, no se rompe nada.

/** Idiomas para escuchar (dictado), en orden de preferencia. */
const IDIOMAS = ['es-UY', 'es-AR', 'es-419', 'es-ES']
/** Voces para leer en voz alta, en orden de preferencia. */
const IDIOMAS_VOZ = ['es-UY', 'es-AR', 'es-419', 'es-MX', 'es-ES']
/** Un poco más lento de lo normal (1 = normal). */
const VELOCIDAD = 0.9
const CLAVE_SILENCIO = 'asistente-voz-silenciada-v2'
/** La versión anterior guardaba el silencio con esta clave: se borra para que la voz arranque activada. */
const CLAVE_SILENCIO_VIEJA = 'asistente-voz-silenciada'
/** Después de dictar, el iPhone puede dejar el audio en "modo grabación" un momento: se espera antes de hablar. */
const ESPERA_DESPUES_DEL_DICTADO_MS = 700

// ── Respuestas en voz alta ──────────────────────────────────

function hayVoz(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let vozElegida: SpeechSynthesisVoice | null = null

/** La mejor voz en español: es-UY, es-AR, es-419, es-MX, es-ES; si no, cualquiera en "es". */
function elegirVoz(voces: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const normalizar = (lang: string) => lang.replace('_', '-').toLowerCase()
  for (const idioma of IDIOMAS_VOZ) {
    const voz = voces.find((v) => normalizar(v.lang) === idioma.toLowerCase())
    if (voz) return voz
  }
  return voces.find((v) => normalizar(v.lang).startsWith('es')) ?? null
}

/** Carga las voces del celular (en iPhone llegan un rato después: evento "voiceschanged"). */
export function prepararVoces(): void {
  if (!hayVoz()) return
  const sintesis = window.speechSynthesis
  const actualizar = () => {
    const voces = sintesis.getVoices()
    if (voces.length > 0) vozElegida = elegirVoz(voces)
  }
  actualizar()
  if (typeof sintesis.addEventListener === 'function') sintesis.addEventListener('voiceschanged', actualizar)
  else sintesis.onvoiceschanged = actualizar
}

/** Deja solo el texto para leer: sin links, emojis ni símbolos de formato. */
export function textoParaLeer(texto: string): string {
  return texto
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\uFE0F\u200D]/gu, '')
    .replace(/[*_#`>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Estado del dictado: mientras el micrófono escucha (o recién terminó) no se habla.
let dictando = false
let finDelDictado = 0
let pendiente: string | null = null

/**
 * Lee el texto en voz alta (corta lo que estuviera diciendo antes).
 * `enEsteToque`: se llama directo desde un botón (por ejemplo "Escuchar"), así en iPhone suena seguro.
 */
export function decirEnVozAlta(texto: string, { enEsteToque = false }: { enEsteToque?: boolean } = {}): void {
  if (!hayVoz()) return
  const limpio = textoParaLeer(texto)
  if (!limpio) return
  if (enEsteToque) return hablarYa(limpio)
  if (dictando) {
    pendiente = limpio // se dice cuando termine el dictado
    return
  }
  const espera = Math.max(0, finDelDictado + ESPERA_DESPUES_DEL_DICTADO_MS - Date.now())
  setTimeout(() => hablarYa(limpio), espera)
}

function hablarYa(texto: string): void {
  const sintesis = window.speechSynthesis
  sintesis.cancel()
  sintesis.resume?.() // en iPhone a veces queda "en pausa"
  const frase = new SpeechSynthesisUtterance(texto)
  const voz = vozElegida ?? elegirVoz(sintesis.getVoices())
  if (voz) frase.voice = voz
  frase.lang = voz?.lang ?? 'es-ES'
  frase.rate = VELOCIDAD
  frase.onstart = () => {
    vozDesbloqueada = true
  }
  sintesis.speak(frase)
}

export function callar(): void {
  pendiente = null
  if (hayVoz()) window.speechSynthesis.cancel()
}

/** El dictado avisa cuándo empieza y termina, para no hablar encima del micrófono. */
function marcarDictado(activo: boolean): void {
  dictando = activo
  if (activo) return
  finDelDictado = Date.now()
  if (pendiente) {
    const texto = pendiente
    pendiente = null
    setTimeout(() => hablarYa(texto), ESPERA_DESPUES_DEL_DICTADO_MS)
  }
}

let vozDesbloqueada = false
let probandoDesbloqueo = false
/**
 * iPhone (Safari) solo deja hablar si la voz se usó primero dentro de un toque de la persona.
 * Se llama en cada toque (click, soltar el dedo, tecla) hasta que la voz suena de verdad.
 */
export function desbloquearVoz(): void {
  if (vozDesbloqueada || probandoDesbloqueo || !hayVoz()) return
  probandoDesbloqueo = true
  const silencio = new SpeechSynthesisUtterance(' ')
  silencio.volume = 0
  silencio.onstart = silencio.onend = () => {
    vozDesbloqueada = true
  }
  window.speechSynthesis.speak(silencio)
  setTimeout(() => {
    probandoDesbloqueo = false // si no arrancó, se vuelve a probar en el próximo toque
  }, 1500)
}

/** Si el abuelo apagó la voz (se recuerda en el celular). Por defecto está ACTIVADA. */
export function useSilencio(): [boolean, (silenciada: boolean) => void] {
  const [silenciada, setSilenciada] = useState(false)
  useEffect(() => {
    try {
      localStorage.removeItem(CLAVE_SILENCIO_VIEJA)
      setSilenciada(localStorage.getItem(CLAVE_SILENCIO) === 'si')
    } catch {
      // Sin acceso al almacenamiento (modo privado): queda con voz.
    }
  }, [])
  const cambiar = useCallback((nueva: boolean) => {
    setSilenciada(nueva)
    if (nueva) callar()
    try {
      localStorage.setItem(CLAVE_SILENCIO, nueva ? 'si' : 'no')
    } catch {
      // No se pudo guardar: igual se aplica mientras la pantalla esté abierta.
    }
  }, [])
  return [silenciada, cambiar]
}

// ── Dictado (reconocimiento de voz) ─────────────────────────

/** Lo mínimo que usamos del reconocimiento de voz del navegador (no viene en los tipos de TypeScript). */
interface Reconocimiento {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((evento: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((evento: { error: string }) => void) | null
  onend: (() => void) | null
}

function constructorDeReconocimiento(): (new () => Reconocimiento) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => Reconocimiento) | null
}

export const MENSAJE_TECLADO = 'Para dictar, use el micrófono del teclado.'

/**
 * Dictado: mientras habla, va pasando el texto con `alEscribir`; cuando termina, llama a `alTerminar`.
 * `disponible`: null mientras se revisa; false si este navegador no puede escuchar (o no dio permiso al micrófono).
 */
export function useDictado(alEscribir: (texto: string) => void, alTerminar: (texto: string) => void) {
  const [disponible, setDisponible] = useState<boolean | null>(null)
  const [escuchando, setEscuchando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const actual = useRef<Reconocimiento | null>(null)
  const callbacks = useRef({ alEscribir, alTerminar })
  callbacks.current = { alEscribir, alTerminar }

  useEffect(() => {
    setDisponible(constructorDeReconocimiento() !== null)
    return () => actual.current?.abort()
  }, [])

  const escucharEn = useCallback((indiceIdioma: number) => {
    const Constructor = constructorDeReconocimiento()
    if (!Constructor) return
    const reconocimiento = new Constructor()
    reconocimiento.lang = IDIOMAS[indiceIdioma]
    reconocimiento.interimResults = true
    reconocimiento.continuous = false
    reconocimiento.maxAlternatives = 1

    let texto = ''
    let probarOtroIdioma = false
    let termino = false // algunos celulares avisan dos veces que terminó: se envía una sola vez
    reconocimiento.onresult = (evento) => {
      texto = Array.from(evento.results, (resultado) => resultado[0]?.transcript ?? '').join('')
      callbacks.current.alEscribir(texto)
    }
    reconocimiento.onerror = (evento) => {
      if (evento.error === 'language-not-supported' && indiceIdioma + 1 < IDIOMAS.length) {
        probarOtroIdioma = true
      } else if (evento.error === 'not-allowed' || evento.error === 'service-not-allowed') {
        // Sin permiso, o el navegador no deja usarlo acá (por ejemplo, abierto desde el ícono en iPhone).
        setDisponible(false)
        setAviso(MENSAJE_TECLADO)
      } else if (evento.error === 'no-speech') {
        setAviso('No le escuché. Toque "Hablar" y hable de nuevo.')
      } else if (evento.error !== 'aborted') {
        setAviso(`No pude escuchar. Pruebe de nuevo o ${MENSAJE_TECLADO.charAt(0).toLowerCase()}${MENSAJE_TECLADO.slice(1)}`)
      }
    }
    reconocimiento.onend = () => {
      if (termino) return
      termino = true
      actual.current = null
      if (probarOtroIdioma) return escucharEn(indiceIdioma + 1)
      setEscuchando(false)
      marcarDictado(false)
      if (texto.trim()) callbacks.current.alTerminar(texto.trim())
    }

    actual.current = reconocimiento
    setAviso(null)
    setEscuchando(true)
    marcarDictado(true)
    try {
      reconocimiento.start()
    } catch {
      actual.current = null
      setEscuchando(false)
      marcarDictado(false)
      setAviso(MENSAJE_TECLADO)
    }
  }, [])

  /** Si está escuchando, termina (y se envía lo dicho). Si no, empieza a escuchar. */
  const tocar = useCallback(() => {
    if (actual.current) actual.current.stop()
    else escucharEn(0)
  }, [escucharEn])

  return { disponible, escuchando, aviso, tocar }
}
