import 'server-only'
import { actualizarSiVencio } from './aprobaciones'
import { agregarALoQuePaso, leerAprobaciones, leerLoQuePaso, type EstadoAprobacion } from './datos'
import { textoDeMinutos, type TarjetaDeEstacionamiento } from './estacionamiento'
import type { Viaje } from './viajes'
import type { Pedido } from './whatsapp'

// "Lo que pasó": lo que el hijo ve en /familia/lo-que-paso, del más nuevo al más viejo.
//   - lo que pidió el abuelo: viajes, pedidos de comida (por WhatsApp), llamadas a comercios y el estacionamiento;
//   - los pedidos de permiso (el estado se lee del pedido de aprobación, así siempre está al día);
//   - los avisos que se le mandaron a la familia (emergencia, ubicación, posible estafa, pedido de plata, resumen);
//   - los mails que el script de Gmail marcó como ESTAFA o DUDOSO (llegan por /api/mail-marcado).
// Se guarda en lib/datos.ts (agregarALoQuePaso). Anotar nunca rompe lo que está haciendo el abuelo.

export type TipoDeCosa = 'viaje' | 'pedido' | 'llamada' | 'estacionamiento' | 'permiso' | 'aviso' | 'mail'
export type CategoriaDeMail = 'ESTAFA' | 'DUDOSO'

export interface CosaQuePaso {
  /** Cuándo pasó (ISO). */
  cuando: string
  tipo: TipoDeCosa
  /** Una frase para el hijo: "Pidió un viaje a Montevideo Shopping". */
  texto: string
  /** Un detalle, si hay: qué pidió, a quién se le preguntó. */
  detalle?: string
  /** Solo en los permisos: el pedido de aprobación. */
  aprobacionId?: string
  /** Solo en los mails marcados. */
  mail?: { categoria: CategoriaDeMail; motivo: string; de?: string; asunto?: string }
}

/** Lo que se muestra: lo guardado y, en los permisos, cómo terminó. */
export interface CosaParaMostrar extends CosaQuePaso {
  estado?: EstadoAprobacion
  respondidoPor?: string
}

const MAXIMO_LETRAS = 300

/** Sin links, mails ni teléfonos (de un mail de estafa no se muestra nada que se pueda tocar o copiar por error). */
export const sinDatosDeContacto = (texto: string) =>
  texto
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, '[link]')
    .replace(/\S+@\S+\.\S+/g, '[mail]')
    .replace(DOMINIO_SUELTO, '[link]')
    // Un monto con puntos de miles ("1.500.000") no es un teléfono.
    .replace(/\+?\d[\d\s().-]{6,}\d/g, (m) => (/^\d{1,3}(\.\d{3})+$/.test(m) ? m : '[teléfono]'))
    .replace(/\s+/g, ' ')
    .trim()

/** "brou-seguridad.com", "pagos.ejemplo.com.uy": un dominio sin http ni www. */
const DOMINIO_SUELTO = /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|uy|ar|br|es|info|biz|xyz|online|site|top|shop|store|io|co|app|link|click|live|me)(?:\.[a-z]{2})?\b(?:\/\S*)?/gi

const corto = (texto: string, max = MAXIMO_LETRAS) => (texto.length > max ? `${texto.slice(0, max - 1)}…` : texto)

async function anotar(codigoFamilia: string, cosa: Omit<CosaQuePaso, 'cuando'>): Promise<void> {
  try {
    await agregarALoQuePaso(codigoFamilia, { cuando: new Date().toISOString(), ...cosa, texto: corto(cosa.texto) })
  } catch (error) {
    console.error('No se pudo anotar en "Lo que pasó":', error) // nunca rompe lo que está haciendo el abuelo
  }
}

// ── Lo que se anota (una línea en cada lugar donde pasa) ────

/** El abuelo pidió ir a un lugar y se le armó el viaje (sin permiso, o porque no hacía falta). */
export const anotarViaje = (codigoFamilia: string, viaje: Viaje) =>
  anotar(codigoFamilia, { tipo: 'viaje', texto: `Pidió ir a ${viaje.nombre}`, detalle: viaje.direccion })

/** Un pedido a un comercio: por WhatsApp es un pedido; por teléfono, una llamada. */
export const anotarPedido = (codigoFamilia: string, pedido: Pedido) =>
  pedido.por === 'llamada'
    ? anotar(codigoFamilia, { tipo: 'llamada', texto: `Llamó a ${pedido.comercio} para pedir`, detalle: corto(pedido.pedido, 200) })
    : anotar(codigoFamilia, { tipo: 'pedido', texto: `Hizo un pedido a ${pedido.comercio} por WhatsApp`, detalle: corto(pedido.pedido, 200) })

