import { Router } from "express";
import {
  getArticleBySlugController,
  getArticlesController,
} from "../controllers/articles.controller.js";

const router = Router();

router.get("/", getArticlesController);
router.get("/:slug", getArticleBySlugController);

export default router;
