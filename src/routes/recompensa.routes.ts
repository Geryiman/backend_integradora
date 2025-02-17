import { Router } from "express";
import { getRecompensas, createRecompensa } from "../controllers/recompensa.controller";

const router = Router();

router.get("/", getRecompensas);
router.post("/", createRecompensa);

export default router;
