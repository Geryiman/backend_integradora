import { Router } from "express";
import {
  getUsuarios,
  createUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  uploadProfileImage, // ✅ Función corregida
  upload, // ✅ Middleware `multer`
} from "../controllers/usuario.controller";

const router: Router = Router();

router.get("/", getUsuarios);
router.post("/", createUsuario);
router.get("/:id", getUsuarioById);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
router.post("/login", loginUsuario);
router.post("/:id_usuario/upload", upload.single("profileImage"), uploadProfileImage); // ✅ Asegura que no hay errores de tipado

export default router;
