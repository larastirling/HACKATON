import BarraNavegacion from '@/components/BarraNavegacion'
import { actividadesQueVienen, dondeEs, textoCuando, type Actividad } from '@/lib/agenda'
import { leerConfiguracion, type ConfiguracionAbuelo } from '@/lib/datos'
import { contactosParaLlamar } from '@/lib/emergencia'
import { clavePublicaVapid } from '@/lib/notificaciones'
import { exigirSesion } from '@/lib/sesion'
import { tratoDe } from '@/lib/trato'
import { armarViaje } from '@/lib/viajes'
import { ConTrato } from '../trato'
import ActivarAvisosAbuelo from './ActivarAvisosAbuelo'
import estilos from './agenda-abuelo.module.css'
import { EscucharAgenda, MarcarVista } from './AlVerLaAgenda'
import ComoIr from './ComoIr'

// La agenda del abuelo: lo que le cargó la familia (lib/agenda.ts), con letra grande y para escuchar.

const conMayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

/** Con la dirección cargada: las formas de ir que activó la familia (el colectivo, con Moovit). */
async function viajeA(a: Actividad, configuracion: ConfiguracionAbuelo | null) {
  if (!a.direccion || !configuracion) return null
  const destino = { nombre: dondeEs(a) ?? a.titulo, direccion: a.direccion.texto, latitud: a.direccion.latitud, longitud: a.direccion.longitud }
  const armado = await armarViaje(destino, configuracion, undefined, { colectivoConMoovit: true })
  return armado.ok ? armado.viaje : null
}

export default async function PaginaAgendaAbuelo() {
  const sesion = await exigirSesion('abuelo')
  const [configuracion, actividades] = await Promise.all([leerConfiguracion(sesion.codigoFamilia), actividadesQueVienen(sesion.codigoFamilia)])
  const deVos = tratoDe(configuracion?.abuelo.comoLeGustaQueLeHablen ?? '') === 'vos'
  const ahora = Date.now()
  const viajes = await Promise.all(actividades.map((a) => viajeA(a, configuracion)))
  const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Montevideo' }).format(ahora)
  const paraEscuchar = actividades.length
    ? actividades.map((a) => `${conMayuscula(textoCuando(a.cuando, ahora))}: ${a.titulo}${dondeEs(a) ? `, en ${dondeEs(a)}` : ''}.`).join(' ')
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
            {actividades.map((a, i) => {
              const esHoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Montevideo' }).format(Date.parse(a.cuando)) === hoy
              return (
                <li key={a.id} className={`${estilos.actividad} ${esHoy ? estilos.hoy : ''}`}>
                  <p className={estilos.cuando}>{conMayuscula(textoCuando(a.cuando, ahora))}</p>
                  <p className={estilos.que}>{a.titulo}</p>
                  {dondeEs(a) && <p className={estilos.detalle}>En {dondeEs(a)}</p>}
                  {a.lugar && a.direccion && <p className={estilos.detalle}>{a.direccion.texto}</p>}
                  <p className={estilos.detalle}>Lo agregó {a.agregadaPor}</p>
                  {viajes[i] && <ComoIr viaje={viajes[i]} />}
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
