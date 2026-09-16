import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addLabTest,
  editLabTest,
  getLabTest,
  getLabTests,
  removeLabTest,
} from "../controllers/adminLabTestController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getLabTests);
router.get("/:id", getLabTest);
router.post("/", addLabTest);
router.patch("/:id", editLabTest);
router.delete("/:id", removeLabTest);

export default router;