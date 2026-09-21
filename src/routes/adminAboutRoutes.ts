import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  getAdminAboutController,
  updateAdminAboutController,
} from "../controllers/adminAboutController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getAdminAboutController);
router.patch("/", updateAdminAboutController);

export default router;
