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
exports.canjearQR = exports.generarQR = void 0;
const db_1 = __importDefault(require("../config/db"));
const generarQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_tarea } = req.body;
        if (!id_tarea) {
            res.status(400).json({ message: "El ID de la tarea es obligatorio" });
            return;
        }
        const [tarea] = yield db_1.default.query("SELECT * FROM Tareas WHERE id_tarea = ?", [id_tarea]);
        if (tarea.length === 0) {
            res.status(404).json({ message: "Tarea no encontrada" });
            return;
        }
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const codigoQR = Array.from({ length: 8 }, () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))).join("");
        yield db_1.default.query("INSERT INTO CodigosQR (id_tarea, codigo, estado, fecha_generado) VALUES (?, ?, 'Generado', NOW())", [id_tarea, codigoQR]);
        res.status(201).json({
            message: "Código QR generado con éxito",
            codigo: codigoQR,
            id_tarea: id_tarea,
        });
    }
    catch (error) {
        console.error("❌ Error en la generación del QR:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.generarQR = generarQR;
const canjearQR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { codigo, id_usuario } = req.body;
        if (!codigo || !id_usuario) {
            res.status(400).json({ message: "Código QR y usuario son requeridos" });
            return;
        }
        const [qrResults] = yield db_1.default.query("SELECT * FROM CodigosQR WHERE codigo = ? AND estado = 'Generado'", [codigo]);
        if (qrResults.length === 0) {
            res.status(404).json({ message: "Código QR no válido o ya canjeado" });
            return;
        }
        const qrData = qrResults[0];
        const [tarea] = yield db_1.default.query("SELECT * FROM Tareas WHERE id_tarea = ?", [qrData.id_tarea]);
        if (tarea.length === 0) {
            res.status(404).json({ message: "Tarea no encontrada" });
            return;
        }
        const tareaData = tarea[0];
        if (tareaData.tipo === "Especial") {
            const now = new Date();
            if (now < new Date(tareaData.fecha_inicio) || now > new Date(tareaData.fecha_fin)) {
                res.status(400).json({ message: "Este reto especial ya no está disponible" });
                return;
            }
        }
        const [userRedeem] = yield db_1.default.query("SELECT * FROM Usuario_Tarea WHERE id_usuario = ? AND id_tarea = ?", [id_usuario, qrData.id_tarea]);
        if (userRedeem.length > 0) {
            res.status(400).json({ message: "Este usuario ya completó este reto" });
            return;
        }
        yield db_1.default.query("INSERT INTO Usuario_Tarea (id_usuario, id_tarea, fecha_completada) VALUES (?, ?, NOW())", [id_usuario, qrData.id_tarea]);
        yield db_1.default.query("UPDATE Usuarios SET puntos_totales = puntos_totales + ? WHERE id_usuario = ?", [tareaData.puntos, id_usuario]);
        res.json({
            message: "Código QR canjeado con éxito",
            puntos_ganados: tareaData.puntos,
        });
    }
    catch (error) {
        console.error("❌ Error en canje de QR:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.canjearQR = canjearQR;
