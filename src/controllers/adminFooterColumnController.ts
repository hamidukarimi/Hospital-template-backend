import type { Request, Response } from "express";
import {
  createFooterColumn,
  deleteFooterColumn,
  getAllFooterColumns,
  getFooterColumnById,
  updateFooterColumn,
} from "../services/adminFooterColumnService.js";

export const getFooterColumns = async (
  _req: Request,
  res: Response
) => {
  try {
    const columns = await getAllFooterColumns();

    return res.json({
      success: true,
      data: columns,
    });
  } catch (error) {
    console.error("GET FOOTER COLUMNS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer columns",
    });
  }
};

export const getFooterColumn = async (
  req: Request,
  res: Response
) => {
  try {
    const column = await getFooterColumnById(req.params.id);

    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Footer column not found",
      });
    }

    return res.json({
      success: true,
      data: column,
    });
  } catch (error) {
    console.error("GET FOOTER COLUMN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer column",
    });
  }
};

export const addFooterColumn = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      sortOrder,
      isActive,
      footerSettingsId,
    } = req.body;

    if (!title || !footerSettingsId) {
      return res.status(400).json({
        success: false,
        message: "Title and footerSettingsId are required",
      });
    }

    const column = await createFooterColumn({
      title,
      sortOrder,
      isActive,
      footerSettingsId,
    });

    return res.status(201).json({
      success: true,
      data: column,
    });
  } catch (error) {
    console.error("CREATE FOOTER COLUMN ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create footer column",
    });
  }
};

export const editFooterColumn = async (
  req: Request,
  res: Response
) => {
  try {
    const column = await updateFooterColumn(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data: column,
    });
  } catch (error) {
    console.error("UPDATE FOOTER COLUMN ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Footer column not found",
    });
  }
};

export const removeFooterColumn = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteFooterColumn(req.params.id);

    return res.json({
      success: true,
      message: "Footer column deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FOOTER COLUMN ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Footer column not found",
    });
  }
};