import prisma from "../lib/prisma.js";

export const getAllSocialMedia = async () => {
  return prisma.socialMedia.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getSocialMediaById = async (id: string) => {
  return prisma.socialMedia.findUnique({
    where: { id },
  });
};

export const createSocialMedia = async (data: {
  platform: string;
  url: string;
  isActive?: boolean;
  siteSettingsId: string;
}) => {
  return prisma.socialMedia.create({
    data: {
      platform: data.platform as any,
      url: data.url,
      isActive: data.isActive ?? true,
      siteSettingsId: data.siteSettingsId,
    },
  });
};

export const updateSocialMedia = async (
  id: string,
  data: Partial<{
    platform: string;
    url: string;
    isActive: boolean;
  }>
) => {
  return prisma.socialMedia.update({
    where: { id },
    data: {
      ...data,
      platform: data.platform as any,
    },
  });
};

export const deleteSocialMedia = async (id: string) => {
  return prisma.socialMedia.delete({
    where: { id },
  });
};