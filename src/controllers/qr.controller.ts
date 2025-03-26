import { Request, Response } from "express";
import db from "../config/db";
import { RowDataPacket, OkPacket } from "mysql2";

// 📌 Registrar escaneo de QR y contar botella
export const canjearQR = async (req: Request, res: Response) => {
  try {
    const { codigo, id_usuario } = req.body;

    if (!codigo || !id_usuario) {
      res.status(400).json({ message: "Código y usuario son requeridos" });
      return;
    }

    // 1. Verificar QR válido
    const [qrResult] = await db.query<RowDataPacket[]>(
      "SELECT * FROM CodigosQR WHERE codigo = ? AND estado = 'Generado'",
      [codigo]
    );

    if (qrResult.length === 0) {
      return res.status(404).json({ message: "Código inválido o ya canjeado" });
    }

    const qr = qrResult[0];

    // 2. Verificar si ya fue escaneado por este usuario
    const [yaEscaneado] = await db.query<RowDataPacket[]>(
      `SELECT * FROM Usuario_QR WHERE id_usuario = ? AND id_qr = ?`,
      [id_usuario, qr.id_qr]
    );

    if (yaEscaneado.length > 0) {
      return res.status(400).json({ message: "Este código ya fue escaneado por este usuario" });
    }

    // 3. Registrar escaneo en Usuario_QR
    await db.query<OkPacket>(
      `INSERT INTO Usuario_QR (id_usuario, id_qr) VALUES (?, ?)`,
      [id_usuario, qr.id_qr]
    );

    // 4. Marcar QR como canjeado
    await db.query<OkPacket>(
      `UPDATE CodigosQR SET estado = 'Canjeado', fecha_canjeado = NOW() WHERE id_qr = ?`,
      [qr.id_qr]
    );

    // 5. Sumar botella en Usuario_Botellas
    await db.query<OkPacket>(
      `INSERT INTO Usuario_Botellas (id_usuario, botellas_contadas)
       VALUES (?, 1)
       ON DUPLICATE KEY UPDATE botellas_contadas = botellas_contadas + 1`,
      [id_usuario]
    );

    // 6. Obtener cuántas botellas tiene el usuario ahora
    const [[{ botellas_contadas }]] = await db.query<RowDataPacket[]>(
      `SELECT botellas_contadas FROM Usuario_Botellas WHERE id_usuario = ?`,
      [id_usuario]
    );

    // 7. Verificar tareas completables en orden de prioridad
    const [tareas] = await db.query<RowDataPacket[]>(
      `SELECT t.* FROM Tareas t
       LEFT JOIN Usuario_Tarea ut ON ut.id_tarea = t.id_tarea AND ut.id_usuario = ?
       WHERE ut.id_tarea IS NULL
       ORDER BY t.puntos DESC, t.id_tarea ASC`,
      [id_usuario]
    );

    for (const tarea of tareas) {
      if (botellas_contadas >= tarea.botellas_necesarias) {
        // Completar la tarea
        await db.query<OkPacket>(
          `INSERT INTO Usuario_Tarea (id_usuario, id_tarea, fecha_completada) VALUES (?, ?, NOW())`,
          [id_usuario, tarea.id_tarea]
        );

        await db.query<OkPacket>(
          `UPDATE Usuarios SET puntos_totales = puntos_totales + ? WHERE id_usuario = ?`,
          [tarea.puntos, id_usuario]
        );

        // Restar las botellas usadas
        await db.query<OkPacket>(
          `UPDATE Usuario_Botellas
           SET botellas_contadas = botellas_contadas - ?
           WHERE id_usuario = ?`,
          [tarea.botellas_necesarias, id_usuario]
        );

        return res.json({
          message: `¡Tarea completada automáticamente!`,
          tarea_completada: tarea.descripcion,
          botellas_restantes: botellas_contadas - tarea.botellas_necesarias
        });
      }
    }

    // Si no se completó tarea, solo sumar botella
    res.json({
      message: "Botella registrada. Sigue escaneando para completar tareas.",
      botellas_totales: botellas_contadas
    });

  } catch (error) {
    console.error("❌ Error en canjearQR:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
export const obtenerQRDisponible = async (req: Request, res: Response) => {
  try {
    const { id_tarea } = req.params;

    // 1. Verificar si la tarea existe
    const [tarea] = await db.query<RowDataPacket[]>(
      "SELECT * FROM Tareas WHERE id_tarea = ?",
      [id_tarea]
    );
    if (tarea.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // 2. Verificar cuántos QR quedan disponibles
    const [conteo] = await db.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS disponibles FROM CodigosQR WHERE id_tarea = ? AND estado = 'Generado'",
      [id_tarea]
    );
    const disponibles = conteo[0].disponibles;

    // 3. Si quedan menos de 10 → generar uno nuevo
    if (disponibles < 10) {
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const nuevoCodigo = Array.from({ length: 8 }, () =>
        caracteres.charAt(Math.floor(Math.random() * caracteres.length))
      ).join("");

      await db.query<OkPacket>(
        `INSERT INTO CodigosQR (id_tarea, codigo, estado, fecha_generado)
         VALUES (?, ?, 'Generado', NOW())`,
        [id_tarea, nuevoCodigo]
      );
    }

    // 4. Obtener un código QR disponible para esta tarea
    const [qr] = await db.query<RowDataPacket[]>(
      `SELECT * FROM CodigosQR WHERE id_tarea = ? AND estado = 'Generado' ORDER BY fecha_generado ASC LIMIT 1`,
      [id_tarea]
    );

    if (qr.length === 0) {
      return res.status(404).json({ message: "No hay códigos QR disponibles" });
    }

    res.json({
      message: "Código QR disponible",
      codigo: qr[0].codigo,
      id_qr: qr[0].id_qr,
      id_tarea: qr[0].id_tarea
    });

  } catch (error) {
    console.error("❌ Error al obtener QR disponible:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
