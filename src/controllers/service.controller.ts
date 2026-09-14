import { Request, Response } from "express";
import { getServices } from "../services/service.service.js";

export const getServicesController = async (
  _req: Request,
  res: Response
) => {
  try {
    const services = await getServices();

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Failed to get services:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get services",
    });
  }
};