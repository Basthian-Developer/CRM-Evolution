import type { Interaccion } from '@models/Interaccion';
import type InteraccionRepository from '@repositories/interface/InteraccionRepository';

// Delega la lectura al repositorio recibido, sin depender de su origen.
export default class InteraccionService {
  private readonly repository: InteraccionRepository;

  constructor(repository: InteraccionRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<Interaccion[]> {
    return this.repository.getAll();
  }
}
