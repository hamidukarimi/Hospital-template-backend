import prisma from "../lib/prisma.js";

export const getAllFooterColumns = async () => {
  return prisma.footerColumn.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      links: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const getFooterColumnById = async (id: string) => {
  return prisma.footerColumn.findUnique({
    where: { id },
    include: {
      links: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const createFooterColumn = async (data: {
  title: string;
  sortOrder?: number;
  isActive?: boolean;
  footerSettingsId: string;
}) => {
  return prisma.footerColumn.create({
    data: {
      title: data.title,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      footerSettingsId: data.footerSettingsId,
    },
  });
};

export const updateFooterColumn = async (
  id: string,
  data: Partial<{
    title: string;
    sortOrder: number;
    isActive: boolean;
  }>
) => {
  return prisma.footerColumn.update({
    where: { id },
    data,
  });
};

export const deleteFooterColumn = async (id: string) => {
  return prisma.footerColumn.delete({
    where: { id },
  });
};