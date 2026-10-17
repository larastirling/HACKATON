// Prueba de calidad del asistente del abuelo.
// Le pasa cada frase a la MISMA función que usa /abuelo (conversarConElAbuelo, en lib/ia.ts)
// y compara lo que hizo (qué botón mostró) con lo esperado. Ver README.md para correrlo.
//
// SEGURIDAD: antes de cargar la app se borran los datos de Gmail y de la base de datos.
// Así la app entra sola en su "modo prueba": los mails se muestran acá y NO se envían,
// y los pedidos de aprobación quedan en la memoria de la compu (se borran al terminar).

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CASOS, type BotonEsperado, type Caso } from './casos'
import { FAMILIA_MARTA } from './familias'

const CARPETA = join(process.cwd(), 'evaluacion', 'abuelo')

for (const variable of [
  'GMAIL_USUARIO',
  'GMAIL_CONTRASENA_APP',
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
]) {
  delete process.env[variable]
}
Object.assign(process.env, { NODE_ENV: 'development' })

/** De .env.local se lee SOLO la clave de Anthropic (nada de Gmail ni de la base). */
function cargarClave(): boolean {
  if (process.env.ANTHROPIC_API_KEY) return true
  try {
    const linea = readFileSync(join(process.cwd(), '.env.local'), 'utf8')
      .split(/\r?\n/)
      .find((l) => l.trim().startsWith('ANTHROPIC_API_KEY='))
    const clave = linea?.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '')
    if (clave) process.env.ANTHROPIC_API_KEY = clave
  } catch {
    // no hay .env.local
  }
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

// Los mails "de prueba" que la app imprime se guardan acá en vez de mostrarse en el medio de la tabla.
const mailsSimulados: string[] = []
const logOriginal = console.log
console.log = (...partes: unknown[]) => {
  const texto = partes.map(String).join(' ')
  if (texto.includes('MAIL DE PRUEBA')) {
    mailsSimulados.push(texto.match(/Para: (.*)/)?.[1] ?? '?')
    return
  }
  logOriginal(...partes)
}

type BotonMostrado =
  | { tipo: 'viaje' | 'aprobacion-viaje' | 'aprobacion-pedido'; destino: string }
  | { tipo: 'pedido'; destino: string; aclaracion?: string }
  | { tipo: 'emergencia'; familiar?: string; avisados?: string[] }

interface Resultado {
  caso: Caso
  botones: BotonMostrado[]
  texto: string
  botonOk: boolean
  textoOk: boolean | null
  motivoJuez?: string
  error?: string
  mails: string[]
}

function describirEsperado(b: BotonEsperado): string {
  switch (b.tipo) {
    case 'ninguno': return '—'
    case 'cualquiera': return '(no se evalúa)'
    case 'viaje': return `🚗 ${b.destino}`
    case 'pedido': return `🛵 ${b.destino}${b.conAclaracion ? ' + aclaración' : ''}`
    case 'aprobacion-viaje': return `⏳ viaje ${b.destino}`
    case 'aprobacion-pedido': return `⏳ pedido ${b.destino}`
    case 'emergencia': return '🚨 emergencia'
  }
}

function describirMostrado(botones: BotonMostrado[]): string {
  if (botones.length === 0) return '—'
  return botones
    .map((b) => {
      if (b.tipo === 'emergencia') return '🚨 emergencia'
      if (b.tipo === 'viaje') return `🚗 ${b.destino}`
      if (b.tipo === 'pedido') return `🛵 ${b.destino}${b.aclaracion ? ' + aclaración' : ''}`
      return `⏳ ${b.tipo === 'aprobacion-viaje' ? 'viaje' : 'pedido'} ${b.destino}`
    })
    .join(' + ')
}

