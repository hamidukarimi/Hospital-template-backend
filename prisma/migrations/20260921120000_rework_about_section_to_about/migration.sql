-- Rework AboutSection into singleton About institutional model
-- Preserves existing homepage AboutSection rows and adds About-page fields

ALTER TABLE "AboutSection" RENAME TO "About";

ALTER TABLE "About" RENAME CONSTRAINT "AboutSection_pkey" TO "About_pkey";

ALTER TABLE "About" ADD COLUMN "singletonKey" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "About" ADD COLUMN "heroBadge" TEXT;
ALTER TABLE "About" ADD COLUMN "heroTitle" TEXT;
ALTER TABLE "About" ADD COLUMN "heroTitleHighlight" TEXT;
ALTER TABLE "About" ADD COLUMN "heroSubtitle" TEXT;
ALTER TABLE "About" ADD COLUMN "heroButtonText" TEXT;
ALTER TABLE "About" ADD COLUMN "heroImage" TEXT;
ALTER TABLE "About" ADD COLUMN "heroImageCaption" TEXT;
ALTER TABLE "About" ADD COLUMN "missionTitle" TEXT;
ALTER TABLE "About" ADD COLUMN "missionTagline" TEXT;
ALTER TABLE "About" ADD COLUMN "missionDescription" TEXT;
ALTER TABLE "About" ADD COLUMN "missionButtonText" TEXT;
ALTER TABLE "About" ADD COLUMN "visionTitle" TEXT;
ALTER TABLE "About" ADD COLUMN "visionTagline" TEXT;
ALTER TABLE "About" ADD COLUMN "visionDescription" TEXT;
ALTER TABLE "About" ADD COLUMN "visionButtonText" TEXT;
ALTER TABLE "About" ADD COLUMN "statsEyebrow" TEXT;
ALTER TABLE "About" ADD COLUMN "statsTitle" TEXT;
ALTER TABLE "About" ADD COLUMN "statsDescription" TEXT;
ALTER TABLE "About" ADD COLUMN "stats" JSONB;
ALTER TABLE "About" ADD COLUMN "milestonesEyebrow" TEXT;
ALTER TABLE "About" ADD COLUMN "milestonesTitle" TEXT;
ALTER TABLE "About" ADD COLUMN "milestonesDescription" TEXT;
ALTER TABLE "About" ADD COLUMN "milestonesImage" TEXT;
ALTER TABLE "About" ADD COLUMN "milestonesImageCaption" TEXT;
ALTER TABLE "About" ADD COLUMN "milestones" JSONB;
ALTER TABLE "About" ADD COLUMN "ctaTitle" TEXT;
ALTER TABLE "About" ADD COLUMN "ctaSubtitle" TEXT;
ALTER TABLE "About" ADD COLUMN "ctaButtonText" TEXT;
ALTER TABLE "About" ADD COLUMN "ctaButtonUrl" TEXT;

-- If multiple AboutSection rows existed, keep one and remove extras
WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) AS rn
  FROM "About"
)
DELETE FROM "About"
WHERE "id" IN (SELECT "id" FROM ranked WHERE rn > 1);

UPDATE "About"
SET
  "singletonKey" = 'default',
  "heroBadge" = COALESCE("heroBadge", 'Pioneering Modern Healthcare'),
  "heroTitle" = COALESCE("heroTitle", 'Combining Advanced Technology with'),
  "heroTitleHighlight" = COALESCE("heroTitleHighlight", 'Compassionate Human Care'),
  "heroSubtitle" = COALESCE(
    "heroSubtitle",
    'At AuraTech Healthcare, we believe the future of medicine lies in the perfect balance between cutting-edge technology and the human touch. We''re here to provide world-class healthcare with empathy, dignity, and innovation.'
  ),
  "heroButtonText" = COALESCE("heroButtonText", 'Our Story'),
  "heroImage" = COALESCE(
    "heroImage",
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000'
  ),
  "heroImageCaption" = COALESCE("heroImageCaption", 'Better Health, Brighter Futures'),
  "missionTitle" = COALESCE("missionTitle", 'Our Mission'),
  "missionTagline" = COALESCE("missionTagline", 'Better Care. A Healthier Tomorrow.'),
  "missionDescription" = COALESCE(
    "missionDescription",
    'Our mission is to deliver exceptional, patient-centered healthcare by combining advanced medical technology, expertise, and genuine compassion — improving lives and building healthier communities.'
  ),
  "missionButtonText" = COALESCE("missionButtonText", 'Learn More'),
  "visionTitle" = COALESCE("visionTitle", 'Our Vision'),
  "visionTagline" = COALESCE("visionTagline", 'A Healthier World, Powered by Innovation.'),
  "visionDescription" = COALESCE(
    "visionDescription",
    'We envision a future where everyone has access to high-quality, personalized healthcare — where technology empowers people, and compassion remains at the heart of every decision.'
  ),
  "visionButtonText" = COALESCE("visionButtonText", 'Learn More'),
  "statsEyebrow" = COALESCE("statsEyebrow", 'OUR IMPACT'),
  "statsTitle" = COALESCE("statsTitle", 'Trusted by Thousands, Driven by Excellence'),
  "statsDescription" = COALESCE(
    "statsDescription",
    'For over two decades, we''ve been committed to providing high-quality healthcare and making a difference in people''s lives.'
  ),
  "stats" = COALESCE(
    "stats",
    '[
      {"icon":"Calendar","value":"25+","title":"Years Experience","description":"A legacy of trust, care and innovation"},
      {"icon":"Users","value":"150+","title":"Specialists","description":"World-class doctors across multiple fields"},
      {"icon":"HeartHandshake","value":"50k+","title":"Patients Treated","description":"Real people. Real stories. Healthier tomorrows."}
    ]'::jsonb
  ),
  "milestonesEyebrow" = COALESCE("milestonesEyebrow", 'OUR JOURNEY'),
  "milestonesTitle" = COALESCE("milestonesTitle", 'Key Milestones'),
  "milestonesDescription" = COALESCE(
    "milestonesDescription",
    'From a small clinic to a leading healthcare provider, our journey has always been guided by one purpose — creating a healthier future for everyone.'
  ),
  "milestonesImage" = COALESCE(
    "milestonesImage",
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1000'
  ),
  "milestonesImageCaption" = COALESCE("milestonesImageCaption", 'Modern Facilities. Compassionate Care.'),
  "milestones" = COALESCE(
    "milestones",
    '[
      {"year":"2000","title":"The Beginning","description":"AuraTech Healthcare was founded with a simple belief — better healthcare for a brighter future."},
      {"year":"2008","title":"Our First Hospital","description":"Opened our first modern hospital, bringing advanced care to our local community."},
      {"year":"2015","title":"Expanding Our Services","description":"Added specialized departments including Cardiology, Neurology, Oncology and more."},
      {"year":"2020","title":"Digital Transformation","description":"Introduced modern health tech solutions, including telemedicine and AI-powered diagnostics."},
      {"year":"2025","title":"A Healthier Tomorrow","description":"Today, we continue to grow — with more specialists, more locations, and a bigger mission."}
    ]'::jsonb
  ),
  "ctaTitle" = COALESCE("ctaTitle", 'Your Health. Our Priority.'),
  "ctaSubtitle" = COALESCE("ctaSubtitle", 'Experience the future of healthcare with AuraTech.'),
  "ctaButtonText" = COALESCE("ctaButtonText", 'Book Appointment'),
  "ctaButtonUrl" = COALESCE("ctaButtonUrl", '/contact');

CREATE UNIQUE INDEX "About_singletonKey_key" ON "About"("singletonKey");
