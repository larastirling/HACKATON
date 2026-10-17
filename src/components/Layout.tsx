import { Link, Outlet, useLocation } from 'react-router-dom'
import { useNotifications } from '../notifications/NotificationsContext'
import BottomNav from './BottomNav'
import Icon from './Icon'

const titles: Record<string, string> = {
  '/': 'Inicio',
  '/explorar': 'Explorar',
  '/notificaciones': 'Notificaciones',
  '/perfil': 'Perfil',
}

export default function Layout() {
  const { pathname } = useLocation()
  const { unreadCount } = useNotifications()

  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>{titles[pathname] ?? 'Quick Start'}</h1>
        <Link to="/notificaciones" className="icon-button" aria-label="Notificaciones">
          <Icon name="bell" />
          {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </Link>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
