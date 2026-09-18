import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addHelpCard,
  editHelpCard,
  getHelpCard,
  getHelpCards,
  getHelpSections,
  removeHelpCard,
} from "../controllers/adminHelpCardController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/sections", getHelpSections);
router.get("/", getHelpCards);
router.get("/:id", getHelpCard);
router.post("/", addHelpCard);
router.patch("/:id", editHelpCard);
router.delete("/:id", removeHelpCard);

export default router;