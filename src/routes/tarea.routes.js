"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tarea_controller_1 = require("../controllers/tarea.controller");
const router = (0, express_1.Router)();
router.get("/tareas", tarea_controller_1.getTareas);
router.get("/tareas/:id", tarea_controller_1.getTareaById);
router.get("/tareas/usuario/:id_usuario", tarea_controller_1.getTareasByUsuario);
router.get("/tareas/pendientes/:id_usuario", tarea_controller_1.getTareasPendientes); // <-- Tareas que aún no ha completado
router.get("/tareas/completadas/:id_usuario", tarea_controller_1.getTareasCompletadas); // <-- Tareas que ya completó
router.post("/tareas", tarea_controller_1.createTarea);
router.put("/tareas/:id", tarea_controller_1.updateTarea);
router.delete("/tareas/:id", tarea_controller_1.deleteTarea);
router.patch("/tareas/:id/especial", tarea_controller_1.makeTareaEspecial);
exports.default = router;
