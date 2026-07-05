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
  InnerDialog,
  InnerDialogTrigger,
  InnerDialogContent,
  InnerDialogHeader,
  InnerDialogFooter,
  InnerDialogTitle,
  InnerDialogDescription,
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
 * Collects a preferred payment method for the sales team to confirm by phone.
 * Card number and CVC never leave this component: they are used only to
 * derive a last-4 display value, and are discarded once the dialog closes.
 * No card data is stored in localStorage, state, or the reservation email.
 */
export function PaymentMethodDialog({
  value,
  onSave,
}: {
  value: PaymentSummary | null;
  onSave: (summary: PaymentSummary) => void;
}) {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodType>(
    value?.method ?? "creditcard"
  );
  const [cardHolder, setCardHolder] = React.useState(value?.cardHolder ?? "");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");

  function handleSave() {
    const digits = cardNumber.replace(/\D/g, "");
    onSave({
      method: paymentMethod,
      cardHolder,
      last4: paymentMethod === "creditcard" ? digits.slice(-4) : "",
    });
    setCardNumber("");
    setCvc("");
  }

  const isCreditCard = paymentMethod === "creditcard";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full sm:w-auto">
          {value
            ? value.method === "creditcard"
              ? `Payment: Credit Card •••• ${value.last4}`
              : `Payment: ${METHOD_LABEL[value.method]}`
            : "Add Payment Method"}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            These details are used only to confirm your preferred method — our
            team finalizes and collects the deposit by phone, nothing here is
            charged automatically.
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
          <InnerDialog>
            <InnerDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Payment Method
              </Button>
            </InnerDialogTrigger>
            <InnerDialogContent className="-mt-6 p-0 sm:-mt-1">
              <InnerDialogHeader className="border-b p-4">
                <InnerDialogTitle>Choose a payment method</InnerDialogTitle>
                <InnerDialogDescription>
                  Select your preferred payment option
                </InnerDialogDescription>
              </InnerDialogHeader>

              <div className="flex flex-col gap-4 p-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethodType)}
                >
                  {METHOD_OPTIONS.map(({ value: optionValue, label, description, icon: Icon }) => (
                    <div
                      key={optionValue}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-accent ${
                        paymentMethod === optionValue ? "bg-accent" : ""
                      }`}
                      onClick={() => setPaymentMethod(optionValue)}
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className="h-5 w-5" />
                        <div>
                          <h3 className="text-sm font-medium">{label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </div>
                      <RadioGroupItem value={optionValue} id={optionValue} />
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <InnerDialogFooter className="flex flex-col items-center justify-between space-y-2 border-t px-4 py-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Cancel Payment Method
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button" className="w-full sm:w-auto">
                    Continue
                  </Button>
                </DialogClose>
              </InnerDialogFooter>
            </InnerDialogContent>
          </InnerDialog>
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" className="w-full sm:w-auto" onClick={handleSave}>
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