/** Para el juez: lo que el abuelo ve en la pantalla, con todos los detalles. */
function describirParaElJuez(botones: BotonMostrado[]): string {
  if (botones.length === 0) return 'ningún botón ni tarjeta'
  return botones
    .map((b) => {
      if (b.tipo === 'emergencia') {
        const llamar = b.familiar ? `"Llamar al 911" y "Llamar a ${b.familiar}"` : '"Llamar al 911"'
        const aviso = b.avisados?.length ? ` Además, el sistema ya les avisó por mail a ${b.avisados.join(' y ')}.` : ''
        return `botones de emergencia: ${llamar}.${aviso}`
      }
      if (b.tipo === 'viaje') return `tarjeta con botón "Abrir Uber" hacia ${b.destino}`
      if (b.tipo === 'pedido') return `tarjeta con botón "Abrir WhatsApp" con el pedido a ${b.destino}${b.aclaracion ? ` (aclaración: ${b.aclaracion})` : ''}`
      return `ningún botón todavía: el sistema le mandó un mail a la familia pidiendo permiso para ${b.tipo === 'aprobacion-viaje' ? 'ir a' : 'pedir a'} ${b.destino}`
    })
    .join('; ')
}

function botonCoincide(esperado: BotonEsperado, botones: BotonMostrado[]): boolean {
  if (esperado.tipo === 'cualquiera') return true
  if (esperado.tipo === 'ninguno') return botones.length === 0
  if (botones.length !== 1) return false
  const [b] = botones
  if (b.tipo !== esperado.tipo) return false
  if (b.tipo === 'emergencia' || esperado.tipo === 'emergencia') return true
  if (b.destino !== esperado.destino) return false
  if (esperado.tipo === 'pedido' && esperado.conAclaracion) return b.tipo === 'pedido' && Boolean(b.aclaracion?.trim())
  return true
}

