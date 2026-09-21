import prisma from "../lib/prisma.js";

export type AboutStatItem = {
  icon?: string;
  value: string;
  title: string;
  description: string;
};

export type AboutMilestoneItem = {
  year: string;
  title: string;
  description: string;
};

export type AboutUpdateInput = {
  smallTitle?: string | null;
  title?: string;
  description?: string;
  image?: string | null;
  buttonText?: string;
  buttonUrl?: string;
  informationImage?: string | null;
  informationTitle?: string | null;
  informationSubtitle?: string | null;
  informationLogo?: string | null;
  rating?: number | string | null;
  badgeText?: string | null;
  badgeValue?: string | null;
  heroBadge?: string | null;
  heroTitle?: string | null;
  heroTitleHighlight?: string | null;
  heroSubtitle?: string | null;
  heroButtonText?: string | null;
  heroImage?: string | null;
  heroImageCaption?: string | null;
  missionTitle?: string | null;
  missionTagline?: string | null;
  missionDescription?: string | null;
  missionButtonText?: string | null;
  visionTitle?: string | null;
  visionTagline?: string | null;
  visionDescription?: string | null;
  visionButtonText?: string | null;
  statsEyebrow?: string | null;
  statsTitle?: string | null;
  statsDescription?: string | null;
  stats?: AboutStatItem[] | null;
  milestonesEyebrow?: string | null;
  milestonesTitle?: string | null;
  milestonesDescription?: string | null;
  milestonesImage?: string | null;
  milestonesImageCaption?: string | null;
  milestones?: AboutMilestoneItem[] | null;
  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
  ctaButtonText?: string | null;
  ctaButtonUrl?: string | null;
  isActive?: boolean;
};

const DEFAULT_STATS: AboutStatItem[] = [
  {
    icon: "Calendar",
    value: "25+",
    title: "Years Experience",
    description: "A legacy of trust, care and innovation",
  },
  {
    icon: "Users",
    value: "150+",
    title: "Specialists",
    description: "World-class doctors across multiple fields",
  },
  {
    icon: "HeartHandshake",
    value: "50k+",
    title: "Patients Treated",
    description: "Real people. Real stories. Healthier tomorrows.",
  },
];

const DEFAULT_MILESTONES: AboutMilestoneItem[] = [
  {
    year: "2000",
    title: "The Beginning",
    description:
      "AuraTech Healthcare was founded with a simple belief — better healthcare for a brighter future.",
  },
  {
    year: "2008",
    title: "Our First Hospital",
    description:
      "Opened our first modern hospital, bringing advanced care to our local community.",
  },
  {
    year: "2015",
    title: "Expanding Our Services",
    description:
      "Added specialized departments including Cardiology, Neurology, Oncology and more.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description:
      "Introduced modern health tech solutions, including telemedicine and AI-powered diagnostics.",
  },
  {
    year: "2025",
    title: "A Healthier Tomorrow",
    description:
      "Today, we continue to grow — with more specialists, more locations, and a bigger mission.",
  },
];

