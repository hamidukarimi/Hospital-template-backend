import type { Request, Response } from "express";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  type DoctorAchievementItem,
  type DoctorCertificationItem,
  type DoctorEducationItem,
  type DoctorLanguageItem,
  type DoctorMembershipItem,
  type DoctorNamedItem,
  type DoctorPublicationItem,
  type DoctorSpecialtyItem,
  type DoctorTeachingItem,
} from "../services/adminDoctorService.js";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asTrimmedString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const parseNamedItems = (
  value: unknown,
  fieldName: string,
): { ok: true; data: DoctorNamedItem[] } | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: `${fieldName} must be an array` };
  }

  const items: DoctorNamedItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: `Each ${fieldName} item must be an object` };
    }
    const name = asTrimmedString(entry.name);
    if (!name) {
      return {
        ok: false,
        message: `Each ${fieldName} item requires a non-empty name`,
      };
    }
    items.push({
      name,
      description: asTrimmedString(entry.description),
    });
  }

  return { ok: true, data: items };
};

const parseSpecialties = (
  value: unknown,
): { ok: true; data: DoctorSpecialtyItem[] } | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: "specialties must be an array" };
  }

  const items: DoctorSpecialtyItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: "Each specialty must be an object" };
    }
    const label = asTrimmedString(entry.label);
    if (!label) {
      return { ok: false, message: "Each specialty requires a non-empty label" };
    }
    items.push({
      label,
      icon: asTrimmedString(entry.icon),
      className: asTrimmedString(entry.className),
    });
  }

  return { ok: true, data: items };
};

const parseEducation = (
  value: unknown,
): { ok: true; data: DoctorEducationItem[] } | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: "education must be an array" };
  }

  const items: DoctorEducationItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: "Each education item must be an object" };
    }
    const year = asTrimmedString(entry.year) ?? "";
    const title = asTrimmedString(entry.title);
    const institution = asTrimmedString(entry.institution);
    if (!title || !institution) {
      return {
        ok: false,
        message: "Each education item requires title and institution",
      };
    }
    items.push({ year, title, institution });
  }

  return { ok: true, data: items };
};

const parseCertifications = (
  value: unknown,
):
  | { ok: true; data: DoctorCertificationItem[] }
  | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: "certifications must be an array" };
  }

  const items: DoctorCertificationItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: "Each certification must be an object" };
    }
    const name = asTrimmedString(entry.name);
    if (!name) {
      return {
        ok: false,
        message: "Each certification requires a non-empty name",
      };
    }
    items.push({
      name,
      issuer: asTrimmedString(entry.issuer),
      year: asTrimmedString(entry.year),
    });
  }

  return { ok: true, data: items };
};

const parseLanguages = (
  value: unknown,
): { ok: true; data: DoctorLanguageItem[] } | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: "languages must be an array" };
  }

  const items: DoctorLanguageItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: "Each language must be an object" };
    }
    const name = asTrimmedString(entry.name);
    if (!name) {
      return { ok: false, message: "Each language requires a non-empty name" };
    }
    items.push({ name });
  }

  return { ok: true, data: items };
};

const parseMemberships = (
  value: unknown,
  fieldName: string,
):
  | { ok: true; data: DoctorMembershipItem[] }
  | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: `${fieldName} must be an array` };
  }

  const items: DoctorMembershipItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: `Each ${fieldName} item must be an object` };
    }
    const name = asTrimmedString(entry.name);
    if (!name) {
      return {
        ok: false,
        message: `Each ${fieldName} item requires a non-empty name`,
      };
    }
    items.push({
      name,
      role: asTrimmedString(entry.role),
    });
  }

  return { ok: true, data: items };
};

