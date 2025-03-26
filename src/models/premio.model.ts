import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../config/db";

export interface Premio {
    id_premio?: number;
    nombre: string;
    descripcion: string;
    puntos_necesarios: number;
}

/**
 * 📌 Obtener todos los premios disponibles
 */
export const obtenerPremios = async (): Promise<Premio[]> => {
    try {
        const [rows] = await db.execute("SELECT * FROM Premios");
        return rows as Premio[];
    } catch (error) {
        console.error("❌ Error en obtenerPremios:", error);
        throw new Error("Error al obtener los premios.");
    }
};

/**
 * 📌 Canjear un premio si el usuario tiene los puntos suficientes
 */
export const canjearPremio = async (id_usuario: number, id_premio: number): Promise<boolean> => {
    try {
        // 🔹 Obtener los puntos actuales del usuario
        const [userResults] = await db.execute<RowDataPacket[]>(
            "SELECT puntos_totales FROM Usuarios WHERE id_usuario = ?",
            [id_usuario]
        );

        if (userResults.length === 0) {
            throw new Error("Usuario no encontrado.");
        }

        const puntosUsuario = userResults[0].puntos_totales;

        // 🔹 Obtener los puntos necesarios para el premio
        const [premioResults] = await db.execute<RowDataPacket[]>(
            "SELECT puntos_necesarios FROM Premios WHERE id_premio = ?",
            [id_premio]
        );

        if (premioResults.length === 0) {
            throw new Error("Premio no encontrado.");
        }

        const puntosRequeridos = premioResults[0].puntos_necesarios;

        // 🔹 Verificar si el usuario tiene suficientes puntos
        if (puntosUsuario < puntosRequeridos) {
            throw new Error("Puntos insuficientes para canjear este premio.");
        }

        // 🔹 Descontar los puntos del usuario
        const [updateResult] = await db.execute<ResultSetHeader>(
            "UPDATE Usuarios SET puntos_totales = puntos_totales - ? WHERE id_usuario = ?",
            [puntosRequeridos, id_usuario]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error("Error al actualizar los puntos del usuario.");
        }

        // 🔹 Registrar el canje en la base de datos
        await db.execute(
            "INSERT INTO Canjes (id_usuario, id_premio, fecha_canje) VALUES (?, ?, NOW())",
            [id_usuario, id_premio]
        );

        return true;
    } catch (error) {
        console.error("❌ Error en canjearPremio:", error);
        throw new Error(error as string);
    }
};
