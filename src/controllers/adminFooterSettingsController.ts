import type { Request, Response } from "express";
import {
  getFooterSettings,
  updateFooterSettings,
} from "../services/adminFooterSettingsService.js";

export const getAdminFooterSettings = async (
  _req: Request,
  res: Response
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

export const editAdminFooterSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      logo,
      location,
      visitingHours,
      phone,
    } = req.body;

    const settings = await updateFooterSettings({
      logo,
      location,
      visitingHours,
      phone,
    });

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("UPDATE FOOTER SETTINGS ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Footer settings not found",
    });
  }
};