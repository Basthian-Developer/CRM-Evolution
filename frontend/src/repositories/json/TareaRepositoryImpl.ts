import type { Tarea } from "@models/Tarea";
import type TareaRepository from "@repositories/interface/TareaRepository";

export default class TareaRepositoryImpl implements TareaRepository {
    async getAll(): Promise<Tarea[]> {
        const response = await fetch(`${import.meta.env.BASE_URL}data/tareas.json`);

        if (!response.ok) {
            throw new Error(`Error al consultar tareas.json: ${response.status}`);
        }

        const data: Tarea[] = await response.json();
        return data;
    }
}
