import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  editAdminSiteSettings,
  getAdminSiteSettings,
} from "../controllers/adminSiteSettingsController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getAdminSiteSettings);
router.patch("/", editAdminSiteSettings);

export default router;