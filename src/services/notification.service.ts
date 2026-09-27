/**
 * Notification boundary for appointment lifecycle events.
 * No external email/SMS provider is configured in this project.
 * Wire a real provider here later without changing booking logic.
 */

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
  reference: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
}

export const notifyAppointmentEvent = async (
  payload: AppointmentNotificationPayload,
): Promise<void> => {
  // Intentionally a no-op until an email/SMS provider is configured.
  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[appointment-notification] ${payload.event} ${payload.reference} → ${payload.patientEmail}`,
    );
  }
};
