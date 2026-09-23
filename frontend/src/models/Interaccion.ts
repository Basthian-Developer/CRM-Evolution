export interface Interaccion{
    id: string;
    clienteId: string;
    tipo: TipoInteraction;
    titulo: string;
    descripcion?: string;
    fecha: string;
}

export type TipoInteraction =
    | "llamada"
    | "correo"
    | "reunion"
    | "nota";