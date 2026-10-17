import BarraNavegacion from '@/components/BarraNavegacion'
import { leerConfiguracion } from '@/lib/datos'
import { clavePublicaVapid } from '@/lib/notificaciones'
import { exigirSesion } from '@/lib/sesion'
import ActivarAvisos from './ActivarAvisos'

// Página para que cada familiar active los avisos (notificaciones) en su celular.
export default async function PaginaAvisos() {
  const sesion = await exigirSesion('familiar')
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  const familiares = [...(configuracion?.familiares ?? [])].sort((a, b) => a.orden - b.orden).map((f) => f.nombre)

  return (
    <>
      <main className="pagina">
        <h1>Avisos en el celular</h1>
        <p className="subtitulo">
          Te llega una notificación cuando {configuracion?.abuelo.nombre.split(' ')[0] ?? 'el abuelo'} pide algo que necesita
          permiso o cuando puede necesitar ayuda.
        </p>
        <ActivarAvisos familiares={familiares} clavePublica={clavePublicaVapid()} />
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
