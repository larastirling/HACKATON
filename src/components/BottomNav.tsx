import { NavLink } from 'react-router-dom'
import { useNotifications } from '../notifications/NotificationsContext'
import Icon, { type IconName } from './Icon'

const items: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/explorar', label: 'Explorar', icon: 'search' },
  { to: '/notificaciones', label: 'Avisos', icon: 'bell' },
  { to: '/perfil', label: 'Perfil', icon: 'user' },
]

export default function BottomNav() {
  const { unreadCount } = useNotifications()

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon">
            <Icon name={item.icon} />
            {item.icon === 'bell' && unreadCount > 0 && (
              <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
