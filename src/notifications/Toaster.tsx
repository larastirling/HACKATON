import { useNotifications } from './NotificationsContext'

export default function Toaster() {
  const { toasts, dismissToast } = useNotifications()

  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className={`toast toast--${t.type}`} onClick={() => dismissToast(t.id)}>
          <strong>{t.title}</strong>
          {t.body && <span>{t.body}</span>}
        </button>
      ))}
    </div>
  )
}
