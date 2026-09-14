import { Router } from "express";
import { getHelpSectionController } from "../controllers/help.controller.js";

const router = Router();

router.get("/", getHelpSectionController);

export default router;