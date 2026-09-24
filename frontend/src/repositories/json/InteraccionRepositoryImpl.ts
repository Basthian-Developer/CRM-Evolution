import type { Interaccion } from '@models/Interaccion';
import type InteraccionRepository from '@repositories/interface/InteraccionRepository';

// Lee los datos de demostración desde la carpeta public/data.
export default class InteraccionRepositoryImpl implements InteraccionRepository {
  async getAll(): Promise<Interaccion[]> {
    // BASE_URL permite servir la demo también desde GitHub Pages.
    const response = await fetch(
      `${import.meta.env.BASE_URL}data/interacciones.json`,
    );

    // Propaga el error para que el hook pueda informar a la vista.
    if (!response.ok) {
      throw new Error(`Error al consultar interacciones: ${response.status}`);
    }

    const data: Interaccion[] = await response.json();
    return data;
  }
}
