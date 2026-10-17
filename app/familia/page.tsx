import BarraNavegacion from '@/components/BarraNavegacion'
import { exigirSesion } from '@/lib/sesion'

// Página de la familia — responsable: Felipe
export default async function PaginaFamilia() {
  const sesion = await exigirSesion('familiar')

  return (
    <>
      <main className="pagina">
        <h1>Familia</h1>
        <p className="tarjeta">En construcción</p>
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
