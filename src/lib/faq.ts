import type { Product } from "@/lib/catalog";

export type FaqItem = { question: string; answer: string };

// Every answer here restates a policy already documented elsewhere on the
// site (reservation-process blog post, Section 179 post, nationwide-
// delivery banner) or a real per-product spec field — nothing invented.
export function getProductFaqs(product: Product): FaqItem[] {
  const faqs: FaqItem[] = [];

  const condition = product.specs.find(([label]) => /condition/i.test(label))?.[1];
  if (condition) {
    faqs.push({
      question: `Is the ${product.title} available new or used?`,
      answer: `This listing is available in the following condition(s): ${condition}. Contact our team to confirm current availability for the condition you need.`,
    });
  }

  faqs.push({
    question: "How does the deposit and reservation process work?",
    answer:
      "A refundable deposit of $1,000 holds this unit and locks the quoted price for 48–72 hours while we confirm availability and arrange delivery. If your order doesn't move forward, the deposit is fully refunded.",
  });

  faqs.push({
    question: "Do you deliver, and does it cost extra?",
    answer:
      "Yes, we deliver nationwide. Delivery is coordinated after reservation and quoted based on your location and the unit's size, so it isn't included in the listed price.",
  });

  faqs.push({
    question: "What's your return policy?",
    answer:
      "Returns are accepted within 7 days of delivery. Return shipping and any related costs are the customer's responsibility.",
  });

  faqs.push({
    question: "Can I write this purchase off as a business expense?",
    answer:
      "Businesses may qualify to deduct the full purchase price in the year it's placed in service under Section 179, rather than depreciating it over several years. Rules and limits vary, so this isn't tax advice — talk to your accountant about your specific situation.",
  });

  return faqs;
}
