import { Router } from "express";
import {
	getAllSongs,
	getFeaturedSongs,
	getMakeForYouSongs,
	getTrendingSongs,
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/make-for-you", getMakeForYouSongs);
router.get("/trending", getTrendingSongs);

export default router;