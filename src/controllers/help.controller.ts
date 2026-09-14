import { Request, Response } from "express";
import { getHelpSection } from "../services/help.service.js";

export const getHelpSectionController = async (
  _req: Request,
  res: Response
) => {
  try {
    const helpSection = await getHelpSection();

    if (!helpSection) {
      return res.status(404).json({
        success: false,
        message: "Help section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: helpSection,
    });
  } catch (error) {
    console.error("Failed to get help section:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get help section",
    });
  }
};