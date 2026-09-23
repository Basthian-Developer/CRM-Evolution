import { useQuery } from "@tanstack/react-query";
import { clienteService } from "@config/dependencies/clienteDependency";

export default function useClientes() {
    return useQuery({
        queryKey: ["clientes"],
        queryFn: () => clienteService.getAll()
    });
}