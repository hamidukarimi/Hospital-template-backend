/**
 * Appointment notification boundary.
 * Queues transactional emails after appointment state changes.
 * Delivery failures never roll back appointment updates.
 */

import { formatDateOnly } from "../utils/time.js";
import {
  queueAppointmentEmail,
  type QueueAppointmentEmailInput,
} from "../email/appointmentEmailQueue.js";
import type { AppointmentEmailType } from "../email/appointmentEmailTemplates.js";

export type AppointmentNotificationEvent =
  | "BOOKED"
  | "CONFIRMED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "REMINDER"
  | "COMPLETED"
  | "NO_SHOW";

export interface AppointmentNotificationPayload {
  event: AppointmentNotificationEvent;
  appointmentId?: string;
  reference: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  doctorSpecialty?: string | null;
  serviceTitle?: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  patientNote?: string | null;
  previousAppointmentDate?: string | null;
  previousStartTime?: string | null;
  previousEndTime?: string | null;
  previousDoctorName?: string | null;
  previousDoctorSpecialty?: string | null;
  previousServiceTitle?: string | null;
  idempotencyKey?: string;
}

const eventToEmailType: Partial<
  Record<AppointmentNotificationEvent, AppointmentEmailType>
> = {
  CONFIRMED: "APPOINTMENT_CONFIRMED",
  RESCHEDULED: "APPOINTMENT_RESCHEDULED",
  CANCELLED: "APPOINTMENT_CANCELLED",
};

export const notifyAppointmentEvent = async (
  payload: AppointmentNotificationPayload,
): Promise<{ queued: boolean }> => {
  const emailType = eventToEmailType[payload.event];

  // Booking / completed / no-show: keep as non-email lifecycle hooks for now.
  if (!emailType) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[appointment-notification] ${payload.event} ${payload.reference} (no email)`,
      );
    }
    return { queued: false };
  }

  if (!payload.appointmentId) {
    console.warn(
      `[appointment-notification] Missing appointmentId for ${payload.event} ${payload.reference}`,
    );
    return { queued: false };
  }

  const schedule = {
    appointmentDate: payload.appointmentDate,
    startTime: payload.startTime,
    endTime: payload.endTime,
    doctorName: payload.doctorName,
    doctorSpecialty: payload.doctorSpecialty ?? null,
    serviceTitle: payload.serviceTitle ?? null,
  };

  const previousSchedule =
    payload.previousAppointmentDate &&
    payload.previousStartTime &&
    payload.previousEndTime &&
    payload.previousDoctorName
      ? {
          appointmentDate: payload.previousAppointmentDate,
          startTime: payload.previousStartTime,
          endTime: payload.previousEndTime,
          doctorName: payload.previousDoctorName,
          doctorSpecialty: payload.previousDoctorSpecialty ?? null,
          serviceTitle: payload.previousServiceTitle ?? null,
        }
      : null;

  const idempotencyKey =
    payload.idempotencyKey ||
    `${emailType}:${payload.appointmentId}:${payload.appointmentDate}:${payload.startTime}:${payload.status}`;

  const input: QueueAppointmentEmailInput = {
    appointmentId: payload.appointmentId,
    emailType,
    idempotencyKey,
    reference: payload.reference,
    patientName: payload.patientName,
    patientEmail: payload.patientEmail,
    schedule,
    previousSchedule,
    patientNote: payload.patientNote ?? null,
  };

  return queueAppointmentEmail(input);
};

/** Helper when callers already have a Date appointmentDate. */
export const toEmailDate = (value: Date | string) =>
  typeof value === "string" ? value : formatDateOnly(value);
