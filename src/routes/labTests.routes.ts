import { Router } from "express";
import { getLabTestsController } from "../controllers/labTests.controller.js";

const router = Router();

router.get("/", getLabTestsController);

export default router;
