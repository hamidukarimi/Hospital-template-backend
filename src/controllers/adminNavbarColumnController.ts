import type { Request, Response } from "express";
import {
  createNavbarColumn,
  deleteNavbarColumn,
  getAllNavbarColumns,
  getNavbarColumnById,
  updateNavbarColumn,
} from "../services/adminNavbarColumnService.js";

export const getNavbarColumns = async (_req: Request, res: Response) => {
  try {
    const columns = await getAllNavbarColumns();

    return res.json({
      success: true,
      data: columns,
    });
  } catch (error) {
    console.error("GET NAVBAR COLUMNS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch navbar columns",
    });
  }
};

export const getNavbarColumn = async (req: Request, res: Response) => {
  try {
    const column = await getNavbarColumnById(req.params.id as string);

    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Navbar column not found",
      });
    }

    return res.json({
      success: true,
      data: column,
    });
  } catch (error) {
    console.error("GET NAVBAR COLUMN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch navbar column",
    });
  }
};

export const addNavbarColumn = async (req: Request, res: Response) => {
  try {
    const { label, url, sortOrder, isActive } = req.body;

    if (!label || !url) {
      return res.status(400).json({
        success: false,
        message: "Label and URL are required",
      });
    }

    const column = await createNavbarColumn({
      label,
      url,
      sortOrder,
      isActive,
    });

    return res.status(201).json({
      success: true,
      data: column,
    });
  } catch (error) {
    console.error("CREATE NAVBAR COLUMN ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create navbar column",
    });
  }
};

export const editNavbarColumn = async (req: Request, res: Response) => {
  try {
    const { label, url, sortOrder, isActive } = req.body;
    const updateData: Record<string, unknown> = {};

    if (label !== undefined) updateData.label = label;
    if (url !== undefined) updateData.url = url;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const column = await updateNavbarColumn(
      req.params.id as string,
      updateData
    );

    return res.json({
      success: true,
      data: column,
    });
  } catch (error) {
    console.error("UPDATE NAVBAR COLUMN ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Navbar column not found",
    });
  }
};

export const removeNavbarColumn = async (req: Request, res: Response) => {
  try {
    await deleteNavbarColumn(req.params.id as string);

    return res.json({
      success: true,
      message: "Navbar column deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NAVBAR COLUMN ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Navbar column not found",
    });
  }
};
