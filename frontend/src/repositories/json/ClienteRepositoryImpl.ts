import type { Cliente } from "@models/Cliente";
import type ClienteRepository from "@repositories/interface/ClienteRepository";

export default class ClienteRepositoryImpl implements ClienteRepository{
    async getAll(): Promise<Cliente[]> {
        const response = await fetch(`${import.meta.env.BASE_URL}data/clientes.json`);

        if(!response.ok){
            throw new Error(`Error al consultar clientes.json: ${response.status}`);
        }

        const data: Cliente[] = await response.json();

        return data;
    }
}