async function main() {
  if (!cargarClave()) {
    logOriginal('\nFalta la clave de Anthropic. Cargala en el archivo .env.local (en la carpeta principal del proyecto):')
    logOriginal('  ANTHROPIC_API_KEY=tu-clave\n')
    process.exit(1)
  }

  // Se cargan DESPUÉS de borrar Gmail y la base, para que la app arranque en modo prueba.
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const datos = await import('../../lib/datos')
  const ia = await import('../../lib/ia')

  if (datos.modoAlmacenamiento !== 'memoria') throw new Error('La prueba tiene que correr sin base de datos real')

  const familias = {
    DEMO: datos.FAMILIA_DEMO,
    MARTA: { ...FAMILIA_MARTA, reglas: { ...FAMILIA_MARTA.reglas, fijas: datos.REGLAS_FIJAS } },
  }
  const cliente = new Anthropic()

  async function juzgar(caso: Caso, botones: BotonMostrado[], texto: string): Promise<{ ok: boolean; motivo: string }> {
    const respuesta = await cliente.beta.messages.create({
      model: ia.MODELO_IA,
      max_tokens: 4000,
      output_config: {
        effort: 'low',
        format: {
          type: 'json_schema',
          schema: {
            type: 'object',
            properties: {
              cumple: { type: 'boolean' },
              motivo: { type: 'string', description: 'Una frase corta en español explicando por qué.' },
            },
            required: ['cumple', 'motivo'],
            additionalProperties: false,
          },
        },
      },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system:
        'Sos un evaluador estricto pero justo. Te paso lo que le escribió una persona mayor a su asistente, ' +
        'los botones que le mostró la pantalla y el texto que contestó el asistente. ' +
        'Decidí si el TEXTO cumple el criterio. Juzgá solo el criterio, no el estilo.',
      messages: [
        {
          role: 'user',
          content:
            `Lo que escribió: "${caso.frase}"\n` +
            `Lo que ve en la pantalla debajo del texto: ${describirParaElJuez(botones)}\n` +
            `Texto del asistente: "${texto}"\n\n` +
            `Criterio: ${caso.criterio}`,
        },
      ],
    })
    if (respuesta.stop_reason === 'refusal') return { ok: false, motivo: 'El juez no quiso evaluar' }
    const json = respuesta.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
    const veredicto = JSON.parse(json) as { cumple: boolean; motivo: string }
    return { ok: veredicto.cumple, motivo: veredicto.motivo }
  }

  const solo = process.argv.find((a) => a.startsWith('--solo='))?.slice(7).split(',').map(Number)
  const casos = solo ? CASOS.filter((c) => solo.includes(c.numero)) : CASOS
  const resultados: Resultado[] = []

  logOriginal(`\nProbando ${casos.length} frases con el asistente del abuelo (modelo ${ia.MODELO_IA})...\n`)

  for (const caso of casos) {
    // Cada frase arranca de cero: se borra la memoria (aprobaciones, candados de emergencia).
    ;(globalThis as { memoriaAsistente?: Map<string, unknown> }).memoriaAsistente?.clear()
    mailsSimulados.length = 0
    process.stdout.write(`  ${caso.numero}. ${caso.frase.slice(0, 60)}... `)

    const resultado: Resultado = { caso, botones: [], texto: '', botonOk: false, textoOk: null, mails: [] }
    try {
      const r = await ia.conversarConElAbuelo(familias[caso.familia], [{ de: 'abuelo', texto: caso.frase }], {
        urlApp: 'http://localhost:3000',
      })
      if (!r.ok) throw new Error(r.error)
      resultado.texto = r.texto
      if (r.viaje) resultado.botones.push({ tipo: 'viaje', destino: r.viaje.nombre })
      if (r.pedido) resultado.botones.push({ tipo: 'pedido', destino: r.pedido.comercio, aclaracion: r.pedido.aclaracion })
      if (r.emergencia) {
        resultado.botones.push({ tipo: 'emergencia', familiar: r.emergencia.familiar?.nombre, avisados: r.emergencia.avisados })
      }
      if (r.aprobacion) {
        const guardada = await datos.leerAprobacion(r.aprobacion.id)
        if (guardada?.que.tipo === 'viaje') resultado.botones.push({ tipo: 'aprobacion-viaje', destino: guardada.que.viaje.nombre })
        if (guardada?.que.tipo === 'pedido') resultado.botones.push({ tipo: 'aprobacion-pedido', destino: guardada.que.pedido.comercio })
      }
      resultado.mails = [...mailsSimulados]
      resultado.botonOk = botonCoincide(caso.boton, resultado.botones)
      if (caso.criterio) {
        const veredicto = await juzgar(caso, resultado.botones, resultado.texto)
        resultado.textoOk = veredicto.ok
        resultado.motivoJuez = veredicto.motivo
      }
    } catch (error) {
      resultado.error = (error as Error).message
    }
    resultados.push(resultado)
    logOriginal(resultado.error ? '⚠️ no se pudo probar' : aprobo(resultado) ? '✅' : '❌')

    // Si la IA falla varias veces seguidas (por ejemplo, sin crédito), se corta: seguir sería gastar sin probar nada.
    if (resultados.slice(-ERRORES_SEGUIDOS_PARA_CORTAR).filter((x) => x.error).length === ERRORES_SEGUIDOS_PARA_CORTAR) {
      logOriginal(`\n⚠️  La IA falló ${ERRORES_SEGUIDOS_PARA_CORTAR} veces seguidas (${resultado.error}). Se corta la prueba.`)
      logOriginal('   Si dice "Error de la IA (400)", lo más probable es que se haya terminado el crédito de Anthropic.')
      break
    }
  }

  mostrarTabla(resultados)
  guardarInforme(resultados)
}

const ERRORES_SEGUIDOS_PARA_CORTAR = 3

function aprobo(r: Resultado): boolean {
  return !r.error && r.botonOk && r.textoOk !== false
}

/** Las frases que no se pudieron probar (error de la IA) no cuentan ni como acierto ni como falla. */
function porcentaje(lista: Resultado[]): string {
  const probadas = lista.filter((r) => !r.error)
  const sinProbar = lista.length - probadas.length
  const nota = sinProbar > 0 ? ` — ${sinProbar} sin probar por error` : ''
  if (probadas.length === 0) return `-${nota}`
  const bien = probadas.filter(aprobo).length
  return `${Math.round((bien / probadas.length) * 100)}% (${bien} de ${probadas.length})${nota}`
}

function marca(r: Resultado): string {
  return r.error ? '⚠️' : aprobo(r) ? '✅' : '❌'
}

function cortar(texto: string, largo: number): string {
  return texto.length > largo ? texto.slice(0, largo - 1) + '…' : texto.padEnd(largo)
}

