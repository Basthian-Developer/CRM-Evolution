import InteraccionRepositoryImpl from "@data-source/InteraccionRepositoryImpl";
import InteraccionService from "@services/InteraccionService";
import type InteraccionRepository from "@repositories/interface/InteraccionRepository";

const interaccionRepository: InteraccionRepository = new InteraccionRepositoryImpl();

export const interaccionService = new InteraccionService(interaccionRepository); 