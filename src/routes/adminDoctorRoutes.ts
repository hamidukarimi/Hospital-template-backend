import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addDoctor,
  editDoctor,
  getDoctor,
  getDoctors,
  removeDoctor,
} from "../controllers/adminDoctorController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getDoctors);
router.get("/:id", getDoctor);
router.post("/", addDoctor);
router.patch("/:id", editDoctor);
router.delete("/:id", removeDoctor);

export default router;