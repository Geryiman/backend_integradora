"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const canje_controller_1 = require("../controllers/canje.controller");
const router = (0, express_1.Router)();
router.get("/", canje_controller_1.getCanjes);
router.post("/", canje_controller_1.createCanje);
exports.default = router;
