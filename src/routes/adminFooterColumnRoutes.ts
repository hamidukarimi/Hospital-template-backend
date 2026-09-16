import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addFooterColumn,
  editFooterColumn,
  getFooterColumn,
  getFooterColumns,
  removeFooterColumn,
} from "../controllers/adminFooterColumnController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getFooterColumns);
router.get("/:id", getFooterColumn);
router.post("/", addFooterColumn);
router.patch("/:id", editFooterColumn);
router.delete("/:id", removeFooterColumn);

export default router;