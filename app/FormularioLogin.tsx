'use client'

import { useActionState, useEffect, useState } from 'react'
import { crearFamiliaNueva, entrarAbuelo, entrarFamiliar } from './acciones'

// Dos formas de entrar: el abuelo con el código de su familia, el familiar con su mail.
// Si el mail no está en ninguna familia, se ofrece crear una.
export default function FormularioLogin() {
  const [quien, setQuien] = useState<'abuelo' | 'familiar' | null>(null)

  if (quien === 'abuelo') return <EntrarAbuelo volver={() => setQuien(null)} />
  if (quien === 'familiar') return <EntrarFamiliar volver={() => setQuien(null)} />

  return (
    <div className="tarjeta">
      <button type="button" className="boton boton-principal" onClick={() => setQuien('abuelo')}>
        Soy el abuelo
      </button>
      <button type="button" className="boton boton-secundario" onClick={() => setQuien('familiar')}>
        Soy familiar
      </button>
    </div>
  )
}

// El celular recuerda el último código, así si alguna vez sale, para volver a entrar solo toca "Entrar".
const CLAVE_CODIGO = 'contigo-codigo-familia'

function EntrarAbuelo({ volver }: { volver: () => void }) {
  const [estado, accion, enviando] = useActionState(entrarAbuelo, null)
  const [codigo, setCodigo] = useState('')

  useEffect(() => {
    try {
      setCodigo(localStorage.getItem(CLAVE_CODIGO) ?? '')
    } catch {
      // sin acceso al almacenamiento del navegador: se escribe a mano
    }
  }, [])

  function recordar() {
    try {
      localStorage.setItem(CLAVE_CODIGO, codigo.trim())
    } catch {}
  }

  return (
    <form action={accion} onSubmit={recordar} className="tarjeta">
      <label className="campo">
        Código de su familia
        <input
          name="codigo"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="Se lo da su familia"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
      </label>
      {estado?.error && <p className="mensaje-error" role="alert">{estado.error}</p>}
      <button type="submit" className="boton boton-principal" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
      <button type="button" className="boton boton-secundario" onClick={volver}>Volver</button>
      <p className="ayuda">Para probar, use el código <strong>DEMO</strong></p>
    </form>
  )
}

function EntrarFamiliar({ volver }: { volver: () => void }) {
  const [estado, accion, enviando] = useActionState(entrarFamiliar, null)
  const [otroMail, setOtroMail] = useState(false)

  if (estado?.mailSinFamilia && !otroMail) {
    return <CrearFamilia mail={estado.mailSinFamilia} usarOtroMail={() => setOtroMail(true)} />
  }
  return (
    <form action={(datos) => (setOtroMail(false), accion(datos))} className="tarjeta">
      <label className="campo campo-mail">
        Tu mail
        <input name="mail" type="email" autoComplete="email" inputMode="email" placeholder="nombre@gmail.com" required />
      </label>
      {estado?.error && <p className="mensaje-error" role="alert">{estado.error}</p>}
      <button type="submit" className="boton boton-principal" disabled={enviando}>
        {enviando ? 'Buscando…' : 'Entrar'}
      </button>
      <button type="button" className="boton boton-secundario" onClick={volver}>Volver</button>
      <p className="ayuda">Si tu mail todavía no está en ninguna familia, vas a poder crear una.</p>
    </form>
  )
}

function CrearFamilia({ mail, usarOtroMail }: { mail: string; usarOtroMail: () => void }) {
  const [estado, accion, enviando] = useActionState(crearFamiliaNueva, null)
  return (
    <form action={accion} className="tarjeta">
      <p>
        No encontramos ninguna familia con <strong>{mail}</strong>. ¿Querés crear una para tu papá o tu mamá?
      </p>
      <input type="hidden" name="mail" value={mail} />
      <label className="campo campo-mail">
        Tu nombre
        <input name="nombre" type="text" autoComplete="given-name" placeholder="Por ejemplo: Inés" required />
      </label>
      {estado?.error && <p className="mensaje-error" role="alert">{estado.error}</p>}
      <button type="submit" className="boton boton-principal" disabled={enviando}>
        {enviando ? 'Creando…' : 'Crear familia'}
      </button>
      <button type="button" className="boton boton-secundario" onClick={usarOtroMail}>Usar otro mail</button>
    </form>
  )
}
