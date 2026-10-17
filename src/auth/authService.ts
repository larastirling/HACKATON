// Servicio de autenticación de ejemplo.
// Reemplazar `login` por una llamada real a tu backend (fetch/axios) cuando exista.

export interface User {
  username: string
  name: string
}

const STORAGE_KEY = 'qs.session'

// Usuarios de prueba. NO usar en producción.
const DEMO_USERS: Record<string, { password: string; name: string }> = {
  demo: { password: 'demo123', name: 'Usuario Demo' },
  admin: { password: 'admin123', name: 'Administrador' },
}

export async function login(username: string, password: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 500)) // simula latencia de red
  const record = DEMO_USERS[username.trim().toLowerCase()]
  if (!record || record.password !== password) {
    throw new Error('Usuario o contraseña incorrectos')
  }
  const user: User = { username: username.trim().toLowerCase(), name: record.name }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}
