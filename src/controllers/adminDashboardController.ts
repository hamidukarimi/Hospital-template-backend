import type { Request, Response } from "express";
import { getDashboardStats } from "../services/adminDashboardService.js";

export const getDashboard = async (
  _req: Request,
  res: Response
) => {
  try {
    const stats = await getDashboardStats();

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("GET DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};