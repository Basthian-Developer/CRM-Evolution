import type { Cliente } from '@models/Cliente';
import type ClienteRepository from '@repositories/interface/ClienteRepository';

// Lee los datos de demostración desde la carpeta public/data.
export default class ClienteRepositoryImpl implements ClienteRepository {
  async getAll(): Promise<Cliente[]> {
    // BASE_URL permite servir la demo también desde GitHub Pages.
    const response = await fetch(
      `${import.meta.env.BASE_URL}data/clientes.json`,
    );

    // Propaga el error para que el hook pueda informar a la vista.
    if (!response.ok) {
      throw new Error(`Error al consultar clientes.json: ${response.status}`);
    }

    const data: Cliente[] = await response.json();

    return data;
  }
}
