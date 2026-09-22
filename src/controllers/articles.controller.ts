import { Request, Response } from "express";
import {
  getArticleBySlug,
  getArticles,
} from "../services/articles.service.js";

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

export const getArticleBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const article = await getArticleBySlug(req.params.slug as string);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Failed to get article:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get article",
    });
  }
};
