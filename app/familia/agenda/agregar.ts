import 'server-only'
import { agregarActividad, textoAgregada } from '@/lib/agenda'
import type { ConfiguracionAbuelo } from '@/lib/datos'

// Agregar a la agenda como el familiar que entró (desde /familia/agenda o escribiéndolo en la charla de /familia).

export type ResultadoAgenda = { ok: true; mensaje: string } | { ok: false; mensaje: string }

export async function agregarComoFamiliar(
  configuracion: ConfiguracionAbuelo,
  mail: string | undefined,
  datos: { titulo?: unknown; fecha?: unknown; hora?: unknown; lugar?: unknown },
): Promise<ResultadoAgenda> {
  const texto = (v: unknown) => (typeof v === 'string' ? v.slice(0, 200) : '')
  // Quién la agrega: el familiar que entró con ese mail (si no se encuentra, el primero).
  const yo =
    configuracion.familiares.find((f) => mail && f.mail.toLowerCase() === mail.toLowerCase()) ??
    [...configuracion.familiares].sort((a, b) => a.orden - b.orden)[0]
  const resultado = await agregarActividad(configuracion, yo?.nombre ?? 'Un familiar', {
    titulo: texto(datos?.titulo),
    fecha: texto(datos?.fecha),
    hora: texto(datos?.hora),
    lugar: texto(datos?.lugar),
  })
  if (!resultado.ok) return { ok: false, mensaje: resultado.problema }
  const nombre = configuracion.abuelo.nombre.split(' ')[0]
  return {
    ok: true,
    mensaje: resultado.avisado
      ? `Listo. A ${nombre} le llegó al celular: "${textoAgregada(configuracion, resultado.actividad)}"`
      : `Listo, quedó en la agenda. ${nombre} todavía no activó los avisos en su celular: lo va a ver cuando abra la app.`,
  }
}
