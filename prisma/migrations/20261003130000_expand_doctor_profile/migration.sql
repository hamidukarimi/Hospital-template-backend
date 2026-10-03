-- AlterTable
-- Additive expansion of Doctor public profile fields. No existing columns are dropped or renamed.
ALTER TABLE "Doctor" ADD COLUMN "professionalTitle" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "carePhilosophy" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "clinicalInterests" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "conditionsTreated" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "procedures" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "certifications" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "languages" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "memberships" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "affiliations" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "researchInterests" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "publications" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "teachingExperience" JSONB;
ALTER TABLE "Doctor" ADD COLUMN "consultationType" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "consultationLocation" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "acceptingNewPatients" BOOLEAN DEFAULT true;
