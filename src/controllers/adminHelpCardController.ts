import type { Request, Response } from "express";
import {
  createHelpCard,
  deleteHelpCard,
  getAllHelpCards,
  getHelpCardById,
  updateHelpCard,
} from "../services/adminHelpCardService.js";

export const getHelpCards = async (_req: Request, res: Response) => {
  try {
    const helpCards = await getAllHelpCards();

    return res.json({
      success: true,
      data: helpCards,
    });
  } catch (error) {
    console.error("GET HELP CARDS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch help cards",
    });
  }
};

export const getHelpCard = async (req: Request, res: Response) => {
  try {
    const helpCard = await getHelpCardById(req.params.id as string);

    if (!helpCard) {
      return res.status(404).json({
        success: false,
        message: "Help card not found",
      });
    }

    return res.json({
      success: true,
      data: helpCard,
    });
  } catch (error) {
    console.error("GET HELP CARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch help card",
    });
  }
};

export const addHelpCard = async (req: Request, res: Response) => {
  try {
    const {
      icon,
      title,
      description,
      buttonText,
      buttonUrl,
      color,
      sortOrder,
      isActive,
      helpSectionId,
    } = req.body;

    if (
      !icon ||
      !title ||
      !description ||
      !buttonText ||
      !buttonUrl ||
      !color ||
      !helpSectionId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const helpCard = await createHelpCard({
      icon,
      title,
      description,
      buttonText,
      buttonUrl,
      color,
      sortOrder,
      isActive,
      helpSectionId,
    });

    return res.status(201).json({
      success: true,
      data: helpCard,
    });
  } catch (error) {
    console.error("CREATE HELP CARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create help card",
    });
  }
};

export const editHelpCard = async (req: Request, res: Response) => {
  try {
    const helpCard = await updateHelpCard(
      req.params.id as string,
      req.body
    );

    return res.json({
      success: true,
      data: helpCard,
    });
  } catch (error) {
    console.error("UPDATE HELP CARD ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Help card not found",
    });
  }
};

export const removeHelpCard = async (req: Request, res: Response) => {
  try {
    await deleteHelpCard(req.params.id as string);

    return res.json({
      success: true,
      message: "Help card deleted successfully",
    });
  } catch (error) {
    console.error("DELETE HELP CARD ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Help card not found",
    });
  }
};