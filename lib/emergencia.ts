import 'server-only'
import { PENDIENTE, type Familiar } from './datos'

/** Lo que necesita la pantalla para mostrar los botones de emergencia. */
export interface Emergencia {
  /** Primer familiar (según "orden") que tiene teléfono guardado. */
  familiar?: { nombre: string; link: string }
}

/** Arma los botones con los teléfonos GUARDADOS en la configuración. El 911 va siempre. */
export function armarEmergencia(familiares: Familiar[]): Emergencia {
  const primero = [...familiares]
    .sort((a, b) => a.orden - b.orden)
    .find((familiar) => familiar.telefono !== PENDIENTE && familiar.telefono.replace(/\D/g, '') !== '')
  if (!primero) return {}
  return { familiar: { nombre: primero.nombre, link: `tel:${primero.telefono.replace(/[^\d+]/g, '')}` } }
}
