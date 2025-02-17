import { Router } from "express";
import { getDepositos, createDeposito } from "../controllers/deposito.controller";

const router = Router();

router.get("/", getDepositos);
router.post("/", createDeposito);

export default router;
