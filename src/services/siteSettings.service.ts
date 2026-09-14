import prisma from "../lib/prisma.js";

export const getSiteSettings = async () => {
  return prisma.siteSettings.findFirst({
    include: {
      socialMedia: true,
    },
  });
};