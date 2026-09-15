import { Router } from "express";
import { getFooterController } from "../controllers/footer.controller.js";

const router = Router();

router.get("/", getFooterController);

export default router;
