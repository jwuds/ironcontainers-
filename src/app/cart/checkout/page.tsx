"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart, depositFor } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { PaymentMethodDialog, type PaymentSummary } from "@/components/PaymentMethodDialog";

const METHOD_LABEL: Record<PaymentSummary["method"], string> = {
  creditcard: "Credit Card",
  paypal: "PayPal",
  applepay: "Apple Pay",
  zelle: "Zelle",
  banktransfer: "Bank Transfer",
};

type ConfirmedOrder = {
  items: { title: string; deposit: number }[];
  totalDeposit: number;
  name: string;
  email: string;
  phone: string;
  zip: string;
  paymentLabel: string;
};

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  const [payment, setPayment] = useState<PaymentSummary | null>(null);
  const [paymentError, setPaymentError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const totalDeposit = items.reduce((sum, i) => sum + depositFor(i.price), 0);

  if (submitted && confirmedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <div className="text-center">
          <h1 className="font-display text-4xl tracking-wide">Reservation Requested</h1>
          <p className="mt-4 text-text-muted">
            We&rsquo;ve opened an email to {SITE.name} sales with your reservation
            details. A team member will follow up to confirm your units and collect
            the{" "}
            {formatPrice(String(confirmedOrder.totalDeposit))} deposit &mdash; your
            quoted price is locked for the next 72 hours.
          </p>
        </div>

        <div className="mt-10 border border-border-soft bg-bg-raised p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-3">
            Order Summary
          </p>
          <div className="divide-y divide-border-soft font-mono text-sm">
            {confirmedOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2.5">
                <span className="text-text-muted truncate pr-4">{item.title}</span>
                <span className="text-accent shrink-0">
                  {formatPrice(String(item.deposit))} deposit
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border-soft flex justify-between font-mono text-sm font-semibold">
            <span>Total deposit due</span>
            <span className="text-accent">
              {formatPrice(String(confirmedOrder.totalDeposit))}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-border-soft space-y-1.5 text-sm text-text-muted">
            <p>{confirmedOrder.name}</p>
            <p>{confirmedOrder.email}</p>
            {confirmedOrder.phone && <p>{confirmedOrder.phone}</p>}
            {confirmedOrder.zip && <p>Delivery ZIP: {confirmedOrder.zip}</p>}
            <p>Payment method: {confirmedOrder.paymentLabel}</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="mt-8 inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-4xl tracking-wide">Nothing to check out</h1>
        <p className="mt-3 text-text-muted">Add a unit to your cart first.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex items-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors"
        >
          Browse Catalog &rarr;
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payment) {
      setPaymentError(true);
      return;
    }
    const paymentLabel =
      payment.method === "creditcard"
        ? `${METHOD_LABEL[payment.method]} ending in ${payment.last4 || "----"}`
        : METHOD_LABEL[payment.method];
    const orderItems = items.map((i) => ({ title: i.title, deposit: depositFor(i.price) }));

    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          zip: form.zip,
          paymentLabel,
          items: orderItems,
          totalDeposit,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      setConfirmedOrder({
        items: orderItems,
        totalDeposit,
        name: form.name,
        email: form.email,
        phone: form.phone,
        zip: form.zip,
        paymentLabel,
      });
      setSubmitted(true);
      clear();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-accent">
        Step 3 of 3
      </span>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-wide leading-[0.95]">
        Checkout
      </h1>
      <p className="mt-4 text-text-muted">
        Give us a few details and we&rsquo;ll reach out to confirm your reservation and
        collect the {formatPrice(String(totalDeposit))} deposit.{" "}
        Online deposit payment is coming soon &mdash; for now this routes straight to
        our sales team.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
            Full Name
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-text-faint">
              Delivery ZIP
            </label>
            <input
              type="text"
              value={form.zip}
              onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
              className="mt-1 w-full border border-border-soft bg-bg-raised px-3 py-2 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
        </div>

        <div
          className={`border p-3 ${
            paymentError && !payment ? "border-red-500/60 bg-red-500/5" : "border-border-soft"
          }`}
        >
          <span className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-accent">
            Payment Method <span className="text-red-400">*</span> Required
          </span>
          <PaymentMethodDialog
            value={payment}
            onSave={(summary) => {
              setPayment(summary);
              setPaymentError(false);
            }}
          />
          {paymentError && !payment && (
            <p className="mt-1.5 text-xs text-red-400">
              Choose a payment method to continue.
            </p>
          )}
          <p className="mt-1.5 text-xs text-text-faint">
            Confirms your preference only &mdash; card details are never stored or sent.
            Our team collects the deposit securely by phone.
          </p>
        </div>

        <div className="pt-2 flex justify-between font-mono text-sm">
          <span className="text-text-muted">Total deposit due</span>
          <span className="text-accent font-semibold">{formatPrice(String(totalDeposit))}</span>
        </div>

        {sendError && (
          <p className="text-sm text-red-400">
            Couldn&rsquo;t send your reservation request: {sendError}. Please try
            again or call {SITE.phoneDisplay}.
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={sending}
          className="mt-2 inline-flex w-full items-center justify-center bg-accent text-accent-ink font-semibold px-6 py-3 clip-corner-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {sending ? "Sending..." : "Submit Reservation Request →"}
        </motion.button>
      </form>
      <Link
        href="/cart/reserve"
        className="mt-3 inline-flex w-full items-center justify-center font-mono text-xs uppercase tracking-widest text-text-faint hover:text-accent transition-colors"
      >
        &larr; Back
      </Link>
    </div>
  );
}
