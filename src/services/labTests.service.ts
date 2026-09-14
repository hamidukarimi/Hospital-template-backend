import prisma from "../lib/prisma.js";

export const getLabTests = async () => {
  return prisma.labTest.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};