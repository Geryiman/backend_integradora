"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTareasByUsuario = exports.getTareasPendientes = exports.getTareasCompletadas = exports.makeTareaEspecial = exports.deleteTarea = exports.updateTarea = exports.createTarea = exports.getTareaById = exports.getTareas = void 0;
const tarea_model_1 = require("../models/tarea.model");
// 📌 Obtener todas las tareas
const getTareas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tareas = yield tarea_model_1.TareaModel.getAllTareas();
        res.json(tareas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTareas = getTareas;
// 📌 Obtener tarea por ID
const getTareaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tarea = yield tarea_model_1.TareaModel.getTareaById(Number(id));
        if (!tarea) {
            res.status(404).json({ error: "Tarea no encontrada" });
            return;
        }
        res.json(tarea);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTareaById = getTareaById;
// 📌 Crear nueva tarea
const createTarea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { descripcion, puntos, tipo, fecha_inicio, fecha_fin } = req.body;
        const nueva = yield tarea_model_1.TareaModel.createTarea(descripcion, puntos, tipo, fecha_inicio, fecha_fin);
        res.status(201).json(nueva);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createTarea = createTarea;
// 📌 Actualizar tarea
const updateTarea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { descripcion, puntos, tipo, fecha_inicio, fecha_fin } = req.body;
        const actualizada = yield tarea_model_1.TareaModel.updateTarea(Number(id), descripcion, puntos, tipo, fecha_inicio, fecha_fin);
        res.json(actualizada);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateTarea = updateTarea;
// 📌 Eliminar tarea
const deleteTarea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resultado = yield tarea_model_1.TareaModel.deleteTarea(Number(id));
        res.json(resultado);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteTarea = deleteTarea;
// 📌 Convertir en tarea especial
const makeTareaEspecial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin } = req.body;
        const resultado = yield tarea_model_1.TareaModel.makeTareaEspecial(Number(id), fecha_inicio, fecha_fin);
        res.json(resultado);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.makeTareaEspecial = makeTareaEspecial;
// 📌 Obtener tareas completadas por usuario
const getTareasCompletadas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        const tareas = yield tarea_model_1.TareaModel.getTareasCompletadas(Number(id_usuario));
        if (!tareas.length) {
            res.status(404).json({ error: "No hay tareas completadas para este usuario" });
            return;
        }
        res.json(tareas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTareasCompletadas = getTareasCompletadas;
// 📌 Obtener tareas pendientes por usuario
const getTareasPendientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        const tareas = yield tarea_model_1.TareaModel.getTareasPendientes(Number(id_usuario));
        if (!tareas.length) {
            res.status(404).json({ error: "No hay tareas pendientes para este usuario" });
            return;
        }
        res.json(tareas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTareasPendientes = getTareasPendientes;
// 📌 Obtener tareas por usuario (todas las que ha hecho)
const getTareasByUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        const tareas = yield tarea_model_1.TareaModel.getTareasByUsuario(Number(id_usuario));
        if (!tareas.length) {
            res.status(404).json({ error: "No se encontraron tareas para este usuario" });
            return;
        }
        res.json(tareas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTareasByUsuario = getTareasByUsuario;
