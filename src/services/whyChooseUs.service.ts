import prisma from "../lib/prisma.js";

export const getWhyChooseUs = async () => {
  return prisma.whyChooseUsItem.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};
