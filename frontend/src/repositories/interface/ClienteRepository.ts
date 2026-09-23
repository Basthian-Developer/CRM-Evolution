import type { Cliente } from "@models/Cliente"

export default interface ClienteRepository {
    getAll(): Promise<Cliente[]>;
}