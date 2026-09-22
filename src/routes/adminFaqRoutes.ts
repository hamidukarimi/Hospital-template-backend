import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addFaq,
  editFaq,
  getFaq,
  getFaqs,
  removeFaq,
} from "../controllers/adminFaqController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getFaqs);
router.get("/:id", getFaq);
router.post("/", addFaq);
router.patch("/:id", editFaq);
router.delete("/:id", removeFaq);

export default router;
