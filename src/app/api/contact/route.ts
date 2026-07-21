import { sendEmail } from "@/lib/resend";

type ContactBody = {
  name: string;
  email: string;
  message: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.message) {
    return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const result = await sendEmail({
    subject: `Contact form: ${body.name}`,
    text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
    replyTo: body.email,
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
