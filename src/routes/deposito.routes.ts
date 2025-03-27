import { Router } from "express";
import {
  getDepositos,
  createDeposito,
  getDepositosByUsuario,
  getResumenDepositos
} from "../controllers/deposito.controller";

const router = Router();

router.get("/", getDepositos); // Todos los depósitos
router.post("/", createDeposito); // Registrar nuevo
router.get("/usuario/:id_usuario", getDepositosByUsuario); // Depósitos de un usuario
router.get("/resumen/:id_usuario", getResumenDepositos);   // Resumen de usuario

export default router;
