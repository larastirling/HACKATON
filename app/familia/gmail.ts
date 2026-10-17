import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { normalizarMail } from '@/lib/datos'
import { estadoProteccion } from './proteccion'

// Herramienta "ofrecer_conexion_gmail": cuando el hijo dice el Gmail del abuelo, la pantalla muestra el botón
// "Conectar Gmail" con ese mail. El mail NO se guarda acá: lo que queda guardado es el que da Google al conectar
// (mailAbuelo de la ConexionGmail, docs/plan-gmail-oauth.md).

export const HERRAMIENTA_OFRECER_GMAIL: Anthropic.Beta.BetaTool = {
  name: 'ofrecer_conexion_gmail',
  description:
    'Muestra en la pantalla el botón grande para conectar el Gmail de la persona mayor (protección contra estafas por mail). ' +
    'Usala cuando el hijo te diga el Gmail, tal cual lo dijo. No guarda nada: se conecta cuando tocan el botón y dan permiso en Google.',
  input_schema: {
    type: 'object',
    properties: { mail: { type: 'string', description: 'El Gmail de la persona mayor, tal cual lo dijo el hijo. Nunca lo inventes.' } },
    required: ['mail'],
    additionalProperties: false,
  },
  strict: true,
}

export async function ofrecerConexionGmail(codigoFamilia: string, dato: unknown): Promise<{ texto: string; mail?: string }> {
  const mail = normalizarMail(String((dato as { mail?: unknown } | null)?.mail ?? ''))
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
    return { texto: `No se mostró el botón: "${mail}" no parece un mail. Pedile al hijo que lo repita. No lo completes vos.` }
  }
  const estado = await estadoProteccion(codigoFamilia)
  if (estado.tipo === 'demo') return { texto: 'No hace falta: la familia DEMO ya está protegida por el Gmail de la demo. Contáselo.' }
  if (estado.tipo === 'conectada' && estado.mail === mail && !estado.error) {
    return { texto: `Ese Gmail (${mail}) ya está conectado y protegido. Contáselo; no hace falta hacer nada.` }
  }
  if (estado.tipo === 'sin-conectar' && !estado.sePuedeConectar) {
    return { texto: 'Todavía no se puede conectar: falta configurar la conexión con Google en la app. Decíselo con calma y seguí con lo demás.' }
  }
  const aviso = mail.endsWith('@gmail.com') ? '' : ' Ojo: no termina en @gmail.com; solo funciona con cuentas de Google. Si no es de Google, decíselo.'
  return {
    mail,
    texto:
      `Listo: debajo de tu mensaje el hijo ve el botón "Conectar Gmail de ${mail}". Explicale en dos frases: al tocarlo se abre Google, ` +
      'ahí tiene que entrar con el Gmail de la persona mayor (mejor con ella al lado) y tocar "Permitir". La app nunca ve su contraseña ni borra mails.' +
      aviso,
  }
}
