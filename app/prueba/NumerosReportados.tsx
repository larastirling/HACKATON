'use client'

import { useEffect, useState, useTransition } from 'react'
import type { NumeroReportado } from '@/lib/datos'
import { verNumerosReportados, yaRevisamosElNumero } from './acciones'

// Números de comercios que algún hijo dijo que no andan: no se sugieren a ninguna familia hasta que los revisemos.
export default function NumerosReportados() {
  const [reportes, setReportes] = useState<NumeroReportado[] | null>(null)
  const [clave, setClave] = useState('')
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null)
  const [guardando, empezar] = useTransition()

  useEffect(() => {
    verNumerosReportados()
      .then(setReportes)
      .catch(() => setReportes([]))
  }, [])

  function revisado(numero: string) {
    if (!window.confirm(`¿Ya revisaron el ${numero}? Va a volver a sugerirse a todas las familias.`)) return
    setResultado(null)
    empezar(async () => {
      try {
        const respuesta = await yaRevisamosElNumero(numero, clave)
        setResultado(respuesta)
        if (respuesta.ok) setReportes(await verNumerosReportados())
      } catch {
        setResultado({ ok: false, texto: 'No se pudo guardar. Probá de nuevo.' })
      }
    })
  }

  return (
    <details className="tarjeta herramientas-demo">
      <summary>Números reportados{reportes && reportes.length > 0 ? ` (${reportes.length})` : ''}</summary>
      <p>Números de comercios que una familia dijo que no andan. No se sugieren a nadie hasta que alguien los revise.</p>
      {reportes === null && <p>Cargando…</p>}
      {reportes?.length === 0 && <p>No hay números reportados.</p>}
      {reportes && reportes.length > 0 && (
        <>
          <ul className="lista-estado">
            {reportes.map((r) => (
              <li key={r.numero}>
                <strong>{r.comercio}</strong>: {r.numero}
                <br />
                {new Date(r.cuando).toLocaleDateString('es-UY')} · familia {r.codigoFamilia} · “{r.loQueDijo}”
                <br />
                <button type="button" className="boton boton-secundario" onClick={() => revisado(r.numero)} disabled={!clave.trim() || guardando}>
                  Ya lo revisamos: volver a sugerirlo
                </button>
              </li>
            ))}
          </ul>
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
        </>
      )}
      {resultado && (
        <p className={resultado.ok ? 'mensaje-ok' : 'mensaje-error'} role="status">
          {resultado.texto}
        </p>
      )}
    </details>
  )
}
