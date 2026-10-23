'use server'

import { actualizarSiVencio } from '@/lib/aprobaciones'
import { anotarEnElDiario, leerAprobacion, leerConfiguracion, marcarAvisadoAlAbuelo } from '@/lib/datos'
import { armarEmergencia, avisarEmergenciaALaFamilia, avisarUbicacionALaFamilia } from '@/lib/emergencia'
import {
  conversarConElAbuelo,
  type Emergencia,
  type EsperaAprobacion,
  type Estafa,
  type MensajeCharla,
  type Pedido,
  type Viaje,
} from '@/lib/ia'
import { leerSesion } from '@/lib/sesion'
import { urlDeLaApp } from '@/lib/url'

const MAXIMO_MENSAJES = 40
const MAXIMO_LETRAS = 2000

export type Respuesta =
  | { ok: true; texto: string; viaje?: Viaje; emergencia?: Emergencia; estafa?: Estafa; pedido?: Pedido; aprobacion?: EsperaAprobacion }
  | { ok: false }

/** Recibe TODA la charla y devuelve lo que contesta la IA. */
export async function responderAlAbuelo(charla: MensajeCharla[]): Promise<Respuesta> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'abuelo' || !esCharlaValida(charla)) return { ok: false }

  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return { ok: false }

  // Si es muy larga, se mandan los últimos mensajes, empezando siempre por uno del abuelo.
  let ultimos = charla.slice(-MAXIMO_MENSAJES)
  while (ultimos[0]?.de !== 'abuelo') ultimos = ultimos.slice(1)

  const respuesta = await conversarConElAbuelo(configuracion, ultimos, { urlApp: await urlDeLaApp() })
  if (!respuesta.ok || !respuesta.texto) {
    console.error('La IA no pudo responder al abuelo:', respuesta.ok ? 'respuesta vacía' : respuesta.error)
    return { ok: false }
  }
  const { texto, viaje, emergencia, estafa, pedido, aprobacion } = respuesta
  await anotarLoQuePaso(sesion.codigoFamilia, ultimos.at(-1)?.texto ?? '', respuesta)
  return { ok: true, texto, viaje, emergencia, estafa, pedido, aprobacion }
}

export type EstadoDeLaAprobacion =
  | { estado: 'esperando'; familiares: string[] }
  | { estado: 'aprobado'; familiar: string; viaje?: Viaje; pedido?: Pedido; consulta?: string }
  | { estado: 'rechazado'; familiar: string; llamar?: string }
  | { estado: 'sin-respuesta'; llamarA?: { nombre: string; link: string } }
  | { estado: 'no-encontrado' }

/**
 * La pantalla del abuelo pregunta esto cada pocos segundos mientras espera a la familia.
 * Cada consulta revisa el reloj: si se venció el tiempo y nadie contestó, queda "sin-respuesta".
 */
export async function consultarAprobacion(id: string): Promise<EstadoDeLaAprobacion> {
  const sesion = await leerSesion()
  const guardada = typeof id === 'string' ? await leerAprobacion(id) : null
  // Solo el abuelo de esa familia puede ver su pedido.
  if (sesion?.rol !== 'abuelo' || !guardada || guardada.codigoFamilia !== sesion.codigoFamilia) {
    return { estado: 'no-encontrado' }
  }
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return { estado: 'no-encontrado' }
  const aprobacion = await actualizarSiVencio(guardada)
  const nombres = aprobacion.preguntadoA.map((p) => p.nombre)

  if (aprobacion.estado === 'esperando') return { estado: 'esperando', familiares: nombres }
  await marcarAvisadoAlAbuelo(aprobacion.id)
  const quien = aprobacion.respondidoPor ?? ''

  if (aprobacion.estado === 'aprobado') {
    if (aprobacion.que.tipo === 'viaje') return { estado: 'aprobado', familiar: quien, viaje: aprobacion.que.viaje }
    if (aprobacion.que.tipo === 'pedido') return { estado: 'aprobado', familiar: quien, pedido: aprobacion.que.pedido }
    return { estado: 'aprobado', familiar: quien, consulta: aprobacion.que.texto }
  }
  if (aprobacion.estado === 'rechazado') {
    // Se le ofrece llamar al familiar que contestó.
    const familiar = configuracion.familiares.find((f) => f.nombre === quien)
    return { estado: 'rechazado', familiar: quien, llamar: familiar && armarEmergencia([familiar]).familiar?.link }
  }
  // Nadie contestó a tiempo: se le ofrece llamar al primer familiar.
  return { estado: 'sin-respuesta', llamarA: armarEmergencia(configuracion.familiares).familiar }
}

/**
 * Botón de emergencia: les avisa a todos los familiares (mail y celular) que el abuelo pidió ayuda.
 * Las llamadas las hace la pantalla. Si ya se avisó hace pocos minutos, no avisa de nuevo.
 */
export async function avisarQuePidioAyuda(): Promise<string[]> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'abuelo') return []
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) return []
  await anotarEnElDiario(sesion.codigoFamilia, 'ayuda', 'Tocó el botón de ayuda (emergencia)')
  return avisarEmergenciaALaFamilia(configuracion, 'Necesito ayuda (tocó el botón de emergencia)')
}

/** Botón Ayuda: cuando el celular sabe dónde está, se lo manda a la familia con un link al mapa. */
export async function mandarUbicacion(latitud: number, longitud: number): Promise<void> {
  const sesion = await leerSesion()
  if (sesion?.rol !== 'abuelo') return
  if (!Number.isFinite(latitud) || !Number.isFinite(longitud) || Math.abs(latitud) > 90 || Math.abs(longitud) > 180) return
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (configuracion) await avisarUbicacionALaFamilia(configuracion, { latitud, longitud })
}

/** Anota en el diario del día lo que pidió el abuelo y lo que hizo la app (para el resumen de la noche). */
async function anotarLoQuePaso(
  codigoFamilia: string,
  loQueDijo: string,
  r: { viaje?: Viaje; emergencia?: Emergencia; pedido?: Pedido; aprobacion?: EsperaAprobacion },
): Promise<void> {
  await anotarEnElDiario(codigoFamilia, 'charla', loQueDijo)
  if (r.viaje) await anotarEnElDiario(codigoFamilia, 'viaje', `Se le armó un viaje en Uber a ${r.viaje.nombre}`)
  if (r.pedido) await anotarEnElDiario(codigoFamilia, 'pedido', `Se le armó un pedido ${r.pedido.por === 'llamada' ? 'por teléfono' : 'por WhatsApp'} a ${r.pedido.comercio}: ${r.pedido.pedido}`)
  if (r.aprobacion) await anotarEnElDiario(codigoFamilia, 'permiso', `Se le pidió permiso a la familia (${r.aprobacion.familiares.join(', ')})`)
  if (r.emergencia) await anotarEnElDiario(codigoFamilia, 'emergencia', 'Se le mostraron los botones de emergencia')
  // La estafa la anota lib/emergencia.ts, con el motivo.
}

function esCharlaValida(charla: unknown): charla is MensajeCharla[] {
  return (
    Array.isArray(charla) &&
    charla.length > 0 &&
    charla.every(
      (m) =>
        (m?.de === 'abuelo' || m?.de === 'ia') &&
        typeof m.texto === 'string' &&
        m.texto.trim() !== '' &&
        m.texto.length <= MAXIMO_LETRAS,
    ) &&
    charla.at(-1)?.de === 'abuelo'
  )
}
