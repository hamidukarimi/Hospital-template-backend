import { Request, Response } from "express";
import { getNavbar } from "../services/navbar.service.js";

export const getNavbarController = async (_req: Request, res: Response) => {
  try {
    const navbar = await getNavbar();

    return res.status(200).json({
      success: true,
      data: navbar,
    });
  } catch (error) {
    console.error("Failed to get navbar:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get navbar",
    });
  }
};
