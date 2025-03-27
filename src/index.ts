import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";

import pool from "./config/db";

// 📦 Importación de rutas
import usuarioRoutes from "./routes/usuario.routes";
import tareaRoutes from "./routes/tarea.routes";
import depositoRoutes from "./routes/deposito.routes";
import recompensaRoutes from "./routes/recompensa.routes";
import canjeRoutes from "./routes/canje.routes";
import qrRoutes from "./routes/qr.routes";
import videosRoutes from "./routes/videos.routes";
import premiosRoutes from "./routes/premios.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const certPath = path.join(__dirname, "../ca-certificate.crt");

// 🔐 Descargar certificado si no existe
async function descargarCertificado(): Promise<void> {
  if (!fs.existsSync(certPath)) {
    try {
      const url = "https://salud-magenes.sfo2.digitaloceanspaces.com/ca-certificate.crt";
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(certPath, response.data);
      console.log("✅ Certificado descargado correctamente.");
    } catch (error: any) {
      console.error("❌ Error al descargar certificado:", error.message);
      process.exit(1);
    }
  }
}

// 🚀 Inicializar servidor
async function iniciarServidor() {
  await descargarCertificado();

  app.locals.pool = pool;

  app.use(cors());
  app.use(express.json());

  // 🖼 Servir imágenes desde carpeta /uploads
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // ✅ Ruta de prueba
  app.get("/", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      message: "Servidor de ECOPET corriendo correctamente",
      version: "1.0.0"
    });
  });

  // 🧩 Rutas organizadas bajo /api
  app.use("/api/usuarios", usuarioRoutes);
  app.use("/api/tareas", tareaRoutes);
  app.use("/api/depositos", depositoRoutes);
  app.use("/api/recompensas", recompensaRoutes);
  app.use("/api/canjes", canjeRoutes);
  app.use("/api/qr", qrRoutes);
  app.use("/api/videos", videosRoutes);
  app.use("/api/premios", premiosRoutes);

  // 🚀 Iniciar servidor
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
}

iniciarServidor();
