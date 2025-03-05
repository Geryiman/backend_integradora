export interface CodigoQR {
    id?: number;
    id_usuario: number;
    codigo: string;
    estado: "Generado" | "Canjeado";
    fecha_generado?: Date;
    fecha_canjeado?: Date | null;
}
