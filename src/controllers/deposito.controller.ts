import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// 📌 Obtener todos los depósitos
export const getDepositos = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute("SELECT * FROM Depositos");
    res.json(rows as RowDataPacket[]);
  } catch (error) {
    console.error("❌ Error en getDepositos:", error);
    res.status(500).json({ error: "Error al obtener los depósitos." });
  }
};

// 📌 Crear un nuevo depósito
export const createDeposito = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, peso_basura, total_puntos } = req.body;

  if (!id_usuario || isNaN(peso_basura) || isNaN(total_puntos)) {
    res.status(400).json({ error: "Datos inválidos. Todos los campos son obligatorios y deben ser numéricos." });
    return;
  }

  try {
    const [results] = await db.execute(
      "INSERT INTO Depositos (id_usuario, peso_basura, total_puntos) VALUES (?, ?, ?)",
      [id_usuario, peso_basura, total_puntos]
    );

    const result = results as ResultSetHeader;
    res.status(201).json({ message: "Depósito registrado con éxito.", id: result.insertId });

  } catch (error) {
    console.error("❌ Error en createDeposito:", error);
    res.status(500).json({ error: "Error al registrar el depósito." });
  }
};

// 📌 Obtener depósitos por usuario
export const getDepositosByUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  if (isNaN(Number(id_usuario))) {
    res.status(400).json({ error: "ID de usuario inválido." });
    return;
  }

  try {
    const [rows] = await db.execute("SELECT * FROM Depositos WHERE id_usuario = ?", [id_usuario]);

    if ((rows as RowDataPacket[]).length === 0) {
      res.status(404).json({ error: "No se encontraron depósitos para este usuario." });
      return;
    }

    res.json(rows as RowDataPacket[]);

  } catch (error) {
    console.error("❌ Error en getDepositosByUsuario:", error);
    res.status(500).json({ error: "Error al obtener los depósitos del usuario." });
  }
};

// 📌 Eliminar un depósito
export const deleteDeposito = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID de depósito inválido." });
    return;
  }

  try {
    const [results] = await db.execute("DELETE FROM Depositos WHERE id_deposito = ?", [id]);
    const result = results as ResultSetHeader;

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Depósito no encontrado." });
      return;
    }

    res.json({ message: "Depósito eliminado correctamente." });

  } catch (error) {
    console.error("❌ Error en deleteDeposito:", error);
    res.status(500).json({ error: "Error al eliminar el depósito." });
  }
};
