import { Router } from "express";
import { getCanjes, createCanje } from "../controllers/canje.controller";

const router = Router();

router.get("/", getCanjes);
router.post("/", createCanje);

export default router;
