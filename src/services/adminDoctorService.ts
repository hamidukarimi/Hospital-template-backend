import prisma from "../lib/prisma.js";

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

export const createDoctor = async (data: {
  name: string;
  specialty: string;
  description: string;
  image?: string;
  profileUrl?: string;
  category: string;
  isActive?: boolean;
  sortOrder?: number;
}) => {
  return prisma.doctor.create({
    data: {
      name: data.name,
      specialty: data.specialty,
      description: data.description,
      image: data.image ?? null,
      profileUrl: data.profileUrl ?? null,
      category: data.category,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
};

export const updateDoctor = async (
  id: string,
  data: Partial<{
    name: string;
    specialty: string;
    description: string;
    image: string | null;
    profileUrl: string | null;
    category: string;
    isActive: boolean;
    sortOrder: number;
  }>
) => {
  return prisma.doctor.update({
    where: { id },
    data,
  });
};

export const deleteDoctor = async (id: string) => {
  return prisma.doctor.delete({
    where: { id },
  });
};