import "server-only";

/**
 * Lead + reservation persistence layer.
 *
 * This is intentionally backend-agnostic and has ZERO third-party dependencies.
 * It talks to Supabase over its REST (PostgREST) endpoint using `fetch`, which
 * means the moment the following environment variables exist the writes start
 * persisting for real — no code change and no package install required:
 *
 *   NEXT_PUBLIC_SUPABASE_URL       e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY      server-only service role key
 *
 * Until those are set, submissions are validated, logged server-side, and
 * reported back honestly as `persisted: false` so nothing silently pretends to
 * have been saved. Run `supabase/schema.sql` in the Supabase SQL editor to
 * create the tables this layer writes to.
 */

export type QuoteLead = {
  name: string;
  email: string;
  phone?: string;
  zip?: string;
  message?: string;
  productSlug?: string;
  productTitle?: string;
  category?: string;
  quantity?: number;
  source?: string;
};

export type ReservationUnit = {
  slug: string;
  title: string;
  price: number | null;
  deposit: number;
};

export type Reservation = {
  name: string;
  email: string;
  phone?: string;
  zip?: string;
  units: ReservationUnit[];
  totalDeposit: number;
};

export type PersistResult = {
  ok: boolean;
  persisted: boolean;
  id?: string;
  error?: string;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function insert(table: string, row: Record<string, unknown>): Promise<PersistResult> {
  const cfg = supabaseConfig();

  if (!cfg) {
    // No backend connected yet: validate + log, report honestly.
    console.log(`[v0] ${table} received (not persisted — Supabase not configured):`, row);
    return { ok: true, persisted: false };
  }

  try {
    const res = await fetch(`${cfg.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.log(`[v0] Supabase insert into ${table} failed:`, res.status, detail);
      return { ok: false, persisted: false, error: `Database error (${res.status})` };
    }

    const data = (await res.json()) as Array<{ id?: string }>;
    return { ok: true, persisted: true, id: data?.[0]?.id };
  } catch (err) {
    console.log(`[v0] Supabase insert into ${table} threw:`, err);
    return { ok: false, persisted: false, error: "Network error reaching database" };
  }
}

export function saveQuoteLead(lead: QuoteLead): Promise<PersistResult> {
  return insert("quote_leads", {
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? null,
    zip: lead.zip ?? null,
    message: lead.message ?? null,
    product_slug: lead.productSlug ?? null,
    product_title: lead.productTitle ?? null,
    category: lead.category ?? null,
    quantity: lead.quantity ?? 1,
    source: lead.source ?? "quote_form",
  });
}

export function saveReservation(reservation: Reservation): Promise<PersistResult> {
  return insert("reservations", {
    name: reservation.name,
    email: reservation.email,
    phone: reservation.phone ?? null,
    zip: reservation.zip ?? null,
    units: reservation.units,
    total_deposit: reservation.totalDeposit,
    status: "pending",
  });
}
