ALTER TABLE "Service" ADD COLUMN "slug" TEXT;
ALTER TABLE "Service" ADD COLUMN "overviewTitle" TEXT;
ALTER TABLE "Service" ADD COLUMN "overviewDescription" TEXT;
ALTER TABLE "Service" ADD COLUMN "ctaText" TEXT;
ALTER TABLE "Service" ADD COLUMN "ctaUrl" TEXT;

UPDATE "Service"
SET "slug" = lower(regexp_replace(trim("title"), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left("id"::text, 8)
WHERE "slug" IS NULL;

ALTER TABLE "Service" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

CREATE TABLE "ServiceMetric" (
  "id" UUID NOT NULL,
  "label" TEXT NOT NULL,
  "value" INTEGER NOT NULL,
  "suffix" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "serviceId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServiceMetric_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceMetric_serviceId_sortOrder_idx" ON "ServiceMetric"("serviceId", "sortOrder");
ALTER TABLE "ServiceMetric" ADD CONSTRAINT "ServiceMetric_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
