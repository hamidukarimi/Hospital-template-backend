import prisma from "../lib/prisma.js";

/** Kept so footer columns/links can resolve a footer settings id. */
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
