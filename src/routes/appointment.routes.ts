import { Router } from "express";
import {
  bookAppointment,
  cancelPublicAppointment,
  getAvailability,
  listBookableDoctors,
  listBookableServices,
  lookupAppointment,
} from "../controllers/appointment.controller.js";

const router = Router();

router.get("/doctors", listBookableDoctors);
router.get("/services", listBookableServices);
router.get("/availability/:doctorId", getAvailability);
router.post("/", bookAppointment);
router.get("/:reference", lookupAppointment);
router.post("/:reference/cancel", cancelPublicAppointment);

export default router;
