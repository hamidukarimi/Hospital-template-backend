-- WhyChooseUsItem: icon → image
ALTER TABLE "WhyChooseUsItem" RENAME COLUMN "icon" TO "image";
ALTER TABLE "WhyChooseUsItem" ALTER COLUMN "image" DROP NOT NULL;

-- LabTest: image → icon (convert legacy image paths to a default icon name)
ALTER TABLE "LabTest" RENAME COLUMN "image" TO "icon";
UPDATE "LabTest"
SET "icon" = 'FlaskConical'
WHERE "icon" IS NULL OR "icon" LIKE '%/%' OR "icon" LIKE './%';
ALTER TABLE "LabTest" ALTER COLUMN "icon" SET NOT NULL;

-- FooterSettings: contact/branding moved to SiteSettings; keep model for columns
ALTER TABLE "FooterSettings" DROP COLUMN IF EXISTS "logo";
ALTER TABLE "FooterSettings" DROP COLUMN IF EXISTS "location";
ALTER TABLE "FooterSettings" DROP COLUMN IF EXISTS "visitingHours";
ALTER TABLE "FooterSettings" DROP COLUMN IF EXISTS "phone";
