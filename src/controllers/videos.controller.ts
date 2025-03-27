import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// 📥 Obtener todos los videos
export const getVideos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Videos");
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo videos:", error);
    res.status(500).json({ message: "Error obteniendo los videos." });
  }
};

// ✅ Registrar que un usuario vio un video completo
export const markVideoAsWatched = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, id_video } = req.body;

  if (!id_usuario || !id_video) {
    res.status(400).json({ message: "Faltan datos obligatorios." });
    return;
  }

  try {
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Usuario_Videos WHERE id_usuario = ? AND id_video = ?",
      [id_usuario, id_video]
    );

    if (existing.length > 0) {
      res.status(400).json({ message: "Ya viste este video." });
      return;
    }

    const [[video]] = await pool.query<RowDataPacket[]>(
      "SELECT puntos FROM Videos WHERE id_video = ?",
      [id_video]
    );

    if (!video) {
      res.status(404).json({ message: "Video no encontrado." });
      return;
    }

    const puntos = video.puntos;

    // Registrar visualización
    await pool.query("INSERT INTO Usuario_Videos (id_usuario, id_video) VALUES (?, ?)", [
      id_usuario,
      id_video,
    ]);

    // Sumar puntos
    await pool.query(
      "UPDATE Usuarios SET puntos_totales = puntos_totales + ? WHERE id_usuario = ?",
      [puntos, id_usuario]
    );

    // Registrar en historial (opcional pero útil)
    await pool.query(
      `INSERT INTO Historial (id_usuario, tipo_actividad, id_video, descripcion, puntos_ganados)
       VALUES (?, 'Video Visto', ?, ?, ?)`,
      [id_usuario, id_video, `Vió video educativo`, puntos]
    );

    res.json({ message: `Has ganado ${puntos} puntos por ver este video.` });
  } catch (error) {
    console.error("Error registrando visualización de video:", error);
    res.status(500).json({ message: "Error interno al registrar el video visto." });
  }
};

// ✅ Agregar nuevo video educativo
export const addVideo = async (req: Request, res: Response): Promise<void> => {
  const { titulo, url_video, descripcion, puntos } = req.body;

  if (!titulo || !url_video || !descripcion || !puntos) {
    res.status(400).json({ message: "Todos los campos son obligatorios." });
    return;
  }

  try {
    await pool.query(
      "INSERT INTO Videos (titulo, url_video, descripcion, puntos) VALUES (?, ?, ?, ?)",
      [titulo, url_video, descripcion, puntos]
    );

    res.status(201).json({ message: "Video agregado correctamente." });
  } catch (error) {
    console.error("Error agregando video:", error);
    res.status(500).json({ message: "Error interno al agregar el video." });
  }
};

// ✅ Actualizar un video existente
export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  const { id_video } = req.params;
  const { titulo, url_video, descripcion, puntos } = req.body;

  if (!titulo || !url_video || !descripcion || !puntos) {
    res.status(400).json({ message: "Todos los campos son obligatorios." });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE Videos SET titulo = ?, url_video = ?, descripcion = ?, puntos = ? WHERE id_video = ?",
      [titulo, url_video, descripcion, puntos, id_video]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No se encontró el video para actualizar." });
      return;
    }

    res.json({ message: "Video actualizado correctamente." });
  } catch (error) {
    console.error("Error actualizando video:", error);
    res.status(500).json({ message: "Error interno al actualizar el video." });
  }
};

// ✅ Eliminar un video
export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  const { id_video } = req.params;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM Videos WHERE id_video = ?",
      [id_video]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No se encontró el video para eliminar." });
      return;
    }

    res.json({ message: "Video eliminado correctamente." });
  } catch (error) {
    console.error("Error eliminando video:", error);
    res.status(500).json({ message: "Error interno al eliminar el video." });
  }
};
