export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  body: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "container-grades-explained",
    title: "Container Grades Explained: Cargo Worthy vs. WWT vs. New",
    excerpt:
      "What \"Cargo Worthy,\" \"Wind & Water Tight,\" and \"New/One-Trip\" actually mean, and how to pick the right grade for your project.",
    date: "2026-05-12",
    tag: "Buying Guide",
    body: [
      "Container listings use a handful of grade terms that aren't always explained clearly. Here's what each one means in practice.",
      "New / One-Trip units have made a single loaded ocean voyage and look close to factory-fresh — the premium option, best when appearance matters (offices, retail conversions, visible jobsite storage).",
      "Cargo Worthy (CW) containers pass an inspection confirming they're structurally sound and watertight enough to ship freight again. This is the most common grade for active storage and shipping use.",
      "Wind & Water Tight (WWT) units keep contents dry but may have cosmetic dents, rust, or wear that would fail a cargo inspection. They're a solid, budget-friendly choice for static storage where looks and shipping certification don't matter.",
      "Economy grade covers older or more heavily used units — still functional for basic dry storage, at the lowest price point, but expect visible wear and shorter remaining service life.",
      "If you're not sure which grade fits your use case, our team can walk through it — call the number in the header or reserve a unit and ask before your deposit is finalized.",
    ],
  },
  {
    slug: "section-179-equipment-deduction",
    title: "Section 179: How Contractors Can Write Off Equipment This Year",
    excerpt:
      "A plain-English overview of the Section 179 deduction and why it matters for contractors and farm operations buying containers or gensets before year-end.",
    date: "2026-04-02",
    tag: "Financing",
    body: [
      "Section 179 of the IRS tax code lets qualifying businesses deduct the full purchase price of eligible equipment — including shipping containers and generators used for business purposes — in the year they're placed in service, rather than depreciating the cost over several years.",
      "For contractors and ag operations, that can mean writing off a jobsite storage container or standby generator against this year's income instead of spreading the deduction out.",
      "Rules, limits, and eligibility change year to year and depend on your specific tax situation, so this isn't tax advice — talk to your accountant about how Section 179 applies to your business before you buy.",
      "What we can help with: documentation. Every unit we sell comes with an itemized invoice your accountant can use to support the deduction.",
    ],
  },
  {
    slug: "reefer-container-buying-guide",
    title: "Reefer Container Buying Guide for Cold Storage",
    excerpt:
      "What to check before buying a refrigerated container for farm, pharmaceutical, or produce cold storage.",
    date: "2026-03-18",
    tag: "Refrigerated",
    body: [
      "Refrigerated containers (reefers) are built around a self-contained refrigeration unit — usually Thermo King or Carrier — mounted to one end of an insulated steel box.",
      "Mount type matters: clip-on units sit on the outside of the container and are easier to service or swap; undermount units sit beneath the floor and free up a few inches of usable length inside, common on newer over-the-road reefers.",
      "For farm and produce cold storage, ask about the unit's temperature range and whether it's been running consistently versus sitting idle — a unit that's been in active cold-chain service usually has a more predictable maintenance history than one that's been parked for years.",
      "Pharmaceutical and other precision cold-chain uses should confirm calibration and temperature-logging capability before relying on a unit for regulated storage.",
      "Reefer units pair with our Refrigeration Units & Gensets category as a cross-sell — if a container's onboard unit ever needs replacing, that's where to look for a compatible clip-on or undermount replacement.",
    ],
  },
  {
    slug: "how-our-reservation-process-works",
    title: "How Our Deposit & Reservation Process Works",
    excerpt:
      "A refundable deposit locks your price for 48–72 hours while we confirm the unit and arrange delivery — here's the full sequence.",
    date: "2026-02-09",
    tag: "How It Works",
    body: [
      "We use a deposit-and-reserve model rather than an instant checkout, so every order gets a human confirmation step before delivery is arranged.",
      "Step 1: Reserve. A refundable deposit of $1,000 holds your unit and locks the quoted price for 48–72 hours.",
      "Step 2: We confirm. Our team verifies the unit is available and preps it for transport.",
      "Step 3: Delivery is arranged. Freight is scheduled to your site, coordinated around your timeline.",
      "Step 4: Delivered. Your unit arrives ready to use. Balance is due before delivery, not at reservation.",
      "If your order doesn't move forward after reserving, the deposit is fully refundable — there's no risk in locking in a price while you finalize details on your end.",
      "Changed your mind after delivery? Returns are accepted within 7 days. Return shipping and any related costs are the customer's responsibility.",
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

// Category group -> guide slugs worth surfacing on that group's product
// pages, beyond the two universal posts (buying process, financing) every
// product links to regardless of category.
const GROUP_SPECIFIC_POSTS: Record<string, string[]> = {
  "shipping-containers": ["container-grades-explained"],
  "offshore-certified": ["container-grades-explained"],
  "refrigerated-containers": ["reefer-container-buying-guide"],
  "refrigeration-gensets": ["reefer-container-buying-guide"],
};

const UNIVERSAL_POST_SLUGS = [
  "how-our-reservation-process-works",
  "section-179-equipment-deduction",
];

export function getRelevantPosts(groups: string[]): BlogPost[] {
  const slugs = new Set<string>(UNIVERSAL_POST_SLUGS);
  for (const g of groups) {
    for (const slug of GROUP_SPECIFIC_POSTS[g] ?? []) slugs.add(slug);
  }
  return posts.filter((p) => slugs.has(p.slug));
}
