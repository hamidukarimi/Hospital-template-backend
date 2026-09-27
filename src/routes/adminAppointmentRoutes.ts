import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  getAppointment,
  getAppointmentStats,
  listAppointments,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../controllers/adminAppointmentController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", listAppointments);
router.get("/stats", getAppointmentStats);
router.get("/:id", getAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.patch("/:id/reschedule", rescheduleAppointment);

export default router;
