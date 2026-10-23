'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'
import type { Trato } from '@/lib/trato'

// Los textos fijos de la pantalla del abuelo siguen el trato que eligió la familia (lib/trato.ts).
// La página lo pone con <ConTrato>; cada texto se escribe en las dos formas: t('Toque acá', 'Tocá acá').
// Si la familia no eligió, queda de usted (como era antes).

const TratoContexto = createContext<Trato>('usted')

export function ConTrato({ trato, children }: { trato: Trato; children: ReactNode }) {
  return <TratoContexto.Provider value={trato}>{children}</TratoContexto.Provider>
}

/** t(deUsted, deVos): el texto en el trato de la familia. */
export type T = (deUsted: string, deVos: string) => string

export function useTrato(): T {
  const trato = useContext(TratoContexto)
  return useCallback((deUsted: string, deVos: string) => (trato === 'vos' ? deVos : deUsted), [trato])
}
