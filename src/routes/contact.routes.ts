import { Router } from "express";
import { handleContactSubmit, handleGetContactInfo } from "../controllers/contact.controller.js";

const router = Router();

router.get("/contact/info", handleGetContactInfo);
router.post("/", handleContactSubmit);

export default router;