import { Router } from "express";
import { getAboutController } from "../controllers/about.controller.js";

const router = Router();

router.get("/", getAboutController);

export default router;
