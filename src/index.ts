import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import usuarioRoutes from "./routes/usuario.routes";
import tareaRoutes from "./routes/tarea.routes";
import depositoRoutes from "./routes/deposito.routes";
import recompensaRoutes from "./routes/recompensa.routes";
import canjeRoutes from "./routes/canje.routes";
import qrRoutes from "./routes/qr.routes"; // ✅ Nueva ruta de QR

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Servir imágenes de perfil desde /uploads/
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Ruta de prueba para confirmar que el servidor está activo
app.get("/", (req, res) => {
  res.send("✅ Servidor en ejecución correctamente.");
});

// ✅ Rutas del backend
app.use("/api", tareaRoutes); // ✅ Mantiene compatibilidad con la otra versión
app.use("/usuarios", usuarioRoutes);
app.use("/tareas", tareaRoutes);
app.use("/depositos", depositoRoutes);
app.use("/recompensas", recompensaRoutes);
app.use("/canjes", canjeRoutes);
app.use("/api/qr", qrRoutes); // ✅ Nueva ruta de QR

// ✅ Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
