import BarraNavegacion from '@/components/BarraNavegacion'
import { leerConfiguracion, PENDIENTE, primerNombre, ZONA_HORARIA } from '@/lib/datos'
import { loQuePaso, type CosaParaMostrar } from '@/lib/lo-que-paso'
import { exigirSesion } from '@/lib/sesion'
import estilos from './lo-que-paso.module.css'

// "Lo que pasó": lo que pidió el abuelo, los permisos, los avisos a la familia y los mails marcados,
// del más nuevo al más viejo (lib/lo-que-paso.ts). Solo para la familia.

export default async function PaginaLoQuePaso() {
  const sesion = await exigirSesion('familiar')
  const [configuracion, cosas] = await Promise.all([leerConfiguracion(sesion.codigoFamilia), loQuePaso(sesion.codigoFamilia)])
  // Recién creada la familia, el nombre todavía no está (PENDIENTE).
  const nombre = configuracion && configuracion.abuelo.nombre !== PENDIENTE ? primerNombre(configuracion.abuelo.nombre) : 'tu papá o mamá'

  return (
    <>
      <main className="pagina">
        <h1>Lo que pasó</h1>
        <p className="subtitulo">
          Lo que pidió {nombre} (viajes, pedidos, estacionamiento), los permisos, los avisos y los mails raros. Lo más nuevo, arriba.
        </p>
        {cosas.length === 0 ? (
          <div className={`tarjeta ${estilos.vacio}`}>
            <p className={estilos.vacioTitulo}>Todavía no pasó nada.</p>
            <p>Cuando {nombre} use el asistente, acá vas a ver lo que pidió y lo que te avisamos.</p>
          </div>
        ) : (
          <ol className={estilos.lista}>
            {cosas.map((c, i) => (
              <Cosa key={`${c.cuando}-${i}`} cosa={c} />
            ))}
          </ol>
        )}
      </main>
      <BarraNavegacion rol={sesion.rol} />
    </>
  )
}

const ICONOS: Record<CosaParaMostrar['tipo'], string> = {
  viaje: '🚕',
  pedido: '🛒',
  llamada: '📞',
  estacionamiento: '🅿️',
  permiso: '✋',
  aviso: '🔔',
  mail: '✉️',
}
const NOMBRE_DEL_TIPO: Record<CosaParaMostrar['tipo'], string> = {
  viaje: 'Viaje',
  pedido: 'Pedido',
  llamada: 'Llamada',
  estacionamiento: 'Estacionamiento',
  permiso: 'Permiso',
  aviso: 'Aviso a la familia',
  mail: 'Mail',
}

function Cosa({ cosa }: { cosa: CosaParaMostrar }) {
  const icono = cosa.mail ? (cosa.mail.categoria === 'ESTAFA' ? '🚫' : '⚠️') : ICONOS[cosa.tipo]
  const peligro = cosa.mail?.categoria === 'ESTAFA'
  return (
    <li className={`${estilos.cosa} ${peligro ? estilos.peligro : cosa.mail ? estilos.cuidado : ''}`}>
      <span className={estilos.icono} aria-hidden="true">
        {icono}
      </span>
      <div className={estilos.cuerpo}>
        <p className={estilos.cuando}>
          <time dateTime={cosa.cuando}>{cuando(cosa.cuando)}</time>
          <span className={estilos.tipo}> · {NOMBRE_DEL_TIPO[cosa.tipo]}</span>
        </p>
        <p className={estilos.texto}>{cosa.texto}</p>
        {cosa.detalle && <p className={estilos.detalle}>{cosa.detalle}</p>}
        {cosa.tipo === 'permiso' && <EstadoDelPermiso cosa={cosa} />}
        {cosa.mail && (
          <>
            {(cosa.mail.de || cosa.mail.asunto) && (
              <p className={estilos.detalle}>
                {cosa.mail.de && <>Decía venir de: {cosa.mail.de}. </>}
                {cosa.mail.asunto && <>Asunto: “{cosa.mail.asunto}”.</>}
              </p>
            )}
            <p className={estilos.porQue}>
              <strong>Por qué:</strong> {cosa.mail.motivo}
            </p>
          </>
        )}
      </div>
    </li>
  )
}

function EstadoDelPermiso({ cosa }: { cosa: CosaParaMostrar }) {
  const por = cosa.respondidoPor ? ` por ${cosa.respondidoPor}` : ''
  switch (cosa.estado) {
    case 'aprobado':
      return <p className={`${estilos.estado} ${estilos.aprobado}`}>✅ Aprobado{por}</p>
    case 'rechazado':
      return <p className={`${estilos.estado} ${estilos.rechazado}`}>❌ Rechazado{por}</p>
    case 'sin-respuesta':
      return <p className={`${estilos.estado} ${estilos.sinRespuesta}`}>⌛ Nadie contestó a tiempo</p>
    case 'esperando':
      return <p className={`${estilos.estado} ${estilos.esperando}`}>⏳ Esperando que alguien conteste</p>
    default:
      return null
  }
}

/** "Hoy · 14:32", "Ayer · 09:10" o "jue 22 de oct · 18:05" (hora de Uruguay). */
function cuando(iso: string): string {
  const fecha = new Date(iso)
  const dia = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(d)
  const hora = new Intl.DateTimeFormat('es-UY', { timeZone: ZONA_HORARIA, hour: '2-digit', minute: '2-digit', hour12: false }).format(fecha)
  const hoy = dia(new Date())
  const ayer = dia(new Date(Date.now() - 86_400_000))
  if (dia(fecha) === hoy) return `Hoy · ${hora}`
  if (dia(fecha) === ayer) return `Ayer · ${hora}`
  const fechaLarga = new Intl.DateTimeFormat('es-UY', { timeZone: ZONA_HORARIA, weekday: 'short', day: 'numeric', month: 'short' })
    .format(fecha)
    .replace(/\./g, '')
    .replace(',', '')
  return `${fechaLarga} · ${hora}`
}
