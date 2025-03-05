import { Router } from "express";
import { generarQR, canjearQR } from "../controllers/qr.controller";

const router = Router();

router.post("/generar", generarQR);
router.post("/canjear", canjearQR);

export default router;
