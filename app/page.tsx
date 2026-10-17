import { redirect } from 'next/navigation'
import { leerSesion, paginaDeInicio } from '@/lib/sesion'
import FormularioLogin from './FormularioLogin'

// Inicio: si ya entraste antes, te lleva directo a tu página.
export default async function Inicio() {
  const sesion = await leerSesion()
  if (sesion) redirect(paginaDeInicio[sesion.rol])

  return (
    <main className="pagina pagina-login">
      <h1>Asistente de confianza</h1>
      <p className="subtitulo">Escribí el código de tu familia y elegí quién sos.</p>
      <FormularioLogin />
    </main>
  )
}
