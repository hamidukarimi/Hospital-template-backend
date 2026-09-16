import prisma from "../lib/prisma.js";

export const getAllArticles = async () => {
  return prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getArticleById = async (id: string) => {
  return prisma.article.findUnique({
    where: { id },
  });
};

export const createArticle = async (data: {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author?: string;
  category: string;
  readTime?: number;
  isPublished?: boolean;
  publishedAt?: Date;
}) => {
  const baseSlug = data.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return prisma.article.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image ?? null,
      author: data.author ?? null,
      category: data.category,
      readTime: data.readTime ?? null,
      isPublished: data.isPublished ?? false,
      publishedAt: data.publishedAt ?? null,
    },
  });
};

export const updateArticle = async (
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string | null;
    author: string | null;
    category: string;
    readTime: number | null;
    isPublished: boolean;
    publishedAt: Date | null;
  }>
) => {
  return prisma.article.update({
    where: { id },
    data,
  });
};

export const deleteArticle = async (id: string) => {
  return prisma.article.delete({
    where: { id },
  });
};