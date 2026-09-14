import prisma from "../lib/prisma.js";

export const getAboutSection = async () => {
  return prisma.aboutSection.findFirst({
    where: { isActive: true },
  });
};