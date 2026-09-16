import prisma from "../lib/prisma.js";

export const getDashboardStats = async () => {
  const [
    services,
    doctors,
    articles,
    testimonials,
    helpCards,
    whyChooseUs,
    labTests,
    socialMedia,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.doctor.count(),
    prisma.article.count(),
    prisma.testimonial.count(),
    prisma.helpCard.count(),
    prisma.whyChooseUsItem.count(),
    prisma.labTest.count(),
    prisma.socialMedia.count(),
  ]);

  return {
    services,
    doctors,
    articles,
    testimonials,
    helpCards,
    whyChooseUs,
    labTests,
    socialMedia,
  };
};