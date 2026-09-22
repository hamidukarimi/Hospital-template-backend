import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addNavbarLink,
  editNavbarLink,
  getNavbarLink,
  getNavbarLinks,
  removeNavbarLink,
} from "../controllers/adminNavbarLinkController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getNavbarLinks);
router.get("/:id", getNavbarLink);
router.post("/", addNavbarLink);
router.patch("/:id", editNavbarLink);
router.delete("/:id", removeNavbarLink);

export default router;
