import BarraNavegacion from '@/components/BarraNavegacion'
import { avisosParaElAbuelo } from '@/lib/agenda'
import { leerConfiguracion, leerEstacionamientoAbierto, leerUltimaAprobacion, type PedidoDeAprobacion } from '@/lib/datos'
import { contactosParaLlamar } from '@/lib/emergencia'
import { tratoDe, type Trato } from '@/lib/trato'
import type { MensajeCharla } from '@/lib/ia'
import { exigirSesion } from '@/lib/sesion'
import Charla from './Charla'
import AvisosDeAgenda from './agenda/AvisosDeAgenda'
import InvitarAInstalar from './InvitarAInstalar'
import { ConTrato } from './trato'

const HORAS_PARA_RETOMAR = 2

// Página del abuelo — responsable: Lara
export default async function PaginaAbuelo() {
  const sesion = await exigirSesion('abuelo')
  const [pendiente, configuracion, estacionamiento] = await Promise.all([
    leerUltimaAprobacion(sesion.codigoFamilia),
    leerConfiguracion(sesion.codigoFamilia),
    leerEstacionamientoAbierto(sesion.codigoFamilia),
  ])

  // Los textos fijos siguen el trato que eligió la familia (si no eligió, de usted).
  const trato = tratoDe(configuracion?.abuelo.comoLeGustaQueLeHablen ?? '') ?? 'usted'
  // La agenda: lo nuevo que le agregaron y lo que tiene en menos de un día (lib/agenda.ts).
  const avisosAgenda = configuracion ? await avisosParaElAbuelo(configuracion) : []

  return (
    <ConTrato trato={trato}>
      <main className="pagina pagina-charla">
        <InvitarAInstalar />
        <h1>{trato === 'vos' ? '¿En qué te ayudo?' : '¿En qué lo ayudo?'}</h1>
        <AvisosDeAgenda avisos={avisosAgenda} />
        <Charla inicial={paraRetomar(pendiente, trato)} estacionadoDesde={estacionamiento?.desde ?? null} />
      </main>
      <BarraNavegacion rol={sesion.rol} contactos={contactosParaLlamar(configuracion?.familiares ?? [])} />
    </ConTrato>
  )
}

/**
 * Si el abuelo cerró la pantalla mientras esperaba a la familia (o le contestaron mientras estaba cerrada),
 * al volver a abrirla se retoma: la pantalla vuelve a consultar el estado guardado.
 */
function paraRetomar(aprobacion: PedidoDeAprobacion | null, trato: Trato): MensajeCharla[] {
  if (!aprobacion || aprobacion.avisadoAlAbuelo) return []
  if (Date.now() - Date.parse(aprobacion.creadoEl) > HORAS_PARA_RETOMAR * 3_600_000) return []
  const que =
    aprobacion.que.tipo === 'viaje'
      ? `ir a ${aprobacion.que.viaje.nombre}`
      : aprobacion.que.tipo === 'pedido'
        ? `su pedido a ${aprobacion.que.pedido.comercio}`
        : aprobacion.que.texto
  return [
    {
      de: 'ia',
      texto:
        trato === 'vos'
          ? `Te recuerdo que estabas esperando que la familia conteste para ${que}.`
          : `Le recuerdo que estaba esperando que la familia conteste para ${que}.`,
      aprobacion: { id: aprobacion.id, familiares: aprobacion.preguntadoA.map((p) => p.nombre) },
    },
  ]
}
