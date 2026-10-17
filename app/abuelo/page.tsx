import BarraNavegacion from '@/components/BarraNavegacion'
import { exigirSesion } from '@/lib/sesion'

// Página del abuelo — responsable: Lara
export default async function PaginaAbuelo() {
  const sesion = await exigirSesion('abuelo')

  return (
    <>
      <main className="pagina">
        <h1>Abuelo</h1>
        <p className="tarjeta">En construcción</p>
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
