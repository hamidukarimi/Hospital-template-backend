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

export type DoctorNamedItem = {
  name: string;
  description?: string | null;
};

export type DoctorCertificationItem = {
  name: string;
  issuer?: string | null;
  year?: string | null;
};

export type DoctorLanguageItem = {
  name: string;
};

export type DoctorMembershipItem = {
  name: string;
  role?: string | null;
};

export type DoctorPublicationItem = {
  title: string;
  year?: string | null;
  venue?: string | null;
  url?: string | null;
};

export type DoctorTeachingItem = {
  title: string;
  institution?: string | null;
  year?: string | null;
};

export type DoctorInput = {
  name: string;
  slug?: string;
  specialty: string;
  credentials?: string | null;
  professionalTitle?: string | null;
  description?: string | null;
  carePhilosophy?: string | null;
  image?: string | null;
  profileUrl?: string | null;
  category?: string | null;
  yearsExperience?: string | null;
  patientsTreated?: string | null;
  rating?: string | null;
  overviewTitle?: string | null;
  specialties?: DoctorSpecialtyItem[] | null;
  clinicalInterests?: DoctorNamedItem[] | null;
  conditionsTreated?: DoctorNamedItem[] | null;
  procedures?: DoctorNamedItem[] | null;
  education?: DoctorEducationItem[] | null;
  certifications?: DoctorCertificationItem[] | null;
  languages?: DoctorLanguageItem[] | null;
  memberships?: DoctorMembershipItem[] | null;
  affiliations?: DoctorMembershipItem[] | null;
  achievements?: DoctorAchievementItem[] | null;
  researchInterests?: DoctorNamedItem[] | null;
  publications?: DoctorPublicationItem[] | null;
  teachingExperience?: DoctorTeachingItem[] | null;
  consultationType?: string | null;
  consultationLocation?: string | null;
  acceptingNewPatients?: boolean | null;
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

const asArray = <T>(value: T[] | null | undefined): T[] => value ?? [];

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
      professionalTitle: data.professionalTitle ?? null,
      description: data.description ?? null,
      carePhilosophy: data.carePhilosophy ?? null,
      image: data.image ?? null,
      profileUrl: resolveProfileUrl(slug, data.profileUrl),
      category: data.category ?? null,
      yearsExperience: data.yearsExperience ?? null,
      patientsTreated: data.patientsTreated ?? null,
      rating: data.rating ?? null,
      overviewTitle: data.overviewTitle ?? null,
      specialties: asArray(data.specialties),
      clinicalInterests: asArray(data.clinicalInterests),
      conditionsTreated: asArray(data.conditionsTreated),
      procedures: asArray(data.procedures),
      education: asArray(data.education),
      certifications: asArray(data.certifications),
      languages: asArray(data.languages),
      memberships: asArray(data.memberships),
      affiliations: asArray(data.affiliations),
      achievements: asArray(data.achievements),
      researchInterests: asArray(data.researchInterests),
      publications: asArray(data.publications),
      teachingExperience: asArray(data.teachingExperience),
      consultationType: data.consultationType ?? null,
      consultationLocation: data.consultationLocation ?? null,
      acceptingNewPatients: data.acceptingNewPatients ?? true,
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
  if (data.professionalTitle !== undefined)
    updateData.professionalTitle = data.professionalTitle;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.carePhilosophy !== undefined)
    updateData.carePhilosophy = data.carePhilosophy;
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
    updateData.specialties = asArray(data.specialties);
  if (data.clinicalInterests !== undefined)
    updateData.clinicalInterests = asArray(data.clinicalInterests);
  if (data.conditionsTreated !== undefined)
    updateData.conditionsTreated = asArray(data.conditionsTreated);
  if (data.procedures !== undefined)
    updateData.procedures = asArray(data.procedures);
  if (data.education !== undefined) updateData.education = asArray(data.education);
  if (data.certifications !== undefined)
    updateData.certifications = asArray(data.certifications);
  if (data.languages !== undefined) updateData.languages = asArray(data.languages);
  if (data.memberships !== undefined)
    updateData.memberships = asArray(data.memberships);
  if (data.affiliations !== undefined)
    updateData.affiliations = asArray(data.affiliations);
  if (data.achievements !== undefined)
    updateData.achievements = asArray(data.achievements);
  if (data.researchInterests !== undefined)
    updateData.researchInterests = asArray(data.researchInterests);
  if (data.publications !== undefined)
    updateData.publications = asArray(data.publications);
  if (data.teachingExperience !== undefined)
    updateData.teachingExperience = asArray(data.teachingExperience);
  if (data.consultationType !== undefined)
    updateData.consultationType = data.consultationType;
  if (data.consultationLocation !== undefined)
    updateData.consultationLocation = data.consultationLocation;
  if (data.acceptingNewPatients !== undefined)
    updateData.acceptingNewPatients = data.acceptingNewPatients;
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
