import type { Request, Response } from "express";
import {
  createSocialMedia,
  deleteSocialMedia,
  getAllSocialMedia,
  getSocialMediaById,
  updateSocialMedia,
} from "../services/adminSocialMediaService.js";

export const getSocialMedia = async (
  _req: Request,
  res: Response
) => {
  try {
    const socialMedia = await getAllSocialMedia();

    return res.json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    console.error("GET SOCIAL MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch social media",
    });
  }
};

export const getSocialMediaItem = async (
  req: Request,
  res: Response
) => {
  try {
    const socialMedia = await getSocialMediaById(req.params.id as string);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media item not found",
      });
    }

    return res.json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    console.error("GET SOCIAL MEDIA ITEM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch social media item",
    });
  }
};

export const addSocialMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      platform,
      url,
      isActive,
      siteSettingsId,
    } = req.body;

    if (!platform || !url || !siteSettingsId) {
      return res.status(400).json({
        success: false,
        message:
          "Platform, URL, and siteSettingsId are required",
      });
    }

    const socialMedia = await createSocialMedia({
      platform,
      url,
      isActive,
      siteSettingsId,
    });

    return res.status(201).json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    console.error("CREATE SOCIAL MEDIA ERROR:", error);

    return res.status(400).json({
      success: false,
      message:
        "Failed to create social media. Check the platform value or duplicate platform.",
    });
  }
};

export const editSocialMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const socialMedia = await updateSocialMedia(
      req.params.id as string,
      req.body
    );

    return res.json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    console.error("UPDATE SOCIAL MEDIA ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to update social media",
    });
  }
};

export const removeSocialMedia = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteSocialMedia(req.params.id as string);

    return res.json({
      success: true,
      message: "Social media deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SOCIAL MEDIA ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Social media item not found",
    });
  }
};