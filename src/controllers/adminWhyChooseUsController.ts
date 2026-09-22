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

export const getWhyChooseUsItem = async (req: Request, res: Response) => {
  try {
    const item = await getWhyChooseUsById(req.params.id as string);

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

export const addWhyChooseUs = async (req: Request, res: Response) => {
  try {
    const {
      image,
      title,
      description,
      color,
      sortOrder,
      isActive,
      linkText,
      linkUrl,
    } = req.body;

    if (!title || !description || !color) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const item = await createWhyChooseUs({
      image: image ? String(image).trim() : null,
      title,
      description,
      color,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      linkText: linkText ? String(linkText).trim() : null,
      linkUrl: linkUrl ? String(linkUrl).trim() : null,
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

export const editWhyChooseUs = async (req: Request, res: Response) => {
  try {
    const {
      image,
      title,
      description,
      color,
      sortOrder,
      isActive,
      linkText,
      linkUrl,
    } = req.body;

    const updateData: Record<string, unknown> = {};
    if (image !== undefined)
      updateData.image = image ? String(image).trim() : null;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (linkText !== undefined)
      updateData.linkText = linkText ? String(linkText).trim() : null;
    if (linkUrl !== undefined)
      updateData.linkUrl = linkUrl ? String(linkUrl).trim() : null;

    const item = await updateWhyChooseUs(
      req.params.id as string,
      updateData,
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

export const removeWhyChooseUs = async (req: Request, res: Response) => {
  try {
    await deleteWhyChooseUs(req.params.id as string);

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
