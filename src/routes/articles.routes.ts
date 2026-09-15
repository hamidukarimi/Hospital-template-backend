import { Router } from "express";
import { getArticlesController } from "../controllers/articles.controller.js";

const router = Router();

router.get("/", getArticlesController);

export default router;
