import { Request, Response } from "express";
import db from "../config/db";
import { RowDataPacket, OkPacket } from "mysql2";

/**
 * 📌 Función para ejecutar consultas SQL con `async/await`
 */
const dbQuery = async <T = RowDataPacket[]>(sql: string, values?: any[]): Promise<T> => {
    try {
        const [results] = await db.execute(sql, values);
        return results as T;
    } catch (error) {
        console.error("❌ Error en la consulta SQL:", error);
        throw new Error("Error en la base de datos.");
    }
};

/**
 * 📌 Generar un código QR vinculado a una tarea (reto)
 */
export const generarQR = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_tarea } = req.body;

        if (!id_tarea) {
            res.status(400).json({ error: "El ID de la tarea es obligatorio." });
            return;
        }

        // 🔹 Verificar que la tarea existe
        const tarea = await dbQuery<RowDataPacket[]>("SELECT * FROM Tareas WHERE id_tarea = ?", [id_tarea]);
        if (tarea.length === 0) {
            res.status(404).json({ error: "Tarea no encontrada." });
            return;
        }

        // 🔹 Generar un código QR aleatorio de 8 caracteres
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const codigoQR = Array.from({ length: 8 }, () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))).join("");

        // 🔹 Insertar en la base de datos el QR asociado a la tarea
        await dbQuery<OkPacket>(
            "INSERT INTO CodigosQR (id_tarea, codigo, estado, fecha_generado) VALUES (?, ?, 'Generado', NOW())",
            [id_tarea, codigoQR]
        );

        res.status(201).json({
            message: "✅ Código QR generado con éxito.",
            codigo: codigoQR,
            id_tarea: id_tarea,
        });

    } catch (error) {
        console.error("❌ Error en la generación del QR:", error);
        res.status(500).json({ error: "Error en el servidor al generar el código QR." });
    }
};

/**
 * 📌 Canjear un código QR y otorgar puntos por reto completado
 */
export const canjearQR = async (req: Request, res: Response): Promise<void> => {
    try {
        const { codigo, id_usuario } = req.body;

        if (!codigo || !id_usuario) {
            res.status(400).json({ error: "Código QR y usuario son requeridos." });
            return;
        }

        // 🔹 Verificar si el QR existe y está disponible
        const qrResults = await dbQuery<RowDataPacket[]>("SELECT * FROM CodigosQR WHERE codigo = ? AND estado = 'Generado'", [codigo]);
        if (qrResults.length === 0) {
            res.status(404).json({ error: "Código QR no válido o ya canjeado." });
            return;
        }

        const qrData = qrResults[0];

        // 🔹 Verificar si la tarea vinculada al QR es válida
        const tarea = await dbQuery<RowDataPacket[]>("SELECT * FROM Tareas WHERE id_tarea = ?", [qrData.id_tarea]);
        if (tarea.length === 0) {
            res.status(404).json({ error: "Tarea no encontrada." });
            return;
        }

        const tareaData = tarea[0];

        // 🔹 Verificar si la tarea es especial y está dentro de la fecha válida
        if (tareaData.tipo === "Especial") {
            const now = new Date();
            if (now < new Date(tareaData.fecha_inicio) || now > new Date(tareaData.fecha_fin)) {
                res.status(400).json({ error: "Este reto especial ya no está disponible." });
                return;
            }
        }

        // 🔹 Verificar si el usuario ya canjeó este QR antes
        const userRedeem = await dbQuery<RowDataPacket[]>(
            "SELECT * FROM Usuario_Tarea WHERE id_usuario = ? AND id_tarea = ?",
            [id_usuario, qrData.id_tarea]
        );

        if (userRedeem.length > 0) {
            res.status(400).json({ error: "Este usuario ya completó este reto." });
            return;
        }

        // 🔹 Registrar que el usuario completó la tarea
        await dbQuery<OkPacket>(
            "INSERT INTO Usuario_Tarea (id_usuario, id_tarea, fecha_completada) VALUES (?, ?, NOW())",
            [id_usuario, qrData.id_tarea]
        );

        // 🔹 Actualizar los puntos del usuario
        await dbQuery<OkPacket>(
            "UPDATE Usuarios SET puntos_totales = puntos_totales + ? WHERE id_usuario = ?",
            [tareaData.puntos, id_usuario]
        );

        // 🔹 Marcar el código QR como "Canjeado"
        await dbQuery<OkPacket>(
            "UPDATE CodigosQR SET estado = 'Canjeado' WHERE codigo = ?",
            [codigo]
        );

        res.json({
            message: "✅ Código QR canjeado con éxito.",
            puntos_ganados: tareaData.puntos,
        });

    } catch (error) {
        console.error("❌ Error en canje de QR:", error);
        res.status(500).json({ error: "Error en el servidor al canjear el código QR." });
    }
};
