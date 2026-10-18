import type { Metadata, Viewport } from 'next'
import { Mulish } from 'next/font/google'
import RegistrarServiceWorker from '@/components/RegistrarServiceWorker'
import './globals.css'

// Tipografía de toda la app: Mulish (redonda y muy fácil de leer).
const mulish = Mulish({ subsets: ['latin'], display: 'swap', variable: '--letra' })

export const metadata: Metadata = {
  title: 'Contigo',
  description: 'Ayuda a personas mayores, con la familia conectada.',
  applicationName: 'Contigo',
  // iPhone: para que al "Agregar a pantalla de inicio" se abra como app (y funcionen las notificaciones).
  appleWebApp: { capable: true, title: 'Contigo', statusBarStyle: 'default' },
  icons: { icon: '/icono-192.png', apple: '/apple-touch-icon.png' },
  other: { 'apple-mobile-web-app-capable': 'yes' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f3ebe2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={mulish.variable}>
      <body>
        {children}
        <RegistrarServiceWorker />
      </body>
    </html>
  )
}
