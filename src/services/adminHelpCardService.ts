import prisma from "../lib/prisma.js";

export const getAllHelpCards = async () => {
  return prisma.helpCard.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getHelpCardById = async (id: string) => {
  return prisma.helpCard.findUnique({
    where: { id },
  });
};

export const createHelpCard = async (data: {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  color: string;
  sortOrder?: number;
  isActive?: boolean;
  helpSectionId: string;
}) => {
  return prisma.helpCard.create({
    data: {
      icon: data.icon,
      title: data.title,
      description: data.description,
      buttonText: data.buttonText,
      buttonUrl: data.buttonUrl,
      color: data.color,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      helpSectionId: data.helpSectionId,
    },
  });
};

export const updateHelpCard = async (
  id: string,
  data: Partial<{
    icon: string;
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    color: string;
    sortOrder: number;
    isActive: boolean;
    helpSectionId: string;
  }>
) => {
  return prisma.helpCard.update({
    where: { id },
    data,
  });
};

export const deleteHelpCard = async (id: string) => {
  return prisma.helpCard.delete({
    where: { id },
  });
};