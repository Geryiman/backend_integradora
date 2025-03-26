import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";

import pool from "./config/db"; // ✅ Import correcto

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

async function iniciarServidor() {
  await descargarCertificado();

  // ✅ Asigna el pool de conexión al app
  app.locals.pool = pool;

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.get("/", (req: Request, res: Response) => {
    res.send("✅ Servidor corriendo correctamente.");
  });

  // 📦 Rutas
  app.use("/api", tareaRoutes);
  app.use("/usuarios", usuarioRoutes);
  app.use("/tareas", tareaRoutes);
  app.use("/depositos", depositoRoutes);
  app.use("/recompensas", recompensaRoutes);
  app.use("/canjes", canjeRoutes);
  app.use("/api/qr", qrRoutes);
  app.use("/api/videos", videosRoutes);
  app.use("/premios", premiosRoutes);
  app.use("/api/qr", qrRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

iniciarServidor();