/** Estacionó el auto (se le abrió el WhatsApp de la Intendencia) o se fue (con "fin"). */
export const anotarEstacionamiento = (codigoFamilia: string, t: TarjetaDeEstacionamiento) =>
  t.accion === 'empezar'
    ? anotar(codigoFamilia, {
        tipo: 'estacionamiento',
        texto: `Estacionó el auto ${t.matricula}`,
        detalle: 'Se le abrió el WhatsApp de la Intendencia para pagar (lo manda él)',
      })
    : anotar(codigoFamilia, {
        tipo: 'estacionamiento',
        texto: `Se fue del estacionamiento (${t.matricula})`,
        ...(t.estuvo !== undefined && { detalle: `Estuvo estacionado ${textoDeMinutos(t.estuvo)}` }),
      })

/** Se le pidió permiso a la familia. */
export const anotarPermiso = (codigoFamilia: string, aprobacionId: string, descripcion: string, preguntados: string[]) =>
  anotar(codigoFamilia, {
    tipo: 'permiso',
    texto: descripcion,
    aprobacionId,
    detalle: preguntados.length ? `Se les preguntó a ${lista(preguntados)}` : 'No se le pudo preguntar a ningún familiar',
  })

/** Un aviso que les llegó a los familiares (mail o celular). */
export const anotarAviso = (codigoFamilia: string, texto: string, avisados: string[], detalle?: string) =>
  avisados.length > 0 ? anotar(codigoFamilia, { tipo: 'aviso', texto, detalle: [detalle, `Les llegó a ${lista(avisados)}`].filter(Boolean).join('. ') }) : Promise.resolve()

/** Un mail que el script de Gmail marcó como ESTAFA o DUDOSO. */
export const anotarMail = (codigoFamilia: string, mail: NonNullable<CosaQuePaso['mail']>) =>
  anotar(codigoFamilia, {
    tipo: 'mail',
    texto: mail.categoria === 'ESTAFA' ? 'Le llegó un mail falso (ESTAFA)' : 'Le llegó un mail dudoso',
    mail: {
      categoria: mail.categoria,
      motivo: corto(sinDatosDeContacto(mail.motivo), 240),
      // De "BROU Seguridad <avisos@algo.com>" queda solo el nombre.
      ...(mail.de && { de: corto(sinDatosDeContacto(mail.de.split('<')[0].replace(/"/g, '')), 80) }),
      ...(mail.asunto && { asunto: corto(sinDatosDeContacto(mail.asunto), 120) }),
    },
  })

const lista = (nombres: string[]) => (nombres.length <= 1 ? (nombres[0] ?? '') : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`)

// ── Lo que se muestra ───────────────────────────────────────

const TIPOS: readonly TipoDeCosa[] = ['viaje', 'pedido', 'llamada', 'estacionamiento', 'permiso', 'aviso', 'mail']

function esCosaQuePaso(dato: unknown): dato is CosaQuePaso {
  const c = dato as Partial<CosaQuePaso> | null
  return !!c && typeof c.cuando === 'string' && !Number.isNaN(Date.parse(c.cuando)) && TIPOS.includes(c.tipo as TipoDeCosa) && typeof c.texto === 'string'
}

/** Todo lo que pasó, del más nuevo al más viejo. En los permisos, cómo terminó (si venció, "nadie contestó"). */
export async function loQuePaso(codigoFamilia: string): Promise<CosaParaMostrar[]> {
  const cosas = (await leerLoQuePaso(codigoFamilia)).filter(esCosaQuePaso)
  // Todos los pedidos de permiso de una sola vez (no uno por uno: pueden ser cientos).
  const ids = [...new Set(cosas.flatMap((c) => (c.aprobacionId ? [c.aprobacionId] : [])))]
  const indice = new Map(ids.map((id, i) => [id, i] as const))
  const leidas = await leerAprobaciones(ids)
  const conEstado = await Promise.all(
    cosas.map(async (c): Promise<CosaParaMostrar> => {
      const aprobacion = c.aprobacionId ? leidas[indice.get(c.aprobacionId)!] : null
      if (!aprobacion) return c
      // Solo escribe si un pedido que seguía esperando ya venció (pasa a "nadie contestó").
      const alDia = await actualizarSiVencio(aprobacion)
      return { ...c, estado: alDia.estado, ...(alDia.respondidoPor && { respondidoPor: alDia.respondidoPor }) }
    }),
  )
  return conEstado.sort((a, b) => Date.parse(b.cuando) - Date.parse(a.cuando))
}
