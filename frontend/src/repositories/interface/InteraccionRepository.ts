import type { Interaccion } from '@models/Interaccion';

// Contrato común para obtener datos desde JSON o API.
export default interface InteraccionRepository {
  getAll(): Promise<Interaccion[]>;
}
