import { Request, Response } from "express";
import { getFooter } from "../services/footer.service.js";

export const getFooterController = async (_req: Request, res: Response) => {
  try {
    const footer = await getFooter();

    if (!footer) {
      return res.status(404).json({
        success: false,
        message: "Footer settings not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error("Failed to get footer:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get footer",
    });
  }
};