const parseAchievements = (
  value: unknown,
):
  | { ok: true; data: DoctorAchievementItem[] }
  | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: "achievements must be an array" };
  }

  const items: DoctorAchievementItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: "Each achievement must be an object" };
    }
    const label = asTrimmedString(entry.label);
    if (!label) {
      return {
        ok: false,
        message: "Each achievement requires a non-empty label",
      };
    }
    items.push({
      label,
      icon: asTrimmedString(entry.icon),
    });
  }

  return { ok: true, data: items };
};

const parsePublications = (
  value: unknown,
):
  | { ok: true; data: DoctorPublicationItem[] }
  | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: "publications must be an array" };
  }

  const items: DoctorPublicationItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return { ok: false, message: "Each publication must be an object" };
    }
    const title = asTrimmedString(entry.title);
    if (!title) {
      return {
        ok: false,
        message: "Each publication requires a non-empty title",
      };
    }
    items.push({
      title,
      year: asTrimmedString(entry.year),
      venue: asTrimmedString(entry.venue),
      url: asTrimmedString(entry.url),
    });
  }

  return { ok: true, data: items };
};

const parseTeaching = (
  value: unknown,
): { ok: true; data: DoctorTeachingItem[] } | { ok: false; message: string } => {
  if (value === undefined || value === null) return { ok: true, data: [] };
  if (!Array.isArray(value)) {
    return { ok: false, message: "teachingExperience must be an array" };
  }

  const items: DoctorTeachingItem[] = [];
  for (const entry of value) {
    if (!isObject(entry)) {
      return {
        ok: false,
        message: "Each teachingExperience item must be an object",
      };
    }
    const title = asTrimmedString(entry.title);
    if (!title) {
      return {
        ok: false,
        message: "Each teachingExperience item requires a non-empty title",
      };
    }
    items.push({
      title,
      institution: asTrimmedString(entry.institution),
      year: asTrimmedString(entry.year),
    });
  }

  return { ok: true, data: items };
};

