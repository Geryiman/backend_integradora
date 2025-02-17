import { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getDepositos = (req: Request, res: Response) => {
  connection.query("SELECT * FROM Depositos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createDeposito = (req: Request, res: Response) => {
  const { id_usuario, peso_basura, total_puntos } = req.body;

  connection.query(
    "INSERT INTO Depositos (id_usuario, peso_basura, total_puntos) VALUES (?, ?, ?)",
    [id_usuario, peso_basura, total_puntos],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const result = results as ResultSetHeader;
      res.json({ message: "Depósito registrado", id: result.insertId });
    }
  );
};
