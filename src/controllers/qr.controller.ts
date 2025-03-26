import { Request, Response } from "express";
import db from "../config/db";
import { RowDataPacket, OkPacket } from "mysql2";

export const generarQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_tarea } = req.body;

    if (!id_tarea) {
      res.status(400).json({ message: "El ID de la tarea es obligatorio" });
      return;
    }

    const [tarea] = await db.query<RowDataPacket[]>(
      "SELECT * FROM Tareas WHERE id_tarea = ?",
      [id_tarea]
    );

    if (tarea.length === 0) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codigoQR = Array.from({ length: 8 }, () =>
      caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join("");

    await db.query<OkPacket>(
      "INSERT INTO CodigosQR (id_tarea, codigo, estado, fecha_generado) VALUES (?, ?, 'Generado', NOW())",
      [id_tarea, codigoQR]
    );

    res.status(201).json({
      message: "Código QR generado con éxito",
      codigo: codigoQR,
      id_tarea: id_tarea,
    });

  } catch (error) {
    console.error("❌ Error en la generación del QR:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const canjearQR = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo, id_usuario } = req.body;

    if (!codigo || !id_usuario) {
      res.status(400).json({ message: "Código QR y usuario son requeridos" });
      return;
    }

    const [qrResults] = await db.query<RowDataPacket[]>(
      "SELECT * FROM CodigosQR WHERE codigo = ? AND estado = 'Generado'",
      [codigo]
    );

    if (qrResults.length === 0) {
      res.status(404).json({ message: "Código QR no válido o ya canjeado" });
      return;
    }

    const qrData = qrResults[0];

    const [tarea] = await db.query<RowDataPacket[]>(
      "SELECT * FROM Tareas WHERE id_tarea = ?",
      [qrData.id_tarea]
    );

    if (tarea.length === 0) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    const tareaData = tarea[0];

    if (tareaData.tipo === "Especial") {
      const now = new Date();
      if (now < new Date(tareaData.fecha_inicio) || now > new Date(tareaData.fecha_fin)) {
        res.status(400).json({ message: "Este reto especial ya no está disponible" });
        return;
      }
    }

    const [userRedeem] = await db.query<RowDataPacket[]>(
      "SELECT * FROM Usuario_Tarea WHERE id_usuario = ? AND id_tarea = ?",
      [id_usuario, qrData.id_tarea]
    );

    if (userRedeem.length > 0) {
      res.status(400).json({ message: "Este usuario ya completó este reto" });
      return;
    }

    await db.query<OkPacket>(
      "INSERT INTO Usuario_Tarea (id_usuario, id_tarea, fecha_completada) VALUES (?, ?, NOW())",
      [id_usuario, qrData.id_tarea]
    );

    await db.query<OkPacket>(
      "UPDATE Usuarios SET puntos_totales = puntos_totales + ? WHERE id_usuario = ?",
      [tareaData.puntos, id_usuario]
    );

    res.json({
      message: "Código QR canjeado con éxito",
      puntos_ganados: tareaData.puntos,
    });

  } catch (error) {
    console.error("❌ Error en canje de QR:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
