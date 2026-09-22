import prisma from "../lib/prisma.js";

export const getAllFaqs = async () => {
  return prisma.faq.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getFaqById = async (id: string) => {
  return prisma.faq.findUnique({
    where: { id },
  });
};

export const createFaq = async (data: {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
  isActive?: boolean;
}) => {
  return prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category ?? null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateFaq = async (
  id: string,
  data: Partial<{
    question: string;
    answer: string;
    category: string | null;
    sortOrder: number;
    isActive: boolean;
  }>,
) => {
  return prisma.faq.update({
    where: { id },
    data,
  });
};

export const deleteFaq = async (id: string) => {
  return prisma.faq.delete({
    where: { id },
  });
};
