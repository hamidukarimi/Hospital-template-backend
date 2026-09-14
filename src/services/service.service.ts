import prisma from "../lib/prisma.js";

export const getServices = async () => {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
};