/** Hospital operating timezone — Asia/Kabul (UTC+4:30). */
export const HOSPITAL_TIMEZONE = "Asia/Kabul";

const WEEK_DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

export type WeekDayName = (typeof WEEK_DAYS)[number];

/** Parse "HH:mm" into minutes since midnight. */
export const timeToMinutes = (time: string): number => {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
};

/** Format minutes since midnight as "HH:mm". */
export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const isValidTimeString = (time: string): boolean => {
  return !Number.isNaN(timeToMinutes(time));
};

/** Validate YYYY-MM-DD calendar date. */
export const isValidDateString = (date: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
};

/** Convert a YYYY-MM-DD string to a Date at UTC midnight for Prisma @db.Date. */
export const toDateOnly = (date: string): Date => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const formatDateOnly = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Current calendar date in the hospital timezone as YYYY-MM-DD. */
export const getHospitalToday = (): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: HOSPITAL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

/** Current time in hospital timezone as minutes since midnight. */
export const getHospitalNowMinutes = (): number => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: HOSPITAL_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
};

export const getWeekDayName = (dateStr: string): WeekDayName => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  return WEEK_DAYS[utc.getUTCDay()];
};

export const rangesOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean => aStart < bEnd && bStart < aEnd;

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export const generateSlots = (
  startTime: string,
  endTime: string,
  durationMinutes: number,
  breaks: Array<{ startTime: string; endTime: string }> = [],
): TimeSlot[] => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    durationMinutes <= 0 ||
    end <= start
  ) {
    return [];
  }

  const breakRanges = breaks
    .map((b) => ({
      start: timeToMinutes(b.startTime),
      end: timeToMinutes(b.endTime),
    }))
    .filter((b) => !Number.isNaN(b.start) && !Number.isNaN(b.end) && b.end > b.start);

  const slots: TimeSlot[] = [];
  for (let cursor = start; cursor + durationMinutes <= end; cursor += durationMinutes) {
    const slotEnd = cursor + durationMinutes;
    const hitsBreak = breakRanges.some((b) =>
      rangesOverlap(cursor, slotEnd, b.start, b.end),
    );
    if (!hitsBreak) {
      slots.push({
        startTime: minutesToTime(cursor),
        endTime: minutesToTime(slotEnd),
      });
    }
  }
  return slots;
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[\d\s()-]{7,20}$/;
