import 'server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { mostrarMatricula, normalizarMatricula } from '@/lib/estacionamiento'
import { cambiarConfiguracion } from './guardar'

// Herramienta "guardar_matricula": si la persona mayor maneja, la matrícula del auto (abuelo.matricula), para pagar el
// estacionamiento tarifado desde /abuelo (con el WhatsApp de la Intendencia). También se carga en la tarjeta del paso 1 (pasos.ts).

/** Lo que se le cuenta al hijo cada vez que se guarda una matrícula (en la tarjeta y en la charla). */
export const AVISO_REGISTRO_DEL_AUTO =
  'Para que pueda pagar el estacionamiento desde su celular (con el WhatsApp de la Intendencia), el auto tiene que estar registrado en el sistema de estacionamiento ' +
  'de la Intendencia (con la matrícula, el padrón y su celular). Eso lo hace la familia una sola vez.'

export const HERRAMIENTA_GUARDAR_MATRICULA: Anthropic.Beta.BetaTool = {
  name: 'guardar_matricula',
  description:
    'Si la persona mayor maneja: guarda la matrícula de su auto (para pagar el estacionamiento tarifado con el WhatsApp de la Intendencia). ' +
    'Usala solo con la matrícula que escribió el hijo, tal cual. Con "" se borra (si dice que ya no maneja).',
  input_schema: {
    type: 'object',
    properties: { matricula: { type: 'string', description: 'La matrícula tal cual la escribió el hijo, ej. "SBA 1234". "" para borrarla.' } },
    required: ['matricula'],
    additionalProperties: false,
  },
  // Sin strict, como sugerir_lugares: Haiku rechaza la charla si hay muchas herramientas strict. Lo revisa el servidor.
  strict: false,
}

/** Guarda (o borra, con "") la matrícula. Devuelve el problema, o la matrícula como se muestra ("SBA 1234"). */
export async function guardarLaMatricula(codigoFamilia: string, texto: string): Promise<{ problema: string } | { matricula: string | null }> {
  const escrita = texto.trim()
  const matricula = escrita ? normalizarMatricula(escrita) : null
  if (escrita && !matricula) return { problema: `"${escrita}" no parece una matrícula (por ejemplo "SBA 1234")` }
  const error = await cambiarConfiguracion(codigoFamilia, (c) => {
    const abuelo = { ...c.abuelo }
    if (matricula) abuelo.matricula = matricula
    else delete abuelo.matricula
    return { ...c, abuelo }
  })
  if (error) return { problema: error }
  return { matricula: matricula && mostrarMatricula(matricula) }
}

export async function guardarMatricula(codigoFamilia: string, dato: unknown): Promise<string> {
  console.log('[familia] la IA pidió guardar_matricula:', JSON.stringify(dato))
  const texto = (dato as { matricula?: unknown } | null)?.matricula
  if (typeof texto !== 'string') return 'No se guardó: falta "matricula" (o "" para borrarla).'
  const resultado = await guardarLaMatricula(codigoFamilia, texto)
  if ('problema' in resultado) return `No se guardó: ${resultado.problema}. Pedile al hijo que la revise. No la completes vos.`
  if (!resultado.matricula) return 'Listo: se borró la matrícula. Contáselo al hijo en una frase.'
  return `Guardada la matrícula ${resultado.matricula}. Contáselo al hijo y avisale, en una o dos frases: ${AVISO_REGISTRO_DEL_AUTO}`
}
