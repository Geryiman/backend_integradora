import { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getRecompensas = (req: Request, res: Response) => {
  connection.query("SELECT * FROM Recompensas", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createRecompensa = (req: Request, res: Response) => {
  const { nombre, puntos_necesarios } = req.body;

  connection.query(
    "INSERT INTO Recompensas (nombre, puntos_necesarios) VALUES (?, ?)",
    [nombre, puntos_necesarios],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const result = results as ResultSetHeader;
      res.json({ message: "Recompensa creada", id: result.insertId });
    }
  );
};
