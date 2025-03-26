"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videos_controller_1 = require("../controllers/videos.controller");
const router = express_1.default.Router();
// ✅ Ruta para obtener todos los videos
router.get("/", videos_controller_1.getVideos);
// ✅ Ruta para agregar un nuevo video
router.post("/", videos_controller_1.addVideo);
// ✅ Ruta para actualizar un video por ID
router.put("/:id_video", videos_controller_1.updateVideo);
// ✅ Ruta para eliminar un video por ID
router.delete("/:id_video", videos_controller_1.deleteVideo);
// ✅ Ruta para registrar que un usuario vio un video
router.post("/visto", videos_controller_1.markVideoAsWatched);
exports.default = router;
