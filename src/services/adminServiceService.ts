import prisma from "../lib/prisma.js";

export const getAllServices = async () => {
  return prisma.service.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getServiceById = async (id: string) => {
  return prisma.service.findUnique({
    where: { id },
  });
};

export const createService = async (data: {
  title: string;
  description: string;
  image?: string;
  category: string;
  linkText: string;
  linkUrl: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
}) => {
  return prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      image: data.image ?? null,
      category: data.category,
      linkText: data.linkText,
      linkUrl: data.linkUrl,
      color: data.color ?? null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};

export const updateService = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    image: string | null;
    category: string;
    linkText: string;
    linkUrl: string;
    color: string | null;
    isActive: boolean;
    sortOrder: number;
  }>
) => {
  return prisma.service.update({
    where: { id },
    data,
  });
};

export const deleteService = async (id: string) => {
  return prisma.service.delete({
    where: { id },
  });
};