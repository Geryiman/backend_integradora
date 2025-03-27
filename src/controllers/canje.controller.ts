import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// 📥 Obtener todos los canjes
export const getCanjes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query("SELECT * FROM Canjes");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Crear nuevo canje
export const createCanje = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, id_recompensa, id_qr } = req.body;

  if (!id_usuario || !id_recompensa || !id_qr) {
    res.status(400).json({ error: "Faltan datos requeridos" });
    return;
  }

  try {
    // 1. Obtener puntos del usuario y recompensa
    const [[usuario]] = await pool.query<RowDataPacket[]>(
      "SELECT puntos_totales FROM Usuarios WHERE id_usuario = ?",
      [id_usuario]
    );
    const [[recompensa]] = await pool.query<RowDataPacket[]>(
      "SELECT puntos_necesarios, stock FROM Recompensas WHERE id_recompensa = ?",
      [id_recompensa]
    );

    if (!usuario || !recompensa) {
      res.status(404).json({ error: "Usuario o recompensa no encontrada" });
      return;
    }

    if (usuario.puntos_totales < recompensa.puntos_necesarios) {
      res.status(400).json({ error: "Puntos insuficientes para canjear esta recompensa" });
      return;
    }

    if (recompensa.stock <= 0) {
      res.status(400).json({ error: "Recompensa agotada" });
      return;
    }

    // 2. Insertar canje
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Canjes (id_usuario, id_recompensa, id_qr) VALUES (?, ?, ?)",
      [id_usuario, id_recompensa, id_qr]
    );

    // 3. Descontar puntos al usuario
    await pool.query(
      "UPDATE Usuarios SET puntos_totales = puntos_totales - ? WHERE id_usuario = ?",
      [recompensa.puntos_necesarios, id_usuario]
    );

    // 4. Registrar en historial
    await pool.query(
      `INSERT INTO Historial (id_usuario, tipo_actividad, id_canje, descripcion, puntos_ganados)
       VALUES (?, 'Canje de Recompensa', ?, ?, ?)`,
      [
        id_usuario,
        result.insertId,
        `Canjeó recompensa ID ${id_recompensa}`,
        -recompensa.puntos_necesarios
      ]
    );

    // 5. Reducir stock
    await pool.query(
      "UPDATE Recompensas SET stock = stock - 1 WHERE id_recompensa = ?",
      [id_recompensa]
    );

    // 6. Eliminar recompensa si ya no hay stock
    await pool.query(
      "DELETE FROM Recompensas WHERE id_recompensa = ? AND stock <= 0",
      [id_recompensa]
    );

    res.status(201).json({
      message: "Canje exitoso",
      id_canje: result.insertId,
      puntos_usados: recompensa.puntos_necesarios
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener canjes por usuario
export const getCanjesByUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, r.nombre AS nombre_recompensa
       FROM Canjes c
       JOIN Recompensas r ON c.id_recompensa = r.id_recompensa
       WHERE c.id_usuario = ?
       ORDER BY c.fecha_canje DESC`,
      [id_usuario]
    );

    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
