import { Router } from "express";
import {
  getServiceBySlugController,
  getServicesController,
} from "../controllers/service.controller.js";

const router = Router();

router.get("/", getServicesController);
router.get("/:slug", getServiceBySlugController);

export default router;
