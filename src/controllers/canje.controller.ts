import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// 📌 Obtener todos los canjes
export const getCanjes = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute("SELECT * FROM Canjes");
    res.json(rows as RowDataPacket[]);
  } catch (error) {
    console.error("❌ Error en getCanjes:", error);
    res.status(500).json({ error: "Error al obtener los canjes." });
  }
};

// 📌 Obtener un canje por ID
export const getCanjeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID de canje inválido." });
    return;
  }

  try {
    const [rows] = await db.execute("SELECT * FROM Canjes WHERE id_canje = ?", [id]);

    if ((rows as RowDataPacket[]).length === 0) {
      res.status(404).json({ error: "Canje no encontrado." });
      return;
    }

    res.json((rows as RowDataPacket[])[0]);
  } catch (error) {
    console.error("❌ Error en getCanjeById:", error);
    res.status(500).json({ error: "Error al obtener el canje." });
  }
};

// 📌 Obtener todos los canjes de un usuario específico
export const getCanjesByUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  if (isNaN(Number(id_usuario))) {
    res.status(400).json({ error: "ID de usuario inválido." });
    return;
  }

  try {
    const [rows] = await db.execute("SELECT * FROM Canjes WHERE id_usuario = ?", [id_usuario]);

    if ((rows as RowDataPacket[]).length === 0) {
      res.status(404).json({ error: "No se encontraron canjes para este usuario." });
      return;
    }

    res.json(rows as RowDataPacket[]);
  } catch (error) {
    console.error("❌ Error en getCanjesByUsuario:", error);
    res.status(500).json({ error: "Error al obtener los canjes del usuario." });
  }
};

// 📌 Crear un nuevo canje
export const createCanje = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, id_recompensa } = req.body;

  if (!id_usuario || !id_recompensa) {
    res.status(400).json({ error: "Datos inválidos. Todos los campos son obligatorios." });
    return;
  }

  try {
    const [results] = await db.execute(
      "INSERT INTO Canjes (id_usuario, id_recompensa) VALUES (?, ?)",
      [id_usuario, id_recompensa]
    );

    const result = results as ResultSetHeader;
    res.status(201).json({ message: "Canje registrado con éxito.", id: result.insertId });
  } catch (error) {
    console.error("❌ Error en createCanje:", error);
    res.status(500).json({ error: "Error al registrar el canje." });
  }
};

// 📌 Eliminar un canje
export const deleteCanje = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID de canje inválido." });
    return;
  }

  try {
    const [results] = await db.execute("DELETE FROM Canjes WHERE id_canje = ?", [id]);
    const result = results as ResultSetHeader;

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Canje no encontrado." });
      return;
    }

    res.json({ message: "Canje eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error en deleteCanje:", error);
    res.status(500).json({ error: "Error al eliminar el canje." });
  }
};
