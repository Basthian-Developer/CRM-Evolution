import type { NuevoCliente, EstadoCliente } from '@models/Cliente';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '@config/dependencies/clienteDependency';

// Consulta y comparte los datos en caché entre las vistas.
export default function useClientes() {
  const queryClient = useQueryClient();
  const consulta = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getAll(),
  });
  // El hook coordina las escrituras y actualiza la caché; no conoce JSON ni API.
  const crear = useMutation({
    mutationFn: (entrada: NuevoCliente) => clienteService.crear(entrada),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
  });
  const cambiarEstado = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoCliente }) =>
      clienteService.cambiarEstado(id, estado),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['clientes'] }),
        queryClient.invalidateQueries({ queryKey: ['interacciones'] }),
      ]);
    },
  });
  return { ...consulta, crear, cambiarEstado };
}
