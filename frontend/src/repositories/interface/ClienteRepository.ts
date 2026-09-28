import type { Cliente, NuevoCliente, EstadoCliente } from '@models/Cliente';

// Contrato común para obtener datos desde JSON o API.
export default interface ClienteRepository {
  getAll(): Promise<Cliente[]>;
  crear(entrada: NuevoCliente): Promise<void>;
  cambiarEstado(id: string, estado: EstadoCliente): Promise<void>;
}
