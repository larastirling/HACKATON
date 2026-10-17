// Qué celular es y cómo está abierta la app. Solo se usa en el navegador (pantallas 'use client').

/** iPhone o iPad (los iPad nuevos dicen ser "Mac", pero tienen pantalla táctil). */
export function esIphone(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function esAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}

/** Si la app está abierta desde el ícono de la pantalla de inicio (y no en el navegador). */
export function estaInstalada(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
}
