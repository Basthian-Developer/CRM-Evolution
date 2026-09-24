import type { Tarea } from '@models/Tarea';

// Contrato común para obtener datos desde JSON o API.
export default interface TareaRepository {
  getAll(): Promise<Tarea[]>;
}
