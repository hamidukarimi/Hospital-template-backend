import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addUnavailability,
  getDoctorSchedule,
  putDoctorSchedule,
  removeUnavailability,
} from "../controllers/adminDoctorScheduleController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/:doctorId", getDoctorSchedule);
router.put("/:doctorId", putDoctorSchedule);
router.post("/:doctorId/unavailability", addUnavailability);
router.delete(
  "/:doctorId/unavailability/:unavailabilityId",
  removeUnavailability,
);

export default router;
