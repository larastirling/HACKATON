import { useNotifications } from '../notifications/NotificationsContext'

const timeFormat = new Intl.DateTimeFormat('es', { dateStyle: 'short', timeStyle: 'short' })

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, remove, clearAll, permission, requestPermission, notify } =
    useNotifications()

  return (
    <div className="stack">
      {permission !== 'unsupported' && permission !== 'granted' && (
        <section className="card">
          <p className="muted">Activá las notificaciones del sistema para recibir avisos aunque no estés en la app.</p>
          <button className="button button--primary" onClick={requestPermission} disabled={permission === 'denied'}>
            {permission === 'denied' ? 'Bloqueadas en el navegador' : 'Activar notificaciones'}
          </button>
        </section>
      )}
      {permission === 'granted' && (
        <button
          className="button"
          onClick={() => notify({ title: 'Notificación del sistema', body: 'Así se ve un aviso nativo', system: true })}
        >
          Probar notificación del sistema
        </button>
      )}

      <div className="button-row">
        <button className="button" onClick={markAllAsRead} disabled={unreadCount === 0}>Marcar todas leídas</button>
        <button className="button" onClick={clearAll} disabled={notifications.length === 0}>Borrar todas</button>
      </div>

      {notifications.length === 0 ? (
        <p className="empty">No tenés notificaciones</p>
      ) : (
        <ul className="list card">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`list__item notification notification--${n.type}${n.read ? '' : ' is-unread'}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="notification__body">
                <strong>{n.title}</strong>
                {n.body && <span>{n.body}</span>}
                <small className="muted">{timeFormat.format(n.createdAt)}</small>
              </div>
              <button
                className="link-button"
                aria-label="Eliminar"
                onClick={(e) => {
                  e.stopPropagation()
                  remove(n.id)
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
