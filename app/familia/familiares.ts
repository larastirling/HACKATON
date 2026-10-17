import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { PENDIENTE, type Familiar } from '@/lib/datos'
import { cambiarConfiguracion, mismoNombre, nombreValido, normalizarMail, normalizarTelefono } from './guardar'

// Herramienta "guardar_familiar": familiares de contacto. El "orden" dice a quién se le avisa primero:
// lo usan las aprobaciones de /abuelo y los avisos de estafa del script de Gmail.

export const HERRAMIENTA_GUARDAR_FAMILIAR: Anthropic.Beta.BetaTool = {
  name: 'guardar_familiar',
  description:
    'Guarda (o actualiza, si ya existe uno con el mismo nombre) un familiar de contacto. ' +
    'Usala cuando sepas nombre, parentesco, mail, teléfono y si es el primero o el segundo en avisar. Solo con datos que dijo el hijo.',
  input_schema: {
    type: 'object',
    properties: {
      nombre: { type: 'string', description: 'Nombre del familiar, ej. "Inés".' },
      relacion: { type: 'string', description: 'Qué es de la persona MAYOR (no del que escribe), ej. "Hija", "Hijo", "Nieta".' },
      mail: { type: 'string', description: 'El mail tal cual lo dijo el hijo. Si no lo sabe, "PENDIENTE". Nunca lo inventes.' },
      telefono: { type: 'string', description: 'El teléfono tal cual lo dijo el hijo. Si no lo sabe, "PENDIENTE". Nunca lo inventes.' },
      orden: { type: 'integer', description: '1 = se le avisa primero, 2 = segundo, etc.' },
    },
    required: ['nombre', 'relacion', 'mail', 'telefono', 'orden'],
    additionalProperties: false,
  },
  strict: true,
}

interface PedidoGuardarFamiliar {
  nombre: string
  relacion: string
  mail: string
  telefono: string
  orden: number
}

function esPedidoValido(dato: unknown): dato is PedidoGuardarFamiliar {
  const d = dato as Partial<PedidoGuardarFamiliar> | null
  return (
    !!d &&
    typeof d.nombre === 'string' &&
    typeof d.relacion === 'string' &&
    d.relacion.trim() !== '' &&
    typeof d.mail === 'string' &&
    typeof d.telefono === 'string' &&
    Number.isInteger(d.orden) &&
    (d.orden ?? 0) >= 1
  )
}

export async function guardarFamiliar(codigoFamilia: string, dato: unknown): Promise<string> {
  console.log('[familia] la IA pidió guardar_familiar:', JSON.stringify(dato))
  if (!esPedidoValido(dato)) return 'No se guardó: faltan datos del familiar (nombre, parentesco, mail, teléfono y orden desde 1).'
  if (!nombreValido(dato.nombre)) return 'No se guardó: ese nombre no parece real. Guardá solo lo que contó el hijo.'

  const mail = normalizarMail(dato.mail)
  if (!mail) return `No se guardó: "${dato.mail}" no parece un mail. Pedile al hijo que te lo repita. No lo completes vos.`
  const telefono = normalizarTelefono(dato.telefono)
  if (!telefono) {
    return `No se guardó: no entiendo el teléfono "${dato.telefono}". Pedile al hijo que te lo repita (por ejemplo 099 123 456). No lo completes vos.`
  }

  const familiar: Familiar = { nombre: dato.nombre.trim(), relacion: dato.relacion.trim(), mail, telefono, orden: dato.orden }
  let movido: Familiar | undefined
  let yaExistia = false
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    const anterior = c.familiares.find((f) => mismoNombre(f.nombre, familiar.nombre))
    yaExistia = !!anterior
    let familiares = anterior
      ? c.familiares.map((f) => (f === anterior ? familiar : f))
      : [...c.familiares, familiar]
    // Si otro tenía ese mismo orden, pasa al lugar que deja este (o al final): nunca dos con el mismo orden.
    const enMismoOrden = familiares.find((f) => f !== familiar && f.orden === familiar.orden)
    if (enMismoOrden) {
      const libre = anterior && anterior.orden !== familiar.orden ? anterior.orden : Math.max(...familiares.map((f) => f.orden)) + 1
      movido = { ...enMismoOrden, orden: libre }
      familiares = familiares.map((f) => (f === enMismoOrden ? movido! : f))
    }
    return { ...c, familiares: familiares.sort((a, b) => a.orden - b.orden) }
  })
  if (error) return error

  const faltan = [mail === PENDIENTE && 'el mail', telefono === PENDIENTE && 'el teléfono'].filter(Boolean)
  return [
    `${yaExistia ? 'Actualizado' : 'Guardado'} ${familiar.nombre} (${familiar.relacion}), número ${familiar.orden} para avisar, mail ${mail}, teléfono ${telefono}.`,
    movido && `${movido.nombre} pasó a ser el número ${movido.orden} para avisar. Contáselo al hijo.`,
    faltan.length > 0 && `Falta ${faltan.join(' y ')}: decile que sin eso no se le puede avisar por ahí, y que lo puede pasar cuando quiera.`,
    'Repetile el mail y el teléfono para que confirme que están bien.',
  ]
    .filter(Boolean)
    .join(' ')
}
