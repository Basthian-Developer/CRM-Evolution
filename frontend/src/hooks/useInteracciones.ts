import { useQuery } from "@tanstack/react-query";
import { interaccionService } from "@config/dependencies/interaccionDependency";

export default function useInteracciones() {
    return useQuery({
        queryKey: ["interacciones"],
        queryFn: () => interaccionService.getAll()
    });
}