import type { Tarea } from "@models/Tarea";
import type TareaRepository from "@repositories/interface/TareaRepository";

export default class TareaService {
    private readonly repository: TareaRepository;

    constructor(repository: TareaRepository) {
        this.repository = repository;
    }

    async getAll(): Promise<Tarea[]> {
        return this.repository.getAll();
    }
}
