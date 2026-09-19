import type { Request, Response } from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../services/adminServiceService.js";

export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await getAllServices();

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    const service = await getServiceById(req.params.id as string);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

export const addService = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      description,
      image,
      category,
      linkText,
      linkUrl,
      color,
      isActive,
      sortOrder,
      ctaText,
      ctaUrl,
      overviewTitle,
      overviewDescription,
      metrics,
    } = req.body;

    if (!title || !description || !category || !linkText || !linkUrl) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
      return;
    }

    const service = await createService({
      title,
      slug,
      description,
      image,
      category,
      linkText,
      linkUrl,
      color,
      isActive,
      sortOrder,
      ctaText,
      ctaUrl,
      overviewTitle,
      overviewDescription,
      metrics: Array.isArray(metrics) ? metrics : undefined,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

export const editService = async (req: Request, res: Response) => {
  try {
    const updatePayload = {
      ...req.body,
      metrics: Array.isArray(req.body.metrics) ? req.body.metrics : undefined,
    };

    const service = await updateService(req.params.id as string, updatePayload);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

export const removeService = async (req: Request, res: Response) => {
  try {
    await deleteService(req.params.id as string);

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }
};