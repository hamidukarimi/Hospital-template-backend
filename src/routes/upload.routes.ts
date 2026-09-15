import { Router } from "express";
import { upload } from "../lib/upload.js";
import { uploadImageController } from "../controllers/upload.controller.js";

const router = Router();

router.post("/", upload.single("image"), uploadImageController);

router.use(
  (
    error: unknown,
    _req: unknown,
    res: {
      status: (code: number) => {
        json: (payload: { success: boolean; message: string }) => unknown;
      };
    },
    _next: unknown,
  ) => {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  },
);

export default router;
