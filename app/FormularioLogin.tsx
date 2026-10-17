'use client'

import { useActionState } from 'react'
import { entrar } from './acciones'

export default function FormularioLogin() {
  const [error, accion, enviando] = useActionState(entrar, null)

  return (
    <form action={accion} className="tarjeta">
      <label className="campo">
        Código de familia
        <input
          name="codigo"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="Por ejemplo: DEMO"
          required
        />
      </label>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" name="rol" value="abuelo" className="boton boton-principal" disabled={enviando}>
        👴 Soy el abuelo
      </button>
      <button type="submit" name="rol" value="familiar" className="boton boton-secundario" disabled={enviando}>
        👨‍👩‍👧 Soy familiar
      </button>

      <p className="ayuda">
        Para probar, usá el código <strong>DEMO</strong>
      </p>
    </form>
  )
}
