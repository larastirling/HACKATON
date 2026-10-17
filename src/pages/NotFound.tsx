import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p className="muted">Esta página no existe.</p>
      <Link to="/" className="button button--primary">Volver al inicio</Link>
    </div>
  )
}
