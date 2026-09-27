import type { AppointmentStatus, Prisma } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";
import {
  formatDateOnly,
  getHospitalToday,
  isValidDateString,
  isValidTimeString,
  toDateOnly,
} from "../utils/time.js";
import { assertSlotIsBookable } from "./appointmentAvailability.service.js";
import { AppointmentError, serializeAppointment } from "./appointment.service.js";
import { notifyAppointmentEvent } from "./notification.service.js";

const ACTIVE_STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED"];

export interface AdminAppointmentFilters {
  search?: string;
  status?: string;
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

const includeRelations = {
  doctor: {
    select: {
      id: true,
      name: true,
      slug: true,
      specialty: true,
      credentials: true,
      image: true,
      category: true,
    },
  },
  service: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
} as const;

const serializeAdmin = (appointment: {
  id: string;
  reference: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason: string | null;
  notes: string | null;
  adminNotes: string | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  confirmedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  doctor: {
    id: string;
    name: string;
    slug: string;
    specialty: string;
    credentials: string | null;
    image: string | null;
    category: string | null;
  };
  service: { id: string; title: string; slug: string } | null;
}) => ({
  ...serializeAppointment(appointment),
  adminNotes: appointment.adminNotes,
  cancelledAt: appointment.cancelledAt?.toISOString() ?? null,
  cancellationReason: appointment.cancellationReason,
  confirmedAt: appointment.confirmedAt?.toISOString() ?? null,
  completedAt: appointment.completedAt?.toISOString() ?? null,
  updatedAt: appointment.updatedAt.toISOString(),
});

export const listAppointmentsAdmin = async (
  filters: AdminAppointmentFilters,
) => {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.AppointmentWhereInput = {};

  if (filters.status) {
    where.status = filters.status as AppointmentStatus;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.dateFrom || filters.dateTo) {
    where.appointmentDate = {};
    if (filters.dateFrom && isValidDateString(filters.dateFrom)) {
      where.appointmentDate.gte = toDateOnly(filters.dateFrom);
    }
    if (filters.dateTo && isValidDateString(filters.dateTo)) {
      where.appointmentDate.lte = toDateOnly(filters.dateTo);
    }
  }

  const search = filters.search?.trim();
  if (search) {
    where.OR = [
      { reference: { contains: search, mode: "insensitive" } },
      { patientName: { contains: search, mode: "insensitive" } },
      { patientEmail: { contains: search, mode: "insensitive" } },
      { patientPhone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      include: includeRelations,
      orderBy: [{ appointmentDate: "desc" }, { startTime: "asc" }],
      skip,
      take: limit,
    }),
  ]);

  return {
    items: items.map(serializeAdmin),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getAppointmentAdmin = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: includeRelations,
  });

  if (!appointment) {
    throw new AppointmentError("Appointment not found.", 404);
  }

  return serializeAdmin(appointment);
};

export const updateAppointmentStatusAdmin = async (
  id: string,
  status: string,
  options?: { adminNotes?: string; cancellationReason?: string },
) => {
  const allowed: AppointmentStatus[] = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
  ];

  if (!allowed.includes(status as AppointmentStatus)) {
    throw new AppointmentError("Invalid appointment status.");
  }

  const existing = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: { select: { name: true } } },
  });

  if (!existing) {
    throw new AppointmentError("Appointment not found.", 404);
  }

  const data: Prisma.AppointmentUpdateInput = {
    status: status as AppointmentStatus,
  };

  if (options?.adminNotes !== undefined) {
    data.adminNotes = options.adminNotes.trim() || null;
  }

  if (status === "CONFIRMED") {
    data.confirmedAt = new Date();
  }

  if (status === "COMPLETED") {
    data.completedAt = new Date();
  }

  if (status === "CANCELLED") {
    data.cancelledAt = new Date();
    data.cancellationReason =
      options?.cancellationReason?.trim() ||
      existing.cancellationReason ||
      "Cancelled by admin";
  }

  if (status === "NO_SHOW") {
    data.completedAt = new Date();
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data,
    include: includeRelations,
  });

  const eventMap: Record<string, "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"> = {
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED",
    NO_SHOW: "NO_SHOW",
  };

  if (eventMap[status]) {
    await notifyAppointmentEvent({
      event: eventMap[status],
      reference: updated.reference,
      patientName: updated.patientName,
      patientEmail: updated.patientEmail,
      patientPhone: updated.patientPhone,
      doctorName: updated.doctor.name,
      appointmentDate: formatDateOnly(updated.appointmentDate),
      startTime: updated.startTime,
      endTime: updated.endTime,
      status: updated.status,
    });
  }

  return serializeAdmin(updated);
};

export const rescheduleAppointmentAdmin = async (
  id: string,
  appointmentDate: string,
  startTime: string,
) => {
  if (!isValidDateString(appointmentDate)) {
    throw new AppointmentError("Invalid appointment date.");
  }
  if (!isValidTimeString(startTime)) {
    throw new AppointmentError("Invalid appointment time.");
  }
  if (appointmentDate < getHospitalToday()) {
    throw new AppointmentError("Cannot reschedule to a past date.");
  }

  const existing = await prisma.appointment.findUnique({
    where: { id },
    include: includeRelations,
  });

  if (!existing) {
    throw new AppointmentError("Appointment not found.", 404);
  }

  if (
    existing.status === "CANCELLED" ||
    existing.status === "COMPLETED" ||
    existing.status === "NO_SHOW"
  ) {
    throw new AppointmentError(
      `Cannot reschedule an appointment with status ${existing.status}.`,
    );
  }

  let endTime: string;
  try {
    ({ endTime } = await assertSlotIsBookable(
      existing.doctorId,
      appointmentDate,
      startTime,
    ));
  } catch {
    throw new AppointmentError(
      "The selected time slot is not available.",
      409,
    );
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          doctorId: existing.doctorId,
          appointmentDate: toDateOnly(appointmentDate),
          startTime,
          status: { in: ACTIVE_STATUSES },
          NOT: { id },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new AppointmentError("Selected slot is already booked.", 409);
      }

      return tx.appointment.update({
        where: { id },
        data: {
          appointmentDate: toDateOnly(appointmentDate),
          startTime,
          endTime,
        },
        include: includeRelations,
      });
    });

    await notifyAppointmentEvent({
      event: "RESCHEDULED",
      reference: updated.reference,
      patientName: updated.patientName,
      patientEmail: updated.patientEmail,
      patientPhone: updated.patientPhone,
      doctorName: updated.doctor.name,
      appointmentDate: formatDateOnly(updated.appointmentDate),
      startTime: updated.startTime,
      endTime: updated.endTime,
      status: updated.status,
    });

    return serializeAdmin(updated);
  } catch (error) {
    if (error instanceof AppointmentError) throw error;

    const { Prisma } = await import("../generated/prisma/client.js");
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppointmentError("Selected slot is already booked.", 409);
    }

    throw new AppointmentError("Failed to reschedule appointment.", 500);
  }
};

export const getAppointmentStatsAdmin = async () => {
  const today = toDateOnly(getHospitalToday());

  const [pending, confirmed, todayCount, cancelled, completed] =
    await Promise.all([
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "CONFIRMED" } }),
      prisma.appointment.count({
        where: {
          appointmentDate: today,
          status: { in: ACTIVE_STATUSES },
        },
      }),
      prisma.appointment.count({ where: { status: "CANCELLED" } }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
    ]);

  return { pending, confirmed, todayCount, cancelled, completed };
};
