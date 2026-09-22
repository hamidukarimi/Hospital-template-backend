import prisma from "../src/lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);

  await prisma.admin.upsert({
    where: {
      email: "admin@aurahospital.com",
    },
    update: {},
    create: {
      name: "Aura Hospital Admin",
      email: "admin@aurahospital.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  // ─────────────────────────────────────────────
  // SITE SETTINGS
  // ─────────────────────────────────────────────

  const siteSettings = await prisma.siteSettings.upsert({
    where: {
      id: "00000000-0000-0000-0000-000000000001",
    },
    update: {
      hospitalName: "Aura Hospital",
      logo: "/uploads/site/logo.svg",
      phone: "+93 700 000 000",
      emergencyPhone: "+93 700 111 911",
      email: "info@aurahospital.com",
      address: "Kabul, Afghanistan",
      sundayVisitingHours: "09:00 AM - 05:00 PM",
      mondayFridayVisitingHours: "08:00 AM - 06:00 PM",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      hospitalName: "Aura Hospital",
      logo: "/uploads/site/logo.svg",
      phone: "+93 700 000 000",
      emergencyPhone: "+93 700 111 911",
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
    update: {
      smallTitle: "Your Health, Our Priority",
      title: "Exceptional Healthcare For Everyone",
      description:
        "Providing trusted healthcare services with experienced doctors and modern facilities.",
      buttonText: "Book an Appointment",
      buttonUrl: "/contact",
      backgroundImage: "/uploads/hero/hero.jpg",
      secondaryImage: null,
      informationCardTitle: "Emergency Care",
      informationCardDescription: "Available 24/7",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      smallTitle: "Your Health, Our Priority",
      title: "Exceptional Healthcare For Everyone",
      description:
        "Providing trusted healthcare services with experienced doctors and modern facilities.",
      buttonText: "Book an Appointment",
      buttonUrl: "/contact",
      backgroundImage: "/uploads/hero/hero.jpg",
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
  // ABOUT (singleton institutional information)
  // ─────────────────────────────────────────────

  const about = await prisma.about.upsert({
    where: {
      singletonKey: "default",
    },
    update: {
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
      stats: [
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
      ],
      milestonesEyebrow: "OUR JOURNEY",
      milestonesTitle: "Key Milestones",
      milestonesDescription:
        "From a small clinic to a leading healthcare provider, our journey has always been guided by one purpose — creating a healthier future for everyone.",
      milestonesImage:
        "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1000",
      milestonesImageCaption: "Modern Facilities. Compassionate Care.",
      milestones: [
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
      ],
      ctaTitle: "Your Health. Our Priority.",
      ctaSubtitle: "Experience the future of healthcare with AuraTech.",
      ctaButtonText: "Book Appointment",
      ctaButtonUrl: "/contact",
      isActive: true,
    },
    create: {
      id: "00000000-0000-0000-0000-000000000004",
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
      stats: [
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
      ],
      milestonesEyebrow: "OUR JOURNEY",
      milestonesTitle: "Key Milestones",
      milestonesDescription:
        "From a small clinic to a leading healthcare provider, our journey has always been guided by one purpose — creating a healthier future for everyone.",
      milestonesImage:
        "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1000",
      milestonesImageCaption: "Modern Facilities. Compassionate Care.",
      milestones: [
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
      ],
      ctaTitle: "Your Health. Our Priority.",
      ctaSubtitle: "Experience the future of healthcare with AuraTech.",
      ctaButtonText: "Book Appointment",
      ctaButtonUrl: "/contact",
      isActive: true,
    },
  });

  console.log("About information ready:", about.id);

  // ─────────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────────

  const services = [
    {
      id: "00000000-0000-0000-0000-000000000101",
      title: "Emergency Care",
      description:
        "Fast and reliable emergency medical care when you need it most.",
      image: "/uploads/services/service-emergency.jpg",
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
      image: "/uploads/services/service-doctors.jpg",
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
      image: "/uploads/services/service-lab.jpg",
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
      name: "Sarah Ahmadi",
      role: "Patient",
      image: "/uploads/site/testimonial-1.png",
      rating: 5,
      sortOrder: 1,
    },
    {
      id: "00000000-0000-0000-0000-000000000202",
      content:
        "I had a great experience at Aura Hospital. The facilities are modern and the service is excellent.",
      name: "Mohammad Azizi",
      role: "Patient",
      image: "/uploads/site/testimonial-2.png",
      rating: 5,
      sortOrder: 2,
    },
    {
      id: "00000000-0000-0000-0000-000000000203",
      content:
        "The medical team made me feel comfortable and explained everything clearly.",
      name: "Laila Mohammadi",
      role: "Patient",
      image: "/uploads/site/testimonial-3.png",
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
      image: "/uploads/why-choose-us/doctors.jpg",
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
      image: "/uploads/why-choose-us/facilities.jpg",
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
      image: "/uploads/why-choose-us/emergency.jpg",
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
      icon: "Activity",
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
      icon: "ScanLine",
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
      icon: "FlaskConical",
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
      id: "33333333-3333-3333-3333-333333333331",
      name: "Dr. Ahmad Rahimi",
      specialty: "Cardiologist",
      description:
        "Experienced cardiologist focused on heart health, prevention, diagnosis, and personalized treatment.",
      image: "/uploads/doctors/doctor-1.jpg",
      profileUrl: "/doctors/ahmad-rahimi",
      category: "Cardiology",
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "33333333-3333-3333-3333-333333333332",
      name: "Dr. Farzana Safi",
      specialty: "Neurologist",
      description:
        "Dedicated neurologist providing comprehensive care for neurological conditions and disorders.",
      image: "/uploads/doctors/doctor-2.jpg",
      profileUrl: "/doctors/farzana-safi",
      category: "Neurology",
      isActive: true,
      sortOrder: 2,
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Dr. Mohammad Wali Noori",
      specialty: "Pediatrician",
      description:
        "Caring pediatrician committed to providing safe, compassionate healthcare for children and families.",
      image: "/uploads/doctors/doctor-3.jpg",
      profileUrl: "/doctors/mohammad-wali-noori",
      category: "Pediatrics",
      isActive: true,
      sortOrder: 3,
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Dr. Badam Samadazai",
      specialty: "Pediatrician",
      description:
        "Caring pediatrician committed to providing safe, compassionate healthcare for children and families.",
      image: "/uploads/doctors/doctor-3.jpg",
      profileUrl: "/doctors/badam-samadazai",
      category: "Pediatrics",
      isActive: true,
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
      image: "/uploads/articles/article-1.png",
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
      image: "/uploads/articles/article-2.png",
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
      image: "/uploads/articles/article-3.png",
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
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000701",
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

  // ─────────────────────────────────────────────
  // NAVBAR
  // ─────────────────────────────────────────────

  const navbarColumns = [
    {
      id: "00000000-0000-0000-0000-000000000801",
      label: "Home",
      url: "/",
      sortOrder: 1,
      links: [
        {
          id: "00000000-0000-0000-0000-000000000811",
          label: "Overview",
          url: "/",
          sortOrder: 1,
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000802",
      label: "About",
      url: "/about",
      sortOrder: 2,
      links: [
        {
          id: "00000000-0000-0000-0000-000000000812",
          label: "Mission & Vision",
          url: "/about#mission",
          sortOrder: 1,
        },
        {
          id: "00000000-0000-0000-0000-000000000813",
          label: "Our Impact",
          url: "/about#impact",
          sortOrder: 2,
        },
        {
          id: "00000000-0000-0000-0000-000000000814",
          label: "Our Journey",
          url: "/about#journey",
          sortOrder: 3,
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000803",
      label: "Contact",
      url: "/contact",
      sortOrder: 3,
      links: [
        {
          id: "00000000-0000-0000-0000-000000000815",
          label: "Get in Touch",
          url: "/contact",
          sortOrder: 1,
        },
      ],
    },
    {
      id: "00000000-0000-0000-0000-000000000804",
      label: "FAQ",
      url: "/faq",
      sortOrder: 4,
      links: [
        {
          id: "00000000-0000-0000-0000-000000000816",
          label: "Common Questions",
          url: "/faq",
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const column of navbarColumns) {
    const navigationItem = await prisma.navigationItem.upsert({
      where: {
        id: column.id,
      },
      update: {
        label: column.label,
        url: column.url,
        sortOrder: column.sortOrder,
        isActive: true,
      },
      create: {
        id: column.id,
        label: column.label,
        url: column.url,
        sortOrder: column.sortOrder,
        isActive: true,
      },
    });

    for (const link of column.links) {
      await prisma.dropdownItem.upsert({
        where: {
          id: link.id,
        },
        update: {
          label: link.label,
          url: link.url,
          sortOrder: link.sortOrder,
          isActive: true,
          navigationItemId: navigationItem.id,
        },
        create: {
          id: link.id,
          label: link.label,
          url: link.url,
          sortOrder: link.sortOrder,
          isActive: true,
          navigationItemId: navigationItem.id,
        },
      });
    }
  }

  console.log("Navbar columns and links ready");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
