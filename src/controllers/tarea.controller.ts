import { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader } from "mysql2";

export const getTareas = (req: Request, res: Response) => {
  connection.query("SELECT * FROM Tareas", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createTarea = (req: Request, res: Response) => {
  const { descripcion, puntos } = req.body;

  connection.query(
    "INSERT INTO Tareas (descripcion, puntos) VALUES (?, ?)",
    [descripcion, puntos],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const result = results as ResultSetHeader;
      res.json({ message: "Tarea creada", id: result.insertId });
    }
  );
};
