-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "DoctorSchedule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "doctorId" UUID NOT NULL,
    "dayOfWeek" "WeekDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorScheduleBreak" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scheduleId" UUID NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorScheduleBreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorUnavailability" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "doctorId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorUnavailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reference" TEXT NOT NULL,
    "doctorId" UUID NOT NULL,
    "serviceId" UUID,
    "appointmentDate" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "patientName" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "adminNotes" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentCounter" (
    "year" INTEGER NOT NULL,
    "lastValue" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AppointmentCounter_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE INDEX "DoctorSchedule_doctorId_dayOfWeek_isActive_idx" ON "DoctorSchedule"("doctorId", "dayOfWeek", "isActive");

-- CreateIndex
CREATE INDEX "DoctorScheduleBreak_scheduleId_idx" ON "DoctorScheduleBreak"("scheduleId");

-- CreateIndex
CREATE INDEX "DoctorUnavailability_doctorId_date_idx" ON "DoctorUnavailability"("doctorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_reference_key" ON "Appointment"("reference");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_appointmentDate_status_idx" ON "Appointment"("doctorId", "appointmentDate", "status");

-- CreateIndex
CREATE INDEX "Appointment_status_appointmentDate_idx" ON "Appointment"("status", "appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_patientEmail_idx" ON "Appointment"("patientEmail");

-- CreateIndex
CREATE INDEX "Appointment_patientPhone_idx" ON "Appointment"("patientPhone");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_idx" ON "Appointment"("appointmentDate");

-- Partial unique index: prevent double-booking of active appointments
CREATE UNIQUE INDEX "Appointment_doctor_date_time_active_key"
ON "Appointment" ("doctorId", "appointmentDate", "startTime")
WHERE "status" IN ('PENDING', 'CONFIRMED');

-- AddForeignKey
ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "DoctorSchedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorScheduleBreak" ADD CONSTRAINT "DoctorScheduleBreak_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "DoctorSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorUnavailability" ADD CONSTRAINT "DoctorUnavailability_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed default Mon–Sat schedules (09:00–17:00, lunch 13:00–14:00) for existing active doctors
INSERT INTO "DoctorSchedule" ("id", "doctorId", "dayOfWeek", "startTime", "endTime", "slotDurationMinutes", "isActive", "createdAt", "updatedAt")
SELECT gen_random_uuid(), d."id", day.dow, '09:00', '17:00', 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Doctor" d
CROSS JOIN (
  VALUES
    ('MONDAY'::"WeekDay"),
    ('TUESDAY'::"WeekDay"),
    ('WEDNESDAY'::"WeekDay"),
    ('THURSDAY'::"WeekDay"),
    ('FRIDAY'::"WeekDay"),
    ('SATURDAY'::"WeekDay")
) AS day(dow)
WHERE d."isActive" = true;

INSERT INTO "DoctorScheduleBreak" ("id", "scheduleId", "startTime", "endTime", "createdAt", "updatedAt")
SELECT gen_random_uuid(), s."id", '13:00', '14:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "DoctorSchedule" s;
