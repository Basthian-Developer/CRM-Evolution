import type { Interaccion } from "@models/Interaccion";

export default interface InteraccionRepository {
    getAll(): Promise<Interaccion[]>;
}