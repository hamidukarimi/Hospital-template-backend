import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addSocialMedia,
  editSocialMedia,
  getSocialMedia,
  getSocialMediaItem,
  removeSocialMedia,
} from "../controllers/adminSocialMediaController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getSocialMedia);
router.get("/:id", getSocialMediaItem);
router.post("/", addSocialMedia);
router.patch("/:id", editSocialMedia);
router.delete("/:id", removeSocialMedia);

export default router;