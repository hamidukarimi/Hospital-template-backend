import type { Request, Response } from "express";
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
} from "../services/adminArticleService.js";

export const getArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await getAllArticles();

    return res.json({
      success: true,
      data: articles,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
    });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article = await getArticleById(req.params.id as string);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.json({
      success: true,
      data: article,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};

export const addArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      excerpt,
      content,
      image,
      author,
      category,
      readTime,
      isPublished,
      publishedAt,
    } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const article = await createArticle({
      title,
      excerpt,
      content,
      image,
      author,
      category,
      readTime,
      isPublished,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    });

    return res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("CREATE ARTICLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create article",
    });
  }
};

export const editArticle = async (req: Request, res: Response) => {
  try {
    const article = await updateArticle(req.params.id as string, req.body);

    return res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("UPDATE ARTICLE ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }
};

export const removeArticle = async (req: Request, res: Response) => {
  try {
    await deleteArticle(req.params.id as string);

    return res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }
};