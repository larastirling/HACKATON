'use client'

import { useEffect, useState } from 'react'
import { esIphone, estaInstalada } from '@/lib/dispositivo'
import { activarAvisos, desactivarAvisos, probarAviso, quienEsEsteCelular } from './acciones'

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'iphone-sin-instalar' }
  | { tipo: 'iphone-viejo' }
  | { tipo: 'no-soportado' }
  | { tipo: 'sin-clave' }
  | { tipo: 'bloqueado' }
  | { tipo: 'elegir' }
  | { tipo: 'activado'; familiar: string }

export default function ActivarAvisos({ familiares, clavePublica }: { familiares: string[]; clavePublica: string | null }) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' })
  const [elegido, setElegido] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null)
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    revisar().then(setEstado)
    async function revisar(): Promise<Estado> {
      const soporta = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
      if (!soporta) return esIphone() ? (estaInstalada() ? { tipo: 'iphone-viejo' } : { tipo: 'iphone-sin-instalar' }) : { tipo: 'no-soportado' }
      if (!clavePublica) return { tipo: 'sin-clave' }
      if (Notification.permission === 'denied') return { tipo: 'bloqueado' }
      const registro = await navigator.serviceWorker.register('/sw.js')
      const suscripcion = await registro.pushManager.getSubscription()
      if (suscripcion && Notification.permission === 'granted') {
        const familiar = await quienEsEsteCelular(suscripcion.endpoint)
        if (familiar) return { tipo: 'activado', familiar }
      }
      return { tipo: 'elegir' }
    }
  }, [clavePublica])

  async function activar() {
    if (!elegido || !clavePublica) return
    setOcupado(true)
    setMensaje(null)
    try {
      const permiso = await Notification.requestPermission()
      if (permiso !== 'granted') {
        setEstado({ tipo: permiso === 'denied' ? 'bloqueado' : 'elegir' })
        if (permiso !== 'denied') setMensaje({ ok: false, texto: 'Para activar los avisos hay que tocar "Permitir".' })
        return
      }
      const registro = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const suscripcion =
        (await registro.pushManager.getSubscription()) ??
        (await registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlABytes(clavePublica) }))
      if (await activarAvisos(elegido, suscripcion.toJSON())) {
        setEstado({ tipo: 'activado', familiar: elegido })
        setMensaje({ ok: true, texto: 'Listo. Probá mandarte un aviso de prueba.' })
      } else {
        setMensaje({ ok: false, texto: 'No se pudieron activar los avisos. Probá de nuevo.' })
      }
    } catch {
      setMensaje({ ok: false, texto: 'No se pudieron activar los avisos en este celular. Probá de nuevo.' })
    } finally {
      setOcupado(false)
    }
  }

  async function probar() {
    setOcupado(true)
    setMensaje(null)
    try {
      const suscripcion = await (await navigator.serviceWorker.ready).pushManager.getSubscription()
      const llego = suscripcion ? await probarAviso(suscripcion.toJSON()) : false
      setMensaje(
        llego
          ? { ok: true, texto: 'Te mandamos un aviso de prueba. Si no lo ves en unos segundos, revisá que el celular no esté en "No molestar".' }
          : { ok: false, texto: 'No se pudo mandar el aviso de prueba.' },
      )
    } finally {
      setOcupado(false)
    }
  }

  async function desactivar() {
    setOcupado(true)
    try {
      const suscripcion = await (await navigator.serviceWorker.ready).pushManager.getSubscription()
      if (suscripcion) {
        await desactivarAvisos(suscripcion.endpoint)
        await suscripcion.unsubscribe()
      }
      setEstado({ tipo: 'elegir' })
      setMensaje({ ok: true, texto: 'Listo, este celular ya no recibe avisos.' })
    } finally {
      setOcupado(false)
    }
  }

  const aviso = mensaje && (
    <p className={mensaje.ok ? 'mensaje-ok' : 'mensaje-error'} role="status">
      {mensaje.texto}
    </p>
  )

  switch (estado.tipo) {
    case 'cargando':
      return <p className="tarjeta">Revisando este celular…</p>

    case 'iphone-sin-instalar':
      return (
        <section className="tarjeta">
          <h2>En iPhone, primero hay que instalar la app</h2>
          <ol className="pasos">
            <li>Abrí esta página en <strong>Safari</strong>.</li>
            <li>
              Tocá el botón <strong>Compartir</strong> (el cuadrado con la flecha para arriba).
            </li>
            <li>
              Elegí <strong>“Agregar a pantalla de inicio”</strong> y tocá <strong>Agregar</strong>.
            </li>
            <li>
              Abrí <strong>“Asistente”</strong> desde el ícono nuevo (el corazón azul), entrá como familiar y volvé a esta
              página.
            </li>
          </ol>
          <p className="ayuda">Hace falta iPhone con iOS 16.4 o más nuevo.</p>
        </section>
      )

    case 'iphone-viejo':
      return (
        <p className="tarjeta">
          Este iPhone todavía no permite avisos. Actualizalo a <strong>iOS 16.4 o más nuevo</strong> (Ajustes → General →
          Actualización de software) y volvé a abrir la app.
        </p>
      )

    case 'no-soportado':
      return (
        <p className="tarjeta">
          Este navegador no permite avisos. En Android usá <strong>Chrome</strong>; en iPhone, <strong>Safari</strong> con la app
          agregada a la pantalla de inicio.
        </p>
      )

    case 'sin-clave':
      return <p className="tarjeta mensaje-error">Los avisos todavía no están configurados en la app (faltan las claves VAPID).</p>

    case 'bloqueado':
      return (
        <p className="tarjeta">
          Los avisos están <strong>bloqueados</strong> para esta app. Activalos en los ajustes del celular (Ajustes →
          Notificaciones → Asistente, o en el candado al lado de la dirección en Chrome) y volvé a abrir esta página.
        </p>
      )

    case 'activado':
      return (
        <section className="tarjeta">
          <p className="respuesta-aprobacion-titulo">Los avisos ya están activados en este celular para {estado.familiar}.</p>
          <button className="boton boton-principal" onClick={probar} disabled={ocupado}>
            Mandarme un aviso de prueba
          </button>
          {aviso}
          <button className="boton boton-secundario" onClick={desactivar} disabled={ocupado}>
            Dejar de recibir avisos en este celular
          </button>
        </section>
      )

    case 'elegir':
      return (
        <section className="tarjeta">
          <h2>¿Quién sos?</h2>
          <div className="elegir-familiar" role="radiogroup" aria-label="¿Quién sos?">
            {familiares.map((nombre) => (
              <button
                key={nombre}
                role="radio"
                aria-checked={elegido === nombre}
                className={`boton ${elegido === nombre ? 'boton-principal' : 'boton-secundario'}`}
                onClick={() => setElegido(nombre)}
              >
                Soy {nombre}
              </button>
            ))}
          </div>
          <button className="boton boton-uber" onClick={activar} disabled={!elegido || ocupado}>
            Activar avisos en este celular
          </button>
          {aviso}
        </section>
      )
  }
}

/** La clave pública VAPID viene en base64url; el navegador la necesita en bytes. */
function base64UrlABytes(base64Url: string): Uint8Array<ArrayBuffer> {
  const relleno = '='.repeat((4 - (base64Url.length % 4)) % 4)
  const binario = atob((base64Url + relleno).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(binario, (letra) => letra.charCodeAt(0))
}
