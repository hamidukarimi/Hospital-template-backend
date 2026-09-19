import { Request, Response } from "express";
import { getServiceBySlug, getServices } from "../services/service.service.js";

export const getServicesController = async (_req: Request, res: Response) => {
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

export const getServiceBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const service = await getServiceBySlug(req.params.slug as string);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error("Failed to get service details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get service details" });
  }
};
