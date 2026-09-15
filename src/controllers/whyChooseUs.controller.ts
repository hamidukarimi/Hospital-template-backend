import { Request, Response } from "express";
import { getWhyChooseUs } from "../services/whyChooseUs.service.js";

export const getWhyChooseUsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const items = await getWhyChooseUs();

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Failed to get Why Choose Us items:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get Why Choose Us items",
    });
  }
};
