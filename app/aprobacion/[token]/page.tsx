import type { Metadata } from 'next'
import { buscarAprobacionPorToken } from '@/lib/datos'
import Respuesta from './Respuesta'

export const metadata: Metadata = { title: 'Pedido de aprobación', robots: { index: false, follow: false } }

// Página que abre el familiar desde el mail (no necesita iniciar sesión: el código secreto del link alcanza).
export default async function PaginaAprobacion({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ respuesta?: string }>
}) {
  const { token } = await params
  const { respuesta } = await searchParams
  const encontrado = await buscarAprobacionPorToken(token)

  if (!encontrado) {
    return (
      <main className="pagina pagina-login">
        <h1>Link no válido</h1>
        <p className="tarjeta">Este link no existe o está mal copiado.</p>
      </main>
    )
  }

  const { aprobacion } = encontrado
  const queEs = aprobacion.que.tipo === 'viaje' ? 'el viaje' : 'el pedido'
  return (
    <main className="pagina pagina-login">
      <h1>Pedido de aprobación</h1>
      <p className="subtitulo">{aprobacion.descripcion}.</p>
      {respuesta === 'aprobar' || respuesta === 'rechazar' ? (
        <Respuesta token={token} respuesta={respuesta} queEs={queEs} />
      ) : (
        <div className="tarjeta">
          <a className="boton boton-uber" href={`?respuesta=aprobar`}>✅ Aprobar</a>
          <a className="boton boton-emergencia boton-911" href={`?respuesta=rechazar`}>❌ Rechazar</a>
        </div>
      )}
    </main>
  )
}
