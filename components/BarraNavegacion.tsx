import Link from 'next/link'
import { salir } from '@/app/acciones'
import { paginaDeInicio, type Rol } from '@/lib/sesion'

// Barra fija abajo de la pantalla, con botones grandes.
export default function BarraNavegacion({ rol }: { rol: Rol }) {
  return (
    <nav className="barra-navegacion">
      <Link href={paginaDeInicio[rol]} className="barra-boton">
        <Icono trazos="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" />
        Inicio
      </Link>
      {rol === 'familiar' && (
        <Link href="/avisos" className="barra-boton">
          <Icono trazos="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0" />
          Avisos
        </Link>
      )}
      {rol === 'familiar' && (
        <Link href="/prueba" className="barra-boton">
          <Icono trazos="M5 12.5 10 17.5 19.5 7" />
          Prueba
        </Link>
      )}
      <form action={salir} className="barra-formulario">
        <button type="submit" className="barra-boton">
          <Icono trazos="M14 4H6v16h8M10 12h10M17 8.5 20.5 12 17 15.5" />
          Salir
        </button>
      </form>
    </nav>
  )
}

// Ícono de línea simple, del color de la barra.
function Icono({ trazos }: { trazos: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={trazos} />
    </svg>
  )
}
