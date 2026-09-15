import prisma from "../lib/prisma.js";

export const getFooter = async () => {
  return prisma.footerSettings.findFirst({
    include: {
      columns: {
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          links: {
            where: {
              isActive: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });
};
