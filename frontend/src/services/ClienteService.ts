import type { Cliente } from '@models/Cliente';
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
}
