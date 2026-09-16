import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addFooterLink,
  editFooterLink,
  getFooterLink,
  getFooterLinks,
  removeFooterLink,
} from "../controllers/adminFooterLinkController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getFooterLinks);
router.get("/:id", getFooterLink);
router.post("/", addFooterLink);
router.patch("/:id", editFooterLink);
router.delete("/:id", removeFooterLink);

export default router;