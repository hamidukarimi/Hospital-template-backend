import { Router } from "express";
import { getSiteSettingsController } from "../controllers/siteSettings.controller.js";

const router = Router();

router.get("/", getSiteSettingsController);

export default router;