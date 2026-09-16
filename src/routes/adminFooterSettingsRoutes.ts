import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  editAdminFooterSettings,
  getAdminFooterSettings,
} from "../controllers/adminFooterSettingsController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getAdminFooterSettings);
router.patch("/", editAdminFooterSettings);

export default router;