import prisma from "../lib/prisma.js";

export const getAllLabTests = async () => {
  return prisma.labTest.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getLabTestById = async (id: string) => {
  return prisma.labTest.findUnique({
    where: { id },
  });
};

export const createLabTest = async (data: {
  title: string;
  description: string;
  image?: string;
  discount?: number;
  price: number;
  buttonText: string;
  buttonUrl: string;
  color: string;
  isActive?: boolean;
  sortOrder?: number;
}) => {
  return prisma.labTest.create({
    data: {
      title: data.title,
      description: data.description,
      image: data.image ?? null,
      discount: data.discount ?? null,
      price: data.price,
      buttonText: data.buttonText,
      buttonUrl: data.buttonUrl,
      color: data.color,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};

export const updateLabTest = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    image: string | null;
    discount: number | null;
    price: number;
    buttonText: string;
    buttonUrl: string;
    color: string;
    isActive: boolean;
    sortOrder: number;
  }>
) => {
  return prisma.labTest.update({
    where: { id },
    data,
  });
};

export const deleteLabTest = async (id: string) => {
  return prisma.labTest.delete({
    where: { id },
  });
};