const defaultAboutCreateData = {
  singletonKey: "default",
  smallTitle: "About Aura Hospital",
  title: "Committed To Your Health And Wellbeing",
  description:
    "Aura Hospital provides trusted healthcare services with experienced professionals, modern facilities, and patient-centered care.",
  image: "/uploads/about/about.png",
  buttonText: "Learn More",
  buttonUrl: "/about",
  informationImage: "/uploads/about/about.png",
  informationTitle: "Trusted Healthcare",
  informationSubtitle: "Experienced medical professionals",
  informationLogo: "/uploads/site/logo.svg",
  rating: 4.9,
  badgeText: "Patients Trust Us",
  badgeValue: "10K+",
  heroBadge: "Pioneering Modern Healthcare",
  heroTitle: "Combining Advanced Technology with",
  heroTitleHighlight: "Compassionate Human Care",
  heroSubtitle:
    "At AuraTech Healthcare, we believe the future of medicine lies in the perfect balance between cutting-edge technology and the human touch. We're here to provide world-class healthcare with empathy, dignity, and innovation.",
  heroButtonText: "Our Story",
  heroImage:
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000",
  heroImageCaption: "Better Health, Brighter Futures",
  missionTitle: "Our Mission",
  missionTagline: "Better Care. A Healthier Tomorrow.",
  missionDescription:
    "Our mission is to deliver exceptional, patient-centered healthcare by combining advanced medical technology, expertise, and genuine compassion — improving lives and building healthier communities.",
  missionButtonText: "Learn More",
  visionTitle: "Our Vision",
  visionTagline: "A Healthier World, Powered by Innovation.",
  visionDescription:
    "We envision a future where everyone has access to high-quality, personalized healthcare — where technology empowers people, and compassion remains at the heart of every decision.",
  visionButtonText: "Learn More",
  statsEyebrow: "OUR IMPACT",
  statsTitle: "Trusted by Thousands, Driven by Excellence",
  statsDescription:
    "For over two decades, we've been committed to providing high-quality healthcare and making a difference in people's lives.",
  stats: DEFAULT_STATS,
  milestonesEyebrow: "OUR JOURNEY",
  milestonesTitle: "Key Milestones",
  milestonesDescription:
    "From a small clinic to a leading healthcare provider, our journey has always been guided by one purpose — creating a healthier future for everyone.",
  milestonesImage:
    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1000",
  milestonesImageCaption: "Modern Facilities. Compassionate Care.",
  milestones: DEFAULT_MILESTONES,
  ctaTitle: "Your Health. Our Priority.",
  ctaSubtitle: "Experience the future of healthcare with AuraTech.",
  ctaButtonText: "Book Appointment",
  ctaButtonUrl: "/contact",
  isActive: true,
};

const buildUpdateData = (data: AboutUpdateInput) => {
  const updateData: Record<string, unknown> = {};

  const keys: (keyof AboutUpdateInput)[] = [
    "smallTitle",
    "title",
    "description",
    "image",
    "buttonText",
    "buttonUrl",
    "informationImage",
    "informationTitle",
    "informationSubtitle",
    "informationLogo",
    "badgeText",
    "badgeValue",
    "heroBadge",
    "heroTitle",
    "heroTitleHighlight",
    "heroSubtitle",
    "heroButtonText",
    "heroImage",
    "heroImageCaption",
    "missionTitle",
    "missionTagline",
    "missionDescription",
    "missionButtonText",
    "visionTitle",
    "visionTagline",
    "visionDescription",
    "visionButtonText",
    "statsEyebrow",
    "statsTitle",
    "statsDescription",
    "milestonesEyebrow",
    "milestonesTitle",
    "milestonesDescription",
    "milestonesImage",
    "milestonesImageCaption",
    "ctaTitle",
    "ctaSubtitle",
    "ctaButtonText",
    "ctaButtonUrl",
    "isActive",
  ];

  for (const key of keys) {
    if (data[key] !== undefined) {
      updateData[key] = data[key];
    }
  }

  if (data.rating !== undefined) {
    updateData.rating =
      data.rating === null || data.rating === "" ? null : Number(data.rating);
  }

  if (data.stats !== undefined) {
    updateData.stats = data.stats ?? [];
  }

  if (data.milestones !== undefined) {
    updateData.milestones = data.milestones ?? [];
  }

  return updateData;
};

export const getAbout = async () => {
  return prisma.about.findUnique({
    where: { singletonKey: "default" },
  });
};

export const getOrCreateAbout = async () => {
  const existing = await getAbout();
  if (existing) return existing;

  return prisma.about.create({
    data: defaultAboutCreateData,
  });
};

export const updateAbout = async (data: AboutUpdateInput) => {
  const existing = await getOrCreateAbout();

  return prisma.about.update({
    where: { id: existing.id },
    data: buildUpdateData(data),
  });
};
