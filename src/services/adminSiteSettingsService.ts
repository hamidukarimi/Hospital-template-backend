import prisma from "../lib/prisma.js";

export const getSiteSettings = async () => {
  return prisma.siteSettings.findFirst();
};

export const updateSiteSettings = async (
  data: Partial<{
    hospitalName: string;
    logo: string | null;
    phone: string;
    email: string;
    address: string;
    sundayVisitingHours: string | null;
    mondayFridayVisitingHours: string | null;
  }>
) => {
  const existingSettings = await prisma.siteSettings.findFirst();

  if (!existingSettings) {
    throw new Error("Site settings not found");
  }

  return prisma.siteSettings.update({
    where: {
      id: existingSettings.id,
    },
    data,
  });
};