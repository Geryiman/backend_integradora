import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuario.routes";
import tareaRoutes from "./routes/tarea.routes";
import depositoRoutes from "./routes/deposito.routes";
import recompensaRoutes from "./routes/recompensa.routes";
import canjeRoutes from "./routes/canje.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/tareas", tareaRoutes);
app.use("/depositos", depositoRoutes);
app.use("/recompensas", recompensaRoutes);
app.use("/canjes", canjeRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
