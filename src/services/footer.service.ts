import prisma from "../lib/prisma";

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