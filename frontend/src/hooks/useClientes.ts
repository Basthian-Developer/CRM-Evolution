import { useQuery } from '@tanstack/react-query';
import { clienteService } from '@config/dependencies/clienteDependency';

// Consulta y comparte los datos en caché entre las vistas.
export default function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getAll(),
  });
}
