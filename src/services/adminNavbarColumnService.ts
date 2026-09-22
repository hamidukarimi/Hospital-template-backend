import prisma from "../lib/prisma.js";

export const getAllNavbarColumns = async () => {
  return prisma.navigationItem.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      dropdownItems: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const getNavbarColumnById = async (id: string) => {
  return prisma.navigationItem.findUnique({
    where: { id },
    include: {
      dropdownItems: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const createNavbarColumn = async (data: {
  label: string;
  url: string;
  sortOrder?: number;
  isActive?: boolean;
}) => {
  return prisma.navigationItem.create({
    data: {
      label: data.label,
      url: data.url,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateNavbarColumn = async (
  id: string,
  data: Partial<{
    label: string;
    url: string;
    sortOrder: number;
    isActive: boolean;
  }>
) => {
  return prisma.navigationItem.update({
    where: { id },
    data,
  });
};

export const deleteNavbarColumn = async (id: string) => {
  return prisma.navigationItem.delete({
    where: { id },
  });
};
