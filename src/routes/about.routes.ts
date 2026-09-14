import { Router } from "express";
import { getAboutSectionController } from "../controllers/about.controller.js";

const router = Router();

router.get("/", getAboutSectionController);

export default router;