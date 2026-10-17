import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Guardamos a dónde quería ir para volver después del login
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
