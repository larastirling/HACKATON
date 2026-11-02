// Configuración del pago del estacionamiento tarifado de Montevideo (lo usa lib/estacionamiento.ts).
// No cambies estos datos ni agregues otros (precios, horarios, minutos permitidos) sin la fuente oficial:
// anotá acá el link y la fecha en que se revisó.
//
// Para que sirva por WhatsApp, el auto tiene que estar registrado una vez (por WhatsApp: matrícula y padrón).
// Eso lo hace la familia, no la app. El costo se carga en la cuenta de SUCIVE del dueño.
// Revisado en montevideo.gub.uy el 2026-11-02 (ver `fuente` de cada uno).

/**
 * La forma principal: el WhatsApp oficial de la Intendencia. Se abre WhatsApp con la palabra ya escrita; el abuelo
 * aprieta Enviar, espera la respuesta y elige "Con matrícula asociada" (opción 1). Se paga por minuto (mínimo 15) y
 * se termina con "fin". La Intendencia le recuerda cada 120 minutos que lo tiene abierto.
 */
export const ESTACIONAMIENTO_POR_WHATSAPP = {
  /** El WhatsApp de la Intendencia (099 019 500), con el código de Uruguay para el link de wa.me. */
  numero: '+598 99 019 500',
  /** Lo que se escribe para empezar a estacionar. */
  paraEmpezar: 'estacionamiento',
  /** La opción que hay que elegir cuando contestan (el auto ya registrado). */
  opcionParaEmpezar: '“Con matrícula asociada” (opción 1)',
  /** Lo que se escribe para terminar ("ya me voy"). */
  paraTerminar: 'fin',
  fuente:
    'https://montevideo.gub.uy/area-tematica/movilidad/estacionamiento-tarifado/estacionamiento-tarifado-por-whatsapp ' +
    '(última actualización de la página: 27/01/2026; revisado el 2026-11-02)',
} as const

/**
 * El respaldo, si WhatsApp no anda: un SMS al 466 con "E" + matrícula + minutos (ejemplo oficial: "E SZS1234 60").
 * Compra esos minutos desde que el sistema confirma: si no llega la confirmación, no está pagado y hay que repetirlo.
 * Solo se arma si el abuelo dijo cuántos minutos va a estar. Para usuarios de Antel, Movistar y Claro.
 * La página no dice si los minutos tienen que ser múltiplos de algo: se manda lo que dijo el abuelo.
 */
export const ESTACIONAMIENTO_POR_SMS = {
  /** A dónde se manda el SMS. */
  numero: '466',
  /** Qué dice el SMS. {MATRICULA} (sin espacio, como en el ejemplo oficial) y {MINUTOS} se reemplazan. */
  formato: 'E {MATRICULA} {MINUTOS}',
  /** Confirmado en la web de la Intendencia el 2026-11-02. */
  confirmado: true,
  fuente:
    'https://montevideo.gub.uy/areas-tematicas/movilidad/estacionamiento-tarifado/precio-del-ticket-y-como-pagarlo-0 ' +
    '(última actualización de la página: 09/01/2025; revisado el 2026-11-02)',
} as const

/**
 * Cuándo y dónde se paga. Fuera de eso es gratis: la app se lo dice al abuelo en vez de abrirle el WhatsApp.
 * Los feriados cambian cada año: sin la lista oficial de ese año, no se da por gratis un feriado (sí el fin de semana).
 * "Si el feriado se corre de día, la gratuidad se adecúa a ello" (dice la página): si se corre uno, cambiarlo acá.
 */
export const CUANDO_SE_PAGA = {
  /** Lunes a viernes (getDay: 1 a 5), de 10 a 18 (hora de Uruguay). */
  dias: [1, 2, 3, 4, 5],
  desdeLas: 10,
  hastaLas: 18,
  zonas: 'Ciudad Vieja, Centro y Cordón',
  /** Feriados con estacionamiento gratuito, por año (fecha de Uruguay → nombre). */
  feriados: {
    2026: {
      '2026-01-01': 'Año Nuevo',
      '2026-01-06': 'Día de Reyes',
      '2026-02-16': 'Carnaval',
      '2026-02-17': 'Carnaval',
      '2026-04-02': 'Turismo',
      '2026-04-03': 'Turismo',
      '2026-04-19': 'Desembarco de los 33 Orientales',
      '2026-05-01': 'Día de los Trabajadores',
      '2026-05-18': 'Batalla de las Piedras',
      '2026-06-19': 'Natalicio de Artigas',
      '2026-07-18': 'Jura de la Constitución',
      '2026-08-25': 'Declaratoria de la Independencia',
      '2026-10-12': 'Día de la Raza',
      '2026-11-02': 'Día de los Difuntos',
      '2026-12-25': 'Navidad o Día de la Familia',
    },
  } as Record<number, Record<string, string>>,
  fuente:
    'https://montevideo.gub.uy/area-tematica/movilidad/estacionamiento-tarifado (días y horario: lunes a viernes de 10 a 18; ' +
    'sábados, domingos y feriados no laborables gratis), ' +
    'https://montevideo.gub.uy/area-tematica/movilidad/estacionamiento-tarifado/zona-de-estacionamiento-tarifado-0 (zonas) y ' +
    'https://montevideo.gub.uy/area-tematica/movilidad/estacionamiento-tarifado/fechas-con-estacionamiento-gratuito ' +
    '(feriados 2026, actualizada el 14/01/2026). Revisado el 2026-11-02.',
}

/**
 * A partir de cuántos minutos de estacionamiento abierto la APP le avisa al abuelo (por si se olvidó de terminarlo).
 * Es un aviso nuestro: el recordatorio de la Intendencia por WhatsApp es cada 120 minutos.
 */
export const MINUTOS_PARA_AVISAR = 60
