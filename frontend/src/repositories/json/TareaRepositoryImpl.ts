import type { Tarea } from '@models/Tarea';
import type TareaRepository from '@repositories/interface/TareaRepository';

// Lee los datos de demostración desde la carpeta public/data.
export default class TareaRepositoryImpl implements TareaRepository {
  async getAll(): Promise<Tarea[]> {
    // BASE_URL permite servir la demo también desde GitHub Pages.
    const response = await fetch(`${import.meta.env.BASE_URL}data/tareas.json`);

    // Propaga el error para que el hook pueda informar a la vista.
    if (!response.ok) {
      throw new Error(`Error al consultar tareas.json: ${response.status}`);
    }

    const data: Tarea[] = await response.json();
    return data;
  }
}
