import prisma from "../lib/prisma.js";

export const getHelpSection = async () => {
  return prisma.helpSection.findFirst({
    where: {
      isActive: true,
    },
    include: {
      cards: {
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};