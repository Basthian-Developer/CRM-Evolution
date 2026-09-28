import type { Tarea, NuevaTarea } from '@models/Tarea';
import type TareaRepository from '@repositories/interface/TareaRepository';
import { demoStore } from './demoStore';

// Solo el alias JSON utiliza este almacén temporal; la API queda independiente.
export default class TareaRepositoryImpl implements TareaRepository {
  async getAll(): Promise<Tarea[]> {
    return demoStore.tareas();
  }
  // La fuente seleccionada se encarga de guardar los cambios.
  async crear(entrada: NuevaTarea): Promise<void> {
    await demoStore.crearTarea(entrada);
  }
}
