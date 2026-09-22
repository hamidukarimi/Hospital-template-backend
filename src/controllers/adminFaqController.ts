import type { Request, Response } from "express";
import {
  createFaq,
  deleteFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
} from "../services/adminFaqService.js";

export const getFaqs = async (_req: Request, res: Response) => {
  try {
    const faqs = await getAllFaqs();

    return res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("GET FAQS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
    });
  }
};

export const getFaq = async (req: Request, res: Response) => {
  try {
    const faq = await getFaqById(req.params.id as string);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("GET FAQ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
    });
  }
};

export const addFaq = async (req: Request, res: Response) => {
  try {
    const { question, answer, category, sortOrder, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const faq = await createFaq({
      question,
      answer,
      category,
      sortOrder,
      isActive,
    });

    return res.status(201).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("CREATE FAQ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create FAQ",
    });
  }
};

export const editFaq = async (req: Request, res: Response) => {
  try {
    const { question, answer, category, sortOrder, isActive } = req.body;

    const updateData: Record<string, unknown> = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (category !== undefined) updateData.category = category || null;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const faq = await updateFaq(req.params.id as string, updateData);

    return res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("UPDATE FAQ ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "FAQ not found",
    });
  }
};

export const removeFaq = async (req: Request, res: Response) => {
  try {
    await deleteFaq(req.params.id as string);

    return res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FAQ ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "FAQ not found",
    });
  }
};
