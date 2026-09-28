import type { NuevaTarea } from '@models/Tarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tareaService } from '@config/dependencies/tareaDependency';

// Consulta y comparte los datos en caché entre las vistas.
export default function useTareas() {
  const queryClient = useQueryClient();
  const consulta = useQuery({
    queryKey: ['tareas'],
    queryFn: () => tareaService.getAll(),
  });
  // El hook coordina las escrituras y actualiza la caché; no conoce JSON ni API.
  const crear = useMutation({
    mutationFn: (entrada: NuevaTarea) => tareaService.crear(entrada),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tareas'] }),
  });
  return { ...consulta, crear };
}
