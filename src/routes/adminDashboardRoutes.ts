import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/adminDashboardController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getDashboard);

export default router;