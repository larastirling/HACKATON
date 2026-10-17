import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false, // oculta el botón "N" de Next.js que tapaba la barra de abajo
  agentRules: false, // no generar AGENTS.md automáticamente
}

export default nextConfig
