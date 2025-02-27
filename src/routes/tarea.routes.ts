import { Router } from "express";
import {
  getTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
  makeTareaEspecial
} from "../controllers/tarea.controller";

const router = Router();

router.get("/tareas", getTareas);
router.get("/tareas/:id", getTareaById);
router.post("/tareas", createTarea);
router.put("/tareas/:id", updateTarea);
router.delete("/tareas/:id", deleteTarea);
router.patch("/tareas/:id/especial", makeTareaEspecial);

export default router;
