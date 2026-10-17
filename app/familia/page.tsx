import { redirect } from 'next/navigation'
import BarraNavegacion from '@/components/BarraNavegacion'
import { leerConfiguracion } from '@/lib/datos'
import { exigirSesion } from '@/lib/sesion'
import Charla from './Charla'

// Página de la familia — responsable: Felipe
export default async function PaginaFamilia() {
  const sesion = await exigirSesion('familiar')
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) redirect('/')

  return (
    <>
      <main className="pagina">
        <h1>Familia</h1>
        <p className="subtitulo">Contame de tu papá o tu mamá y armamos juntos su asistente.</p>
        <Charla
          guardadoInicial={{
            lugares: configuracion.lugares,
            comercios: configuracion.comercios,
            familiares: configuracion.familiares,
            reglas: configuracion.reglas,
          }}
        />
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
