import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Icon from '../components/Icon'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="stack">
      <section className="card profile">
        <div className="avatar">{user?.name.charAt(0)}</div>
        <div>
          <h2>{user?.name}</h2>
          <p className="muted">@{user?.username}</p>
        </div>
      </section>

      <button className="button button--danger" onClick={handleLogout}>
        <Icon name="logout" size={20} /> Cerrar sesión
      </button>
    </div>
  )
}
