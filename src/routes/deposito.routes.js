"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deposito_controller_1 = require("../controllers/deposito.controller");
const router = (0, express_1.Router)();
router.get("/", deposito_controller_1.getDepositos);
router.post("/", deposito_controller_1.createDeposito);
exports.default = router;
