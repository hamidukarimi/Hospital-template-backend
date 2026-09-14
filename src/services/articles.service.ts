import prisma from "../lib/prisma";

export const getArticles = async () => {
  return prisma.article.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        sortOrder: "asc",
      },
    ],
  });
};