import type { MetadataRoute } from 'next'

// Para que la app se pueda instalar en el celular (y así funcionen las notificaciones en iPhone).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Contigo',
    short_name: 'Contigo',
    description: 'Contigo: ayuda a personas mayores, con la familia conectada.',
    lang: 'es',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f3ebe2',
    theme_color: '#6b4226',
    icons: [
      { src: '/icono-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
