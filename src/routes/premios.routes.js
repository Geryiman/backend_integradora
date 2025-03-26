"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const premios_controller_1 = require("../controllers/premios.controller");
const router = (0, express_1.Router)();
router.get("/", premios_controller_1.getPremios); // Obtener premios
router.post("/canjear", premios_controller_1.canjearPremioUsuario); // Canjear premio
exports.default = router;
