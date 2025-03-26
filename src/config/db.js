"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const certPath = path_1.default.join(__dirname, "../../ca-certificate.crt");
// ⚠ Si el certificado no existe, lanza advertencia
let sslConfig;
if (fs_1.default.existsSync(certPath)) {
    sslConfig = { ca: fs_1.default.readFileSync(certPath) };
}
else {
    console.warn("⚠️ Certificado SSL no encontrado, se omitirá SSL.");
}
// 🟢 Crear y exportar el pool
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "ECOPET",
    port: Number(process.env.DB_PORT) || 3306,
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.default = pool;
