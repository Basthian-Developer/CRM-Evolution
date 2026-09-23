import type TareaRepository from "@repositories/interface/TareaRepository";
import TareaRepositoryImpl from "@data-source/TareaRepositoryImpl";
import TareaService from "@services/TareaService";

const tareaRepository: TareaRepository = new TareaRepositoryImpl();

export const tareaService = new TareaService(tareaRepository);
