import { useQuery } from '@tanstack/react-query';
import { interaccionService } from '@config/dependencies/interaccionDependency';

// Consulta y comparte los datos en caché entre las vistas.
export default function useInteracciones() {
  return useQuery({
    queryKey: ['interacciones'],
    queryFn: () => interaccionService.getAll(),
  });
}
