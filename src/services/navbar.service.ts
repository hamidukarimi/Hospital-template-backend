import prisma from "../lib/prisma.js";

export const getNavbar = async () => {
  return prisma.navigationItem.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      dropdownItems: {
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};
