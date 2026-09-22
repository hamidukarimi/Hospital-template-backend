import { Router } from "express";
import { getFaqsController } from "../controllers/faqs.controller.js";

const router = Router();

router.get("/", getFaqsController);

export default router;
