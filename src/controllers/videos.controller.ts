import { Request, Response } from "express";
import pool from "../config/db"; // Ya está usando createPool()

// ✅ Obtener todos los videos
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query("SELECT * FROM Videos");
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo videos:", error);
    res.status(500).json({ message: "Error obteniendo los videos." });
  }
};

// ✅ Registrar que un usuario vio un video completamente
export const markVideoAsWatched = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario, id_video } = req.body;

  if (!id_usuario || !id_video) {
    res.status(400).json({ message: "Faltan datos obligatorios." });
    return;
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM Usuario_Videos WHERE id_usuario = ? AND id_video = ?",
      [id_usuario, id_video]
    ) as any[];

    if (existing.length > 0) {
      res.status(400).json({ message: "Ya viste este video y no puedes obtener más puntos por él." });
      return;
    }

    const [video] = await pool.query(
      "SELECT puntos FROM Videos WHERE id_video = ?",
      [id_video]
    ) as any[];

    if (video.length === 0) {
      res.status(404).json({ message: "Video no encontrado." });
      return;
    }

    const puntos = video[0].puntos;

    await pool.query(
      "INSERT INTO Usuario_Videos (id_usuario, id_video) VALUES (?, ?)",
      [id_usuario, id_video]
    );

    await pool.query(
      "UPDATE Usuarios SET puntos_totales = puntos_totales + ? WHERE id_usuario = ?",
      [puntos, id_usuario]
    );

    res.json({ message: `Has ganado ${puntos} puntos por ver este video.` });
  } catch (error) {
    console.error("Error registrando visualización de video:", error);
    res.status(500).json({ message: "Error interno al registrar el video visto." });
  }
};

// ✅ Agregar nuevo video
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

// ✅ Actualizar video
export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  const { id_video } = req.params;
  const { titulo, url_video, descripcion, puntos } = req.body;

  if (!titulo || !url_video || !descripcion || !puntos) {
    res.status(400).json({ message: "Todos los campos son obligatorios." });
    return;
  }

  try {
    const [result] = await pool.query(
      "UPDATE Videos SET titulo = ?, url_video = ?, descripcion = ?, puntos = ? WHERE id_video = ?",
      [titulo, url_video, descripcion, puntos, id_video]
    ) as any[];

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

// ✅ Eliminar video
export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  const { id_video } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM Videos WHERE id_video = ?",
      [id_video]
    ) as any[];

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
