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
exports.createCanje = exports.getCanjes = void 0;
const db_1 = __importDefault(require("../config/db"));
const getCanjes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query("SELECT * FROM Canjes");
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getCanjes = getCanjes;
const createCanje = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario, id_recompensa } = req.body;
    try {
        const [result] = yield db_1.default.query("INSERT INTO Canjes (id_usuario, id_recompensa) VALUES (?, ?)", [id_usuario, id_recompensa]);
        const insert = result;
        res.json({ message: "Canje registrado", id: insert.insertId });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createCanje = createCanje;
