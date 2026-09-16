import prisma from "../lib/prisma.js";

export const getAllTestimonials = async () => {
  return prisma.testimonial.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getTestimonialById = async (id: string) => {
  return prisma.testimonial.findUnique({
    where: { id },
  });
};

export const createTestimonial = async (data: {
  name: string;
  role?: string;
  content: string;
  image?: string;
  rating?: number;
  sortOrder?: number;
  isActive?: boolean;
}) => {
  return prisma.testimonial.create({
    data: {
      name: data.name,
      role: data.role ?? null,
      content: data.content,
      image: data.image ?? null,
      rating: data.rating ?? null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateTestimonial = async (
  id: string,
  data: Partial<{
    name: string;
    role: string | null;
    content: string;
    image: string | null;
    rating: number | null;
    sortOrder: number;
    isActive: boolean;
  }>
) => {
  return prisma.testimonial.update({
    where: { id },
    data,
  });
};

export const deleteTestimonial = async (id: string) => {
  return prisma.testimonial.delete({
    where: { id },
  });
};