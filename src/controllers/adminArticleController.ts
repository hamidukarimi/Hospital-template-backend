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

    const parsedPublishedAt = publishedAt
      ? (/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)
          ? new Date(`${publishedAt}T00:00:00.000Z`)
          : new Date(publishedAt))
      : undefined;

    const article = await createArticle({
      title,
      excerpt,
      content,
      image,
      author,
      category,
      readTime:
        readTime !== undefined && readTime !== "" ? Number(readTime) : undefined,
      isPublished: Boolean(isPublished),
      publishedAt:
        parsedPublishedAt && !isNaN(parsedPublishedAt.getTime())
          ? parsedPublishedAt
          : undefined,
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
    const {
      title,
      slug,
      excerpt,
      content,
      image,
      author,
      category,
      readTime,
      isPublished,
      publishedAt,
    } = req.body;

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image || null;
    if (author !== undefined) updateData.author = author;
    if (category !== undefined) updateData.category = category;
    if (readTime !== undefined) {
      updateData.readTime =
        readTime !== null && readTime !== "" ? Number(readTime) : null;
    }
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);
    if (publishedAt !== undefined) {
      if (!publishedAt) {
        updateData.publishedAt = null;
      } else if (publishedAt instanceof Date) {
        updateData.publishedAt = publishedAt;
      } else if (typeof publishedAt === "string") {
        const parsed = /^\d{4}-\d{2}-\d{2}$/.test(publishedAt)
          ? new Date(`${publishedAt}T00:00:00.000Z`)
          : new Date(publishedAt);
        updateData.publishedAt = !isNaN(parsed.getTime()) ? parsed : null;
      } else {
        updateData.publishedAt = null;
      }
    }

    const article = await updateArticle(req.params.id as string, updateData);

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