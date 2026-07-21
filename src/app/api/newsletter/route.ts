import { sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  let body: { email: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (!body.email) {
    return Response.json({ ok: false, error: "Missing email" }, { status: 400 });
  }

  const result = await sendEmail({
    subject: "Newsletter signup",
    text: `Please add this email to the list: ${body.email}`,
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
