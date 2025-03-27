import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// 📌 Obtener todas las recompensas (opcionalmente filtrar por nombre)
export const getRecompensas = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.query;

    let query = "SELECT * FROM Recompensas";
    let params: any[] = [];

    if (nombre) {
      query += " WHERE nombre LIKE ?";
      params.push(`%${nombre}%`);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener recompensa por ID
export const getRecompensaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Recompensas WHERE id_recompensa = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Recompensa no encontrada" });
    }

    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Crear nueva recompensa
export const createRecompensa = async (req: Request, res: Response) => {
  const { nombre, puntos_necesarios } = req.body;

  if (!nombre || typeof puntos_necesarios !== "number" || puntos_necesarios <= 0) {
    return res.status(400).json({ error: "Datos inválidos para crear recompensa" });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Recompensas (nombre, puntos_necesarios) VALUES (?, ?)",
      [nombre, puntos_necesarios]
    );

    res.status(201).json({
      message: "Recompensa creada con éxito",
      id_recompensa: result.insertId,
      nombre,
      puntos_necesarios
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Actualizar recompensa
export const updateRecompensa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, puntos_necesarios } = req.body;

  if (!nombre || typeof puntos_necesarios !== "number" || puntos_necesarios <= 0) {
    return res.status(400).json({ error: "Datos inválidos para actualizar recompensa" });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE Recompensas 
       SET nombre = ?, puntos_necesarios = ? 
       WHERE id_recompensa = ?`,
      [nombre, puntos_necesarios, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Recompensa no encontrada" });
    }

    res.json({ message: "Recompensa actualizada", id_recompensa: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Eliminar recompensa
export const deleteRecompensa = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM Recompensas WHERE id_recompensa = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Recompensa no encontrada" });
    }

    res.json({ message: "Recompensa eliminada correctamente", id_recompensa: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
