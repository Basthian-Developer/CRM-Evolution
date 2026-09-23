import type { Tarea } from "@models/Tarea";

export default interface TareaRepository {
    getAll(): Promise<Tarea[]>;
}
