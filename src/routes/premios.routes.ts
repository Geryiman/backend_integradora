import { Router } from "express";
import { getPremios, canjearPremioUsuario } from "../controllers/premios.controller";

const router = Router();

router.get("/", getPremios); // Obtener premios
router.post("/canjear", canjearPremioUsuario); // Canjear premio

export default router;
