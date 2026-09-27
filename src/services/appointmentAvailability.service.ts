import prisma from "../lib/prisma.js";
import {
  formatDateOnly,
  generateSlots,
  getHospitalNowMinutes,
  getHospitalToday,
  getWeekDayName,
  rangesOverlap,
  timeToMinutes,
  toDateOnly,
  type TimeSlot,
} from "../utils/time.js";

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED"] as const;

const isSlotBlockedByUnavailability = (
  slot: TimeSlot,
  unavailabilities: Array<{ startTime: string | null; endTime: string | null }>,
): boolean => {
  const slotStart = timeToMinutes(slot.startTime);
  const slotEnd = timeToMinutes(slot.endTime);

  return unavailabilities.some((u) => {
    // Full-day leave
    if (!u.startTime || !u.endTime) return true;
    const uStart = timeToMinutes(u.startTime);
    const uEnd = timeToMinutes(u.endTime);
    if (Number.isNaN(uStart) || Number.isNaN(uEnd)) return true;
    return rangesOverlap(slotStart, slotEnd, uStart, uEnd);
  });
};

const isSlotBooked = (
  slot: TimeSlot,
  booked: Array<{ startTime: string; endTime: string }>,
): boolean => {
  const slotStart = timeToMinutes(slot.startTime);
  const slotEnd = timeToMinutes(slot.endTime);

  return booked.some((b) => {
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    if (Number.isNaN(bStart) || Number.isNaN(bEnd)) {
      return b.startTime === slot.startTime;
    }
    return rangesOverlap(slotStart, slotEnd, bStart, bEnd);
  });
};

export const getAvailableSlotsForDoctor = async (
  doctorId: string,
  dateStr: string,
): Promise<TimeSlot[]> => {
  const dayOfWeek = getWeekDayName(dateStr);
  const dateOnly = toDateOnly(dateStr);

  const [schedules, unavailabilities, booked] = await Promise.all([
    prisma.doctorSchedule.findMany({
      where: {
        doctorId,
        dayOfWeek,
        isActive: true,
      },
      include: {
        breaks: {
          select: { startTime: true, endTime: true },
        },
      },
    }),
    prisma.doctorUnavailability.findMany({
      where: {
        doctorId,
        date: dateOnly,
      },
      select: { startTime: true, endTime: true },
    }),
    prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: dateOnly,
        status: { in: [...ACTIVE_STATUSES] },
      },
      select: { startTime: true, endTime: true },
    }),
  ]);

  if (schedules.length === 0) return [];

  // Full-day unavailability
  if (unavailabilities.some((u) => !u.startTime || !u.endTime)) {
    return [];
  }

  const today = getHospitalToday();
  const nowMinutes = getHospitalNowMinutes();

  const allSlots: TimeSlot[] = [];
  for (const schedule of schedules) {
    const slots = generateSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.slotDurationMinutes,
      schedule.breaks,
    );
    allSlots.push(...slots);
  }

  // Deduplicate by startTime
  const unique = new Map<string, TimeSlot>();
  for (const slot of allSlots) {
    if (!unique.has(slot.startTime)) unique.set(slot.startTime, slot);
  }

  return [...unique.values()]
    .filter((slot) => !isSlotBlockedByUnavailability(slot, unavailabilities))
    .filter((slot) => !isSlotBooked(slot, booked))
    .filter((slot) => {
      if (dateStr < today) return false;
      if (dateStr === today) {
        return timeToMinutes(slot.startTime) > nowMinutes;
      }
      return true;
    })
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
};

export const getAvailableDatesForDoctor = async (
  doctorId: string,
  fromDate: string,
  daysAhead = 28,
): Promise<string[]> => {
  const dates: string[] = [];
  const start = toDateOnly(fromDate);

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const dateStr = formatDateOnly(d);
    const slots = await getAvailableSlotsForDoctor(doctorId, dateStr);
    if (slots.length > 0) dates.push(dateStr);
  }

  return dates;
};

export const assertSlotIsBookable = async (
  doctorId: string,
  dateStr: string,
  startTime: string,
): Promise<{ endTime: string }> => {
  const slots = await getAvailableSlotsForDoctor(doctorId, dateStr);
  const match = slots.find((s) => s.startTime === startTime);
  if (!match) {
    throw new Error("SELECTED_SLOT_UNAVAILABLE");
  }
  return { endTime: match.endTime };
};
