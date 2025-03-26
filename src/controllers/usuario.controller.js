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
exports.deleteUsuario = exports.updateUsuario = exports.uploadProfileImage = exports.getUsuarioById = exports.createUsuario = exports.getUsuarios = exports.loginUsuario = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const db_1 = __importDefault(require("../config/db"));
const BASE_URL = "http://192.168.1.27:3000";
const UPLOADS_FOLDER = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(UPLOADS_FOLDER)) {
    fs_1.default.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}
// 📦 Configuración multer
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_FOLDER),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
exports.upload = (0, multer_1.default)({ storage });
// =======================
// 📌 Inicio de sesión
// =======================
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Todos los campos son obligatorios." });
        return;
    }
    try {
        const [result] = yield db_1.default.query("SELECT * FROM Usuarios WHERE email = ? LIMIT 1", [email]);
        if (result.length === 0) {
            res.status(401).json({ error: "Usuario no encontrado." });
            return;
        }
        const usuario = result[0];
        const valid = yield bcrypt_1.default.compare(password, usuario.password);
        if (!valid) {
            res.status(401).json({ error: "Contraseña incorrecta." });
            return;
        }
        res.json({
            message: "Inicio de sesión exitoso",
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                puntos_totales: usuario.puntos_totales,
                profileImage: usuario.profileImage || null,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.loginUsuario = loginUsuario;
// =======================
// 📌 Obtener todos los usuarios
// =======================
const getUsuarios = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query("SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios");
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUsuarios = getUsuarios;
// =======================
// 📌 Crear nuevo usuario
// =======================
const createUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        res.status(400).json({ error: "Todos los campos son obligatorios" });
        return;
    }
    try {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const [result] = yield db_1.default.query("INSERT INTO Usuarios (nombre, email, password) VALUES (?, ?, ?)", [nombre, email, hash]);
        res.status(201).json({ message: "Usuario creado", id: result.insertId });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createUsuario = createUsuario;
// =======================
// 📌 Obtener usuario por ID
// =======================
const getUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield db_1.default.query("SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios WHERE id_usuario = ?", [id]);
        if (result.length === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }
        const user = result[0];
        user.profileImage = user.profileImage || `${BASE_URL}/uploads/default-profile.jpg`;
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUsuarioById = getUsuarioById;
// =======================
// 📌 Subir/Actualizar imagen de perfil
// =======================
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario } = req.params;
    if (!req.file) {
        res.status(400).json({ error: "No se subió ninguna imagen" });
        return;
    }
    const profileImage = `${BASE_URL}/uploads/${req.file.filename}`;
    try {
        const [result] = yield db_1.default.query("UPDATE Usuarios SET profileImage = ? WHERE id_usuario = ?", [profileImage, id_usuario]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }
        res.json({ message: "Imagen actualizada correctamente", profileImage });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.uploadProfileImage = uploadProfileImage;
// =======================
// 📌 Actualizar usuario
// =======================
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, email, password, puntos_totales } = req.body;
    try {
        let query;
        let params;
        if (password) {
            const hash = yield bcrypt_1.default.hash(password, 10);
            query = `UPDATE Usuarios SET nombre = ?, email = ?, password = ?, puntos_totales = ? WHERE id_usuario = ?`;
            params = [nombre, email, hash, puntos_totales, id];
        }
        else {
            query = `UPDATE Usuarios SET nombre = ?, email = ?, puntos_totales = ? WHERE id_usuario = ?`;
            params = [nombre, email, puntos_totales, id];
        }
        const [result] = yield db_1.default.query(query, params);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }
        res.json({ message: "Usuario actualizado correctamente" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateUsuario = updateUsuario;
// =======================
// 📌 Eliminar usuario
// =======================
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [result] = yield db_1.default.query("DELETE FROM Usuarios WHERE id_usuario = ?", [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }
        res.json({ message: "Usuario eliminado correctamente" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteUsuario = deleteUsuario;
