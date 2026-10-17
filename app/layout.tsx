import type { Metadata, Viewport } from 'next'
import RegistrarServiceWorker from '@/components/RegistrarServiceWorker'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asistente de confianza',
  description: 'Ayuda a personas mayores, con la familia conectada.',
  applicationName: 'Asistente',
  // iPhone: para que al "Agregar a pantalla de inicio" se abra como app (y funcionen las notificaciones).
  appleWebApp: { capable: true, title: 'Asistente', statusBarStyle: 'default' },
  icons: { icon: '/icono-192.png', apple: '/apple-touch-icon.png' },
  other: { 'apple-mobile-web-app-capable': 'yes' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <RegistrarServiceWorker />
      </body>
    </html>
  )
}
