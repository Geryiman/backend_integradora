"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recompensa_controller_1 = require("../controllers/recompensa.controller");
const router = (0, express_1.Router)();
router.get("/", recompensa_controller_1.getRecompensas);
router.post("/", recompensa_controller_1.createRecompensa);
exports.default = router;
