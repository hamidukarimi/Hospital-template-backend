import { Prisma } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  formatDateOnly,
  getHospitalToday,
  isValidDateString,
  isValidTimeString,
  toDateOnly,
} from "../utils/time.js";
import {
  assertSlotIsBookable,
  getAvailableDatesForDoctor,
  getAvailableSlotsForDoctor,
} from "./appointmentAvailability.service.js";
import { notifyAppointmentEvent } from "./notification.service.js";

export class AppointmentError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppointmentError";
    this.statusCode = statusCode;
  }
}

export interface CreateAppointmentInput {
  doctorId: string;
  serviceId?: string | null;
  appointmentDate: string;
  startTime: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason?: string | null;
  notes?: string | null;
}

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED"] as const;

const publicDoctorSelect = {
  id: true,
  name: true,
  slug: true,
  specialty: true,
  credentials: true,
  image: true,
  category: true,
} as const;

const publicServiceSelect = {
  id: true,
  title: true,
  slug: true,
} as const;

const nextReference = async (tx: Prisma.TransactionClient): Promise<string> => {
  const year = Number(getHospitalToday().slice(0, 4));
  const counter = await tx.appointmentCounter.upsert({
    where: { year },
    create: { year, lastValue: 1 },
    update: { lastValue: { increment: 1 } },
  });
  return `APT-${year}-${String(counter.lastValue).padStart(5, "0")}`;
};

const normalizeOptional = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const validateCreateAppointmentInput = (
  input: CreateAppointmentInput,
) => {
  const doctorId = input.doctorId?.trim();
  const appointmentDate = input.appointmentDate?.trim();
  const startTime = input.startTime?.trim();
  const patientName = input.patientName?.trim();
  const patientEmail = input.patientEmail?.trim().toLowerCase();
  const patientPhone = input.patientPhone?.trim();

  if (!doctorId) throw new AppointmentError("Doctor is required.");
  if (!appointmentDate || !isValidDateString(appointmentDate)) {
    throw new AppointmentError("A valid appointment date is required.");
  }
  if (!startTime || !isValidTimeString(startTime)) {
    throw new AppointmentError("A valid appointment time is required.");
  }
  if (!patientName || patientName.length < 2) {
    throw new AppointmentError("Patient full name is required.");
  }
  if (!patientEmail || !EMAIL_REGEX.test(patientEmail)) {
    throw new AppointmentError("A valid email address is required.");
  }
  if (!patientPhone || !PHONE_REGEX.test(patientPhone)) {
    throw new AppointmentError("A valid phone number is required.");
  }
  if (appointmentDate < getHospitalToday()) {
    throw new AppointmentError("Cannot book an appointment in the past.");
  }

  return {
    doctorId,
    serviceId: normalizeOptional(input.serviceId),
    appointmentDate,
    startTime,
    patientName,
    patientEmail,
    patientPhone,
    reason: normalizeOptional(input.reason),
    notes: normalizeOptional(input.notes),
  };
};

export const getBookableDoctors = async () => {
  return prisma.doctor.findMany({
    where: {
      isActive: true,
      schedules: { some: { isActive: true } },
    },
    select: {
      ...publicDoctorSelect,
      description: true,
    },
    orderBy: { sortOrder: "asc" },
  });
};

export const getBookableServices = async () => {
  return prisma.service.findMany({
    where: { isActive: true },
    select: publicServiceSelect,
    orderBy: { sortOrder: "asc" },
  });
};

export const getDoctorAvailability = async (
  doctorId: string,
  date?: string,
) => {
  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, isActive: true },
    select: publicDoctorSelect,
  });

  if (!doctor) {
    throw new AppointmentError("Doctor not found.", 404);
  }

  const fromDate = getHospitalToday();

  if (date) {
    if (!isValidDateString(date)) {
      throw new AppointmentError("Invalid date.");
    }
    const slots = await getAvailableSlotsForDoctor(doctorId, date);
    return { doctor, date, slots };
  }

  const availableDates = await getAvailableDatesForDoctor(doctorId, fromDate, 28);
  return { doctor, availableDates };
};

