import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const certPath = path.join(__dirname, "../../ca-certificate.crt");

// ⚠ Si el certificado no existe, lanza advertencia
let sslConfig;
if (fs.existsSync(certPath)) {
  sslConfig = { ca: fs.readFileSync(certPath) };
} else {
  console.warn("⚠️ Certificado SSL no encontrado, se omitirá SSL.");
}

// 🟢 Crear y exportar el pool
const pool = mysql.createPool({
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

export default pool;
