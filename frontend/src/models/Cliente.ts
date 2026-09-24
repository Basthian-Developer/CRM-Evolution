// Estructura de los datos que consumen los servicios y las vistas.
export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa?: string;
  estado: EstadoCliente;
  fechaCreated: string;
  fechaUpdated: string;
}

export type EstadoCliente = 'prospecto' | 'cliente' | 'inactivo';
