import prisma from "../lib/prisma.js";

export const getAllServices = async () => {
  return prisma.service.findMany({
    include: { metrics: { orderBy: { sortOrder: "asc" } } },
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getServiceById = async (id: string) => {
  return prisma.service.findUnique({
    where: { id },
    include: { metrics: { orderBy: { sortOrder: "asc" } } },
  });
};

export const createService = async (data: {
  title: string;
  slug?: string;
  description: string;
  image?: string;
  category: string;
  linkText: string;
  linkUrl: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
  ctaText?: string | null;
  ctaUrl?: string | null;
  overviewTitle?: string | null;
  overviewDescription?: string | null;
  metrics?: Array<{
    label: string;
    value: number;
    suffix?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  }>;
}) => {
  return prisma.service.create({
    data: {
      title: data.title,
      slug:
        data.slug ||
        data.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        crypto.randomUUID(),
      description: data.description,
      image: data.image ?? null,
      category: data.category,
      linkText: data.linkText,
      linkUrl: data.linkUrl,
      color: data.color ?? "",
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      ctaText: data.ctaText ?? null,
      ctaUrl: data.ctaUrl ?? null,
      overviewTitle: data.overviewTitle ?? null,
      overviewDescription: data.overviewDescription ?? null,
      metrics: data.metrics ? { create: data.metrics } : undefined,
    },
    include: {
      metrics: { orderBy: { sortOrder: "asc" } }, // Ensures returned created object contains metrics array
    },
  });
};

export const updateService = async (
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    image: string | null;
    category: string;
    linkText: string;
    linkUrl: string;
    color: string;
    isActive: boolean;
    sortOrder: number;
    ctaText: string | null;
    ctaUrl: string | null;
    overviewTitle: string | null;
    overviewDescription: string | null;
    metrics: Array<{
      label: string;
      value: number;
      suffix?: string | null;
      sortOrder?: number;
      isActive?: boolean;
    }>;
  }>,
) => {
  const { metrics, ...serviceData } = data;
  return prisma.$transaction(async (transaction) => {
    await transaction.service.update({
      where: { id },
      data: serviceData,
    });

    if (metrics) {
      await transaction.serviceMetric.deleteMany({ where: { serviceId: id } });
      if (metrics.length > 0) {
        await transaction.serviceMetric.createMany({
          data: metrics.map((metric) => ({ ...metric, serviceId: id })),
        });
      }
    }

    // Return the updated service with metrics populated
    return transaction.service.findUnique({
      where: { id },
      include: { metrics: { orderBy: { sortOrder: "asc" } } },
    });
  });
};

export const deleteService = async (id: string) => {
  return prisma.service.delete({
    where: { id },
  });
};