export const createAppointment = async (rawInput: CreateAppointmentInput) => {
  const input = validateCreateAppointmentInput(rawInput);

  const doctor = await prisma.doctor.findFirst({
    where: { id: input.doctorId, isActive: true },
    select: { id: true, name: true },
  });

  if (!doctor) {
    throw new AppointmentError("Doctor not found or inactive.", 404);
  }

  if (input.serviceId) {
    const service = await prisma.service.findFirst({
      where: { id: input.serviceId, isActive: true },
      select: { id: true },
    });
    if (!service) {
      throw new AppointmentError("Selected service was not found.", 404);
    }
  }

  let endTime: string;
  try {
    ({ endTime } = await assertSlotIsBookable(
      input.doctorId,
      input.appointmentDate,
      input.startTime,
    ));
  } catch {
    throw new AppointmentError(
      "The selected time slot is no longer available. Please choose another.",
      409,
    );
  }

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      // Re-check inside the transaction against active bookings
      const conflict = await tx.appointment.findFirst({
        where: {
          doctorId: input.doctorId,
          appointmentDate: toDateOnly(input.appointmentDate),
          startTime: input.startTime,
          status: { in: [...ACTIVE_STATUSES] },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new AppointmentError(
          "This time slot was just booked by another patient. Please choose another.",
          409,
        );
      }

      const reference = await nextReference(tx);

      return tx.appointment.create({
        data: {
          reference,
          doctorId: input.doctorId,
          serviceId: input.serviceId,
          appointmentDate: toDateOnly(input.appointmentDate),
          startTime: input.startTime,
          endTime,
          status: "PENDING",
          patientName: input.patientName,
          patientEmail: input.patientEmail,
          patientPhone: input.patientPhone,
          reason: input.reason,
          notes: input.notes,
        },
        include: {
          doctor: { select: publicDoctorSelect },
          service: { select: publicServiceSelect },
        },
      });
    });

    await notifyAppointmentEvent({
      event: "BOOKED",
      reference: appointment.reference,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone,
      doctorName: appointment.doctor.name,
      appointmentDate: formatDateOnly(appointment.appointmentDate),
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
    });

    return serializeAppointment(appointment);
  } catch (error) {
    if (error instanceof AppointmentError) throw error;

    // Unique partial index violation (race condition safety net)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppointmentError(
        "This time slot was just booked by another patient. Please choose another.",
        409,
      );
    }

    throw error;
  }
};

export const getAppointmentByReferencePublic = async (reference: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { reference: reference.trim().toUpperCase() },
    include: {
      doctor: { select: publicDoctorSelect },
      service: { select: publicServiceSelect },
    },
  });

  if (!appointment) {
    throw new AppointmentError("Appointment not found.", 404);
  }

  return {
    reference: appointment.reference,
    status: appointment.status,
    appointmentDate: formatDateOnly(appointment.appointmentDate),
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    patientName: appointment.patientName,
    doctor: appointment.doctor,
    service: appointment.service,
  };
};

export const cancelAppointmentPublic = async (
  reference: string,
  patientEmail: string,
  reason?: string,
) => {
  const email = patientEmail.trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new AppointmentError("A valid email is required to cancel.");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { reference: reference.trim().toUpperCase() },
    include: {
      doctor: { select: { name: true } },
    },
  });

  if (!appointment) {
    throw new AppointmentError("Appointment not found.", 404);
  }

  if (appointment.patientEmail.toLowerCase() !== email) {
    throw new AppointmentError(
      "Email does not match this appointment.",
      403,
    );
  }

  if (
    appointment.status === "CANCELLED" ||
    appointment.status === "COMPLETED" ||
    appointment.status === "NO_SHOW"
  ) {
    throw new AppointmentError(
      `This appointment cannot be cancelled (status: ${appointment.status}).`,
    );
  }

  const updated = await prisma.appointment.update({
    where: { id: appointment.id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancellationReason: normalizeOptional(reason) ?? "Cancelled by patient",
    },
    include: {
      doctor: { select: publicDoctorSelect },
      service: { select: publicServiceSelect },
    },
  });

  await notifyAppointmentEvent({
    event: "CANCELLED",
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

  return serializeAppointment(updated);
};

type AppointmentPayload = {
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
  createdAt?: Date;
};

export const serializeAppointment = (appointment: AppointmentPayload) => ({
  id: appointment.id,
  reference: appointment.reference,
  appointmentDate: formatDateOnly(appointment.appointmentDate),
  startTime: appointment.startTime,
  endTime: appointment.endTime,
  status: appointment.status,
  patientName: appointment.patientName,
  patientEmail: appointment.patientEmail,
  patientPhone: appointment.patientPhone,
  reason: appointment.reason,
  notes: appointment.notes,
  doctor: appointment.doctor,
  service: appointment.service,
  createdAt: appointment.createdAt?.toISOString(),
});
