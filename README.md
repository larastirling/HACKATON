# Quick Start — Web app mobile first

Plantilla base para arrancar una aplicación web **mobile first** con:

- **Router** entre páginas (React Router) con rutas protegidas y página 404
- **Barra de navegación** inferior (estilo app nativa) + barra superior con campana de avisos
- **Login con usuario y contraseña** (sesión persistida en `localStorage`)
- **Notificaciones**: toasts en pantalla, centro de notificaciones con contador de no leídas y notificaciones nativas del navegador (Web Notifications API)

Stack: React 19 + TypeScript + Vite. Sin librerías de UI: CSS propio con modo oscuro automático.

## Empezar

```bash
npm install
npm run dev      # http://localhost:5173 (también expuesto en la red local para probar desde el celular)
npm run build    # build de producción en dist/
npm run preview  # sirve el build
```

**Usuarios de prueba:** `demo` / `demo123` · `admin` / `admin123`

## Estructura

```
src/
├── main.tsx                  # Providers: Router, Auth, Notificaciones
├── App.tsx                   # Definición de rutas
├── styles.css                # Estilos globales (tokens, mobile first)
├── auth/
│   ├── authService.ts        # login/logout (mock) ← conectar acá tu backend
│   ├── AuthContext.tsx       # useAuth(): user, login, logout
│   └── ProtectedRoute.tsx    # Redirige a /login si no hay sesión
├── notifications/
│   ├── NotificationsContext.tsx  # useNotifications(): notify, markAsRead, ...
│   └── Toaster.tsx           # Toasts flotantes
├── components/
│   ├── Layout.tsx            # Barra superior + contenido + navegación inferior
│   ├── BottomNav.tsx         # Ítems de la barra de navegación
│   └── Icon.tsx              # Íconos SVG inline
└── pages/                    # Login, Home, Explore, Notifications, Profile, NotFound
```

## Cómo extender

**Agregar una página**
1. Crear `src/pages/MiPagina.tsx`.
2. Registrarla en `src/App.tsx` dentro del bloque protegido: `<Route path="mi-pagina" element={<MiPagina />} />`.
3. (Opcional) Agregarla a `items` en `components/BottomNav.tsx` y su título en `components/Layout.tsx`.

**Lanzar una notificación desde cualquier componente**
```tsx
const { notify } = useNotifications()
notify({ title: 'Pago recibido', body: '$ 1.500', type: 'success' })        // toast + centro de avisos
notify({ title: 'Recordatorio', body: 'Vence hoy', system: true })          // además, notificación nativa
```
Tipos: `info` | `success` | `warning` | `error`. La notificación nativa requiere que el usuario dé permiso (botón en la página *Notificaciones*) y funciona en `localhost` o HTTPS.

**Conectar un backend real de login**
Reemplazar el cuerpo de `login()` en `src/auth/authService.ts` por un `fetch` a tu API y guardar el token que devuelva. El resto de la app (`useAuth`, `ProtectedRoute`) no necesita cambios.

## Notas mobile
- `viewport-fit=cover` + `env(safe-area-inset-*)` para respetar el notch y la barra de gestos de iOS.
- Áreas táctiles de 44px+ e inputs de 16px (evita el zoom automático de iOS).
- `manifest.webmanifest` incluido: se puede “Agregar a pantalla de inicio”.
- En pantallas ≥ 768px la barra inferior pasa a ser flotante y centrada.
