'use client'

import { useEffect, useState } from 'react'
import { esIphone, estaInstalada } from '@/lib/dispositivo'
import { useTrato } from '../trato'
import { activarAvisosDelAbuelo, avisosActivadosEn, probarAvisoDelAbuelo } from './acciones'
import estilos from './agenda-abuelo.module.css'

// "Activar avisos" en el celular del abuelo: así le llegan los de la agenda aunque tenga la app cerrada.
// (Como en /avisos para los familiares; en iPhone solo anda con la app instalada en la pantalla de inicio.)

type Estado = 'cargando' | 'iphone-sin-instalar' | 'no-soportado' | 'bloqueado' | 'desactivado' | 'activado'

export default function ActivarAvisosAbuelo({ clavePublica }: { clavePublica: string | null }) {
  const t = useTrato()
  const [estado, setEstado] = useState<Estado>('cargando')
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null)
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    revisar().then(setEstado)
    async function revisar(): Promise<Estado> {
      const soporta = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
      if (!soporta || !clavePublica) return esIphone() && !estaInstalada() ? 'iphone-sin-instalar' : 'no-soportado'
      if (Notification.permission === 'denied') return 'bloqueado'
      const registro = await navigator.serviceWorker.register('/sw.js')
      const suscripcion = await registro.pushManager.getSubscription()
      if (suscripcion && Notification.permission === 'granted' && (await avisosActivadosEn(suscripcion.endpoint))) return 'activado'
      return 'desactivado'
    }
  }, [clavePublica])

  async function activar() {
    if (!clavePublica) return
    setOcupado(true)
    setMensaje(null)
    try {
      const permiso = await Notification.requestPermission()
      if (permiso !== 'granted') {
        setEstado(permiso === 'denied' ? 'bloqueado' : 'desactivado')
        if (permiso !== 'denied') setMensaje({ ok: false, texto: t('Para activarlos, toque "Permitir".', 'Para activarlos, tocá "Permitir".') })
        return
      }
      const registro = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const suscripcion =
        (await registro.pushManager.getSubscription()) ??
        (await registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlABytes(clavePublica) }))
      if (await activarAvisosDelAbuelo(suscripcion.toJSON())) {
        setEstado('activado')
        setMensaje({ ok: true, texto: t('Listo. Ya le van a llegar los avisos de su agenda.', 'Listo. Ya te van a llegar los avisos de tu agenda.') })
      } else {
        setMensaje({ ok: false, texto: t('No se pudieron activar. Pruebe de nuevo.', 'No se pudieron activar. Probá de nuevo.') })
      }
    } catch {
      setMensaje({ ok: false, texto: t('No se pudieron activar en este celular. Pruebe de nuevo.', 'No se pudieron activar en este celular. Probá de nuevo.') })
    } finally {
      setOcupado(false)
    }
  }

  async function probar() {
    setOcupado(true)
    setMensaje(null)
    try {
      const suscripcion = await (await navigator.serviceWorker.ready).pushManager.getSubscription()
      const llego = suscripcion ? await probarAvisoDelAbuelo(suscripcion.toJSON()) : false
      setMensaje(llego ? { ok: true, texto: t('Le mandamos un aviso de prueba.', 'Te mandamos un aviso de prueba.') } : { ok: false, texto: 'No se pudo mandar el aviso de prueba.' })
    } finally {
      setOcupado(false)
    }
  }

  if (estado === 'cargando') return null
  return (
    <section className={`tarjeta ${estilos.avisos}`} aria-label="Avisos de la agenda">
      {estado === 'activado' && (
        <>
          <p>✅ {t('Los avisos de su agenda están activados.', 'Los avisos de tu agenda están activados.')}</p>
          <button type="button" className="boton boton-secundario" onClick={probar} disabled={ocupado}>
            Probar un aviso
          </button>
        </>
      )}
      {estado === 'desactivado' && (
        <>
          <p>
            {t(
              'Active los avisos para que le llegue un recordatorio en el celular, aunque no tenga la app abierta.',
              'Activá los avisos para que te llegue un recordatorio en el celular, aunque no tengas la app abierta.',
            )}
          </p>
          <button type="button" className="boton boton-principal" onClick={activar} disabled={ocupado}>
            Activar avisos
          </button>
        </>
      )}
      {estado === 'iphone-sin-instalar' && (
        <p>
          {t(
            'Para recibir avisos en el iPhone, primero instale la app: toque arriba "¿Quiere tener el Asistente como una app?".',
            'Para recibir avisos en el iPhone, primero instalá la app: tocá arriba "¿Querés tener el Asistente como una app?".',
          )}
        </p>
      )}
      {estado === 'bloqueado' && (
        <p>
          {t(
            'Los avisos están bloqueados en este celular. Pídale a alguien de la familia que los habilite en la configuración.',
            'Los avisos están bloqueados en este celular. Pedile a alguien de la familia que los habilite en la configuración.',
          )}
        </p>
      )}
      {estado === 'no-soportado' && <p>{t('Este celular no puede recibir avisos de la app.', 'Este celular no puede recibir avisos de la app.')}</p>}
      {mensaje && (
        <p className={mensaje.ok ? 'mensaje-ok' : 'mensaje-error'} role="status">
          {mensaje.texto}
        </p>
      )}
    </section>
  )
}

// La clave pública de los avisos viene en base64url; el navegador la pide en bytes (igual que en /avisos).
function base64UrlABytes(base64Url: string): Uint8Array<ArrayBuffer> {
  const relleno = '='.repeat((4 - (base64Url.length % 4)) % 4)
  const binario = atob((base64Url + relleno).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(binario, (letra) => letra.charCodeAt(0))
}
