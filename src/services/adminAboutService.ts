import prisma from "../lib/prisma.js";
import type { AboutUpdateInput } from "./about.service.js";
import { getOrCreateAbout, updateAbout } from "./about.service.js";

export const getAdminAbout = async () => {
  return getOrCreateAbout();
};

export const updateAdminAbout = async (data: AboutUpdateInput) => {
  return updateAbout(data);
};

export const getAboutRecordCount = async () => {
  return prisma.about.count();
};
