import { Request, Response } from "express";
import pool from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getCanjes = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Canjes");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createCanje = async (req: Request, res: Response) => {
  const { id_usuario, id_recompensa } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO Canjes (id_usuario, id_recompensa) VALUES (?, ?)",
      [id_usuario, id_recompensa]
    );

    const insert = result as ResultSetHeader;
    res.json({ message: "Canje registrado", id: insert.insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
