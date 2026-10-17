import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../notifications/NotificationsContext'

export default function Login() {
  const { user, login } = useAuth()
  const { notify } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={from} replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!username || !password) {
      setError('Completá usuario y contraseña')
      return
    }
    setLoading(true)
    try {
      await login(username, password)
      notify({ title: '¡Bienvenido/a!', body: 'Iniciaste sesión correctamente', type: 'success' })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__brand">
        <img src="/icon.svg" alt="" width={64} height={64} />
        <h1>Quick Start</h1>
        <p>Ingresá con tu usuario y contraseña</p>
      </div>

      <form className="card login__form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Usuario</span>
          <input
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="demo"
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <div className="field__password">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
            <button type="button" className="link-button" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="button button--primary" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="hint">
          Prueba con <code>demo</code> / <code>demo123</code>
        </p>
      </form>
    </div>
  )
}
