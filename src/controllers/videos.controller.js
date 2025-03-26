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
exports.deleteVideo = exports.updateVideo = exports.addVideo = exports.markVideoAsWatched = exports.getVideos = void 0;
const db_1 = __importDefault(require("../config/db")); // Ya está usando createPool()
// ✅ Obtener todos los videos
const getVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query("SELECT * FROM Videos");
        res.json(rows);
    }
    catch (error) {
        console.error("Error obteniendo videos:", error);
        res.status(500).json({ message: "Error obteniendo los videos." });
    }
});
exports.getVideos = getVideos;
// ✅ Registrar que un usuario vio un video completamente
const markVideoAsWatched = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario, id_video } = req.body;
    if (!id_usuario || !id_video) {
        res.status(400).json({ message: "Faltan datos obligatorios." });
        return;
    }
    try {
        const [existing] = yield db_1.default.query("SELECT * FROM Usuario_Videos WHERE id_usuario = ? AND id_video = ?", [id_usuario, id_video]);
        if (existing.length > 0) {
            res.status(400).json({ message: "Ya viste este video y no puedes obtener más puntos por él." });
            return;
        }
        const [video] = yield db_1.default.query("SELECT puntos FROM Videos WHERE id_video = ?", [id_video]);
        if (video.length === 0) {
            res.status(404).json({ message: "Video no encontrado." });
            return;
        }
        const puntos = video[0].puntos;
        yield db_1.default.query("INSERT INTO Usuario_Videos (id_usuario, id_video) VALUES (?, ?)", [id_usuario, id_video]);
        yield db_1.default.query("UPDATE Usuarios SET puntos_totales = puntos_totales + ? WHERE id_usuario = ?", [puntos, id_usuario]);
        res.json({ message: `Has ganado ${puntos} puntos por ver este video.` });
    }
    catch (error) {
        console.error("Error registrando visualización de video:", error);
        res.status(500).json({ message: "Error interno al registrar el video visto." });
    }
});
exports.markVideoAsWatched = markVideoAsWatched;
// ✅ Agregar nuevo video
const addVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, url_video, descripcion, puntos } = req.body;
    if (!titulo || !url_video || !descripcion || !puntos) {
        res.status(400).json({ message: "Todos los campos son obligatorios." });
        return;
    }
    try {
        yield db_1.default.query("INSERT INTO Videos (titulo, url_video, descripcion, puntos) VALUES (?, ?, ?, ?)", [titulo, url_video, descripcion, puntos]);
        res.status(201).json({ message: "Video agregado correctamente." });
    }
    catch (error) {
        console.error("Error agregando video:", error);
        res.status(500).json({ message: "Error interno al agregar el video." });
    }
});
exports.addVideo = addVideo;
// ✅ Actualizar video
const updateVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_video } = req.params;
    const { titulo, url_video, descripcion, puntos } = req.body;
    if (!titulo || !url_video || !descripcion || !puntos) {
        res.status(400).json({ message: "Todos los campos son obligatorios." });
        return;
    }
    try {
        const [result] = yield db_1.default.query("UPDATE Videos SET titulo = ?, url_video = ?, descripcion = ?, puntos = ? WHERE id_video = ?", [titulo, url_video, descripcion, puntos, id_video]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "No se encontró el video para actualizar." });
            return;
        }
        res.json({ message: "Video actualizado correctamente." });
    }
    catch (error) {
        console.error("Error actualizando video:", error);
        res.status(500).json({ message: "Error interno al actualizar el video." });
    }
});
exports.updateVideo = updateVideo;
// ✅ Eliminar video
const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_video } = req.params;
    try {
        const [result] = yield db_1.default.query("DELETE FROM Videos WHERE id_video = ?", [id_video]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "No se encontró el video para eliminar." });
            return;
        }
        res.json({ message: "Video eliminado correctamente." });
    }
    catch (error) {
        console.error("Error eliminando video:", error);
        res.status(500).json({ message: "Error interno al eliminar el video." });
    }
});
exports.deleteVideo = deleteVideo;
