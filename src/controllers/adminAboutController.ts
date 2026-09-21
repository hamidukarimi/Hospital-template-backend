import type { Request, Response } from "express";
import {
  getAdminAbout,
  updateAdminAbout,
} from "../services/adminAboutService.js";
import type {
  AboutMilestoneItem,
  AboutStatItem,
} from "../services/about.service.js";

const normalizeStats = (value: unknown): AboutStatItem[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];

  const items: AboutStatItem[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const title = String(row.title ?? "").trim();
    const statValue = String(row.value ?? "").trim();
    const description = String(row.description ?? "").trim();
    if (!title && !statValue && !description) continue;

    items.push({
      icon: String(row.icon ?? "Users").trim() || "Users",
      value: statValue,
      title,
      description,
    });
  }

  return items;
};

const normalizeMilestones = (
  value: unknown,
): AboutMilestoneItem[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];

  const items: AboutMilestoneItem[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const year = String(row.year ?? "").trim();
    const title = String(row.title ?? "").trim();
    const description = String(row.description ?? "").trim();
    if (!year && !title && !description) continue;

    items.push({ year, title, description });
  }

  return items;
};

export const getAdminAboutController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const about = await getAdminAbout();

    return res.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("GET ADMIN ABOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch about information",
    });
  }
};

export const updateAdminAboutController = async (
  req: Request,
  res: Response,
) => {
  try {
    const body = req.body ?? {};

    if (!body.title || !body.description || !body.buttonText || !body.buttonUrl) {
      return res.status(400).json({
        success: false,
        message: "title, description, buttonText, and buttonUrl are required",
      });
    }

    const about = await updateAdminAbout({
      smallTitle: body.smallTitle ?? null,
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      image: body.image ?? null,
      buttonText: String(body.buttonText).trim(),
      buttonUrl: String(body.buttonUrl).trim(),
      informationImage: body.informationImage ?? null,
      informationTitle: body.informationTitle ?? null,
      informationSubtitle: body.informationSubtitle ?? null,
      informationLogo: body.informationLogo ?? null,
      rating: body.rating ?? null,
      badgeText: body.badgeText ?? null,
      badgeValue: body.badgeValue ?? null,
      heroBadge: body.heroBadge ?? null,
      heroTitle: body.heroTitle ?? null,
      heroTitleHighlight: body.heroTitleHighlight ?? null,
      heroSubtitle: body.heroSubtitle ?? null,
      heroButtonText: body.heroButtonText ?? null,
      heroImage: body.heroImage ?? null,
      heroImageCaption: body.heroImageCaption ?? null,
      missionTitle: body.missionTitle ?? null,
      missionTagline: body.missionTagline ?? null,
      missionDescription: body.missionDescription ?? null,
      missionButtonText: body.missionButtonText ?? null,
      visionTitle: body.visionTitle ?? null,
      visionTagline: body.visionTagline ?? null,
      visionDescription: body.visionDescription ?? null,
      visionButtonText: body.visionButtonText ?? null,
      statsEyebrow: body.statsEyebrow ?? null,
      statsTitle: body.statsTitle ?? null,
      statsDescription: body.statsDescription ?? null,
      stats: normalizeStats(body.stats),
      milestonesEyebrow: body.milestonesEyebrow ?? null,
      milestonesTitle: body.milestonesTitle ?? null,
      milestonesDescription: body.milestonesDescription ?? null,
      milestonesImage: body.milestonesImage ?? null,
      milestonesImageCaption: body.milestonesImageCaption ?? null,
      milestones: normalizeMilestones(body.milestones),
      ctaTitle: body.ctaTitle ?? null,
      ctaSubtitle: body.ctaSubtitle ?? null,
      ctaButtonText: body.ctaButtonText ?? null,
      ctaButtonUrl: body.ctaButtonUrl ?? null,
      isActive: body.isActive !== false,
    });

    return res.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("UPDATE ADMIN ABOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update about information",
    });
  }
};
