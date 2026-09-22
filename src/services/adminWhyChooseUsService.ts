import prisma from "../lib/prisma.js";

export const getAllWhyChooseUs = async () => {
  return prisma.whyChooseUsItem.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getWhyChooseUsById = async (id: string) => {
  return prisma.whyChooseUsItem.findUnique({
    where: { id },
  });
};

export const createWhyChooseUs = async (data: {
  image?: string | null;
  title: string;
  description: string;
  color: string;
  sortOrder?: number;
  isActive?: boolean;
  linkText?: string | null;
  linkUrl?: string | null;
}) => {
  return prisma.whyChooseUsItem.create({
    data: {
      image: data.image ?? null,
      title: data.title,
      description: data.description,
      color: data.color,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      linkText: data.linkText ?? null,
      linkUrl: data.linkUrl ?? null,
    },
  });
};

export const updateWhyChooseUs = async (
  id: string,
  data: Partial<{
    image: string | null;
    title: string;
    description: string;
    color: string;
    sortOrder: number;
    isActive: boolean;
    linkText: string | null;
    linkUrl: string | null;
  }>
) => {
  return prisma.whyChooseUsItem.update({
    where: { id },
    data,
  });
};

export const deleteWhyChooseUs = async (id: string) => {
  return prisma.whyChooseUsItem.delete({
    where: { id },
  });
};
