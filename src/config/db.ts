import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const certPath = "./ca-certificate.crt"; // Ruta del certificado SSL si es necesario

// 📌 Crear un pool de conexiones para MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || "db-mysql-app-salud-do-user-18905968-0.j.db.ondigitalocean.com",
  user: process.env.DB_USER || "doadmin",
  password: process.env.DB_PASS || "AVNS_eC3dTdiST4fJ0_6la0r",
  database: process.env.DB_NAME || "ecopet",
  port: Number(process.env.DB_PORT) || 25060,
  ssl: { ca: fs.existsSync(certPath) ? fs.readFileSync(certPath) : undefined }, // Cargar SSL si está disponible
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones activas
  queueLimit: 0, // Sin límite de espera
});

// 📌 Probar la conexión a la base de datos
async function testDBConnection() {
  try {
    const connection = await db.getConnection();
    await connection.ping(); // Enviar ping para verificar la conexión
    console.log("✅ Conectado a MySQL con éxito.");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error);
    process.exit(1); // Termina la ejecución si la conexión falla
  }
}

// 📌 Mantener la conexión activa
setInterval(async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    console.log("🔄 Ping enviado a MySQL para mantener la conexión activa.");
  } catch (error) {
    console.error("❌ Error al hacer ping a MySQL:", error);
  }
}, 60000); // Cada 60 segundos

testDBConnection();

export default db;
