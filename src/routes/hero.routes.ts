import { Router } from "express";
import { getHeroController } from "../controllers/hero.controller.js";

const router = Router();

router.get("/", getHeroController);

export default router;