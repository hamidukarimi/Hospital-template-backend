-- CreateEnum
CREATE TYPE "AppointmentEmailType" AS ENUM ('APPOINTMENT_CONFIRMED', 'APPOINTMENT_RESCHEDULED', 'APPOINTMENT_CANCELLED');

-- CreateEnum
CREATE TYPE "AppointmentEmailStatus" AS ENUM ('QUEUED', 'PROCESSING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "AppointmentEmailLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "appointmentId" UUID NOT NULL,
    "emailType" "AppointmentEmailType" NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" "AppointmentEmailStatus" NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "lastError" TEXT,
    "providerMessageId" TEXT,
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "nextAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentEmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentEmailLog_idempotencyKey_key" ON "AppointmentEmailLog"("idempotencyKey");

-- CreateIndex
CREATE INDEX "AppointmentEmailLog_status_nextAttemptAt_idx" ON "AppointmentEmailLog"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "AppointmentEmailLog_appointmentId_emailType_idx" ON "AppointmentEmailLog"("appointmentId", "emailType");

-- AddForeignKey
ALTER TABLE "AppointmentEmailLog" ADD CONSTRAINT "AppointmentEmailLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
