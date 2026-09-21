import type { Request, Response } from "express";
import { getAbout, getOrCreateAbout } from "../services/about.service.js";

export const getAboutController = async (_req: Request, res: Response) => {
  try {
    const about = await getAbout();

    if (!about || about.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "About information not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Failed to get about information:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get about information",
    });
  }
};

/** Ensures the singleton About record exists (safe initial setup). */
export const ensureAboutController = async (_req: Request, res: Response) => {
  try {
    const about = await getOrCreateAbout();

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Failed to ensure about information:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to ensure about information",
    });
  }
};
