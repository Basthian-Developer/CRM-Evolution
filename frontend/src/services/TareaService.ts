import type { Tarea } from '@models/Tarea';
import type TareaRepository from '@repositories/interface/TareaRepository';

// Delega la lectura al repositorio recibido, sin depender de su origen.
export default class TareaService {
  private readonly repository: TareaRepository;

  constructor(repository: TareaRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<Tarea[]> {
    return this.repository.getAll();
  }
}
