import { Request, Response } from "express";
import { getSiteSettings } from "../services/siteSettings.service.js";

export const getSiteSettingsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const settings = await getSiteSettings();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Site settings not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Failed to get site settings:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get site settings",
    });
  }
};