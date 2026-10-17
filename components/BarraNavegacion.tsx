import Link from 'next/link'
import { salir } from '@/app/acciones'
import { paginaDeInicio, type Rol } from '@/lib/sesion'

// Barra fija abajo de la pantalla, con botones grandes.
export default function BarraNavegacion({ rol }: { rol: Rol }) {
  return (
    <nav className="barra-navegacion">
      <Link href={paginaDeInicio[rol]} className="barra-boton">
        <span aria-hidden="true">🏠</span>
        Inicio
      </Link>
      {rol === 'familiar' && (
        <Link href="/prueba" className="barra-boton">
          <span aria-hidden="true">🧪</span>
          Prueba
        </Link>
      )}
      <form action={salir} className="barra-formulario">
        <button type="submit" className="barra-boton">
          <span aria-hidden="true">🚪</span>
          Salir
        </button>
      </form>
    </nav>
  )
}
