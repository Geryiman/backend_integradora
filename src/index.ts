import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import mysql from "mysql2/promise";
import { S3Client } from "@aws-sdk/client-s3";

// Importación de rutas
import usuarioRoutes from "./routes/usuario.routes";
import tareaRoutes from "./routes/tarea.routes";
import depositoRoutes from "./routes/deposito.routes";
import recompensaRoutes from "./routes/recompensa.routes";
import canjeRoutes from "./routes/canje.routes";
import qrRoutes from "./routes/qr.routes";
import videosRoutes from "./routes/videos.routes";
import premiosRoutes from "./routes/premios.routes";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const certPath = "./ca-certificate.crt";

app.use(cors());
app.use(express.json());

// 📌 Servir archivos estáticos desde la carpeta `uploads`
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 📌 Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("✅ Servidor en ejecución correctamente.");
});

// 📌 Configuración de rutas
app.use("/usuarios", usuarioRoutes);
app.use("/tareas", tareaRoutes);
app.use("/depositos", depositoRoutes);
app.use("/recompensas", recompensaRoutes);
app.use("/canjes", canjeRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/videos", videosRoutes);
app.use("/premios", premiosRoutes);

// 📌 Descargar certificado SSL automáticamente
async function descargarCertificado() {
  try {
    const url = "https://salud-magenes.sfo2.digitaloceanspaces.com/ca-certificate.crt";
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(certPath, response.data);
    console.log("✅ Certificado SSL descargado correctamente.");
  } catch (error) {
    console.error("❌ Error descargando el certificado SSL:", error);
    process.exit(1);
  }
}

// 📌 Conexión a la base de datos MySQL con manejo de errores y reintento automático
let db: mysql.Pool;
async function conectarDB(reintento = 5) {
  try {
    db = mysql.createPool({
      host: process.env.DB_HOST || "db-mysql-app-salud-do-user-18905968-0.j.db.ondigitalocean.com",
      user: process.env.DB_USER || "doadmin",
      password: process.env.DB_PASS || "AVNS_eC3dTdiST4fJ0_6la0r",
      database: process.env.DB_NAME || "ecopet",
      port: Number(process.env.DB_PORT) || 25060,
      ssl: { ca: fs.readFileSync(certPath) },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("✅ Conectado a MySQL con SSL");
  } catch (error) {
    console.error("❌ Error en la conexión a MySQL:", error);
    
    if (reintento > 0) {
      console.log(`🔄 Reintentando conexión a MySQL (${6 - reintento}/5) en 5 segundos...`);
      setTimeout(() => conectarDB(reintento - 1), 5000);
    } else {
      console.error("⛔ No se pudo conectar a MySQL después de varios intentos. Saliendo...");
      process.exit(1);
    }
  }
}

// 📌 Configuración de DigitalOcean Spaces
let s3Client: S3Client;
async function configurarS3() {
  try {
    s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || "https://sfo2.digitaloceanspaces.com",
      region: process.env.S3_REGION || "sfo2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "DO00F92NFGUU9UR29VYV",
        secretAccessKey: process.env.S3_SECRET_KEY || "pr0SzcMGY9zK/TaqelriS6oZJU+D/3K5CHsM7qDyYZU",
      },
    });

    console.log("✅ Conectado a DigitalOcean Spaces");
  } catch (error) {
    console.error("❌ Error conectando a DigitalOcean Spaces:", error);
  }
}

// 📌 Iniciar servidor
async function iniciarServidor() {
  await descargarCertificado();
  await conectarDB();
  await configurarS3();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

iniciarServidor();

export { db, s3Client }; // Exportar la conexión para que pueda ser usada en otros archivos
