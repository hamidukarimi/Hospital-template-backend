import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addService,
  editService,
  getService,
  getServices,
  removeService,
} from "../controllers/adminServiceController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getServices);
router.get("/:id", getService);
router.post("/", addService);
router.patch("/:id", editService);
router.delete("/:id", removeService);

export default router;