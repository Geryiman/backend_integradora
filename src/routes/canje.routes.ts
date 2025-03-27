import { Router } from "express";
import {
  getCanjes,
  createCanje,
  getCanjesByUsuario
} from "../controllers/canje.controller";

const router = Router();

router.get("/", getCanjes);
router.get("/usuario/:id_usuario", getCanjesByUsuario);
router.post("/", createCanje);

export default router;
