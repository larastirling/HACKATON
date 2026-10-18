import BarraNavegacion from '@/components/BarraNavegacion'
import { leerConfiguracion, leerUltimaEmergencia, PENDIENTE, primerNombre } from '@/lib/datos'
import { linkAlMapa } from '@/lib/emergencia'
import { exigirSesion } from '@/lib/sesion'

// Se abre al tocar la notificación de emergencia: un botón grande para llamar al abuelo.
export default async function PaginaEmergencia() {
  const sesion = await exigirSesion('familiar')
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  const aviso = await leerUltimaEmergencia(sesion.codigoFamilia)
  const nombre = configuracion ? primerNombre(configuracion.abuelo.nombre) : 'el abuelo'
  const telefono = configuracion?.abuelo.telefono ?? PENDIENTE
  const tieneTelefono = telefono !== PENDIENTE && telefono.replace(/\D/g, '') !== ''
  const hora = aviso && new Date(aviso.cuando).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Montevideo' })

  return (
    <>
      <main className="pagina">
        <h1>{nombre} puede necesitar ayuda</h1>
        {aviso ? (
          <p className="tarjeta">
            A las {hora} dijo: <strong>“{aviso.loQueDijo}”</strong>
          </p>
        ) : (
          <p className="tarjeta">No hay avisos de emergencia recientes.</p>
        )}
        {aviso?.ubicacion && (
          <a className="boton boton-principal" href={linkAlMapa(aviso.ubicacion)} target="_blank" rel="noopener noreferrer">
            Ver en el mapa dónde está
          </a>
        )}
        {tieneTelefono ? (
          <a className="boton boton-emergencia boton-911" href={`tel:${telefono.replace(/[^\d+]/g, '')}`}>
            Llamar a {nombre}
          </a>
        ) : (
          <p className="tarjeta mensaje-error">No tenemos el teléfono de {nombre} guardado.</p>
        )}
        <a className="boton boton-secundario" href="tel:911">
          Llamar al 911
        </a>
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
