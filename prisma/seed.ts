import prisma from "../src/lib/prisma.js";

async function main() {
  // ─────────────────────────────────────────────
  // SITE SETTINGS
  // ─────────────────────────────────────────────

  const siteSettings = await prisma.siteSettings.upsert({
    where: {
      id: "00000000-0000-0000-0000-000000000001",
    },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      hospitalName: "Aura Hospital",
      logo: "/images/logo-placeholder.png",
      phone: "+93 700 000 000",
      email: "info@aurahospital.com",
      address: "Kabul, Afghanistan",
      sundayVisitingHours: "09:00 AM - 05:00 PM",
      mondayFridayVisitingHours: "08:00 AM - 06:00 PM",

      socialMedia: {
        create: [
          {
            platform: "FACEBOOK",
            url: "https://facebook.com/",
          },
          {
            platform: "INSTAGRAM",
            url: "https://instagram.com/",
          },
          {
            platform: "TWITTER",
            url: "https://twitter.com/",
          },
          {
            platform: "LINKEDIN",
            url: "https://linkedin.com/",
          },
        ],
      },
    },
  });

  console.log("Site settings ready:", siteSettings.id);

  // ─────────────────────────────────────────────
  // HERO
  // ─────────────────────────────────────────────

  const hero = await prisma.heroSection.upsert({
    where: {
      id: "00000000-0000-0000-0000-000000000002",
    },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      smallTitle: "Your Health, Our Priority",
      title: "Exceptional Healthcare For Everyone",
      description:
        "Providing trusted healthcare services with experienced doctors and modern facilities.",
      buttonText: "Book an Appointment",
      buttonUrl: "/contact",
      backgroundImage: "/images/hero-placeholder.jpg",
      secondaryImage: null,
      informationCardTitle: "Emergency Care",
      informationCardDescription: "Available 24/7",
    },
  });

  console.log("Hero ready:", hero.id);

  // ─────────────────────────────────────────────
  // HELP SECTION
  // ─────────────────────────────────────────────

  const helpSection = await prisma.helpSection.upsert({
    where: {
      id: "00000000-0000-0000-0000-000000000003",
    },
    update: {
      title: "How can we help you today?",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      title: "How can we help you today?",
    },
  });

  console.log("Help section ready:", helpSection.id);

  const helpCards = [
    {
      id: "00000000-0000-0000-0000-000000000031",
      icon: "CalendarCheck",
      title: "Book an Appointment",
      description: "Schedule an appointment with one of our specialists.",
      buttonText: "Book Now",
      buttonUrl: "/contact",
      color: "#8B5CF6",
      sortOrder: 1,
    },
    {
      id: "00000000-0000-0000-0000-000000000032",
      icon: "Stethoscope",
      title: "Find a Doctor",
      description: "Find the right doctor for your healthcare needs.",
      buttonText: "Find Doctor",
      buttonUrl: "/doctors",
      color: "#22C55E",
      sortOrder: 2,
    },
    {
      id: "00000000-0000-0000-0000-000000000033",
      icon: "Phone",
      title: "Emergency Care",
      description: "Get immediate help from our emergency care team.",
      buttonText: "Contact Us",
      buttonUrl: "/contact",
      color: "#EF4444",
      sortOrder: 3,
    },
  ];

  for (const card of helpCards) {
    await prisma.helpCard.upsert({
      where: {
        id: card.id,
      },
      update: card,
      create: {
        ...card,
        helpSectionId: helpSection.id,
      },
    });
  }

  console.log("Help cards ready");

  // ─────────────────────────────────────────────
  // ABOUT
  // ─────────────────────────────────────────────

  const aboutSection = await prisma.aboutSection.upsert({
    where: {
      id: "00000000-0000-0000-0000-000000000004",
    },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000004",
      smallTitle: "About Aura Hospital",
      title: "Committed To Your Health And Wellbeing",
      description:
        "Aura Hospital provides trusted healthcare services with experienced professionals, modern facilities, and patient-centered care.",
      image: "/images/about-placeholder.jpg",
      buttonText: "Learn More",
      buttonUrl: "/about",
      informationImage: "/images/about-info-placeholder.jpg",
      informationTitle: "Trusted Healthcare",
      informationSubtitle: "Experienced medical professionals",
      informationLogo: "/images/logo-placeholder.png",
      rating: 4.9,
      badgeText: "Patients Trust Us",
      badgeValue: "10K+",
    },
  });

  console.log("About section ready:", aboutSection.id);

  // ─────────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────────

  const services = [
    {
      id: "00000000-0000-0000-0000-000000000101",
      title: "Emergency Care",
      description:
        "Fast and reliable emergency medical care when you need it most.",
      image: "/images/service-emergency.jpg",
      category: "Emergency",
      linkText: "Learn More",
      linkUrl: "/services/emergency",
      color: "#EF4444",
      sortOrder: 1,
    },
    {
      id: "00000000-0000-0000-0000-000000000102",
      title: "Specialist Doctors",
      description:
        "Connect with experienced doctors across multiple specialties.",
      image: "/images/service-doctors.jpg",
      category: "Doctors",
      linkText: "View Doctors",
      linkUrl: "/doctors",
      color: "#8B5CF6",
      sortOrder: 2,
    },
    {
      id: "00000000-0000-0000-0000-000000000103",
      title: "Laboratory Services",
      description: "Accurate laboratory testing with modern medical equipment.",
      image: "/images/service-lab.jpg",
      category: "Laboratory",
      linkText: "View Services",
      linkUrl: "/lab-tests",
      color: "#22C55E",
      sortOrder: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        id: service.id,
      },
      update: service,
      create: service,
    });
  }

  console.log("Services ready");

  // ─────────────────────────────────────────────
  // TESTIMONIALS
  // ─────────────────────────────────────────────

  const testimonials = [
    {
      id: "00000000-0000-0000-0000-000000000201",
      content:
        "The doctors and staff were professional, caring, and very helpful throughout my treatment.",
      name: "Sarah Johnson",
      role: "Patient",
      image: "/images/testimonial-1.jpg",
      rating: 5,
      sortOrder: 1,
    },
    {
      id: "00000000-0000-0000-0000-000000000202",
      content:
        "I had a great experience at Aura Hospital. The facilities are modern and the service is excellent.",
      name: "Michael Smith",
      role: "Patient",
      image: "/images/testimonial-2.jpg",
      rating: 5,
      sortOrder: 2,
    },
    {
      id: "00000000-0000-0000-0000-000000000203",
      content:
        "The medical team made me feel comfortable and explained everything clearly.",
      name: "Emily Davis",
      role: "Patient",
      image: "/images/testimonial-3.jpg",
      rating: 5,
      sortOrder: 3,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: {
        id: testimonial.id,
      },
      update: testimonial,
      create: testimonial,
    });
  }

  console.log("Testimonials ready");

  // ─────────────────────────────────────────────
  // WHY CHOOSE US
  // ─────────────────────────────────────────────

  const whyChooseUsItems = [
    {
      id: "00000000-0000-0000-0000-000000000301",
      title: "Experienced Doctors",
      description:
        "Our experienced medical professionals provide trusted and compassionate care.",
      icon: "Stethoscope",
      color: "#F7C12B",
      linkText: "Meet Our Doctors",
      linkUrl: "/doctors",
      sortOrder: 1,
    },
    {
      id: "00000000-0000-0000-0000-000000000302",
      title: "Modern Facilities",
      description:
        "We provide high-quality healthcare using modern facilities and technology.",
      icon: "Hospital",
      color: "#8B5CF6",
      linkText: "Learn More",
      linkUrl: "/about",
      sortOrder: 2,
    },
    {
      id: "00000000-0000-0000-0000-000000000303",
      title: "24/7 Emergency Care",
      description:
        "Our emergency services are available around the clock when you need us.",
      icon: "Clock",
      color: "#EF4444",
      linkText: "Emergency",
      linkUrl: "/contact",
      sortOrder: 3,
    },
  ];

  for (const item of whyChooseUsItems) {
    await prisma.whyChooseUsItem.upsert({
      where: {
        id: item.id,
      },
      update: item,
      create: item,
    });
  }

  console.log("Why Choose Us items ready");


  // ─────────────────────────────────────────────
