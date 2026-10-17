import 'server-only'
import { hayCredencialesDeGoogle } from '@/app/api/gmail/google'
import { FAMILIA_DEMO, normalizarCodigo } from '@/lib/datos'
import { leerConexionGmail } from './conexion-gmail'

// Estado de la protección de mail de una familia, para la pantalla y para la IA.

export type EstadoProteccion =
  | { tipo: 'demo' }
  | { tipo: 'conectada'; mail: string; desde: string; error?: string }
  | { tipo: 'sin-conectar'; sePuedeConectar: boolean }

export async function estadoProteccion(codigoFamilia: string): Promise<EstadoProteccion> {
  // La DEMO la protege el script de Apps Script de Inés en el Gmail de la demo.
  if (normalizarCodigo(codigoFamilia) === FAMILIA_DEMO.codigoFamilia) return { tipo: 'demo' }
  const conexion = await leerConexionGmail(codigoFamilia)
  if (!conexion) return { tipo: 'sin-conectar', sePuedeConectar: hayCredencialesDeGoogle() }
  return { tipo: 'conectada', mail: conexion.mailAbuelo, desde: conexion.conectadoEl, ...(conexion.ultimoError && { error: conexion.ultimoError }) }
}

export function proteccionParaLaIA(estado: EstadoProteccion): string {
  switch (estado.tipo) {
    case 'demo':
      return 'PROTECCIÓN DE MAIL: activada (es la familia de demostración, la protege el Gmail de la demo). No ofrezcas conectar otro Gmail.'
    case 'conectada':
      return estado.error
        ? `PROTECCIÓN DE MAIL: conectada a ${estado.mail}, pero la última revisión falló (${estado.error}). Sugerí volver a tocar "Conectar Gmail del abuelo".`
        : `PROTECCIÓN DE MAIL: activada, revisando ${estado.mail}.`
    case 'sin-conectar':
      return 'PROTECCIÓN DE MAIL: todavía no está conectada.'
  }
}

/** Lo que se muestra al volver de Google o de desconectar (?gmail=… en la dirección). */
export const AVISOS_GMAIL: Record<string, { texto: string; ok: boolean }> = {
  conectado: { ok: true, texto: '✅ Listo: el Gmail quedó conectado y la app lo va a revisar sola.' },
  'conectado-otro': { ok: false, texto: '⚠️ Se conectó un Gmail distinto al que dijiste en la charla. Fijate abajo que sea el del abuelo.' },
  desconectado: { ok: true, texto: 'Listo: el Gmail se desconectó y la app ya no lo revisa.' },
  cancelado: { ok: false, texto: 'No se conectó: en la pantalla de Google se tocó Cancelar.' },
  vencido: { ok: false, texto: 'Pasaron más de 10 minutos o ese link ya se usó. Tocá el botón de nuevo.' },
  'otra-sesion': { ok: false, texto: 'Volviste de Google en otro navegador o con otra familia. Tocá el botón de nuevo desde acá.' },
  'sin-permiso-gmail': { ok: false, texto: 'Google no dio permiso para el Gmail (se destildó una casilla). Probá de nuevo y dejá todo tildado.' },
  'sin-permiso-guardable': { ok: false, texto: 'Google no dejó guardar el permiso. Probá de nuevo en un rato.' },
  'google-rechazo': { ok: false, texto: 'Google no dejó conectar. Probá de nuevo en un rato.' },
  error: { ok: false, texto: 'No se pudo conectar el Gmail. Probá de nuevo en un rato.' },
  'falta-configurar': { ok: false, texto: 'Todavía falta configurar la conexión con Google en la app (las credenciales de Google Cloud).' },
  demo: { ok: true, texto: 'La familia DEMO ya está protegida por el Gmail de la demo.' },
}
