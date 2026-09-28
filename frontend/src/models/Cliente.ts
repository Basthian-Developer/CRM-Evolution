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

// Campos que se solicitan al crear un registro.
export type NuevoCliente = Pick<
  Cliente,
  'nombre' | 'apellido' | 'email' | 'telefono' | 'empresa' | 'estado'
>;
