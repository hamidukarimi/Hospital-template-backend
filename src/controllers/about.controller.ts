import { Request, Response } from "express";
import { getAboutSection } from "../services/about.service.js";

export const getAboutSectionController = async (
  _req: Request,
  res: Response
) => {
  try {
    const about = await getAboutSection();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Failed to get about section:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get about section",
    });
  }
};