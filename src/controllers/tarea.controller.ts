import { Request, Response } from "express";
import { TareaModel } from "../models/tarea.model";

// 📌 Obtener todas las tareas
export const getTareas = async (_req: Request, res: Response) => {
  try {
    const tareas = await TareaModel.getAllTareas();
    res.json(tareas);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener tarea por ID
export const getTareaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tarea = await TareaModel.getTareaById(Number(id));
    if (!tarea) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }
    res.json(tarea);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Crear nueva tarea
export const createTarea = async (req: Request, res: Response) => {
  try {
    const { descripcion, puntos, tipo, fecha_inicio, fecha_fin, botellas_necesarias } = req.body;
    const nueva = await TareaModel.createTarea(
      descripcion,
      puntos,
      tipo,
      fecha_inicio,
      fecha_fin,
      botellas_necesarias
    );
    res.status(201).json(nueva);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Actualizar tarea
export const updateTarea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { descripcion, puntos, tipo, fecha_inicio, fecha_fin, botellas_necesarias } = req.body;
    const actualizada = await TareaModel.updateTarea(
      Number(id),
      descripcion,
      puntos,
      tipo,
      fecha_inicio,
      fecha_fin,
      botellas_necesarias
    );
    res.json(actualizada);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Eliminar tarea
export const deleteTarea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await TareaModel.deleteTarea(Number(id));
    res.json(resultado);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Convertir en tarea especial
export const makeTareaEspecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin } = req.body;
    const resultado = await TareaModel.makeTareaEspecial(Number(id), fecha_inicio, fecha_fin);
    res.json(resultado);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener tareas completadas por usuario
export const getTareasCompletadas = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;
    const tareas = await TareaModel.getTareasCompletadas(Number(id_usuario));

    // ✅ Siempre devolver 200 OK, aunque esté vacío
    res.status(200).json(tareas); // <--- ya no mandamos 404
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


// 📌 Obtener tareas pendientes por usuario
export const getTareasPendientes = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;
    const tareas = await TareaModel.getTareasPendientes(Number(id_usuario));
    if (!tareas.length) {
      res.status(404).json({ error: "No hay tareas pendientes para este usuario" });
      return;
    }
    res.json(tareas);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener tareas por usuario (todas las que ha hecho)
export const getTareasByUsuario = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;
    const tareas = await TareaModel.getTareasByUsuario(Number(id_usuario));
    if (!tareas.length) {
      res.status(404).json({ error: "No se encontraron tareas para este usuario" });
      return;
    }
    res.json(tareas);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
