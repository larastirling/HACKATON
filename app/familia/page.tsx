import BarraNavegacion from '@/components/BarraNavegacion'
import { leerConfiguracion } from '@/lib/datos'
import { exigirSesion } from '@/lib/sesion'
import Charla from './Charla'

// Página de la familia — responsable: Felipe
export default async function PaginaFamilia() {
  const sesion = await exigirSesion('familiar')
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)

  return (
    <>
      <main className="pagina">
        <h1>Familia</h1>
        <p className="subtitulo">Contame de tu papá o tu mamá y armamos juntos su asistente.</p>
        <Charla lugaresIniciales={configuracion?.lugares ?? []} />
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
