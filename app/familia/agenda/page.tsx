import Link from 'next/link'
import { redirect } from 'next/navigation'
import BarraNavegacion from '@/components/BarraNavegacion'
import { actividadesQueVienen, HORAS_ANTES, textoCuando } from '@/lib/agenda'
import { leerConfiguracion, leerSuscripcionesDelAbuelo, PENDIENTE, primerNombre } from '@/lib/datos'
import { exigirSesion } from '@/lib/sesion'
import estilos from './agenda.module.css'
import { BotonBorrar, FormularioAgenda } from './FormularioAgenda'

// La agenda del abuelo, vista por la familia: cargar actividades y ver las que vienen (lib/agenda.ts). Sin la IA.

export default async function PaginaAgendaFamilia() {
  const sesion = await exigirSesion('familiar')
  const configuracion = await leerConfiguracion(sesion.codigoFamilia)
  if (!configuracion) redirect('/')
  const [actividades, suscripciones] = await Promise.all([
    actividadesQueVienen(sesion.codigoFamilia),
    leerSuscripcionesDelAbuelo(sesion.codigoFamilia),
  ])
  const nombre = configuracion.abuelo.nombre === PENDIENTE ? 'tu papá o mamá' : primerNombre(configuracion.abuelo.nombre)
  // Hoy en Uruguay ("2026-10-27"), para que el calendario no deje elegir días pasados.
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Montevideo' }).format(new Date())

  return (
    <>
      <main className="pagina">
        <h1>Agenda de {nombre}</h1>
        <p className="subtitulo">
          Lo que cargues le llega a {nombre}: apenas lo agregás, un día antes y {HORAS_ANTES} horas antes.
        </p>
        <p className={`tarjeta ${estilos.estadoAvisos} ${suscripciones.length ? estilos.activados : ''}`}>
          {suscripciones.length
            ? `✅ ${nombre} tiene los avisos activados en su celular.`
            : `⚠️ ${nombre} todavía no activó los avisos en su celular: lo va a ver cuando abra la app. Para activarlos, en su celular: botón "Agenda" y "Activar avisos".`}
        </p>

        <FormularioAgenda hoy={hoy} />

        <h2 className={estilos.titulo}>Lo que viene</h2>
        {actividades.length === 0 ? (
          <p className={estilos.vacio}>Todavía no hay nada en la agenda.</p>
        ) : (
          <ol className={estilos.lista}>
            {actividades.map((a) => (
              <li key={a.id} className={estilos.actividad}>
                <p className={estilos.cuando}>{textoCuando(a.cuando).replace(/^./, (c) => c.toUpperCase())}</p>
                <p className={estilos.que}>{a.titulo}</p>
                {a.lugar && <p className={estilos.detalle}>En {a.lugar}</p>}
                {a.direccion && <p className={estilos.detalle}>📍 {a.direccion.texto} (puede pedir el Uber o ver cómo ir)</p>}
                <p className={estilos.detalle}>Lo agregó {a.agregadaPor}</p>
                <BotonBorrar id={a.id} titulo={a.titulo} />
              </li>
            ))}
          </ol>
        )}
        <Link href="/familia" className="boton boton-secundario">
          Volver
        </Link>
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}
