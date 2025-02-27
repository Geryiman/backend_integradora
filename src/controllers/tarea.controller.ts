import { Request, Response } from "express";
import { TareaModel } from "../models/tarea.model";

// Obtener todas las tareas
export const getTareas = async (req: Request, res: Response) => {
  try {
    const tareas = await TareaModel.getAllTareas();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las tareas" });
  }
};

// Obtener una tarea por ID
export const getTareaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tarea = await TareaModel.getTareaById(Number(id));
    if (!tarea) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la tarea" });
  }
};

// Crear una nueva tarea
export const createTarea = async (req: Request, res: Response) => {
  try {
    const { descripcion, puntos, tipo, fecha_inicio, fecha_fin } = req.body;
    const nuevaTarea = await TareaModel.createTarea(descripcion, puntos, tipo, fecha_inicio, fecha_fin);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la tarea" });
  }
};

// Actualizar una tarea
export const updateTarea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { descripcion, puntos, tipo, fecha_inicio, fecha_fin } = req.body;
    const tareaActualizada = await TareaModel.updateTarea(Number(id), descripcion, puntos, tipo, fecha_inicio, fecha_fin);
    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
};

// Eliminar una tarea
export const deleteTarea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await TareaModel.deleteTarea(Number(id));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
};

// Convertir una tarea en especial
export const makeTareaEspecial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin } = req.body;
    const resultado = await TareaModel.makeTareaEspecial(Number(id), fecha_inicio, fecha_fin);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al modificar la tarea" });
  }
};
