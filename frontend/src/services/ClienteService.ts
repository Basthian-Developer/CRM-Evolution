import type { Cliente, NuevoCliente, EstadoCliente } from '@models/Cliente';
import type ClienteRepository from '@repositories/interface/ClienteRepository';

// Delega la lectura al repositorio recibido, sin depender de su origen.
export default class ClienteService {
  private readonly repository: ClienteRepository;

  constructor(repository: ClienteRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<Cliente[]> {
    return this.repository.getAll();
  }
  // La fuente seleccionada se encarga de guardar los cambios.
  async crear(entrada: NuevoCliente): Promise<void> {
    await this.repository.crear(entrada);
  }
  async cambiarEstado(id: string, estado: EstadoCliente): Promise<void> {
    await this.repository.cambiarEstado(id, estado);
  }
}
