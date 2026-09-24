import { useQuery } from '@tanstack/react-query';
import { tareaService } from '@config/dependencies/tareaDependency';

// Consulta y comparte los datos en caché entre las vistas.
export default function useTareas() {
  return useQuery({
    queryKey: ['tareas'],
    queryFn: () => tareaService.getAll(),
  });
}
