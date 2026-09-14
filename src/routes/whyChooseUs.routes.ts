import { Router } from "express";
import { getWhyChooseUsController } from "../controllers/whyChooseUs.controller";

const router = Router();

router.get("/", getWhyChooseUsController);

export default router;