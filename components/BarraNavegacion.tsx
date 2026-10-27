import Link from 'next/link'
import BotonAyuda from '@/app/abuelo/BotonAyuda'
import { paginaDeInicio, type Rol } from '@/lib/sesion'
import BotonSalir from './BotonSalir'

// Barra fija abajo de la pantalla, con botones grandes.
// Si recibe los contactos de emergencia (pantalla del abuelo), muestra el botón Ayuda en el medio.
export default function BarraNavegacion({ rol, contactos }: { rol: Rol; contactos?: { nombre: string; link: string }[] }) {
  return (
    <nav className="barra-navegacion">
      <Link href={paginaDeInicio[rol]} className="barra-boton">
        <Icono trazos="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" />
        Inicio
      </Link>
      {contactos && <BotonAyuda contactos={contactos} />}
      {rol === 'abuelo' && (
        <Link href="/abuelo/agenda" className="barra-boton">
          <Icono trazos="M4 6.5h16V20H4V6.5ZM4 10.5h16M8.5 4v4M15.5 4v4" />
          Agenda
        </Link>
      )}
      {rol === 'familiar' && (
        <Link href="/familia/lo-que-paso" className="barra-boton">
          <Icono trazos="M12 7.5V12l3 2M20.5 12a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z" />
          Lo que pasó
        </Link>
      )}
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
      <BotonSalir preguntar={rol === 'abuelo'} icono={<Icono trazos="M14 4H6v16h8M10 12h10M17 8.5 20.5 12 17 15.5" />} />
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
