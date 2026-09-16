import { Router } from "express";
import { adminLogin } from "../controllers/adminAuthController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", adminLogin);

router.get("/me", authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    data: req.admin,
  });
});

export default router;