import type TareaRepository from '@repositories/interface/TareaRepository';
import TareaRepositoryImpl from '@data-source/TareaRepositoryImpl';
import TareaService from '@services/TareaService';

// Vite selecciona el repositorio JSON o API mediante @data-source.
const tareaRepository: TareaRepository = new TareaRepositoryImpl();

// Una misma instancia del servicio se reutiliza en los hooks.
export const tareaService = new TareaService(tareaRepository);
