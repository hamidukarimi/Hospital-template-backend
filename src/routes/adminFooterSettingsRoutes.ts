import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import { getAdminFooterSettings } from "../controllers/adminFooterSettingsController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getAdminFooterSettings);

export default router;
