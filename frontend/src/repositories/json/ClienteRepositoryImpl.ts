import type { Cliente, NuevoCliente, EstadoCliente } from '@models/Cliente';
import type ClienteRepository from '@repositories/interface/ClienteRepository';
import { demoStore } from './demoStore';

// Solo el alias JSON utiliza este almacén temporal; la API queda independiente.
export default class ClienteRepositoryImpl implements ClienteRepository {
  async getAll(): Promise<Cliente[]> {
    return demoStore.clientes();
  }
  // La fuente seleccionada se encarga de guardar los cambios.
  async crear(entrada: NuevoCliente): Promise<void> {
    await demoStore.crearCliente(entrada);
  }
  async cambiarEstado(id: string, estado: EstadoCliente): Promise<void> {
    await demoStore.cambiarEstado(id, estado);
  }
}
