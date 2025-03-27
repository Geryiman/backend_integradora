import { Request, Response } from "express";
import pool from "../config/db";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";


// 📥 Obtener todos los depósitos
export const getDepositos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query("SELECT * FROM Depositos");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Crear nuevo depósito (NO suma puntos, solo registro)
export const createDeposito = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, peso_basura } = req.body;

  if (!id_usuario || !peso_basura || isNaN(peso_basura) || peso_basura <= 0) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Depositos (id_usuario, peso_basura) VALUES (?, ?)",
      [id_usuario, peso_basura]
    );

    res.status(201).json({
      message: "Depósito registrado correctamente",
      id_deposito: result.insertId
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
// 📌 Obtener depósitos por usuario
export const getDepositosByUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Depositos WHERE id_usuario = ? ORDER BY fecha_hora DESC",
      [id_usuario]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener resumen de kilos reciclados por usuario
export const getResumenDepositos = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         id_usuario, 
         COUNT(*) AS total_depositos, 
         SUM(peso_basura) AS kilos_totales 
       FROM Depositos 
       WHERE id_usuario = ?`,
      [id_usuario]
    );

    res.json(rows[0]); // ✅ Ya no marcará error
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

