import type { WeekDay } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";
import { isValidTimeString, timeToMinutes, toDateOnly } from "../utils/time.js";
import { AppointmentError } from "./appointment.service.js";

const WEEK_DAYS: WeekDay[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export interface ScheduleBreakInput {
  startTime: string;
  endTime: string;
}

export interface ScheduleInput {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes?: number;
  isActive?: boolean;
  breaks?: ScheduleBreakInput[];
}

export interface UnavailabilityInput {
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
}

const validateTimeRange = (startTime: string, endTime: string, label: string) => {
  if (!isValidTimeString(startTime) || !isValidTimeString(endTime)) {
    throw new AppointmentError(`Invalid ${label} time format. Use HH:mm.`);
  }
  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    throw new AppointmentError(`${label} end time must be after start time.`);
  }
};

export const getDoctorSchedulesAdmin = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { id: true, name: true, specialty: true },
  });

  if (!doctor) {
    throw new AppointmentError("Doctor not found.", 404);
  }

  const [schedules, unavailabilities] = await Promise.all([
    prisma.doctorSchedule.findMany({
      where: { doctorId },
      include: { breaks: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    prisma.doctorUnavailability.findMany({
      where: { doctorId },
      orderBy: { date: "asc" },
    }),
  ]);

  return {
    doctor,
    schedules: schedules.map((s) => ({
      ...s,
      breaks: s.breaks.map((b) => ({
        id: b.id,
        startTime: b.startTime,
        endTime: b.endTime,
      })),
    })),
    unavailabilities: unavailabilities.map((u) => ({
      id: u.id,
      date: u.date.toISOString().slice(0, 10),
      startTime: u.startTime,
      endTime: u.endTime,
      reason: u.reason,
    })),
  };
};

export const replaceDoctorSchedulesAdmin = async (
  doctorId: string,
  schedules: ScheduleInput[],
) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { id: true },
  });

  if (!doctor) {
    throw new AppointmentError("Doctor not found.", 404);
  }

  if (!Array.isArray(schedules)) {
    throw new AppointmentError("Schedules must be an array.");
  }

  for (const schedule of schedules) {
    if (!WEEK_DAYS.includes(schedule.dayOfWeek as WeekDay)) {
      throw new AppointmentError(`Invalid day of week: ${schedule.dayOfWeek}`);
    }
    validateTimeRange(schedule.startTime, schedule.endTime, "Working hours");

    const duration = schedule.slotDurationMinutes ?? 30;
    if (!Number.isInteger(duration) || duration < 5 || duration > 240) {
      throw new AppointmentError(
        "Slot duration must be between 5 and 240 minutes.",
      );
    }

    for (const br of schedule.breaks ?? []) {
      validateTimeRange(br.startTime, br.endTime, "Break");
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctorSchedule.deleteMany({ where: { doctorId } });

    for (const schedule of schedules) {
      await tx.doctorSchedule.create({
        data: {
          doctorId,
          dayOfWeek: schedule.dayOfWeek as WeekDay,
          startTime: schedule.startTime.trim(),
          endTime: schedule.endTime.trim(),
          slotDurationMinutes: schedule.slotDurationMinutes ?? 30,
          isActive: schedule.isActive ?? true,
          breaks: {
            create: (schedule.breaks ?? []).map((br) => ({
              startTime: br.startTime.trim(),
              endTime: br.endTime.trim(),
            })),
          },
        },
      });
    }
  });

  return getDoctorSchedulesAdmin(doctorId);
};

export const addDoctorUnavailabilityAdmin = async (
  doctorId: string,
  input: UnavailabilityInput,
) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { id: true },
  });

  if (!doctor) {
    throw new AppointmentError("Doctor not found.", 404);
  }

  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    throw new AppointmentError("A valid date is required.");
  }

  if (input.startTime || input.endTime) {
    if (!input.startTime || !input.endTime) {
      throw new AppointmentError(
        "Both start and end time are required for partial unavailability.",
      );
    }
    validateTimeRange(input.startTime, input.endTime, "Unavailability");
  }

  const row = await prisma.doctorUnavailability.create({
    data: {
      doctorId,
      date: toDateOnly(input.date),
      startTime: input.startTime?.trim() || null,
      endTime: input.endTime?.trim() || null,
      reason: input.reason?.trim() || null,
    },
  });

  return {
    id: row.id,
    date: input.date,
    startTime: row.startTime,
    endTime: row.endTime,
    reason: row.reason,
  };
};

export const removeDoctorUnavailabilityAdmin = async (
  doctorId: string,
  unavailabilityId: string,
) => {
  const existing = await prisma.doctorUnavailability.findFirst({
    where: { id: unavailabilityId, doctorId },
  });

  if (!existing) {
    throw new AppointmentError("Unavailability record not found.", 404);
  }

  await prisma.doctorUnavailability.delete({
    where: { id: unavailabilityId },
  });

  return { success: true };
};
