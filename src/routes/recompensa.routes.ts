import { Router } from "express";
import {
  getRecompensas,
  getRecompensaById,
  createRecompensa,
  updateRecompensa,
  deleteRecompensa
} from "../controllers/recompensa.controller";

const router = Router();

router.get("/", getRecompensas);
router.get("/:id", getRecompensaById);
router.post("/", createRecompensa);
router.put("/:id", updateRecompensa);
router.delete("/:id", deleteRecompensa);

export default router;
