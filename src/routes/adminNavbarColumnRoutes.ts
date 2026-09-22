import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addNavbarColumn,
  editNavbarColumn,
  getNavbarColumn,
  getNavbarColumns,
  removeNavbarColumn,
} from "../controllers/adminNavbarColumnController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getNavbarColumns);
router.get("/:id", getNavbarColumn);
router.post("/", addNavbarColumn);
router.patch("/:id", editNavbarColumn);
router.delete("/:id", removeNavbarColumn);

export default router;
