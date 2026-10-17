'use client'

import { useEffect } from 'react'

// Registra el service worker (necesario para las notificaciones y para instalar la app).
export default function RegistrarServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])
  return null
}
