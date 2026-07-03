import { NextResponse } from "next/server";
import { saveQuoteLead } from "@/lib/leads";
import { cleanString, isEmail, isNonEmptyString } from "@/lib/validate";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!isNonEmptyString(body.name, 200)) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!isEmail(body.email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const quantityRaw = Number(body.quantity);
  const quantity =
    Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.min(Math.floor(quantityRaw), 9999) : 1;

  const result = await saveQuoteLead({
    name: cleanString(body.name, 200)!,
    email: (body.email as string).trim(),
    phone: cleanString(body.phone, 40),
    zip: cleanString(body.zip, 20),
    message: cleanString(body.message, 4000),
    productSlug: cleanString(body.productSlug, 200),
    productTitle: cleanString(body.productTitle, 400),
    category: cleanString(body.category, 200),
    quantity,
    source: cleanString(body.source, 60) ?? "quote_form",
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Something went wrong." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, persisted: result.persisted, id: result.id });
}
