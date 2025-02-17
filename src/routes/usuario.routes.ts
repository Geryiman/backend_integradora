import { Router } from "express";
import {
  getUsuarios,
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
} from "../controllers/usuario.controller";

const router: Router = Router();

router.get("/", getUsuarios);
router.post("/", createUsuario);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
router.post("/login", loginUsuario); // ✅ Ruta de inicio de sesión corregida

export default router;
