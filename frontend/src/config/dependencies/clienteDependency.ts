import type ClienteRepository from '@repositories/interface/ClienteRepository';
import ClienteRepositoryImpl from '@data-source/ClienteRepositoryImpl';
import ClienteService from '@services/ClienteService';

// Vite selecciona el repositorio JSON o API mediante @data-source.
const clienteRepository: ClienteRepository = new ClienteRepositoryImpl();

// Una misma instancia del servicio se reutiliza en los hooks.
export const clienteService = new ClienteService(clienteRepository);