// LAB TESTS / OFFERS
// ─────────────────────────────────────────────

const labTests = [
  {
    id: "00000000-0000-0000-0000-000000000401",
    title: "Complete Blood Test",
    description:
      "A comprehensive blood test to help evaluate your overall health.",
    image: "/images/lab-blood-test.jpg",
    discount: 20,
    price: 25,
    buttonText: "Book Test",
    buttonUrl: "/contact",
    color: "#8B5CF6",
    sortOrder: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000402",
    title: "Full Body Checkup",
    description:
      "A complete health screening designed to give you a clear picture of your health.",
    image: "/images/lab-full-body.jpg",
    discount: 30,
    price: 80,
    buttonText: "Book Checkup",
    buttonUrl: "/contact",
    color: "#22C55E",
    sortOrder: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000403",
    title: "Diabetes Screening",
    description:
      "Quick and reliable testing to monitor your blood sugar levels.",
    image: "/images/lab-diabetes.jpg",
    discount: 15,
    price: 20,
    buttonText: "Book Test",
    buttonUrl: "/contact",
    color: "#F7C12B",
    sortOrder: 3,
  },
];

for (const labTest of labTests) {
  await prisma.labTest.upsert({
    where: {
      id: labTest.id,
    },
    update: labTest,
    create: labTest,
  });
}

console.log("Lab tests ready");


// ─────────────────────────────────────────────
// DOCTORS
// ─────────────────────────────────────────────

