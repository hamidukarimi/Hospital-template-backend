import prisma from "../lib/prisma.js";

export const getAllFooterLinks = async () => {
  return prisma.footerLink.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getFooterLinkById = async (id: string) => {
  return prisma.footerLink.findUnique({
    where: { id },
  });
};

export const createFooterLink = async (data: {
  label: string;
  url: string;
  sortOrder?: number;
  isActive?: boolean;
  footerColumnId: string;
}) => {
  return prisma.footerLink.create({
    data: {
      label: data.label,
      url: data.url,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      footerColumnId: data.footerColumnId,
    },
  });
};

export const updateFooterLink = async (
  id: string,
  data: Partial<{
    label: string;
    url: string;
    sortOrder: number;
    isActive: boolean;
    footerColumnId: string;
  }>
) => {
  return prisma.footerLink.update({
    where: { id },
    data,
  });
};

export const deleteFooterLink = async (id: string) => {
  return prisma.footerLink.delete({
    where: { id },
  });
};