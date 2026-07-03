import { NextResponse } from "next/server";
import { saveReservation, type ReservationUnit } from "@/lib/leads";
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
  if (!Array.isArray(body.units) || body.units.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No units to reserve." },
      { status: 400 }
    );
  }

  // Normalise + re-derive totals server-side; never trust client math.
  const units: ReservationUnit[] = [];
  for (const raw of body.units as unknown[]) {
    if (typeof raw !== "object" || raw === null) continue;
    const u = raw as Record<string, unknown>;
    const slug = cleanString(u.slug, 200);
    const title = cleanString(u.title, 400);
    if (!slug || !title) continue;
    const price = Number.isFinite(Number(u.price)) ? Number(u.price) : null;
    const deposit = Number.isFinite(Number(u.deposit)) ? Number(u.deposit) : 0;
    units.push({ slug, title, price, deposit });
  }

  if (units.length === 0) {
    return NextResponse.json({ ok: false, error: "No valid units to reserve." }, { status: 400 });
  }

  const totalDeposit = units.reduce((sum, u) => sum + u.deposit, 0);

  const result = await saveReservation({
    name: cleanString(body.name, 200)!,
    email: (body.email as string).trim(),
    phone: cleanString(body.phone, 40),
    zip: cleanString(body.zip, 20),
    units,
    totalDeposit,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Something went wrong." },
      { status: 502 }
    );
  }

  // NOTE: Stripe deposit collection hooks in here later — create a Checkout
  // Session for `totalDeposit`, persist the session id on the reservation row,
  // and return the redirect URL instead of finishing immediately.
  return NextResponse.json({
    ok: true,
    persisted: result.persisted,
    id: result.id,
    totalDeposit,
  });
}
