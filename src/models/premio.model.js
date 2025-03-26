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
exports.canjearPremio = exports.obtenerPremios = void 0;
const db_1 = __importDefault(require("../config/db"));
// ✅ Obtener todos los premios (recompensas)
const obtenerPremios = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.query("SELECT * FROM Recompensas");
    return rows;
});
exports.obtenerPremios = obtenerPremios;
// ✅ Canjear un premio (resta puntos al usuario si tiene suficientes)
const canjearPremio = (id_usuario, id_recompensa) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Obtener puntos necesarios del premio
        const [recompensaResult] = yield db_1.default.query("SELECT puntos_necesarios FROM Recompensas WHERE id_recompensa = ?", [id_recompensa]);
        if (recompensaResult.length === 0) {
            throw new Error("Recompensa no encontrada");
        }
        const puntosNecesarios = recompensaResult[0].puntos_necesarios;
        // 2. Obtener puntos actuales del usuario
        const [usuarioResult] = yield db_1.default.query("SELECT puntos_totales FROM Usuarios WHERE id_usuario = ?", [id_usuario]);
        if (usuarioResult.length === 0) {
            throw new Error("Usuario no encontrado");
        }
        const puntosActuales = usuarioResult[0].puntos_totales;
        if (puntosActuales < puntosNecesarios) {
            throw new Error("Puntos insuficientes");
        }
        // 3. Actualizar puntos del usuario (restar)
        yield db_1.default.query("UPDATE Usuarios SET puntos_totales = puntos_totales - ? WHERE id_usuario = ?", [puntosNecesarios, id_usuario]);
        return true;
    }
    catch (error) {
        console.error("❌ Error al canjear premio:", error);
        return false;
    }
});
exports.canjearPremio = canjearPremio;
