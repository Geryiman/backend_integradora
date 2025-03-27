import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const getRecompensas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.query;
    let query = "SELECT * FROM Recompensas";
    const params: any[] = [];

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

export const getRecompensaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Recompensas WHERE id_recompensa = ?",
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Recompensa no encontrada" });
      return;
    }

    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createRecompensa = async (req: Request, res: Response): Promise<void> => {
  const { nombre, puntos_necesarios } = req.body;

  if (!nombre || typeof puntos_necesarios !== "number" || puntos_necesarios <= 0) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Recompensas (nombre, puntos_necesarios) VALUES (?, ?)",
      [nombre, puntos_necesarios]
    );

    res.status(201).json({
      message: "Recompensa creada",
      id_recompensa: result.insertId,
      nombre,
      puntos_necesarios
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRecompensa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, puntos_necesarios } = req.body;

  if (!nombre || typeof puntos_necesarios !== "number" || puntos_necesarios <= 0) {
    res.status(400).json({ error: "Datos inválidos para actualizar" });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE Recompensas SET nombre = ?, puntos_necesarios = ? WHERE id_recompensa = ?`,
      [nombre, puntos_necesarios, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Recompensa no encontrada" });
      return;
    }

    res.json({ message: "Recompensa actualizada", id_recompensa: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRecompensa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM Recompensas WHERE id_recompensa = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Recompensa no encontrada" });
      return;
    }

    res.json({ message: "Recompensa eliminada", id_recompensa: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
