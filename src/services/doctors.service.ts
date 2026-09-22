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

export const getDoctorBySlug = async (slug: string) => {
  return prisma.doctor.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });
};
