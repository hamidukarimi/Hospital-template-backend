import prisma from "../lib/prisma.js";

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

export const getArticleBySlug = async (slug: string) => {
  return prisma.article.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });
};
