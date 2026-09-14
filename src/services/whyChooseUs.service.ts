import prisma from "../lib/prisma";

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