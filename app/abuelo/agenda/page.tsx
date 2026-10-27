import BarraNavegacion from '@/components/BarraNavegacion'
import { actividadesQueVienen, textoCuando } from '@/lib/agenda'
import { leerConfiguracion } from '@/lib/datos'
import { contactosParaLlamar } from '@/lib/emergencia'
import { clavePublicaVapid } from '@/lib/notificaciones'
import { exigirSesion } from '@/lib/sesion'
import { tratoDe } from '@/lib/trato'
import { ConTrato } from '../trato'
import ActivarAvisosAbuelo from './ActivarAvisosAbuelo'
import estilos from './agenda-abuelo.module.css'
import { EscucharAgenda, MarcarVista } from './AlVerLaAgenda'

// La agenda del abuelo: lo que le cargó la familia (lib/agenda.ts), con letra grande y para escuchar.

const conMayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

export default async function PaginaAgendaAbuelo() {
  const sesion = await exigirSesion('abuelo')
  const [configuracion, actividades] = await Promise.all([leerConfiguracion(sesion.codigoFamilia), actividadesQueVienen(sesion.codigoFamilia)])
  const deVos = tratoDe(configuracion?.abuelo.comoLeGustaQueLeHablen ?? '') === 'vos'
  const ahora = Date.now()
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Montevideo' }).format(ahora)
  const paraEscuchar = actividades.length
    ? actividades.map((a) => `${conMayuscula(textoCuando(a.cuando, ahora))}: ${a.titulo}${a.lugar ? `, en ${a.lugar}` : ''}.`).join(' ')
    : deVos
      ? 'Todavía no tenés nada en la agenda.'
      : 'Todavía no tiene nada en la agenda.'

  return (
    <ConTrato trato={deVos ? 'vos' : 'usted'}>
      <main className="pagina">
        <MarcarVista />
        <h1>{deVos ? 'Tu agenda' : 'Su agenda'}</h1>
        <p className="subtitulo">{deVos ? 'Lo que te cargó tu familia.' : 'Lo que le cargó su familia.'}</p>
        <ActivarAvisosAbuelo clavePublica={clavePublicaVapid()} />
        {actividades.length === 0 ? (
          <p className={estilos.vacio}>{paraEscuchar}</p>
        ) : (
          <ol className={estilos.lista}>
            {actividades.map((a) => {
              const esHoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Montevideo' }).format(Date.parse(a.cuando)) === hoy
              return (
                <li key={a.id} className={`${estilos.actividad} ${esHoy ? estilos.hoy : ''}`}>
                  <p className={estilos.cuando}>{conMayuscula(textoCuando(a.cuando, ahora))}</p>
                  <p className={estilos.que}>{a.titulo}</p>
                  {a.lugar && <p className={estilos.detalle}>En {a.lugar}</p>}
                  <p className={estilos.detalle}>Lo agregó {a.agregadaPor}</p>
                </li>
              )
            })}
          </ol>
        )}
        <EscucharAgenda texto={paraEscuchar} />
      </main>
      <BarraNavegacion rol={sesion.rol} contactos={contactosParaLlamar(configuracion?.familiares ?? [])} />
    </ConTrato>
  )
}
