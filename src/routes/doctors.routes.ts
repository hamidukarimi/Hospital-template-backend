import { Router } from "express";
import {
  getDoctorBySlugController,
  getDoctorsController,
} from "../controllers/doctors.controller.js";

const router = Router();

router.get("/", getDoctorsController);
router.get("/:slug", getDoctorBySlugController);

export default router;
