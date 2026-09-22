import prisma from "../lib/prisma.js";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type DoctorSpecialtyItem = {
  label: string;
  icon?: string | null;
  className?: string | null;
};

export type DoctorEducationItem = {
  year: string;
  title: string;
  institution: string;
};

export type DoctorAchievementItem = {
  label: string;
  icon?: string | null;
};

export type DoctorInput = {
  name: string;
  slug?: string;
  specialty: string;
  credentials?: string | null;
  description?: string | null;
  image?: string | null;
  profileUrl?: string | null;
  category?: string | null;
  yearsExperience?: string | null;
  patientsTreated?: string | null;
  rating?: string | null;
  overviewTitle?: string | null;
  specialties?: DoctorSpecialtyItem[] | null;
  education?: DoctorEducationItem[] | null;
  achievements?: DoctorAchievementItem[] | null;
  isActive?: boolean;
  sortOrder?: number;
};

const resolveSlug = (name: string, slug?: string) =>
  slugify(slug || name) || crypto.randomUUID();

const resolveProfileUrl = (
  slug: string,
  profileUrl?: string | null,
): string | null => {
  if (profileUrl !== undefined && profileUrl !== null) {
    const trimmed = profileUrl.trim();
    return trimmed || null;
  }

  return `/doctors/${slug}`;
};

export const getAllDoctors = async () => {
  return prisma.doctor.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getDoctorById = async (id: string) => {
  return prisma.doctor.findUnique({
    where: { id },
  });
};

export const createDoctor = async (data: DoctorInput) => {
  const slug = resolveSlug(data.name, data.slug);

  return prisma.doctor.create({
    data: {
      name: data.name,
      slug,
      specialty: data.specialty,
      credentials: data.credentials ?? null,
      description: data.description ?? null,
      image: data.image ?? null,
      profileUrl: resolveProfileUrl(slug, data.profileUrl),
      category: data.category ?? null,
      yearsExperience: data.yearsExperience ?? null,
      patientsTreated: data.patientsTreated ?? null,
      rating: data.rating ?? null,
      overviewTitle: data.overviewTitle ?? null,
      specialties: data.specialties ?? [],
      education: data.education ?? [],
      achievements: data.achievements ?? [],
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};

export const updateDoctor = async (id: string, data: Partial<DoctorInput>) => {
  const existing = await prisma.doctor.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Doctor not found");
  }

  const slug =
    data.slug !== undefined || data.name !== undefined
      ? resolveSlug(data.name ?? existing.name, data.slug ?? existing.slug)
      : existing.slug;

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined || data.name !== undefined) updateData.slug = slug;
  if (data.specialty !== undefined) updateData.specialty = data.specialty;
  if (data.credentials !== undefined) updateData.credentials = data.credentials;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.yearsExperience !== undefined)
    updateData.yearsExperience = data.yearsExperience;
  if (data.patientsTreated !== undefined)
    updateData.patientsTreated = data.patientsTreated;
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.overviewTitle !== undefined)
    updateData.overviewTitle = data.overviewTitle;
  if (data.specialties !== undefined)
    updateData.specialties = data.specialties ?? [];
  if (data.education !== undefined) updateData.education = data.education ?? [];
  if (data.achievements !== undefined)
    updateData.achievements = data.achievements ?? [];
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

  if (data.profileUrl !== undefined) {
    updateData.profileUrl = resolveProfileUrl(slug, data.profileUrl);
  } else if (data.slug !== undefined || data.name !== undefined) {
    const current = existing.profileUrl;
    if (!current || current === `/doctors/${existing.slug}`) {
      updateData.profileUrl = `/doctors/${slug}`;
    }
  }

  return prisma.doctor.update({
    where: { id },
    data: updateData,
  });
};

export const deleteDoctor = async (id: string) => {
  return prisma.doctor.delete({
    where: { id },
  });
};
