import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addWhyChooseUs,
  editWhyChooseUs,
  getWhyChooseUs,
  getWhyChooseUsItem,
  removeWhyChooseUs,
} from "../controllers/adminWhyChooseUsController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getWhyChooseUs);
router.get("/:id", getWhyChooseUsItem);
router.post("/", addWhyChooseUs);
router.patch("/:id", editWhyChooseUs);
router.delete("/:id", removeWhyChooseUs);

export default router;