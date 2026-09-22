import { Router } from "express";
import { getNavbarController } from "../controllers/navbar.controller.js";

const router = Router();

router.get("/", getNavbarController);

export default router;
