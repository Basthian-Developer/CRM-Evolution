import type { Cliente } from '@models/Cliente';
import type ClienteRepository from '@repositories/interface/ClienteRepository';

export default class ClienteService {
    private readonly repository: ClienteRepository;

    constructor(
        repository: ClienteRepository
    ) {
        this.repository = repository
    }

    async getAll(): Promise<Cliente[]> {
        return this.repository.getAll();
    }
}
