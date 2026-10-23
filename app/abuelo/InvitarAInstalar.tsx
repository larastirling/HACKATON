'use client'

import { useEffect, useState } from 'react'
import { esAndroid, esIphone, estaInstalada } from '@/lib/dispositivo'
import { useTrato } from './trato'

const CLAVE_OCULTO = 'asistente-instalar-oculto'

/** Lo que guarda Chrome (Android) para poder ofrecer "Instalar app" con un botón. */
interface PedidoDeInstalacion extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Cartel chico arriba de /abuelo: si la app está abierta en el navegador (no desde el ícono),
// le ofrece al abuelo tenerla como una app y le explica cómo.
export default function InvitarAInstalar() {
  const t = useTrato()
  const [visible, setVisible] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const [celular, setCelular] = useState<'iphone' | 'android' | 'otro'>('otro')
  const [instalarYa, setInstalarYa] = useState<PedidoDeInstalacion | null>(null)

  useEffect(() => {
    let oculto = false
    try {
      oculto = localStorage.getItem(CLAVE_OCULTO) === 'si'
    } catch {
      // Sin acceso al almacenamiento: se muestra igual.
    }
    if (estaInstalada() || oculto) return
    setCelular(esIphone() ? 'iphone' : esAndroid() ? 'android' : 'otro')
    setVisible(true)

    // Android (Chrome): si el teléfono permite instalar con un botón, lo guardamos para ofrecerlo.
    const guardarPedido = (evento: Event) => {
      evento.preventDefault()
      setInstalarYa(evento as PedidoDeInstalacion)
    }
    const yaInstalada = () => setVisible(false)
    window.addEventListener('beforeinstallprompt', guardarPedido)
    window.addEventListener('appinstalled', yaInstalada)
    return () => {
      window.removeEventListener('beforeinstallprompt', guardarPedido)
      window.removeEventListener('appinstalled', yaInstalada)
    }
  }, [])

  function ahoraNo() {
    setVisible(false)
    try {
      localStorage.setItem(CLAVE_OCULTO, 'si')
    } catch {
      // No se pudo guardar: igual se esconde mientras la pantalla esté abierta.
    }
  }

  async function instalar() {
    if (!instalarYa) return
    await instalarYa.prompt()
    const { outcome } = await instalarYa.userChoice
    setInstalarYa(null)
    if (outcome === 'accepted') setVisible(false)
  }

  if (!visible) return null

  return (
    <section className="invitar-instalar">
      <button type="button" className="invitar-cartel" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        {t('¿Quiere tener el Asistente como una app?', '¿Querés tener el Asistente como una app?')}{' '}
        <strong>{t('Toque aquí y le mostramos cómo', 'Tocá acá y te mostramos cómo')}</strong>
      </button>

      {/* La explicación ocupa toda la pantalla, para que se lean todos los pasos sin bajar. */}
      {abierto && (
        <div className="invitar-pasos" role="dialog" aria-modal="true" aria-label="Cómo tener el Asistente como una app">
          <h2>Cómo tener el Asistente como una app</h2>
          {instalarYa && (
            <button type="button" className="boton boton-uber" onClick={instalar}>
              Instalar ahora
            </button>
          )}
          {celular !== 'android' && <PasosIphone titulo={celular === 'otro'} />}
          {celular !== 'iphone' && <PasosAndroid titulo={celular === 'otro'} />}
          <p>{t('Después, abra el Asistente desde el ícono nuevo: el corazón azul.', 'Después, abrí el Asistente desde el ícono nuevo: el corazón azul.')}</p>
          <button type="button" className="boton boton-principal" onClick={() => setAbierto(false)}>
            Cerrar
          </button>
          <button type="button" className="boton boton-secundario" onClick={ahoraNo}>
            Ahora no
          </button>
        </div>
      )}
    </section>
  )
}

function PasosIphone({ titulo }: { titulo: boolean }) {
  const t = useTrato()
  return (
    <>
      {titulo && <h3>En iPhone</h3>}
      <ol className="pasos">
        <li>
          {t('Abra', 'Abrí')} esta página en <strong>Safari</strong>.
        </li>
        <li>
          {t('Toque', 'Tocá')} el botón <strong>Compartir</strong> (el cuadrado con una flecha para arriba).
        </li>
        <li>
          {t('Elija', 'Elegí')} <strong>“Agregar a pantalla de inicio”</strong>. {t('Si no lo ve, deslice la lista hacia arriba.', 'Si no lo ves, deslizá la lista hacia arriba.')}
        </li>
        <li>
          {t('Toque', 'Tocá')} <strong>“Agregar”</strong>.
        </li>
      </ol>
    </>
  )
}

function PasosAndroid({ titulo }: { titulo: boolean }) {
  const t = useTrato()
  return (
    <>
      {titulo && <h3>En Android</h3>}
      <ol className="pasos">
        <li>
          {t('Abra', 'Abrí')} esta página en <strong>Chrome</strong>.
        </li>
        <li>
          {t('Toque', 'Tocá')} los <strong>tres puntitos</strong> (⋮), arriba a la derecha.
        </li>
        <li>
          {t('Elija', 'Elegí')} <strong>“Agregar a pantalla de inicio”</strong> o <strong>“Instalar app”</strong>.
        </li>
        <li>
          {t('Toque', 'Tocá')} <strong>“Agregar”</strong> o <strong>“Instalar”</strong>.
        </li>
      </ol>
    </>
  )
}
