import BarraNavegacion from '@/components/BarraNavegacion'
import { exigirSesion } from '@/lib/sesion'
import Charla from './Charla'

// Página del abuelo — responsable: Lara
export default async function PaginaAbuelo() {
  const sesion = await exigirSesion('abuelo')

  return (
    <>
      <main className="pagina pagina-charla">
        <h1>¿En qué lo ayudo?</h1>
        <Charla />
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