const doctors = [
  {
    id: "00000000-0000-0000-0000-000000000501",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    description:
      "Experienced cardiologist specializing in comprehensive heart care.",
    image: "/images/doctor-1.jpg",
    profileUrl: "/doctors/sarah-johnson",
    category: "Cardiology",
    sortOrder: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000502",
    name: "Dr. Michael Smith",
    specialty: "Neurologist",
    description:
      "Specialist in neurological conditions and advanced patient care.",
    image: "/images/doctor-2.jpg",
    profileUrl: "/doctors/michael-smith",
    category: "Neurology",
    sortOrder: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000503",
    name: "Dr. Emily Davis",
    specialty: "Pediatrician",
    description:
      "Dedicated pediatrician providing compassionate healthcare for children.",
    image: "/images/doctor-3.jpg",
    profileUrl: "/doctors/emily-davis",
    category: "Pediatrics",
    sortOrder: 3,
  },
];

for (const doctor of doctors) {
  await prisma.doctor.upsert({
    where: { id: doctor.id },
    update: doctor,
    create: doctor,
  });
}

console.log("Doctors ready");


// ─────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────

const articles = [
  {
    id: "00000000-0000-0000-0000-000000000601",
    title: "5 Simple Ways to Maintain a Healthy Heart",
    excerpt:
      "Discover practical habits that can help you maintain better heart health.",
    content:
      "A healthy lifestyle, regular exercise, balanced nutrition, and routine medical checkups can help protect your heart.",
    image: "/images/article-1.jpg",
    category: "Health Tips",
    author: "Aura Hospital",
    publishedAt: new Date("2026-09-01"),
    readTime: 5,
    slug: "5-simple-ways-to-maintain-a-healthy-heart",
    isPublished: true,
    sortOrder: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000602",
    title: "Why Regular Health Checkups Matter",
    excerpt:
      "Regular checkups can help detect potential health problems early.",
    content:
      "Preventive healthcare and regular medical examinations play an important role in maintaining long-term health.",
    image: "/images/article-2.jpg",
    category: "Healthcare",
    author: "Aura Hospital",
    publishedAt: new Date("2026-09-05"),
    readTime: 4,
    slug: "why-regular-health-checkups-matter",
    isPublished: true,
    sortOrder: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000603",
    title: "How to Build a Healthier Daily Routine",
    excerpt:
      "Small daily habits can make a meaningful difference to your overall wellbeing.",
    content:
      "Getting enough sleep, staying active, eating nutritious foods, and managing stress can contribute to a healthier lifestyle.",
    image: "/images/article-3.jpg",
    category: "Wellness",
    author: "Aura Hospital",
    publishedAt: new Date("2026-09-10"),
    readTime: 6,
    slug: "how-to-build-a-healthier-daily-routine",
    isPublished: true,
    sortOrder: 3,
  },
];

for (const article of articles) {
  await prisma.article.upsert({
    where: { id: article.id },
    update: article,
    create: article,
  });
}

console.log("Articles ready");


// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

const footer = await prisma.footerSettings.upsert({
  where: {
    id: "00000000-0000-0000-0000-000000000701",
  },
  update: {
    logo: "/images/logo-placeholder.png",
    location: "Kabul, Afghanistan",
    visitingHours: "Mon - Fri: 08:00 AM - 06:00 PM",
    phone: "+93 700 000 000",
  },
  create: {
    id: "00000000-0000-0000-0000-000000000701",
    logo: "/images/logo-placeholder.png",
    location: "Kabul, Afghanistan",
    visitingHours: "Mon - Fri: 08:00 AM - 06:00 PM",
    phone: "+93 700 000 000",
  },
});

console.log("Footer settings ready");

const footerColumns = [
  {
    id: "00000000-0000-0000-0000-000000000711",
    title: "Quick Links",
    sortOrder: 1,
    links: [
      {
        id: "00000000-0000-0000-0000-000000000721",
        label: "About Us",
        url: "/about",
        sortOrder: 1,
      },
      {
        id: "00000000-0000-0000-0000-000000000722",
        label: "Services",
        url: "/services",
        sortOrder: 2,
      },
      {
        id: "00000000-0000-0000-0000-000000000723",
        label: "Doctors",
        url: "/doctors",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000712",
    title: "Patient Care",
    sortOrder: 2,
    links: [
      {
        id: "00000000-0000-0000-0000-000000000724",
        label: "Lab Tests",
        url: "/lab-tests",
        sortOrder: 1,
      },
      {
        id: "00000000-0000-0000-0000-000000000725",
        label: "Book Appointment",
        url: "/contact",
        sortOrder: 2,
      },
      {
        id: "00000000-0000-0000-0000-000000000726",
        label: "Contact Us",
        url: "/contact",
        sortOrder: 3,
      },
    ],
  },
];

for (const column of footerColumns) {
  const footerColumn = await prisma.footerColumn.upsert({
    where: {
      id: column.id,
    },
    update: {
      title: column.title,
      sortOrder: column.sortOrder,
    },
    create: {
      id: column.id,
      title: column.title,
      sortOrder: column.sortOrder,
      footerSettingsId: footer.id,
    },
  });

  for (const link of column.links) {
    await prisma.footerLink.upsert({
      where: {
        id: link.id,
      },
      update: {
        label: link.label,
        url: link.url,
        sortOrder: link.sortOrder,
      },
      create: {
        ...link,
        footerColumnId: footerColumn.id,
      },
    });
  }
}

console.log("Footer columns and links ready");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
