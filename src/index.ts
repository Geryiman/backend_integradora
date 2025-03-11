import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

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

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.get("/", (req, res) => {
  res.send("✅ Servidor en ejecución correctamente.");
});


app.use("/api", tareaRoutes); 
app.use("/usuarios", usuarioRoutes);
app.use("/tareas", tareaRoutes);
app.use("/depositos", depositoRoutes);
app.use("/recompensas", recompensaRoutes);
app.use("/canjes", canjeRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/videos", videosRoutes);
app.use("/premios", premiosRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
