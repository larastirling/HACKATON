import BarraNavegacion from '@/components/BarraNavegacion'
import { leerConfiguracion, leerUltimaAprobacion, type PedidoDeAprobacion } from '@/lib/datos'
import { contactosParaLlamar } from '@/lib/emergencia'
import type { MensajeCharla } from '@/lib/ia'
import { exigirSesion } from '@/lib/sesion'
import Charla from './Charla'
import InvitarAInstalar from './InvitarAInstalar'

const HORAS_PARA_RETOMAR = 2

// Página del abuelo — responsable: Lara
export default async function PaginaAbuelo() {
  const sesion = await exigirSesion('abuelo')
  const [pendiente, configuracion] = await Promise.all([
    leerUltimaAprobacion(sesion.codigoFamilia),
    leerConfiguracion(sesion.codigoFamilia),
  ])

  return (
    <>
      <main className="pagina pagina-charla">
        <InvitarAInstalar />
        <h1>¿En qué lo ayudo?</h1>
        <Charla inicial={paraRetomar(pendiente)} />
      </main>
      <BarraNavegacion rol={sesion.rol} contactos={contactosParaLlamar(configuracion?.familiares ?? [])} />
    </>
  )
}

/**
 * Si el abuelo cerró la pantalla mientras esperaba a la familia (o le contestaron mientras estaba cerrada),
 * al volver a abrirla se retoma: la pantalla vuelve a consultar el estado guardado.
 */
function paraRetomar(aprobacion: PedidoDeAprobacion | null): MensajeCharla[] {
  if (!aprobacion || aprobacion.avisadoAlAbuelo) return []
  if (Date.now() - Date.parse(aprobacion.creadoEl) > HORAS_PARA_RETOMAR * 3_600_000) return []
  const que = aprobacion.que.tipo === 'viaje' ? `ir a ${aprobacion.que.viaje.nombre}` : `su pedido a ${aprobacion.que.pedido.comercio}`
  return [
    {
      de: 'ia',
      texto: `Le recuerdo que estaba esperando que la familia conteste para ${que}.`,
      aprobacion: { id: aprobacion.id, familiares: aprobacion.preguntadoA.map((p) => p.nombre) },
    },
  ]
}
