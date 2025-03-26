// routes/qr.routes.ts

import { Router } from "express";
import {
  generarQR,
  canjearQR,
  obtenerQRDisponible
} from "../controllers/qr.controller"; // 👈 asegurate que la ruta esté bien

const router = Router();

router.post("/generar", generarQR);
router.post("/canjear", canjearQR);
router.get("/qr/disponible/:id_tarea", obtenerQRDisponible);

export default router;
