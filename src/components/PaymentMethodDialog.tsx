"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Apple, Wallet, Landmark, Send } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/nested-dialog";

export type PaymentMethodType =
  | "creditcard"
  | "paypal"
  | "applepay"
  | "zelle"
  | "banktransfer";

export type PaymentSummary = {
  method: PaymentMethodType;
  cardHolder: string;
  last4: string;
};

const METHOD_LABEL: Record<PaymentMethodType, string> = {
  creditcard: "Credit Card",
  paypal: "PayPal",
  applepay: "Apple Pay",
  zelle: "Zelle",
  banktransfer: "Bank Transfer",
};

const METHOD_OPTIONS: {
  value: PaymentMethodType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "creditcard",
    label: "Credit Card",
    description: "Pay with Visa, Mastercard, or American Express",
    icon: Wallet,
  },
  {
    value: "paypal",
    label: "PayPal",
    description: "Pay with your PayPal account",
    icon: CreditCard,
  },
  {
    value: "applepay",
    label: "Apple Pay",
    description: "Pay with Apple Pay",
    icon: Apple,
  },
  {
    value: "zelle",
    label: "Zelle",
    description: "Send a direct bank-to-bank payment via Zelle",
    icon: Send,
  },
  {
    value: "banktransfer",
    label: "Bank Transfer",
    description: "Pay via ACH or wire transfer",
    icon: Landmark,
  },
];

/**
 * Collects a required payment method for the sales team to confirm by
 * phone. Card number and CVC never leave this component: they are used
 * only to derive a last-4 display value, and are discarded once the
 * dialog closes. No card data is stored in localStorage, state, or the
 * reservation email.
 *
 * Opens straight to the method picker (the choice that actually matters)
 * rather than defaulting to credit-card fields with the method choice
 * buried behind a second nested dialog.
 */
export function PaymentMethodDialog({
  value,
  onSave,
}: {
  value: PaymentSummary | null;
  onSave: (summary: PaymentSummary) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<"method" | "details">("method");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodType>(
    value?.method ?? "creditcard"
  );
  const [cardHolder, setCardHolder] = React.useState(value?.cardHolder ?? "");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setStep(value ? "details" : "method");
  }

  function handleSave() {
    const digits = cardNumber.replace(/\D/g, "");
    onSave({
      method: paymentMethod,
      cardHolder,
      last4: paymentMethod === "creditcard" ? digits.slice(-4) : "",
    });
    setCardNumber("");
    setCvc("");
    setOpen(false);
  }

  const isCreditCard = paymentMethod === "creditcard";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={value ? "outline" : "default"}
          className="w-full justify-center"
        >
          {value
            ? value.method === "creditcard"
              ? `Payment: Credit Card •••• ${value.last4}`
              : `Payment: ${METHOD_LABEL[value.method]}`
            : "Choose Payment Method (required)"}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        {step === "method" ? (
          <>
            <DialogHeader className="border-b p-4">
              <DialogTitle>Choose a payment method</DialogTitle>
              <DialogDescription>
                Select how you&rsquo;d like to pay the deposit. Our team confirms
                and collects it by phone &mdash; nothing here is charged
                automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 p-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethodType)}
              >
                {METHOD_OPTIONS.map(({ value: optionValue, label, description, icon: Icon }) => (
                  <div
                    key={optionValue}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent ${
                      paymentMethod === optionValue ? "border-accent bg-accent" : ""
                    }`}
                    onClick={() => setPaymentMethod(optionValue)}
                  >
                    <div className="flex items-center space-x-4">
                      <Icon className="h-5 w-5" />
                      <div>
                        <h3 className="text-sm font-medium">{label}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                    <RadioGroupItem value={optionValue} id={optionValue} />
                  </div>
                ))}
              </RadioGroup>
            </div>

            <DialogFooter className="flex flex-col items-center justify-between space-y-2 border-t px-4 py-2 sm:flex-row sm:space-y-0">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => setStep("details")}
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="border-b p-4">
              <DialogTitle>{METHOD_LABEL[paymentMethod]}</DialogTitle>
              <DialogDescription>
                These details confirm your preference only &mdash; our team
                finalizes and collects the deposit by phone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 p-4">
              {isCreditCard ? (
                <>
                  <div className="flex flex-col">
                    <Label className="mb-1.5 text-xs text-muted-foreground">
                      Card Holder*
                    </Label>
                    <Input
                      placeholder="Card Holder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-1.5 text-xs text-muted-foreground">
                      Card Number*
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Card number"
                        className="peer ps-9 [direction:inherit]"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        autoComplete="off"
                      />
                      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <CreditCard className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <Label className="mb-1.5 text-xs text-muted-foreground">
                        Expiration month and year*
                      </Label>
                      <Input
                        placeholder="MM/YY"
                        className="[direction:inherit]"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label className="mb-1.5 text-xs text-muted-foreground">
                        CVC*
                      </Label>
                      <Input
                        placeholder="CVC"
                        className="[direction:inherit]"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <Label className="mb-1.5 text-xs text-muted-foreground">
                      Name on Account*
                    </Label>
                    <Input
                      placeholder="Full Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No account or routing details needed here &mdash; our team will
                    reach out with {METHOD_LABEL[paymentMethod]} instructions to
                    complete the deposit.
                  </p>
                </>
              )}
            </div>

            <DialogFooter className="flex flex-col items-center justify-between space-y-2 border-t px-4 py-2 sm:flex-row sm:space-y-0">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setStep("method")}
              >
                &larr; Change Method
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={handleSave}>
                Save
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
