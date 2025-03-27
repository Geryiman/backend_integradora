import { Router } from "express";
import {
  getVideos,
  markVideoAsWatched,
  addVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videos.controller";

const router = Router();

router.get("/", getVideos);
router.post("/watch", markVideoAsWatched);
router.post("/", addVideo);
router.put("/:id_video", updateVideo);
router.delete("/:id_video", deleteVideo);

export default router;
