import prisma from "../lib/prisma.js";

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
department?: string;
  message: string;
}

export const createContactSubmission = async (data: CreateContactInput) => {
  return await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department || "General Inquiry",
      message: data.message,
    },
  });
};

export const getSiteContactInfo = async () => {
  return await prisma.siteSettings.findFirst({
    select: {
      phone: true,
      emergencyPhone: true,
      email: true,
      address: true,
      mapEmbedUrl: true,
      sundayVisitingHours: true,
      mondayFridayVisitingHours: true,
    },
  });
};