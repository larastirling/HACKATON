'use client'

import { useState, type ReactNode } from 'react'
import { salir } from '@/app/acciones'
import { useTrato } from '@/app/abuelo/trato'

// Botón "Salir" de la barra de abajo. Al abuelo le pregunta antes, para que no salga sin querer
// (si sale, tiene que volver a entrar; el código ya queda escrito).
export default function BotonSalir({ preguntar, icono }: { preguntar: boolean; icono: ReactNode }) {
  const [preguntando, setPreguntando] = useState(false)
  const t = useTrato()

  return (
    <form action={salir} className="barra-formulario">
      <button
        type={preguntar ? 'button' : 'submit'}
        className="barra-boton"
        onClick={preguntar ? () => setPreguntando(true) : undefined}
      >
        {icono}
        Salir
      </button>

      {preguntando && (
        <div className="salir-pantalla" role="dialog" aria-modal="true" aria-label={t('¿Quiere salir?', '¿Querés salir?')}>
          <h2>{t('¿Quiere salir?', '¿Querés salir?')}</h2>
          <p className="ayuda-pregunta">
            {t(
              'Si sale, para volver a entrar va a tener que tocar “Soy el abuelo” y “Entrar” de nuevo.',
              'Si salís, para volver a entrar vas a tener que tocar “Soy el abuelo” y “Entrar” de nuevo.',
            )}
          </p>
          <button type="button" className="boton boton-principal" onClick={() => setPreguntando(false)}>
            No, quedarme
          </button>
          <button type="submit" className="boton boton-secundario">
            Sí, salir
          </button>
        </div>
      )}
    </form>
  )
}
