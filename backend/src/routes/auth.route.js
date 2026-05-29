import { Router } from "express";
import User from "../models/User.model.js";

const router = Router();

router.post("/callback", authCallback); 

export default router;