import prisma from "../lib/prisma.js";

export const getServices = async () => {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
};

export const getServiceBySlug = async (slug: string) => {
  return prisma.service.findFirst({
    where: { slug, isActive: true },
    include: {
      metrics: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
    },
  });
};
