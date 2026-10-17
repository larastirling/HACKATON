import estilos from './charla.module.css'

// Botón grande que lleva a la pantalla de permiso de Google (GET /api/gmail/conectar).
// Si se sabe el Gmail del abuelo, Google ya lo muestra elegido y a la vuelta se avisa si se eligió otro.
export default function BotonConectarGmail({ texto, mail }: { texto: string; mail?: string }) {
  const destino = mail ? `/api/gmail/conectar?mail=${encodeURIComponent(mail)}` : '/api/gmail/conectar'
  return (
    <a className={`boton boton-principal ${estilos.botonGmail}`} href={destino}>
      📧 {texto}
    </a>
  )
}
