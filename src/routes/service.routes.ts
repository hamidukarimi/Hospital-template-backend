import { Router } from "express";
import { getServicesController } from "../controllers/service.controller.js";

const router = Router();

router.get("/", getServicesController);

export default router;