import prisma from "../lib/prisma.js";

export const getAllNavbarLinks = async () => {
  return prisma.dropdownItem.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getNavbarLinkById = async (id: string) => {
  return prisma.dropdownItem.findUnique({
    where: { id },
  });
};

export const createNavbarLink = async (data: {
  label: string;
  url: string;
  sortOrder?: number;
  isActive?: boolean;
  navigationItemId: string;
}) => {
  return prisma.dropdownItem.create({
    data: {
      label: data.label,
      url: data.url,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      navigationItemId: data.navigationItemId,
    },
  });
};

export const updateNavbarLink = async (
  id: string,
  data: Partial<{
    label: string;
    url: string;
    sortOrder: number;
    isActive: boolean;
    navigationItemId: string;
  }>
) => {
  return prisma.dropdownItem.update({
    where: { id },
    data,
  });
};

export const deleteNavbarLink = async (id: string) => {
  return prisma.dropdownItem.delete({
    where: { id },
  });
};
