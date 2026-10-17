import { useCallback, useEffect, useRef, useState } from 'react'

// Voz del abuelo: dictado (reconocimiento de voz del navegador) y respuestas en voz alta (speechSynthesis).
// Todo es del navegador: no usa servicios pagos. Si algo no está disponible, no se rompe nada.

/** Idiomas en orden de preferencia (para escuchar y para elegir la voz). */
const IDIOMAS = ['es-UY', 'es-AR', 'es-419', 'es-ES']
/** Un poco más lento de lo normal (1 = normal). */
const VELOCIDAD = 0.9
const CLAVE_SILENCIO = 'asistente-voz-silenciada'

// ── Respuestas en voz alta ──────────────────────────────────

function hayVoz(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** La mejor voz en español disponible en este celular (o null si no hay ninguna). */
function elegirVoz(): SpeechSynthesisVoice | null {
  const voces = window.speechSynthesis.getVoices()
  const normalizar = (lang: string) => lang.replace('_', '-').toLowerCase()
  for (const idioma of IDIOMAS) {
    const voz = voces.find((v) => normalizar(v.lang) === idioma.toLowerCase())
    if (voz) return voz
  }
  return voces.find((v) => normalizar(v.lang).startsWith('es')) ?? null
}

/** Deja solo el texto para leer: sin links, emojis ni símbolos de formato. */
export function textoParaLeer(texto: string): string {
  return texto
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍]/gu, '')
    .replace(/[*_#`>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Lee el texto en voz alta (corta lo que estuviera diciendo antes). */
export function decirEnVozAlta(texto: string): void {
  if (!hayVoz()) return
  const limpio = textoParaLeer(texto)
  if (!limpio) return
  const sintesis = window.speechSynthesis
  sintesis.cancel()
  const frase = new SpeechSynthesisUtterance(limpio)
  const voz = elegirVoz()
  if (voz) frase.voice = voz
  frase.lang = voz?.lang ?? IDIOMAS[0]
  frase.rate = VELOCIDAD
  sintesis.speak(frase)
}

export function callar(): void {
  if (hayVoz()) window.speechSynthesis.cancel()
}

let vozDesbloqueada = false
/**
 * iPhone (Safari) solo deja hablar después de que la persona tocó algo.
 * Se llama en cada toque: la primera vez dice un "silencio" para destrabar la voz.
 */
export function desbloquearVoz(): void {
  if (vozDesbloqueada || !hayVoz()) return
  vozDesbloqueada = true
  const silencio = new SpeechSynthesisUtterance(' ')
  silencio.volume = 0
  window.speechSynthesis.speak(silencio)
}

/** Si el abuelo apagó la voz (se recuerda en el celular). */
export function useSilencio(): [boolean, (silenciada: boolean) => void] {
  const [silenciada, setSilenciada] = useState(false)
  useEffect(() => {
    try {
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
      if (texto.trim()) callbacks.current.alTerminar(texto.trim())
    }

    actual.current = reconocimiento
    setAviso(null)
    setEscuchando(true)
    try {
      reconocimiento.start()
    } catch {
      actual.current = null
      setEscuchando(false)
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
