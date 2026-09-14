import { Router } from "express";
import { getArticlesController } from "../controllers/articles.controller";

const router = Router();

router.get("/", getArticlesController);

export default router;