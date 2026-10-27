'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { agregarALaAgenda, borrarDeLaAgenda } from './acciones'
import estilos from './agenda.module.css'

// Cargar una actividad en la agenda del abuelo: qué, día, hora, dónde y la dirección (opcionales). Sin la IA.
export function FormularioAgenda({ hoy }: { hoy: string }) {
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [lugar, setLugar] = useState('')
  const [direccion, setDireccion] = useState('')
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null)
  const [guardando, empezar] = useTransition()
  const falta = !titulo.trim() ? 'qué es' : !fecha ? 'el día' : !hora ? 'la hora' : ''

  function agregar(e: FormEvent) {
    e.preventDefault()
    if (falta) return
    empezar(async () => {
      try {
        const r = await agregarALaAgenda({ titulo, fecha, hora, lugar, direccion })
        setResultado(r)
        if (r.ok) {
          setTitulo('')
          setFecha('')
          setHora('')
          setLugar('')
          setDireccion('')
        }
      } catch {
        setResultado({ ok: false, mensaje: 'No se pudo guardar. Probá de nuevo.' })
      }
    })
  }

  return (
    <form className={`tarjeta ${estilos.formulario}`} onSubmit={agregar} aria-label="Agregar a la agenda">
      <h2 className={estilos.titulo}>Agregar algo</h2>
      <label className="campo">
        Qué es
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Cumple de su sobrina Sofi" maxLength={120} autoComplete="off" />
      </label>
      <div className={estilos.diaYHora}>
        <label className="campo">
          Día
          <input type="date" value={fecha} min={hoy} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label className="campo">
          Hora
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </label>
      </div>
      <label className="campo">
        Dónde (si querés)
        <input value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Lo de Laura" maxLength={120} autoComplete="off" />
      </label>
      <label className="campo">
        Dirección (si querés)
        <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Av. Brasil 2550" maxLength={120} autoComplete="off" />
        <span className={estilos.ayuda}>Con la dirección puede pedir el Uber o ver qué colectivo tomar desde su agenda.</span>
      </label>
      {falta && (titulo || fecha || hora) && <p className={estilos.falta}>Falta {falta}.</p>}
      <button type="submit" className="boton boton-principal" disabled={!!falta || guardando}>
        {guardando ? 'Guardando…' : 'Agregar a la agenda'}
      </button>
      {resultado && (
        <p className={resultado.ok ? 'mensaje-ok' : 'mensaje-error'} role="status">
          {resultado.mensaje}
        </p>
      )}
    </form>
  )
}

export function BotonBorrar({ id, titulo }: { id: string; titulo: string }) {
  const [borrando, empezar] = useTransition()
  const [preguntando, setPreguntando] = useState(false)
  if (!preguntando) {
    return (
      <button type="button" className={estilos.borrar} onClick={() => setPreguntando(true)}>
        Borrar
      </button>
    )
  }
  return (
    <div className={estilos.confirmar}>
      <p>¿Borrar «{titulo}»?</p>
      <button type="button" className="boton boton-secundario" disabled={borrando} onClick={() => empezar(async () => void (await borrarDeLaAgenda(id)))}>
        Sí, borrar
      </button>
      <button type="button" className={estilos.borrar} onClick={() => setPreguntando(false)}>
        No
      </button>
    </div>
  )
}
