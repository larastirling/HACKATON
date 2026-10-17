'use client'

import { useEffect, useRef, useState } from 'react'
import { responder, type ResultadoRespuesta } from '../acciones'

// La respuesta se guarda recién cuando la página termina de cargar en el navegador.
// Así, si el correo "revisa" los links por seguridad sin abrirlos de verdad, no aprueba nada sin querer.
export default function Respuesta({
  token,
  respuesta,
  queEs,
}: {
  token: string
  respuesta: 'aprobar' | 'rechazar'
  queEs: string
}) {
  const [resultado, setResultado] = useState<ResultadoRespuesta | null>(null)
  const yaEnvie = useRef(false)

  useEffect(() => {
    if (yaEnvie.current) return
    yaEnvie.current = true
    responder(token, respuesta)
      .then(setResultado)
      .catch(() => setResultado({ ok: false }))
  }, [token, respuesta])

  if (!resultado) return <p className="tarjeta">Guardando tu respuesta…</p>
  if (!resultado.ok) return <p className="tarjeta mensaje-error">No se pudo guardar. Probá tocar el botón del mail de nuevo.</p>

  if ('vencido' in resultado) {
    return (
      <p className="tarjeta">
        Este link ya venció: pasaron {resultado.tiempo} sin respuesta y {queEs} quedó sin hacer. No se cambió nada.
      </p>
    )
  }

  const pedida = respuesta === 'aprobar' ? 'aprobado' : 'rechazado'
  if (resultado.estado !== pedida || !resultado.fuisteVos) {
    return (
      <p className="tarjeta">
        Este pedido ya lo <strong>{resultado.estado === 'aprobado' ? 'aprobó' : 'rechazó'}</strong>{' '}
        {resultado.fuisteVos ? 'usted' : (resultado.respondidoPor ?? 'otro familiar')}. No se cambió nada.
      </p>
    )
  }
  return (
    <div className={`tarjeta respuesta-aprobacion respuesta-${pedida}`} role="status">
      <p className="respuesta-aprobacion-titulo">
        {pedida === 'aprobado' ? `✅ Listo, aprobaste ${queEs}.` : `❌ Listo, rechazaste ${queEs}.`}
      </p>
      <p>{pedida === 'aprobado' ? 'Ya le aparece el botón en su pantalla.' : 'Le avisamos con calma en su pantalla.'}</p>
      {!resultado.cambio && <p className="ayuda">(Ya estaba respondido: no cambió nada.)</p>}
    </div>
  )
}
