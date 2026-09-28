import type { Tarea, NuevaTarea } from '@models/Tarea';

// Contrato común para obtener datos desde JSON o API.
export default interface TareaRepository {
  getAll(): Promise<Tarea[]>;
  crear(entrada: NuevaTarea): Promise<void>;
}
