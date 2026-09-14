import prisma from "../lib/prisma.js";

export const getDoctors = async () => {
  return prisma.doctor.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};