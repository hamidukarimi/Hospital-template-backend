import type { Request, Response } from "express";
import { getPublicUploadPath } from "../lib/upload.js";

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file was uploaded.",
      });
    }

    const category =
      typeof req.body?.category === "string" ? req.body.category : "site";
    const publicPath = getPublicUploadPath(category, req.file.filename);

    return res.status(201).json({
      success: true,
      data: {
        path: publicPath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
};
