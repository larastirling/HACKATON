import 'server-only'
import { PENDIENTE, primerNombre, type Abuelo, type Comercio } from './datos'

/** Lo que necesita la pantalla para mostrar la tarjeta del pedido. */
export interface Pedido {
  comercio: string
  pedido: string
  aclaracion?: string
  /** Por WhatsApp (link de wa.me) o llamando (link tel:). Los pedidos guardados antes de esto no lo tienen: son por WhatsApp. */
  por?: 'whatsapp' | 'llamada'
  /** Solo en los de llamada: lo que el abuelo lee cuando atienden. */
  textoParaLeer?: string
  link: string
}

const MAXIMO_LETRAS_ACLARACION = 150
const MAXIMO_LETRAS_PEDIDO_DISTINTO = 200

/**
 * Arma el pedido con los datos GUARDADOS en la configuración: número del comercio, pedido habitual,
 * nombre y dirección del abuelo (si está cargada). Nunca se manda ni se llama solo:
 * - por WhatsApp: el abuelo abre WhatsApp con el mensaje escrito y aprieta enviar;
 * - por llamada: el abuelo toca "Llamar" y lee el texto que le muestra la pantalla.
 * Si pide algo que NO es su pedido habitual, va `pedidoDistinto` (y eso necesita permiso de la familia).
 * Devuelve null si al comercio le falta el número.
 */
export function armarPedido(
  comercio: Comercio,
  abuelo: Abuelo,
  { aclaracion = '', pedidoDistinto = '' }: { aclaracion?: string; pedidoDistinto?: string },
): Pedido | null {
  const nota = aclaracion.trim().slice(0, MAXIMO_LETRAS_ACLARACION)
  const pedido = pedidoDistinto.trim().slice(0, MAXIMO_LETRAS_PEDIDO_DISTINTO) || comercio.pedidoHabitual.trim()
  const enMinuscula = `${pedido.charAt(0).toLowerCase()}${pedido.slice(1)}`
  const direccion = abuelo.direccion?.trim()
  const conDireccion = direccion && direccion !== PENDIENTE ? direccion : ''

  if (comercio.pedidoPor === 'llamada') {
    const numero = !comercio.telefono || comercio.telefono === PENDIENTE ? '' : comercio.telefono.replace(/[^\d+]/g, '')
    if (!numero) return null
    const textoParaLeer =
      `Hola, quiero pedir ${enMinuscula}${nota ? ` (${nota})` : ''}${conDireccion ? ` para ${conDireccion}` : ''}.`.replace(/\.\./g, '.')
    return { comercio: comercio.nombre, pedido, ...(nota && { aclaracion: nota }), por: 'llamada', textoParaLeer, link: `tel:${numero}` }
  }

  const numero = comercio.whatsapp === PENDIENTE ? '' : comercio.whatsapp.replace(/\D/g, '')
  if (!numero) return null
  const mensaje = [
    `Hola, soy ${primerNombre(abuelo.nombre)}. Quería pedir: ${enMinuscula}.`,
    nota && `Aclaración: ${nota}.`,
    conDireccion && `Es para ${conDireccion}.`,
    '¡Gracias!',
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\.\./g, '.')

  return {
    comercio: comercio.nombre,
    pedido,
    ...(nota && { aclaracion: nota }),
    por: 'whatsapp',
    link: `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
  }
}
