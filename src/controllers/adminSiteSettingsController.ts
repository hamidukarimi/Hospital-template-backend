import type { Request, Response } from "express";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../services/adminSiteSettingsService.js";

export const getAdminSiteSettings = async (
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

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET ADMIN SITE SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
    });
  }
};

export const editAdminSiteSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      hospitalName,
      logo,
      phone,
      email,
      address,
      sundayVisitingHours,
      mondayFridayVisitingHours,
    } = req.body;

    const settings = await updateSiteSettings({
      hospitalName,
      logo,
      phone,
      email,
      address,
      sundayVisitingHours,
      mondayFridayVisitingHours,
    });

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("UPDATE ADMIN SITE SETTINGS ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Site settings not found",
    });
  }
};