import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false, // oculta el botón "N" de Next.js que tapaba la barra de abajo
  agentRules: false, // no generar AGENTS.md automáticamente
  // Permite probar desde el celular por el Wi‑Fi (dirección "Network" de la Terminal).
  // Sin esto, el celular ve la página pero los botones no funcionan. Solo afecta a `npm run dev`.
  allowedDevOrigins: ['10.*.*.*', '192.168.*.*', '172.*.*.*'],
  // El service worker de las notificaciones: que el celular siempre busque la última versión.
  async headers() {
    return [{ source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }] }]
  },
}

export default nextConfig
