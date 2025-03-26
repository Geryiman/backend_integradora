import { Request, Response } from "express";
import pool from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getDepositos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Depositos");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createDeposito = async (req: Request, res: Response) => {
  const { id_usuario, peso_basura, total_puntos } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO Depositos (id_usuario, peso_basura, total_puntos) VALUES (?, ?, ?)",
      [id_usuario, peso_basura, total_puntos]
    );

    const insert = result as ResultSetHeader;
    res.json({ message: "Depósito registrado", id: insert.insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
