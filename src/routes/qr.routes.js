"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qr_controller_1 = require("../controllers/qr.controller");
const router = (0, express_1.Router)();
router.post("/generar", qr_controller_1.generarQR);
router.post("/canjear", qr_controller_1.canjearQR);
exports.default = router;
