'use client'

import { useState, useTransition } from 'react'
import { restaurarDemo } from './acciones'

// Sección escondida (plegada) para dejar la familia DEMO como al principio antes de la demo.
export default function RestaurarDemo() {
  const [clave, setClave] = useState('')
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null)
  const [restaurando, empezar] = useTransition()

  function restaurar() {
    if (!window.confirm('¿Restaurar la familia DEMO? Se pierden los cambios hechos a DEMO y los pedidos de aprobación pendientes.')) return
    setResultado(null)
    empezar(async () => {
      try {
        const respuesta = await restaurarDemo(clave)
        setResultado(respuesta)
        if (respuesta.ok) setClave('')
      } catch {
        setResultado({ ok: false, texto: 'No se pudo restaurar. Probá de nuevo.' })
      }
    })
  }

  return (
    <details className="tarjeta herramientas-demo">
      <summary>Herramientas para la demo</summary>
      <p>
        Deja la familia <strong>DEMO</strong> como al principio: Carlos, Inés, Lara, la pizzería, el shopping con permiso y
        nivel Acompañado. También borra los pedidos de aprobación pendientes.
      </p>
      <label className="campo">
        Clave de la demo (CONFIG_API_TOKEN)
        <input
          type="password"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Pegá la clave acá"
        />
      </label>
      <button type="button" className="boton boton-secundario" onClick={restaurar} disabled={!clave.trim() || restaurando}>
        {restaurando ? 'Restaurando…' : 'Restaurar familia DEMO'}
      </button>
      {resultado && (
        <p className={resultado.ok ? 'mensaje-ok' : 'mensaje-error'} role="status">
          {resultado.texto}
        </p>
      )}
    </details>
  )
}
