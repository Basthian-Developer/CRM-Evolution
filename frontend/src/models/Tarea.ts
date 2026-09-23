export interface Tarea {
    id: string;
    clienteId: string;
    titulo: string;
    descripcion?: string;
    estado: EstadoTask;
    prioridad: PrioridadTask;
    fechaLimited?: string;
    fechaCreated: string;
    fechaCompleted: string;
}

export type EstadoTask =
    | "pendiente"
    | "completada";

export type PrioridadTask =
    | "baja"
    | "media"
    | "alta";