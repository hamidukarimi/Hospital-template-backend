import { Request, Response } from "express";
import { getFaqs } from "../services/faqs.service.js";

export const getFaqsController = async (_req: Request, res: Response) => {
  try {
    const faqs = await getFaqs();

    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Failed to get FAQs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get FAQs",
    });
  }
};
