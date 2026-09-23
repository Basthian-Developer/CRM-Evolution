import { useQuery } from "@tanstack/react-query";
import { tareaService } from "@config/dependencies/tareaDependency";

export default function useTareas() {
    return useQuery({
        queryKey: ["tareas"],
        queryFn: () => tareaService.getAll()
    });
}
