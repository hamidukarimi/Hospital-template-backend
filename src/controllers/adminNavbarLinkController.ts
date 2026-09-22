import type { Request, Response } from "express";
import {
  createNavbarLink,
  deleteNavbarLink,
  getAllNavbarLinks,
  getNavbarLinkById,
  updateNavbarLink,
} from "../services/adminNavbarLinkService.js";

export const getNavbarLinks = async (_req: Request, res: Response) => {
  try {
    const links = await getAllNavbarLinks();

    return res.json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error("GET NAVBAR LINKS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch navbar links",
    });
  }
};

export const getNavbarLink = async (req: Request, res: Response) => {
  try {
    const link = await getNavbarLinkById(req.params.id as string);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Navbar link not found",
      });
    }

    return res.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("GET NAVBAR LINK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch navbar link",
    });
  }
};

export const addNavbarLink = async (req: Request, res: Response) => {
  try {
    const { label, url, sortOrder, isActive, navigationItemId } = req.body;

    if (!label || !url || !navigationItemId) {
      return res.status(400).json({
        success: false,
        message: "Label, URL, and navigationItemId are required",
      });
    }

    const link = await createNavbarLink({
      label,
      url,
      sortOrder,
      isActive,
      navigationItemId,
    });

    return res.status(201).json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("CREATE NAVBAR LINK ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create navbar link",
    });
  }
};

export const editNavbarLink = async (req: Request, res: Response) => {
  try {
    const { label, url, sortOrder, isActive, navigationItemId } = req.body;
    const updateData: Record<string, unknown> = {};

    if (label !== undefined) updateData.label = label;
    if (url !== undefined) updateData.url = url;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (navigationItemId !== undefined)
      updateData.navigationItemId = navigationItemId;

    const link = await updateNavbarLink(req.params.id as string, updateData);

    return res.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("UPDATE NAVBAR LINK ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Navbar link not found",
    });
  }
};

export const removeNavbarLink = async (req: Request, res: Response) => {
  try {
    await deleteNavbarLink(req.params.id as string);

    return res.json({
      success: true,
      message: "Navbar link deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NAVBAR LINK ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Navbar link not found",
    });
  }
};
