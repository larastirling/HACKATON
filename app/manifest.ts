import type { MetadataRoute } from 'next'

// Para que la app se pueda instalar en el celular (y así funcionen las notificaciones en iPhone).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Asistente',
    short_name: 'Asistente',
    description: 'Asistente de confianza: ayuda a personas mayores, con la familia conectada.',
    lang: 'es',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0b3d91',
    icons: [
      { src: '/icono-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
