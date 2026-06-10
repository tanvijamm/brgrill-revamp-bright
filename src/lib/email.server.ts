type SendEmailInput = {
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendFormNotification({ subject, html, replyTo }: SendEmailInput) {
  const recipient = process.env.FORM_RECIPIENT_EMAIL;
  const from = process.env.FORM_FROM_EMAIL ?? "BRG Website <onboarding@resend.dev>";
  const resendKey = process.env.RESEND_API_KEY;
  const webhookUrl = process.env.FORM_WEBHOOK_URL;

  if (resendKey && recipient) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject,
        html,
        reply_to: replyTo,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }
    return { channel: "resend" as const };
  }

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, html, replyTo, sentAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Webhook error: ${err}`);
    }
    return { channel: "webhook" as const };
  }

  console.info("[brg-form]", subject, replyTo ?? "(no reply-to)");
  return { channel: "log" as const };
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formRows(entries: Record<string, string | string[] | undefined>) {
  return Object.entries(entries)
    .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(([key, value]) => {
      const display = Array.isArray(value) ? value.join(", ") : value;
      return `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top">${escapeHtml(key)}</td><td style="padding:6px 12px">${escapeHtml(display ?? "")}</td></tr>`;
    })
    .join("");
}
