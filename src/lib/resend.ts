import { SITE } from "@/lib/site";

// Resend's REST API directly via fetch — no SDK dependency needed for a
// single "send this email" call. Requires RESEND_API_KEY (and, for
// production sending from your own domain rather than the shared Resend
// test sender, a verified domain — see RESEND_SETUP.md).
export async function sendEmail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${SITE.name} <${from}>`,
      to: [SITE.email],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `Resend API error (${res.status}): ${body}` };
  }

  return { ok: true };
}
