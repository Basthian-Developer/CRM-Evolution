import InteraccionRepositoryImpl from '@data-source/InteraccionRepositoryImpl';
import InteraccionService from '@services/InteraccionService';
import type InteraccionRepository from '@repositories/interface/InteraccionRepository';

// Vite selecciona el repositorio JSON o API mediante @data-source.
const interaccionRepository: InteraccionRepository =
  new InteraccionRepositoryImpl();

// Una misma instancia del servicio se reutiliza en los hooks.
export const interaccionService = new InteraccionService(interaccionRepository);
