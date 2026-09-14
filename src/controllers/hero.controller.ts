import { Request, Response } from "express";
import { getHero } from "../services/hero.service.js";

export const getHeroController = async (
  _req: Request,
  res: Response
) => {
  try {
    const hero = await getHero();

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error("Failed to get hero:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get hero section",
    });
  }
};