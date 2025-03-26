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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareaModel = void 0;
const db_1 = __importDefault(require("../config/db"));
class TareaModel {
    static getAllTareas() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.default.query("SELECT * FROM Tareas");
            return rows;
        });
    }
    static getTareaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.default.query("SELECT * FROM Tareas WHERE id_tarea = ?", [id]);
            return rows[0] || null;
        });
    }
    static createTarea(descripcion, puntos, tipo, fecha_inicio, fecha_fin) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_1.default.query(`INSERT INTO Tareas (descripcion, puntos, tipo, fecha_inicio, fecha_fin)
       VALUES (?, ?, ?, ?, ?)`, [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null]);
            return { id_tarea: result.insertId, descripcion, puntos, tipo, fecha_inicio, fecha_fin };
        });
    }
    static updateTarea(id, descripcion, puntos, tipo, fecha_inicio, fecha_fin) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.query(`UPDATE Tareas SET descripcion = ?, puntos = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?
       WHERE id_tarea = ?`, [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null, id]);
            return { message: "Tarea actualizada correctamente", id_tarea: id };
        });
    }
    static deleteTarea(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.query("DELETE FROM Tareas WHERE id_tarea = ?", [id]);
            return { message: "Tarea eliminada correctamente", id_tarea: id };
        });
    }
    static makeTareaEspecial(id, fecha_inicio, fecha_fin) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.query(`UPDATE Tareas SET tipo = 'Especial', fecha_inicio = ?, fecha_fin = ?
       WHERE id_tarea = ?`, [fecha_inicio, fecha_fin, id]);
            return { message: "Tarea convertida en especial correctamente", id_tarea: id };
        });
    }
    static getTareasByUsuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.default.query(`SELECT t.*
       FROM Tareas t
       JOIN Usuario_Tarea ut ON t.id_tarea = ut.id_tarea
       WHERE ut.id_usuario = ?`, [id_usuario]);
            return rows;
        });
    }
    static getTareasPendientes(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.default.query(`SELECT t.*
       FROM Tareas t
       WHERE t.id_tarea NOT IN (
         SELECT id_tarea FROM Usuario_Tarea WHERE id_usuario = ?
       )`, [id_usuario]);
            return rows;
        });
    }
    static getTareasCompletadas(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_1.default.query(`SELECT t.*, ut.fecha_completada
       FROM Tareas t
       JOIN Usuario_Tarea ut ON t.id_tarea = ut.id_tarea
       WHERE ut.id_usuario = ?`, [id_usuario]);
            return rows;
        });
    }
}
exports.TareaModel = TareaModel;