function mostrarTabla(resultados: Resultado[]) {
  const linea = '─'.repeat(130)
  logOriginal(`\n${linea}`)
  logOriginal(`${'#'.padEnd(4)}${cortar('Frase', 50)}  ${cortar('Esperado', 32)}  ${cortar('Resultado', 32)}  OK`)
  logOriginal(linea)
  for (const r of resultados) {
    const obtenido = r.error ? `ERROR: ${r.error}` : describirMostrado(r.botones)
    logOriginal(
      `${String(r.caso.numero).padEnd(4)}${cortar(r.caso.frase, 50)}  ${cortar(describirEsperado(r.caso.boton), 32)}  ${cortar(obtenido, 32)}  ${marca(r)}`,
    )
  }
  logOriginal(linea)

  const fallas = resultados.filter((r) => !aprobo(r))
  if (fallas.length > 0) {
    logOriginal('\nPor qué fallaron:')
    for (const r of fallas) {
      const motivos = [
        r.error && `error: ${r.error}`,
        !r.error && !r.botonOk && `botón distinto (esperado ${describirEsperado(r.caso.boton)}, mostró ${describirMostrado(r.botones)})`,
        r.textoOk === false && `texto: ${r.motivoJuez}`,
      ].filter(Boolean)
      logOriginal(`  ${r.caso.numero}. ${motivos.join(' | ')}`)
      if (r.texto) logOriginal(`      Contestó: "${r.texto}"`)
    }
  }

  const mails = resultados.reduce((total, r) => total + r.mails.length, 0)
  logOriginal(`\nMails: ${mails} simulados, 0 enviados de verdad.`)
  logOriginal(`\nFamilia DEMO (Don Carlos):   ${porcentaje(resultados.filter((r) => r.caso.familia === 'DEMO'))}`)
  logOriginal(`Familia inventada (Marta):   ${porcentaje(resultados.filter((r) => r.caso.familia === 'MARTA'))}`)
  logOriginal(`TOTAL:                       ${porcentaje(resultados)}`)
  logOriginal(`\nEl detalle completo (con lo que contestó en cada frase) quedó en evaluacion/abuelo/resultados.md\n`)
}

function guardarInforme(resultados: Resultado[]) {
  const escapar = (t: string) => t.replace(/\|/g, '\\|').replace(/\n+/g, ' ')
  const filas = resultados.map((r) =>
    [
      r.caso.numero,
      escapar(r.caso.frase),
      describirEsperado(r.caso.boton),
      r.error ? `ERROR: ${escapar(r.error)}` : describirMostrado(r.botones),
      marca(r),
    ].join(' | '),
  )
  const detalle = resultados.map(
    (r) =>
      `### ${r.caso.numero}. "${r.caso.frase}" ${marca(r)}\n` +
      `- Esperado: ${describirEsperado(r.caso.boton)}${r.caso.criterio ? ` — ${r.caso.criterio}` : ''}\n` +
      `- Botones: ${r.error ? `ERROR: ${r.error}` : describirMostrado(r.botones)} ${r.botonOk ? '✅' : '❌'}\n` +
      (r.textoOk !== null ? `- Juez: ${r.textoOk ? '✅' : '❌'} ${r.motivoJuez}\n` : '') +
      (r.mails.length ? `- Mails simulados (no enviados) a: ${r.mails.join('; ')}\n` : '') +
      `- Contestó: "${r.texto}"\n`,
  )
  const informe = `# Resultados de la prueba del asistente del abuelo

Corrida: ${new Date().toLocaleString('es-UY')}

- Familia DEMO (Don Carlos): ${porcentaje(resultados.filter((r) => r.caso.familia === 'DEMO'))}
- Familia inventada (Marta): ${porcentaje(resultados.filter((r) => r.caso.familia === 'MARTA'))}
- **TOTAL: ${porcentaje(resultados)}**

| # | Frase | Esperado | Resultado | OK |
|---|---|---|---|---|
${filas.map((f) => `| ${f} |`).join('\n')}

## Detalle

${detalle.join('\n')}`
  writeFileSync(join(CARPETA, 'resultados.md'), informe)
}

main().catch((error) => {
  console.error('\nLa prueba se cortó por un error:', error)
  process.exit(1)
})
