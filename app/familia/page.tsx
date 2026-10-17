import BarraNavegacion from '@/components/BarraNavegacion'
import { exigirSesion } from '@/lib/sesion'
import Charla from './Charla'

// Página de la familia — responsable: Felipe
export default async function PaginaFamilia() {
  const sesion = await exigirSesion('familiar')

  return (
    <>
      <main className="pagina">
        <h1>Familia</h1>
        <p className="subtitulo">Contame de tu papá o tu mamá y armamos juntos su asistente.</p>
        <Charla />
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
