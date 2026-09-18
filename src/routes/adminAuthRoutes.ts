import { Router } from "express";
import {
  adminLogin,
  adminMe,
} from "../controllers/adminAuthController.js";
import {
  authenticateAdmin,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", adminLogin);
router.get("/me", authenticateAdmin, adminMe);

export default router;