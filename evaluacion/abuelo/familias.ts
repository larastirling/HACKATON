import type { ConfiguracionAbuelo } from '../../lib/datos'

// Segunda familia de prueba: INVENTADA. Solo existe dentro de esta prueba (nunca se guarda en la base).
// Las direcciones y coordenadas son aproximadas y los mails terminan en .invalid (no existen).
// Las reglas fijas se agregan en evaluar.ts, desde lib/datos.ts, igual que hace la app.
export const FAMILIA_MARTA: Omit<ConfiguracionAbuelo, 'reglas'> & { reglas: Omit<ConfiguracionAbuelo['reglas'], 'fijas'> } = {
  codigoFamilia: 'PRUEBA-MARTA',
  abuelo: {
    nombre: 'Marta Rodríguez',
    comoLeGustaQueLeHablen: 'Marta, de vos',
    telefono: '+598 99 000 001',
    direccion: 'Benito Blanco 1050, Montevideo',
  },
  lugares: [
    {
      nombre: 'Casa de Pablo',
      apodos: ['lo del nene', 'lo de Pablo'],
      direccion: 'Av. Brasil 2500, Montevideo',
      latitud: -34.9078,
      longitud: -56.1515,
      necesitaPermiso: false,
    },
    {
      nombre: 'Club de Jubilados',
      apodos: ['el club'],
      direccion: 'Av. 18 de Julio 1800, Montevideo',
      latitud: -34.8995,
      longitud: -56.1715,
      necesitaPermiso: false,
    },
    {
      nombre: 'Club Naval',
      apodos: ['el club'],
      direccion: 'Rambla República de México 5600, Montevideo',
      latitud: -34.8915,
      longitud: -56.0700,
      necesitaPermiso: false,
    },
    {
      nombre: 'Casino del Parque Hotel',
      apodos: ['el casino'],
      direccion: 'Rambla Wilson y Sarmiento, Montevideo',
      latitud: -34.9158,
      longitud: -56.1665,
      necesitaPermiso: true,
    },
  ],
  comercios: [
    {
      nombre: 'Panadería La Espiga',
      apodos: ['la panadería'],
      whatsapp: '+598 99 000 002',
      pedidoHabitual: 'Media docena de bizcochos y un pan flauta',
      necesitaPermiso: false,
    },
  ],
  familiares: [{ nombre: 'Pablo', relacion: 'Hijo', mail: 'pablo@ejemplo.invalid', telefono: '+598 99 000 003', orden: 1 }],
  reglas: {
    nivel: 'Cuidado cercano',
    seAvisa: ['Cuando sale de su casa hacia un lugar', 'Cuando hace un pedido a un comercio'],
    seAprueba: ['Ir al casino', 'Pedir algo que no es el pedido habitual'],
    abueloAceptoAvisos: true,
  },
}
