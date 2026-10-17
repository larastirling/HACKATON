import 'server-only'
import nodemailer from 'nodemailer'

// Manda mails con el Gmail de la demo (contraseña de aplicación de Gmail).
// Los datos van en variables de entorno: GMAIL_USUARIO y GMAIL_CONTRASENA_APP.

export interface Mail {
  para: string
  asunto: string
  texto: string
  html: string
}

export type ResultadoMail = { enviado: true; modoPrueba?: boolean } | { enviado: false; error: string }

export async function enviarMail(mail: Mail): Promise<ResultadoMail> {
  const usuario = process.env.GMAIL_USUARIO
  const contrasena = process.env.GMAIL_CONTRASENA_APP?.replace(/\s/g, '')

  if (!usuario || !contrasena) {
    // En la compu, sin Gmail configurado, el mail se muestra en la Terminal para poder probar.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n✉️  MAIL DE PRUEBA (falta configurar Gmail, no se envió)\nPara: ${mail.para}\nAsunto: ${mail.asunto}\n${mail.texto}\n`)
      return { enviado: true, modoPrueba: true }
    }
    return { enviado: false, error: 'Falta configurar GMAIL_USUARIO y GMAIL_CONTRASENA_APP' }
  }

  try {
    const transporte = nodemailer.createTransport({ service: 'gmail', auth: { user: usuario, pass: contrasena } })
    await transporte.sendMail({
      from: `"Asistente de confianza" <${usuario}>`,
      to: mail.para,
      subject: mail.asunto,
      text: mail.texto,
      html: mail.html,
    })
    return { enviado: true }
  } catch (error) {
    console.error('No se pudo enviar el mail:', error)
    return { enviado: false, error: (error as Error).message }
  }
}
