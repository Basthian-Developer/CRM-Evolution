import type { Cliente } from '@models/Cliente';

// Contrato común para obtener datos desde JSON o API.
export default interface ClienteRepository {
  getAll(): Promise<Cliente[]>;
}
