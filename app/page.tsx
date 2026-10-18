import { redirect } from 'next/navigation'
import { leerSesion, paginaDeInicio } from '@/lib/sesion'
import FormularioLogin from './FormularioLogin'

// Inicio: si ya entraste antes, te lleva directo a tu página.
export default async function Inicio() {
  const sesion = await leerSesion()
  if (sesion) redirect(paginaDeInicio[sesion.rol])

  return (
    <main className="pagina pagina-login">
      <h1 className="marca">Contigo</h1>
      <p className="subtitulo">¿Quién sos?</p>
      <FormularioLogin />
    </main>
  )
}
