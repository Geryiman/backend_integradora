import { Router } from "express";
import {
  generarQR,
  canjearQR,
  obtenerQRDisponible
} from "../controllers/qr.controller";

const router = Router();

// 📌 Generar un nuevo código QR manualmente (uso administrativo)
router.post("/generar", generarQR);

// 📌 Registrar escaneo de QR desde la app móvil
router.post("/canjear", canjearQR);

// 📌 Obtener QR disponible automáticamente (Arduino u otro sistema)
router.get("/disponible/:id_tarea", obtenerQRDisponible);

export default router;
