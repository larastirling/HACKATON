import type { Guardado } from './acciones'
import estilos from './charla.module.css'

// Recuadros que muestran lo que la IA fue guardando: reglas, lugares, comercios y familiares.
// (cantidad -1 = recuadro sin contador)

const PENDIENTE = 'PENDIENTE' // igual que en lib/datos.ts (ese archivo solo corre en el servidor)
const apodos = (lista: string[]) => lista.map((a) => `“${a}”`).join(', ')

export default function RecuadrosGuardado({ guardado }: { guardado: Guardado }) {
  const { lugares, comercios, familiares, reglas } = guardado
  const conPermiso = lugares.filter((l) => l.necesitaPermiso).map((l) => l.nombre)
  return (
    <>
      <Recuadro titulo={`⚖️ Nivel: ${reglas.nivel}`} cantidad={-1}>
        <li>
          <strong>🔒 Se aprueba:</strong>{' '}
          {[...conPermiso.map((n) => `ir a ${n}`), ...reglas.seAprueba.filter((r) => r !== 'Ir a un lugar que necesita permiso')].join(' · ') ||
            'nada'}
        </li>
        <li>
          <strong>🔔 Solo se avisa:</strong> {reglas.seAvisa.join(' · ') || 'nada'}
        </li>
        <li>
          <Estado ok={reglas.abueloAceptoAvisos} si="El abuelo aceptó los avisos" no="El abuelo todavía no aceptó los avisos" />
        </li>
      </Recuadro>

      <Recuadro titulo="📍 Lugares guardados" cantidad={lugares.length}>
        {lugares.map((l) => (
          <li key={l.nombre}>
            <strong>{l.nombre}</strong>
            {l.apodos.length > 0 && <span> — le dice: {apodos(l.apodos)}</span>}
            <br />
            {l.direccion === PENDIENTE ? 'Sin dirección todavía' : l.direccion}
            <br />
            <Estado ok={typeof l.latitud === 'number'} si="Ubicado en el mapa" no="Falta ubicarlo en el mapa (no se puede pedir Uber)" />
            {l.necesitaPermiso && <span> · 🔒 Necesita permiso</span>}
          </li>
        ))}
      </Recuadro>

      <Recuadro titulo="🛒 Comercios guardados" cantidad={comercios.length}>
        {comercios.map((c) => (
          <li key={c.nombre}>
            <strong>{c.nombre}</strong>
            {c.apodos.length > 0 && <span> — le dice: {apodos(c.apodos)}</span>}
            <br />
            Pide: {c.pedidoHabitual}
            <br />
            <Estado
              ok={c.whatsapp !== PENDIENTE}
              si={`WhatsApp ${c.whatsapp}`}
              no="Falta el WhatsApp (no se le puede armar el pedido)"
            />
          </li>
        ))}
      </Recuadro>

      <Recuadro titulo="👨‍👩‍👧 Familiares de contacto" cantidad={familiares.length}>
        {familiares.map((f) => (
          <li key={f.nombre}>
            <strong>
              {f.orden}º para llamar: {f.nombre}
            </strong>{' '}
            ({f.relacion})
            <br />
            <Estado ok={f.mail !== PENDIENTE} si={`Mail ${f.mail}`} no="Falta el mail" />
            <br />
            <Estado ok={f.telefono !== PENDIENTE} si={`Teléfono ${f.telefono}`} no="Falta el teléfono" />
          </li>
        ))}
      </Recuadro>
    </>
  )
}

function Recuadro({ titulo, cantidad, children }: { titulo: string; cantidad: number; children: React.ReactNode }) {
  return (
    <details className={estilos.guardado}>
      <summary>
        {titulo}
        {cantidad >= 0 && ` (${cantidad})`}
      </summary>
      {cantidad === 0 ? <p>Todavía ninguno.</p> : <ul>{children}</ul>}
    </details>
  )
}

function Estado({ ok, si, no }: { ok: boolean; si: string; no: string }) {
  return <span className={ok ? estilos.ok : estilos.falta}>{ok ? `✅ ${si}` : `⚠️ ${no}`}</span>
}
