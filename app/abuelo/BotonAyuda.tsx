'use client'

import { useState } from 'react'
import { juntarNombres } from '@/lib/texto'
import { avisarQuePidioAyuda, mandarUbicacion } from './acciones'

type Contacto = { nombre: string; link: string }

/**
 * Botón de emergencia de la barra de abajo.
 * Al tocarlo llama enseguida al primer familiar (con teléfono guardado) y les avisa a todos por mail y al celular.
 * Si el celular sabe dónde está, después les manda también la ubicación con un link al mapa.
 * Una app web no puede saber si atendieron, así que al volver le pregunta al abuelo:
 * si no atendió, llama al siguiente; después de todos, al 911.
 */
export default function BotonAyuda({ contactos }: { contactos: Contacto[] }) {
  const [abierto, setAbierto] = useState(false)
  const [paso, setPaso] = useState(0) // índice en contactos; contactos.length = el 911
  const [avisados, setAvisados] = useState<string[]>([])

  function llamar(indice: number) {
    setPaso(indice)
    window.location.href = indice < contactos.length ? contactos[indice].link : 'tel:911'
  }

  function pedirAyuda() {
    setAbierto(true)
    const avisado = avisarQuePidioAyuda().then(setAvisados, () => {})
    // La ubicación se pide antes de llamar (el permiso se pregunta con el toque) y se manda después del aviso.
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => avisado.then(() => mandarUbicacion(coords.latitude, coords.longitude)).catch(() => {}),
      () => {}, // sin permiso o sin señal: la familia recibe el aviso igual, sin el mapa
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 60_000 },
    )
    llamar(0)
  }

  const actual = contactos[paso]
  const siguiente = contactos[paso + 1]

  return (
    <>
      <button type="button" className="barra-boton barra-ayuda" onClick={pedirAyuda}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
        Ayuda
      </button>

      {abierto && (
        <div className="ayuda-pantalla" role="dialog" aria-modal="true" aria-label="Pidiendo ayuda">
          <h2>Pidiendo ayuda</h2>

          {actual ? (
            <>
              <p className="ayuda-llamando">Llamando a {actual.nombre}...</p>
              <p className="ayuda-pregunta">¿Le atendió?</p>
              <button type="button" className="boton boton-principal" onClick={() => setAbierto(false)}>
                Sí, ya hablé
              </button>
              <button type="button" className="boton boton-emergencia boton-familiar" onClick={() => llamar(paso + 1)}>
                {siguiente ? `No atendió: llamar a ${siguiente.nombre}` : 'No atendió: llamar al 911'}
              </button>
              <button type="button" className="boton boton-secundario" onClick={() => llamar(paso)}>
                Volver a llamar a {actual.nombre}
              </button>
              <a className="boton boton-emergencia boton-911" href="tel:911" onClick={() => setPaso(contactos.length)}>
                Llamar al 911 ahora
              </a>
            </>
          ) : (
            <>
              <p className="ayuda-llamando">Llamando al 911...</p>
              <a className="boton boton-emergencia boton-911" href="tel:911">
                Volver a llamar al 911
              </a>
              {contactos.length > 0 && (
                <button type="button" className="boton boton-secundario" onClick={() => llamar(0)}>
                  Llamar de nuevo a {contactos[0].nombre}
                </button>
              )}
            </>
          )}

          {avisados.length > 0 && <p className="emergencia-avisados">Ya le avisé a {juntarNombres(avisados)}.</p>}

          <button type="button" className="boton boton-secundario" onClick={() => setAbierto(false)}>
            Cerrar
          </button>
        </div>
      )}
    </>
  )
}
