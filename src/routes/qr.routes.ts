import { Router } from "express";
import {
  generarQR,
  canjearQR,
  obtenerQRDisponible
} from "../controllers/qr.controller";

const router = Router();

// 📌 Generar un código QR manualmente (admin o sistema)
router.post("/generar", generarQR);

// 📌 Escanear QR desde app móvil o Arduino (contar botella, completar tarea)
router.post("/canjear", canjearQR);

// 📌 Obtener un código QR disponible (Arduino, app, etc.)
router.get("/disponible/:id_tarea", obtenerQRDisponible);

export default router;
