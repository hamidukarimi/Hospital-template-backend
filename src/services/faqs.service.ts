import prisma from "../lib/prisma.js";

export const getFaqs = async () => {
  return prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
};
