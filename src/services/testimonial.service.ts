import prisma from "../lib/prisma.js";

export const getTestimonials = async () => {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
};