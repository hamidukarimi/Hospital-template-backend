import prisma from "../lib/prisma.js";

export const getFooterSettings = async () => {
  return prisma.footerSettings.findFirst({
    include: {
      columns: {
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
      },
    },
  });
};

export const updateFooterSettings = async (
  data: Partial<{
    logo: string | null;
    location: string;
    visitingHours: string | null;
    phone: string;
  }>
) => {
  const existingSettings = await prisma.footerSettings.findFirst();

  if (!existingSettings) {
    throw new Error("Footer settings not found");
  }

  return prisma.footerSettings.update({
    where: {
      id: existingSettings.id,
    },
    data,
  });
};