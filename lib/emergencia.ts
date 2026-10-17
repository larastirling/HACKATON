import 'server-only'
import { escapar, familiaresConMail } from './aprobaciones'
import { PENDIENTE, primerNombre, soltarCandado, tomarCandado, type ConfiguracionAbuelo, type Familiar } from './datos'
import { enviarMail } from './mail'

/** Lo que necesita la pantalla para mostrar los botones de emergencia. */
export interface Emergencia {
  /** Primer familiar (según "orden") que tiene teléfono guardado. */
  familiar?: { nombre: string; link: string }
  /** A quiénes se les avisó por mail (ahora o en los últimos minutos). */
  avisados?: string[]
}

/** Como máximo un aviso de emergencia por mail cada estos minutos, por abuelo. */
export const MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA = 10
const MAXIMO_LETRAS_CITA = 300

/** Arma los botones con los teléfonos GUARDADOS en la configuración. El 911 va siempre. */
export function armarEmergencia(familiares: Familiar[]): Emergencia {
  const primero = [...familiares]
    .sort((a, b) => a.orden - b.orden)
    .find((familiar) => familiar.telefono !== PENDIENTE && familiar.telefono.replace(/\D/g, '') !== '')
  if (!primero) return {}
  return { familiar: { nombre: primero.nombre, link: `tel:${primero.telefono.replace(/[^\d+]/g, '')}` } }
}

/**
 * Manda un mail a los familiares, solo y sin preguntar, contando lo que dijo el abuelo.
 * Si ya se mandó uno en los últimos minutos, no manda otro (para no llenar la casilla).
 * Devuelve a quiénes se les avisó (ahora o hace poco).
 */
export async function avisarEmergenciaALaFamilia(configuracion: ConfiguracionAbuelo, loQueDijo: string): Promise<string[]> {
  const familiares = familiaresConMail(configuracion)
  if (familiares.length === 0) return []
  const nombres = familiares.map((f) => f.nombre)

  const candado = `emergencia:${configuracion.codigoFamilia}`
  if (!(await tomarCandado(candado, MINUTOS_ENTRE_AVISOS_DE_EMERGENCIA * 60))) return nombres // ya se avisó hace poco

  const nombre = primerNombre(configuracion.abuelo.nombre)
  const cita = loQueDijo.trim().slice(0, MAXIMO_LETRAS_CITA)
  const telefono = configuracion.abuelo.telefono
  const tieneTelefono = telefono !== PENDIENTE && telefono.replace(/\D/g, '') !== ''
  const llamalo = tieneTelefono ? `Llamalo al ${telefono}.` : 'No tenemos su teléfono guardado: comunicate con él como puedas.'

  const resultado = await enviarMail({
    para: familiares.map((f) => f.mail).join(', '),
    asunto: `⚠️ ${nombre} puede necesitar ayuda`,
    texto: `${nombre} dijo: "${cita}". Puede necesitar ayuda. ${llamalo}\n\nAsistente de confianza`,
    html: `<div style="font-family:Arial,sans-serif;font-size:20px;line-height:1.5;color:#111111;max-width:480px">
  <p style="font-size:24px"><strong>${escapar(nombre)} dijo: "${escapar(cita)}".</strong></p>
  <p>Puede necesitar ayuda. ${escapar(llamalo)}</p>
  ${
    tieneTelefono
      ? `<a href="tel:${escapar(telefono.replace(/[^\d+]/g, ''))}" style="display:block;padding:20px;margin:12px 0;border-radius:12px;background:#a50e0e;color:#ffffff;font-size:24px;font-weight:bold;text-align:center;text-decoration:none">📞 Llamar a ${escapar(nombre)}</a>`
      : ''
  }
  <p style="font-size:16px;color:#3d3d3d">Asistente de confianza</p>
</div>`,
  })
  if (!resultado.enviado) {
    await soltarCandado(candado) // así el próximo intento puede volver a probar
    return []
  }
  return nombres
}
