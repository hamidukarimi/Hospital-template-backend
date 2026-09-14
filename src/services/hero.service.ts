import prisma from "../lib/prisma.js";

export const getHero = async () => {
  return prisma.heroSection.findFirst({
    where: {
      isActive: true,
    },
  });
};