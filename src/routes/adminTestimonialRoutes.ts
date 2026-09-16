import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addTestimonial,
  editTestimonial,
  getTestimonial,
  getTestimonials,
  removeTestimonial,
} from "../controllers/adminTestimonialController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getTestimonials);
router.get("/:id", getTestimonial);
router.post("/", addTestimonial);
router.patch("/:id", editTestimonial);
router.delete("/:id", removeTestimonial);

export default router;