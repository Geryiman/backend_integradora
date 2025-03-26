import { Router } from "express";
import {
  getTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  makeTareaEspecial,
  getTareasByUsuario,
  getTareasPendientes,
  getTareasCompletadas // <-- Agregamos la nueva función
} from "../controllers/tarea.controller";

const router = Router();

router.get("/tareas", getTareas);
router.get("/tareas/:id", getTareaById);
router.get("/tareas/usuario/:id_usuario", getTareasByUsuario);
router.get("/tareas/pendientes/:id_usuario", getTareasPendientes); // <-- Tareas que aún no ha completado
router.get("/tareas/completadas/:id_usuario", getTareAasCompletadas); // <-- Tareas que ya completó
router.post("/tareas", createTarea);
router.put("/tareas/:id", updateTarea);
router.delete("/tareas/:id", deleteTarea);
router.patch("/tareas/:id/especial", makeTareaEspecial);

export default router;
