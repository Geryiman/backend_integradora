import express from "express";
import { 
    getVideos, 
    addVideo, 
    updateVideo, 
    deleteVideo, 
    markVideoAsWatched 
} from "../controllers/videos.controller";

const router = express.Router();

// ✅ Ruta para obtener todos los videos
router.get("/", getVideos);

// ✅ Ruta para agregar un nuevo video
router.post("/", addVideo);

// ✅ Ruta para actualizar un video por ID
router.put("/:id_video", updateVideo);

// ✅ Ruta para eliminar un video por ID
router.delete("/:id_video", deleteVideo);

// ✅ Ruta para registrar que un usuario vio un video
router.post("/visto", markVideoAsWatched);

export default router;
