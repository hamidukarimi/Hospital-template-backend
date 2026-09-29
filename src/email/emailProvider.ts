export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  messageId: string;
}

export class EmailProviderError extends Error {
  retryable: boolean;

  constructor(message: string, retryable = true) {
    super(message);
    this.name = "EmailProviderError";
    this.retryable = retryable;
  }
}

/**
 * Resend transactional email adapter.
 * Isolated so the appointment system does not depend on provider SDKs directly.
 */
export const sendTransactionalEmail = async (
  input: SendEmailInput,
): Promise<SendEmailResult> => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey) {
    throw new EmailProviderError(
      "RESEND_API_KEY is not configured.",
      false,
    );
  }

  if (!from) {
    throw new EmailProviderError(
      "RESEND_FROM_EMAIL is not configured.",
      false,
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (error) {
    const message = error.message || "Resend email send failed.";
    const permanent =
      /invalid|unauthorized|forbidden|api key|not allowed/i.test(message);
    throw new EmailProviderError(message, !permanent);
  }

  if (!data?.id) {
    throw new EmailProviderError("Resend returned no message id.", true);
  }

  return { messageId: data.id };
};
