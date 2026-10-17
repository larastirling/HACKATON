import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../notifications/NotificationsContext'

export default function Home() {
  const { user } = useAuth()
  const { notify, unreadCount } = useNotifications()

  return (
    <div className="stack">
      <section className="card">
        <h2>Hola, {user?.name} 👋</h2>
        <p className="muted">Este es el punto de partida de tu app. Editá <code>src/pages/Home.tsx</code>.</p>
      </section>

      <section className="card">
        <h3>Notificaciones</h3>
        <p className="muted">Tenés {unreadCount} sin leer.</p>
        <div className="button-row">
          <button className="button" onClick={() => notify({ title: 'Info', body: 'Mensaje informativo' })}>
            Info
          </button>
          <button className="button" onClick={() => notify({ title: 'Listo', body: 'Operación exitosa', type: 'success' })}>
            Éxito
          </button>
          <button className="button" onClick={() => notify({ title: 'Ojo', body: 'Algo requiere atención', type: 'warning' })}>
            Alerta
          </button>
          <button className="button" onClick={() => notify({ title: 'Error', body: 'Algo salió mal', type: 'error' })}>
            Error
          </button>
        </div>
        <Link to="/notificaciones" className="link">Ver todas →</Link>
      </section>
    </div>
  )
}
