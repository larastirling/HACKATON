import BarraNavegacion from '@/components/BarraNavegacion'
import { modoAlmacenamiento } from '@/lib/datos'
import { exigirSesion } from '@/lib/sesion'
import BotonesDePrueba from './BotonesDePrueba'
import RestaurarDemo from './RestaurarDemo'
import ResumenDelDia from './ResumenDelDia'

// Página para comprobar que la base de datos y la IA funcionan.
export default async function PaginaPrueba() {
  const sesion = await exigirSesion()

  return (
    <>
      <main className="pagina">
        <h1>Prueba</h1>
        <ul className="tarjeta lista-estado">
          <li>Base de datos: {modoAlmacenamiento === 'redis' ? 'Upstash Redis' : 'En memoria (temporal)'}</li>
          <li>Clave de la IA: {process.env.ANTHROPIC_API_KEY ? 'Cargada' : 'Falta la clave de la IA'}</li>
          <li>Token para Gmail: {process.env.CONFIG_API_TOKEN ? 'Cargado' : 'Falta CONFIG_API_TOKEN'}</li>
        </ul>
        <BotonesDePrueba />
        <ResumenDelDia />
        <RestaurarDemo />
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
