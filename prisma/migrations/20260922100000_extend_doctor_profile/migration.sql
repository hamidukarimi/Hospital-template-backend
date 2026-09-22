-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN "slug" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "credentials" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "yearsExperience" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "patientsTreated" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "rating" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "overviewTitle" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "specialties" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "education" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "achievements" JSONB;

-- Backfill unique slugs for existing rows
UPDATE "Doctor"
SET "slug" = lower(regexp_replace(trim("name"), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left("id"::text, 8)
WHERE "slug" IS NULL OR "slug" = '';

ALTER TABLE "Doctor" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Doctor_slug_key" ON "Doctor"("slug");
