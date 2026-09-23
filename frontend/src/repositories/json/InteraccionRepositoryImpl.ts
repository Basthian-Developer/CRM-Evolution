import type { Interaccion } from "@models/Interaccion";
import type InteraccionRepository from "@repositories/interface/InteraccionRepository";

export default class InteraccionRepositoryImpl implements InteraccionRepository{
    async getAll(): Promise<Interaccion[]> {
        const response = await fetch(`${import.meta.env.BASE_URL}data/interacciones.json`);

        if(!response.ok){
            throw new Error(`Error al consultar interacciones: ${response.status}`);
        }

        const data: Interaccion[] = await response.json();
        return data;
    }
}