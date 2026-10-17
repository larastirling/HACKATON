import type { TablaReglas as Tabla } from './reglas'
import estilos from './tabla.module.css'

// Tabla de reglas pensada para el celular: un bloque por grupo, una fila por regla.

const GRUPOS = [
  { clave: 'seAprueba', titulo: '🔒 Se aprueba', ayuda: 'La familia tiene que decir que sí antes', clase: estilos.aprueba },
  { clave: 'seAvisa', titulo: '🔔 Solo se avisa', ayuda: 'La familia se entera, no hace falta contestar', clase: estilos.avisa },
  { clave: 'libre', titulo: '✅ Libre', ayuda: 'Lo puede hacer solo', clase: estilos.libre },
  { clave: 'fijas', titulo: '🛡️ Siempre, no se puede apagar', ayuda: '', clase: estilos.fijas },
] as const

export default function TablaReglas({ tabla }: { tabla: Tabla }) {
  return (
    <section className={estilos.tabla} aria-label="Nivel y reglas">
      <header className={estilos.encabezado}>
        <p className={estilos.etiqueta}>{tabla.guardada ? 'Nivel guardado' : 'Nivel propuesto'}</p>
        <p className={estilos.nivel}>{tabla.nivel}</p>
        {tabla.motivo && <p className={estilos.motivo}>{tabla.motivo}</p>}
      </header>

      {GRUPOS.map((g) => (
        <div key={g.clave} className={`${estilos.grupo} ${g.clase}`}>
          <h3>{g.titulo}</h3>
          {g.ayuda && <p className={estilos.ayuda}>{g.ayuda}</p>}
          <ul>
            {tabla[g.clave].length === 0 ? <li className={estilos.nada}>Nada</li> : tabla[g.clave].map((regla) => <li key={regla}>{regla}</li>)}
          </ul>
        </div>
      ))}

      {!tabla.abueloAceptoAvisos && <p className={estilos.nota}>⚠️ El abuelo todavía tiene que aceptar qué se le avisa a la familia.</p>}
      <p className={tabla.guardada ? estilos.guardada : estilos.borrador}>
        {tabla.guardada ? '✅ Guardado: el asistente ya usa estas reglas' : '✏️ Todavía no está guardado. Decime qué querés cambiar o si está bien.'}
      </p>
    </section>
  )
}
