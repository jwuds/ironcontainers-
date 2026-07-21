import { sendEmail } from "@/lib/resend";
import { formatPrice } from "@/lib/catalog";

type ReservationBody = {
  name: string;
  email: string;
  phone?: string;
  zip?: string;
  paymentLabel: string;
  items: { title: string; deposit: number }[];
  totalDeposit: number;
};

export async function POST(request: Request) {
  let body: ReservationBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.paymentLabel || !Array.isArray(body.items)) {
    return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const lines = [
    `Reservation request from ${body.name}`,
    `Email: ${body.email}`,
    `Phone: ${body.phone || "n/a"}`,
    `Delivery ZIP: ${body.zip || "n/a"}`,
    `Preferred payment method: ${body.paymentLabel}`,
    "",
    "Units:",
    ...body.items.map((i) => `- ${i.title} (deposit ${formatPrice(String(i.deposit)) ?? i.deposit})`),
    "",
    `Total deposit due: ${formatPrice(String(body.totalDeposit)) ?? body.totalDeposit}`,
  ];

  const result = await sendEmail({
    subject: `Reservation request (${body.items.length} unit${body.items.length === 1 ? "" : "s"})`,
    text: lines.join("\n"),
    replyTo: body.email,
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
