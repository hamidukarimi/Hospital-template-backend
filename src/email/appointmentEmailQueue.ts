import type { Prisma } from "../generated/prisma/client.js";
import prisma from "../lib/prisma.js";
import { HOSPITAL_TIMEZONE } from "../utils/time.js";
import {
  buildAppointmentEmailSubject,
  renderAppointmentEmailHtml,
  renderAppointmentEmailText,
  type AppointmentEmailPayload,
  type AppointmentEmailType,
  type AppointmentScheduleSnapshot,
  type HospitalEmailBranding,
} from "./appointmentEmailTemplates.js";
import { EmailProviderError, sendTransactionalEmail } from "./emailProvider.js";

const MAX_ATTEMPTS = 5;
const RETRY_BASE_MS = 30_000;

const absoluteUrl = (base: string, pathOrUrl?: string | null) => {
  if (!pathOrUrl) return null;
  const value = pathOrUrl.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  const origin = base.replace(/\/+$/, "");
  if (value.startsWith("/")) return `${origin}${value}`;
  return `${origin}/${value}`;
};

export const loadHospitalEmailBranding = async (): Promise<HospitalEmailBranding> => {
  const settings = await prisma.siteSettings.findFirst({
    select: {
      hospitalName: true,
      logo: true,
      phone: true,
      email: true,
      address: true,
    },
  });

  const websiteUrl = (
    process.env.PUBLIC_WEBSITE_URL ||
    "https://hospital-template-iota.vercel.app"
  ).replace(/\/+$/, "");

  const apiOrigin = (
    process.env.PUBLIC_API_URL ||
    process.env.API_PUBLIC_URL ||
    "https://hospital-template-backend.onrender.com"
  ).replace(/\/+$/, "");

  return {
    hospitalName: settings?.hospitalName || "Aura Hospital",
    logoUrl: absoluteUrl(apiOrigin, settings?.logo),
    phone: settings?.phone || null,
    email: settings?.email || null,
    address: settings?.address || null,
    websiteUrl,
    bookingUrl: `${websiteUrl}/book-appointment`,
    timezone: HOSPITAL_TIMEZONE,
  };
};

export interface QueueAppointmentEmailInput {
  appointmentId: string;
  emailType: AppointmentEmailType;
  idempotencyKey: string;
  reference: string;
  patientName: string;
  patientEmail: string;
  schedule: AppointmentScheduleSnapshot;
  previousSchedule?: AppointmentScheduleSnapshot | null;
  patientNote?: string | null;
}

export const queueAppointmentEmail = async (
  input: QueueAppointmentEmailInput,
): Promise<{ queued: boolean; logId?: string }> => {
  const recipient = input.patientEmail?.trim().toLowerCase();
  if (!recipient) {
    console.warn(
      `[appointment-email] Skipping ${input.emailType} for ${input.reference}: missing patient email`,
    );
    return { queued: false };
  }

  const hospital = await loadHospitalEmailBranding();
  const payload: AppointmentEmailPayload = {
    emailType: input.emailType,
    reference: input.reference,
    patientName: input.patientName,
    patientEmail: recipient,
    schedule: input.schedule,
    previousSchedule: input.previousSchedule ?? null,
    patientNote: input.patientNote?.trim() || null,
    hospital,
  };

  const subject = buildAppointmentEmailSubject(payload);

  try {
    const log = await prisma.appointmentEmailLog.create({
      data: {
        appointmentId: input.appointmentId,
        emailType: input.emailType,
        recipientEmail: recipient,
        subject,
        idempotencyKey: input.idempotencyKey,
        status: "QUEUED",
        payload: payload as unknown as Prisma.InputJsonValue,
        maxAttempts: MAX_ATTEMPTS,
        nextAttemptAt: new Date(),
      },
    });

    // Fire-and-forget — appointment state must not wait on delivery.
    void processEmailLogById(log.id);

    return { queued: true, logId: log.id };
  } catch (error) {
    // Duplicate idempotency key → already queued/sent for this action.
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return { queued: false };
    }
    console.error("[appointment-email] Failed to queue email:", error);
    return { queued: false };
  }
};

const backoffMs = (attempt: number) =>
  Math.min(RETRY_BASE_MS * 2 ** Math.max(0, attempt - 1), 30 * 60_000);

export const processEmailLogById = async (logId: string): Promise<void> => {
  const claimed = await prisma.appointmentEmailLog.updateMany({
    where: {
      id: logId,
      status: { in: ["QUEUED", "FAILED"] },
      OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: new Date() } }],
    },
    data: {
      status: "PROCESSING",
      processedAt: new Date(),
    },
  });

  if (claimed.count === 0) return;

  const log = await prisma.appointmentEmailLog.findUnique({
    where: { id: logId },
  });

  if (!log) return;

  const payload = log.payload as unknown as AppointmentEmailPayload;
  const attempt = log.attempts + 1;

  try {
    const html = renderAppointmentEmailHtml(payload);
    const text = renderAppointmentEmailText(payload);
    const result = await sendTransactionalEmail({
      to: log.recipientEmail,
      subject: log.subject,
      html,
      text,
    });

    await prisma.appointmentEmailLog.update({
      where: { id: log.id },
      data: {
        status: "SENT",
        attempts: attempt,
        providerMessageId: result.messageId,
        sentAt: new Date(),
        processedAt: new Date(),
        lastError: null,
        nextAttemptAt: null,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email send error";
    const retryable =
      error instanceof EmailProviderError ? error.retryable : true;
    const canRetry = retryable && attempt < log.maxAttempts;

    await prisma.appointmentEmailLog.update({
      where: { id: log.id },
      data: {
        status: "FAILED",
        attempts: canRetry ? attempt : log.maxAttempts,
        lastError: message.slice(0, 1000),
        processedAt: new Date(),
        nextAttemptAt: canRetry
          ? new Date(Date.now() + backoffMs(attempt))
          : null,
      },
    });

    console.error(
      `[appointment-email] Send failed for ${log.idempotencyKey} (attempt ${attempt}): ${message}`,
    );

    if (canRetry) {
      setTimeout(() => {
        void processEmailLogById(log.id);
      }, backoffMs(attempt));
    }
  }
};

export const processDueAppointmentEmails = async (): Promise<number> => {
  const due = await prisma.appointmentEmailLog.findMany({
    where: {
      status: { in: ["QUEUED", "FAILED"] },
      attempts: { lt: MAX_ATTEMPTS },
      OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: new Date() } }],
    },
    select: { id: true },
    take: 20,
    orderBy: { queuedAt: "asc" },
  });

  for (const item of due) {
    await processEmailLogById(item.id);
  }

  return due.length;
};

let pollTimer: ReturnType<typeof setInterval> | null = null;

export const startAppointmentEmailWorker = () => {
  if (pollTimer) return;

  // Catch anything left QUEUED/FAILED after restarts.
  void processDueAppointmentEmails();

  pollTimer = setInterval(() => {
    void processDueAppointmentEmails();
  }, 60_000);

  if (typeof pollTimer.unref === "function") {
    pollTimer.unref();
  }

  console.log("[appointment-email] Background email worker started");
};

export const stopAppointmentEmailWorker = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};
