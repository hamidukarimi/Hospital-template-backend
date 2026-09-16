import type { Request, Response } from "express";
import {
  createFooterLink,
  deleteFooterLink,
  getAllFooterLinks,
  getFooterLinkById,
  updateFooterLink,
} from "../services/adminFooterLinkService.js";

export const getFooterLinks = async (
  _req: Request,
  res: Response
) => {
  try {
    const links = await getAllFooterLinks();

    return res.json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error("GET FOOTER LINKS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer links",
    });
  }
};

export const getFooterLink = async (
  req: Request,
  res: Response
) => {
  try {
    const link = await getFooterLinkById(req.params.id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Footer link not found",
      });
    }

    return res.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("GET FOOTER LINK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer link",
    });
  }
};

export const addFooterLink = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      label,
      url,
      sortOrder,
      isActive,
      footerColumnId,
    } = req.body;

    if (!label || !url || !footerColumnId) {
      return res.status(400).json({
        success: false,
        message:
          "Label, URL, and footerColumnId are required",
      });
    }

    const link = await createFooterLink({
      label,
      url,
      sortOrder,
      isActive,
      footerColumnId,
    });

    return res.status(201).json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("CREATE FOOTER LINK ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create footer link",
    });
  }
};

export const editFooterLink = async (
  req: Request,
  res: Response
) => {
  try {
    const link = await updateFooterLink(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("UPDATE FOOTER LINK ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Footer link not found",
    });
  }
};

export const removeFooterLink = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteFooterLink(req.params.id);

    return res.json({
      success: true,
      message: "Footer link deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FOOTER LINK ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Footer link not found",
    });
  }
};