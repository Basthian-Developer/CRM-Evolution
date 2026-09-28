import type { Interaccion } from '@models/Interaccion';
import type InteraccionRepository from '@repositories/interface/InteraccionRepository';
import { demoStore } from './demoStore';

// Solo el alias JSON utiliza este almacén temporal; la API queda independiente.
export default class InteraccionRepositoryImpl implements InteraccionRepository {
  async getAll(): Promise<Interaccion[]> {
    return demoStore.interacciones();
  }
}
