import { Router } from "express";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import {
  addArticle,
  editArticle,
  getArticle,
  getArticles,
  removeArticle,
} from "../controllers/adminArticleController.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getArticles);
router.get("/:id", getArticle);
router.post("/", addArticle);
router.patch("/:id", editArticle);
router.delete("/:id", removeArticle);

export default router;