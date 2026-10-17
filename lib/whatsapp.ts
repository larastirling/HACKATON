import 'server-only'
import { PENDIENTE, primerNombre, type Abuelo, type Comercio } from './datos'

/** Lo que necesita la pantalla para mostrar la tarjeta del pedido. */
export interface Pedido {
  comercio: string
  pedido: string
  aclaracion?: string
  link: string
}

const MAXIMO_LETRAS_ACLARACION = 150
const MAXIMO_LETRAS_PEDIDO_DISTINTO = 200

/**
 * Arma el mensaje y el link de WhatsApp con los datos GUARDADOS en la configuración:
 * número del comercio, pedido habitual, nombre y dirección del abuelo (si está cargada). No se manda solo:
 * el abuelo abre WhatsApp y aprieta enviar.
 * Si pide algo que NO es su pedido habitual, va `pedidoDistinto` (y eso necesita permiso de la familia).
 * Devuelve null si al comercio le falta el número.
 */
export function armarPedidoWhatsApp(
  comercio: Comercio,
  abuelo: Abuelo,
  { aclaracion = '', pedidoDistinto = '' }: { aclaracion?: string; pedidoDistinto?: string },
): Pedido | null {
  const numero = comercio.whatsapp === PENDIENTE ? '' : comercio.whatsapp.replace(/\D/g, '')
  if (!numero) return null

  const nota = aclaracion.trim().slice(0, MAXIMO_LETRAS_ACLARACION)
  const pedido = pedidoDistinto.trim().slice(0, MAXIMO_LETRAS_PEDIDO_DISTINTO) || comercio.pedidoHabitual.trim()
  const direccion = abuelo.direccion?.trim()
  const mensaje = [
    `Hola, soy ${primerNombre(abuelo.nombre)}. Quería pedir: ${pedido.charAt(0).toLowerCase()}${pedido.slice(1)}.`,
    nota && `Aclaración: ${nota}.`,
    direccion && direccion !== PENDIENTE && `Es para ${direccion}.`,
    '¡Gracias!',
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\.\./g, '.')

  return {
    comercio: comercio.nombre,
    pedido,
    ...(nota && { aclaracion: nota }),
    link: `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
  }
}
