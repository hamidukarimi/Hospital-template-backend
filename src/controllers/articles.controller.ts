import { Request, Response } from "express";
import { getArticles } from "../services/articles.service.js";

export const getArticlesController = async (_req: Request, res: Response) => {
  try {
    const articles = await getArticles();

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Failed to get articles:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get articles",
    });
  }
};
