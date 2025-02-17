import { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getCanjes = (req: Request, res: Response) => {
  connection.query("SELECT * FROM Canjes", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createCanje = (req: Request, res: Response) => {
  const { id_usuario, id_recompensa } = req.body;

  connection.query(
    "INSERT INTO Canjes (id_usuario, id_recompensa) VALUES (?, ?)",
    [id_usuario, id_recompensa],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const result = results as ResultSetHeader;
      res.json({ message: "Canje registrado", id: result.insertId });
    }
  );
};
