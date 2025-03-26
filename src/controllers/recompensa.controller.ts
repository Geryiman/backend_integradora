import { Request, Response } from "express";
import pool from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getRecompensas = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Recompensas");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createRecompensa = async (req: Request, res: Response) => {
  const { nombre, puntos_necesarios } = req.body;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Recompensas (nombre, puntos_necesarios) VALUES (?, ?)",
      [nombre, puntos_necesarios]
    );

    res.json({ message: "Recompensa creada", id: result.insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