const parseDoctorBody = (body: Record<string, unknown>, requireCore: boolean) => {
  const name = asTrimmedString(body.name);
  const specialty = asTrimmedString(body.specialty);

  if (requireCore && (!name || !specialty)) {
    return {
      ok: false as const,
      message: "Required fields are missing",
    };
  }

  const specialties = parseSpecialties(body.specialties);
  if (!specialties.ok) return specialties;

  const clinicalInterests = parseNamedItems(
    body.clinicalInterests,
    "clinicalInterests",
  );
  if (!clinicalInterests.ok) return clinicalInterests;

  const conditionsTreated = parseNamedItems(
    body.conditionsTreated,
    "conditionsTreated",
  );
  if (!conditionsTreated.ok) return conditionsTreated;

  const procedures = parseNamedItems(body.procedures, "procedures");
  if (!procedures.ok) return procedures;

  const education = parseEducation(body.education);
  if (!education.ok) return education;

  const certifications = parseCertifications(body.certifications);
  if (!certifications.ok) return certifications;

  const languages = parseLanguages(body.languages);
  if (!languages.ok) return languages;

  const memberships = parseMemberships(body.memberships, "memberships");
  if (!memberships.ok) return memberships;

  const affiliations = parseMemberships(body.affiliations, "affiliations");
  if (!affiliations.ok) return affiliations;

  const achievements = parseAchievements(body.achievements);
  if (!achievements.ok) return achievements;

  const researchInterests = parseNamedItems(
    body.researchInterests,
    "researchInterests",
  );
  if (!researchInterests.ok) return researchInterests;

  const publications = parsePublications(body.publications);
  if (!publications.ok) return publications;

  const teachingExperience = parseTeaching(body.teachingExperience);
  if (!teachingExperience.ok) return teachingExperience;

  const acceptingNewPatients =
    body.acceptingNewPatients === undefined
      ? undefined
      : Boolean(body.acceptingNewPatients);

  return {
    ok: true as const,
    data: {
      name: name ?? undefined,
      slug: asTrimmedString(body.slug) ?? undefined,
      specialty: specialty ?? undefined,
      credentials: body.credentials === undefined ? undefined : asTrimmedString(body.credentials),
      professionalTitle:
        body.professionalTitle === undefined
          ? undefined
          : asTrimmedString(body.professionalTitle),
      description:
        body.description === undefined
          ? undefined
          : asTrimmedString(body.description),
      carePhilosophy:
        body.carePhilosophy === undefined
          ? undefined
          : asTrimmedString(body.carePhilosophy),
      image: body.image === undefined ? undefined : asTrimmedString(body.image),
      profileUrl:
        body.profileUrl === undefined
          ? undefined
          : asTrimmedString(body.profileUrl),
      category:
        body.category === undefined ? undefined : asTrimmedString(body.category),
      yearsExperience:
        body.yearsExperience === undefined
          ? undefined
          : asTrimmedString(body.yearsExperience),
      patientsTreated:
        body.patientsTreated === undefined
          ? undefined
          : asTrimmedString(body.patientsTreated),
      rating: body.rating === undefined ? undefined : asTrimmedString(body.rating),
      overviewTitle:
        body.overviewTitle === undefined
          ? undefined
          : asTrimmedString(body.overviewTitle),
      specialties: body.specialties === undefined ? undefined : specialties.data,
      clinicalInterests:
        body.clinicalInterests === undefined
          ? undefined
          : clinicalInterests.data,
      conditionsTreated:
        body.conditionsTreated === undefined
          ? undefined
          : conditionsTreated.data,
      procedures: body.procedures === undefined ? undefined : procedures.data,
      education: body.education === undefined ? undefined : education.data,
      certifications:
        body.certifications === undefined ? undefined : certifications.data,
      languages: body.languages === undefined ? undefined : languages.data,
      memberships: body.memberships === undefined ? undefined : memberships.data,
      affiliations:
        body.affiliations === undefined ? undefined : affiliations.data,
      achievements:
        body.achievements === undefined ? undefined : achievements.data,
      researchInterests:
        body.researchInterests === undefined
          ? undefined
          : researchInterests.data,
      publications:
        body.publications === undefined ? undefined : publications.data,
      teachingExperience:
        body.teachingExperience === undefined
          ? undefined
          : teachingExperience.data,
      consultationType:
        body.consultationType === undefined
          ? undefined
          : asTrimmedString(body.consultationType),
      consultationLocation:
        body.consultationLocation === undefined
          ? undefined
          : asTrimmedString(body.consultationLocation),
      acceptingNewPatients,
      isActive:
        body.isActive === undefined ? undefined : Boolean(body.isActive),
      sortOrder:
        body.sortOrder === undefined
          ? undefined
          : Number(body.sortOrder) || 0,
    },
  };
};

export const getDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await getAllDoctors();

    return res.json({
      success: true,
      data: doctors,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

export const getDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await getDoctorById(req.params.id as string);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.json({
      success: true,
      data: doctor,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
    });
  }
};

export const addDoctor = async (req: Request, res: Response) => {
  try {
    const parsed = parseDoctorBody(req.body ?? {}, true);
    if (!parsed.ok) {
      return res.status(400).json({
        success: false,
        message: parsed.message,
      });
    }

    if (!parsed.data.name || !parsed.data.specialty) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const doctor = await createDoctor({
      ...parsed.data,
      name: parsed.data.name,
      specialty: parsed.data.specialty,
    });

    return res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to create doctor",
    });
  }
};

export const editDoctor = async (req: Request, res: Response) => {
  try {
    const parsed = parseDoctorBody(req.body ?? {}, false);
    if (!parsed.ok) {
      return res.status(400).json({
        success: false,
        message: parsed.message,
      });
    }

    const doctor = await updateDoctor(req.params.id as string, parsed.data);

    return res.json({
      success: true,
      data: doctor,
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }
};

export const removeDoctor = async (req: Request, res: Response) => {
  try {
    await deleteDoctor(req.params.id as string);

    return res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }
};
