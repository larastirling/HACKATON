// Service worker: recibe las notificaciones (Web Push) y abre la página correcta al tocarlas.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let datos = {}
  try {
    datos = event.data ? event.data.json() : {}
  } catch {
    datos = { cuerpo: event.data ? event.data.text() : '' }
  }
  event.waitUntil(
    self.registration.showNotification(datos.titulo || 'Asistente de confianza', {
      body: datos.cuerpo || '',
      icon: '/icono-192.png',
      badge: '/icono-192.png',
      tag: datos.etiqueta || undefined,
      renotify: Boolean(datos.etiqueta),
      data: { url: datos.url || '/' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  // Solo se abren páginas de la propia app.
  let url = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin)
  if (url.origin !== self.location.origin) url = new URL('/', self.location.origin)

  event.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const ventana of ventanas) {
        if (ventana.url === url.href && 'focus' in ventana) return ventana.focus()
      }
      return self.clients.openWindow(url.href)
    })(),
  )
})
