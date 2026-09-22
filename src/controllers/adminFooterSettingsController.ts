import type { Request, Response } from "express";
import { getFooterSettings } from "../services/adminFooterSettingsService.js";

export const getAdminFooterSettings = async (
  _req: Request,
  res: Response,
) => {
  try {
    const settings = await getFooterSettings();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Footer settings not found",
      });
    }

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET FOOTER SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer settings",
    });
  }
};
