import { Router } from "express";
import { getDoctorsController } from "../controllers/doctors.controller.js";

const router = Router();

router.get("/", getDoctorsController);

export default router;