import { AVISOS_GMAIL, type EstadoProteccion } from './proteccion'
import BotonConectarGmail from './BotonConectarGmail'
import estilos from './charla.module.css'

// Recuadro "Protección de mail": si está activada para esta familia, y el botón para conectar el Gmail del abuelo.

export default function ProteccionMail({ estado, aviso }: { estado: EstadoProteccion; aviso?: string }) {
  const mensaje = aviso ? AVISOS_GMAIL[aviso] : undefined
  return (
    <section className={estilos.proteccion} aria-label="Protección de mail">
      <h2>🛡️ Protección de mail</h2>
      {mensaje && (
        <p className={mensaje.ok ? 'mensaje-ok' : 'mensaje-error'} role="status">
          {mensaje.texto}
        </p>
      )}

      {estado.tipo === 'demo' && <p className={estilos.ok}>✅ Activada: la familia DEMO la protege el Gmail de la demo.</p>}

      {estado.tipo === 'conectada' && (
        <>
          <p className={estado.error ? estilos.falta : estilos.ok}>
            {estado.error ? '⚠️ Conectada, pero la última revisión falló' : '✅ Activada'}: revisando <strong>{estado.mail}</strong>
          </p>
          {estado.error && <p>Motivo: {estado.error}. Volvé a conectarlo para renovar el permiso.</p>}
          <p className={estilos.ayudaProteccion}>
            Si llega un mail falso, la IA lo marca, lo saca de la bandeja, le explica al abuelo y les avisa a ustedes.
          </p>
          {estado.error && <BotonConectarGmail texto="Volver a conectar el Gmail" />}
          <form method="post" action="/api/gmail/desconectar">
            <button type="submit" className="boton boton-secundario">
              Desconectar Gmail
            </button>
          </form>
        </>
      )}

      {estado.tipo === 'sin-conectar' && (
        <>
          <p className={estilos.falta}>⚠️ No está activada: todavía no se conectó el Gmail del abuelo.</p>
          <p className={estilos.ayudaProteccion}>
            Conectándolo, la IA revisa sus mails nuevos y, si alguno es una estafa, lo marca, lo saca de la bandeja, le explica
            qué hacer y les avisa a ustedes. Nunca borra mails ni pide su contraseña.
          </p>
          {estado.sePuedeConectar ? (
            <BotonConectarGmail texto="Conectar Gmail del abuelo" />
          ) : (
            <p className={estilos.ayudaProteccion}>(Todavía falta configurar la conexión con Google en la app.)</p>
          )}
        </>
      )}
    </section>
  )
}
