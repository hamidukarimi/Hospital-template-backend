import { HOSPITAL_TIMEZONE } from "../utils/time.js";

export type AppointmentEmailType =
  | "APPOINTMENT_CONFIRMED"
  | "APPOINTMENT_RESCHEDULED"
  | "APPOINTMENT_CANCELLED";

export interface AppointmentScheduleSnapshot {
  appointmentDate: string;
  startTime: string;
  endTime: string;
  doctorName: string;
  doctorSpecialty?: string | null;
  serviceTitle?: string | null;
}

export interface HospitalEmailBranding {
  hospitalName: string;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  websiteUrl: string;
  bookingUrl: string;
  timezone: string;
}

export interface AppointmentEmailPayload {
  emailType: AppointmentEmailType;
  reference: string;
  patientName: string;
  patientEmail: string;
  schedule: AppointmentScheduleSnapshot;
  previousSchedule?: AppointmentScheduleSnapshot | null;
  patientNote?: string | null;
  hospital: HospitalEmailBranding;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatDisplayDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatTimeLabel = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const scheduleRows = (schedule: AppointmentScheduleSnapshot) => {
  const rows: Array<[string, string]> = [
    ["Date", formatDisplayDate(schedule.appointmentDate)],
    [
      "Time",
      `${formatTimeLabel(schedule.startTime)} – ${formatTimeLabel(schedule.endTime)}`,
    ],
    ["Timezone", HOSPITAL_TIMEZONE],
    ["Doctor", schedule.doctorName],
  ];

  if (schedule.doctorSpecialty) {
    rows.push(["Specialty", schedule.doctorSpecialty]);
  }
  if (schedule.serviceTitle) {
    rows.push(["Service", schedule.serviceTitle]);
  }

  return rows;
};

const detailTable = (rows: Array<[string, string]>) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:16px 0;">
    ${rows
      .map(
        ([label, value]) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;width:34%;font-size:13px;color:#64748b;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`,
      )
      .join("")}
  </table>`;

const ctaButton = (href: string, label: string) => `
  <a href="${escapeHtml(href)}" style="display:inline-block;margin-top:8px;background:#147BD5;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:700;">
    ${escapeHtml(label)}
  </a>`;

const contactBlock = (hospital: HospitalEmailBranding) => {
  const lines: string[] = [];
  if (hospital.phone) lines.push(`Phone: ${escapeHtml(hospital.phone)}`);
  if (hospital.email) lines.push(`Email: ${escapeHtml(hospital.email)}`);
  if (hospital.address) lines.push(`Address: ${escapeHtml(hospital.address)}`);
  if (lines.length === 0) return "";
  return `
    <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#475569;">
      <strong style="color:#0f172a;">Need help?</strong><br/>
      ${lines.join("<br/>")}
    </p>`;
};

const statusCopy: Record<
  AppointmentEmailType,
  { headline: string; intro: string; accent: string }
> = {
  APPOINTMENT_CONFIRMED: {
    headline: "Your appointment has been confirmed",
    intro:
      "We are pleased to confirm your upcoming visit. Please arrive a few minutes early and bring any documents you usually need for your appointment.",
    accent: "#059669",
  },
  APPOINTMENT_RESCHEDULED: {
    headline: "Your appointment has been rescheduled",
    intro:
      "Your appointment time has been updated. Please review the new details below.",
    accent: "#147BD5",
  },
  APPOINTMENT_CANCELLED: {
    headline: "Your appointment has been cancelled",
    intro:
      "The appointment listed below has been cancelled. If you still need care, you can book a new appointment online.",
    accent: "#dc2626",
  },
};

export const buildAppointmentEmailSubject = (
  payload: AppointmentEmailPayload,
): string => {
  const hospital = payload.hospital.hospitalName;
  switch (payload.emailType) {
    case "APPOINTMENT_CONFIRMED":
      return `Your appointment is confirmed — ${hospital}`;
    case "APPOINTMENT_RESCHEDULED":
      return `Your appointment has been rescheduled — ${hospital}`;
    case "APPOINTMENT_CANCELLED":
      return `Your appointment has been cancelled — ${hospital}`;
  }
};

export const renderAppointmentEmailHtml = (
  payload: AppointmentEmailPayload,
): string => {
  const copy = statusCopy[payload.emailType];
  const hospital = payload.hospital;
  const logoHtml = hospital.logoUrl
    ? `<img src="${escapeHtml(hospital.logoUrl)}" alt="${escapeHtml(hospital.hospitalName)}" width="140" style="display:block;max-width:140px;height:auto;border:0;" />`
    : `<div style="font-size:20px;font-weight:700;color:#147BD5;">${escapeHtml(hospital.hospitalName)}</div>`;

  let bodySections = "";

  if (payload.emailType === "APPOINTMENT_RESCHEDULED" && payload.previousSchedule) {
    bodySections += `
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;">Previous appointment</p>
      ${detailTable(scheduleRows(payload.previousSchedule))}
      <p style="margin:18px 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#147BD5;">New appointment</p>
      ${detailTable([
        ["Reference", payload.reference],
        ...scheduleRows(payload.schedule),
      ])}`;
  } else {
    bodySections += detailTable([
      ["Reference", payload.reference],
      ...scheduleRows(payload.schedule),
    ]);
  }

  if (payload.patientNote?.trim()) {
    bodySections += `
      <div style="margin-top:16px;padding:14px 16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">Note from the hospital</p>
        <p style="margin:0;font-size:14px;line-height:1.55;color:#0f172a;">${escapeHtml(payload.patientNote.trim())}</p>
      </div>`;
  }

  let cta = "";
  if (payload.emailType === "APPOINTMENT_CANCELLED" && hospital.bookingUrl) {
    cta = `
      <div style="margin-top:22px;">
        ${ctaButton(hospital.bookingUrl, "Book a New Appointment")}
      </div>`;
  } else if (
    payload.emailType === "APPOINTMENT_CONFIRMED" &&
    hospital.websiteUrl
  ) {
    cta = `
      <div style="margin-top:22px;">
        ${ctaButton(hospital.websiteUrl, "Visit Our Website")}
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(copy.headline)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:22px 28px;border-bottom:1px solid #e2e8f0;background:#ffffff;">
              ${logoHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:${copy.accent}1A;color:${copy.accent};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
                Appointment update
              </div>
              <h1 style="margin:14px 0 10px;font-size:24px;line-height:1.3;color:#0f172a;">${escapeHtml(copy.headline)}</h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#475569;">
                Hello ${escapeHtml(payload.patientName)},
              </p>
              <p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#475569;">
                ${escapeHtml(copy.intro)}
              </p>
              ${bodySections}
              ${cta}
              ${contactBlock(hospital)}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#0f172a;color:#cbd5e1;font-size:12px;line-height:1.5;">
              ${escapeHtml(hospital.hospitalName)} · Appointment notifications
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const renderAppointmentEmailText = (
  payload: AppointmentEmailPayload,
): string => {
  const copy = statusCopy[payload.emailType];
  const lines = [
    copy.headline,
    "",
    `Hello ${payload.patientName},`,
    copy.intro,
    "",
    `Reference: ${payload.reference}`,
    `Doctor: ${payload.schedule.doctorName}`,
    `Date: ${formatDisplayDate(payload.schedule.appointmentDate)}`,
    `Time: ${formatTimeLabel(payload.schedule.startTime)} – ${formatTimeLabel(payload.schedule.endTime)} (${HOSPITAL_TIMEZONE})`,
  ];

  if (payload.schedule.serviceTitle) {
    lines.push(`Service: ${payload.schedule.serviceTitle}`);
  }

  if (payload.previousSchedule) {
    lines.push(
      "",
      "Previous appointment:",
      `Date: ${formatDisplayDate(payload.previousSchedule.appointmentDate)}`,
      `Time: ${formatTimeLabel(payload.previousSchedule.startTime)} – ${formatTimeLabel(payload.previousSchedule.endTime)}`,
    );
  }

  if (payload.patientNote?.trim()) {
    lines.push("", `Note from the hospital: ${payload.patientNote.trim()}`);
  }

  if (payload.hospital.phone) lines.push(`Phone: ${payload.hospital.phone}`);
  if (payload.hospital.email) lines.push(`Email: ${payload.hospital.email}`);
  if (payload.hospital.address) {
    lines.push(`Address: ${payload.hospital.address}`);
  }

  return lines.join("\n");
};
