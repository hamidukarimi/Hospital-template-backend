import type { Request, Response } from "express";
import {
  createWhyChooseUs,
  deleteWhyChooseUs,
  getAllWhyChooseUs,
  getWhyChooseUsById,
  updateWhyChooseUs,
} from "../services/adminWhyChooseUsService.js";

export const getWhyChooseUs = async (_req: Request, res: Response) => {
  try {
    const items = await getAllWhyChooseUs();

    return res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("GET WHY CHOOSE US ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Why Choose Us items",
    });
  }
};

export const getWhyChooseUsItem = async (
  req: Request,
  res: Response
) => {
  try {
    const item = await getWhyChooseUsById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Why Choose Us item not found",
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("GET WHY CHOOSE US ITEM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch item",
    });
  }
};

export const addWhyChooseUs = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      icon,
      title,
      description,
      color,
      sortOrder,
      isActive,
    } = req.body;

    if (!icon || !title || !description || !color) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const item = await createWhyChooseUs({
      icon,
      title,
      description,
      color,
      sortOrder,
      isActive,
    });

    return res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("CREATE WHY CHOOSE US ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Why Choose Us item",
    });
  }
};

export const editWhyChooseUs = async (
  req: Request,
  res: Response
) => {
  try {
    const item = await updateWhyChooseUs(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("UPDATE WHY CHOOSE US ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Why Choose Us item not found",
    });
  }
};

export const removeWhyChooseUs = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteWhyChooseUs(req.params.id);

    return res.json({
      success: true,
      message: "Why Choose Us item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE WHY CHOOSE US ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Why Choose Us item not found",
    });
  }
};