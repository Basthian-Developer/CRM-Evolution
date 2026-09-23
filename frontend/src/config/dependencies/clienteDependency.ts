import type ClienteRepository from "@repositories/interface/ClienteRepository";
import ClienteRepositoryImpl from "@data-source/ClienteRepositoryImpl";
import ClienteService from "@services/ClienteService";

const clienteRepository: ClienteRepository = new ClienteRepositoryImpl();

export const clienteService = new ClienteService(clienteRepository);