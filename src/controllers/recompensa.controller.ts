import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// 📌 Obtener todas las recompensas
export const getRecompensas = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute("SELECT * FROM Recompensas");
    res.json(rows as RowDataPacket[]);
  } catch (error) {
    console.error("❌ Error en getRecompensas:", error);
    res.status(500).json({ error: "Error al obtener las recompensas." });
  }
};

// 📌 Obtener una recompensa por ID
export const getRecompensaById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID de recompensa inválido." });
    return;
  }

  try {
    const [rows] = await db.execute("SELECT * FROM Recompensas WHERE id_recompensa = ?", [id]);

    if ((rows as RowDataPacket[]).length === 0) {
      res.status(404).json({ error: "Recompensa no encontrada." });
      return;
    }

    res.json((rows as RowDataPacket[])[0]);
  } catch (error) {
    console.error("❌ Error en getRecompensaById:", error);
    res.status(500).json({ error: "Error al obtener la recompensa." });
  }
};

// 📌 Crear una nueva recompensa
export const createRecompensa = async (req: Request, res: Response): Promise<void> => {
  const { nombre, puntos_necesarios } = req.body;

  if (!nombre || isNaN(puntos_necesarios)) {
    res.status(400).json({ error: "Datos inválidos. Todos los campos son obligatorios." });
    return;
  }

  try {
    const [results] = await db.execute(
      "INSERT INTO Recompensas (nombre, puntos_necesarios) VALUES (?, ?)",
      [nombre, puntos_necesarios]
    );

    const result = results as ResultSetHeader;
    res.status(201).json({ message: "Recompensa creada con éxito.", id: result.insertId });
  } catch (error) {
    console.error("❌ Error en createRecompensa:", error);
    res.status(500).json({ error: "Error al crear la recompensa." });
  }
};

// 📌 Actualizar una recompensa
export const updateRecompensa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, puntos_necesarios } = req.body;

  if (isNaN(Number(id)) || !nombre || isNaN(puntos_necesarios)) {
    res.status(400).json({ error: "Datos inválidos. Todos los campos son obligatorios." });
    return;
  }

  try {
    const [results] = await db.execute(
      "UPDATE Recompensas SET nombre = ?, puntos_necesarios = ? WHERE id_recompensa = ?",
      [nombre, puntos_necesarios, id]
    );

    const result = results as ResultSetHeader;

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Recompensa no encontrada." });
      return;
    }

    res.json({ message: "Recompensa actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error en updateRecompensa:", error);
    res.status(500).json({ error: "Error al actualizar la recompensa." });
  }
};

// 📌 Eliminar una recompensa
export const deleteRecompensa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID de recompensa inválido." });
    return;
  }

  try {
    const [results] = await db.execute("DELETE FROM Recompensas WHERE id_recompensa = ?", [id]);
    const result = results as ResultSetHeader;

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Recompensa no encontrada." });
      return;
    }

    res.json({ message: "Recompensa eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error en deleteRecompensa:", error);
    res.status(500).json({ error: "Error al eliminar la recompensa." });
  }
};
