export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateModified?: string;
  tag: string;
  body: BlogSection[];
};

export const posts: BlogPost[] = [
  {
    slug: "container-grades-explained",
    title: "Container Grades Explained: Cargo Worthy vs. WWT vs. New",
    excerpt:
      "What \"Cargo Worthy,\" \"Wind & Water Tight,\" and \"New/One-Trip\" actually mean, and how to pick the right grade for your project.",
    date: "2026-05-12",
    dateModified: "2026-07-21",
    tag: "Buying Guide",
    body: [
      {
        heading: "Why grade matters more than age",
        paragraphs: [
          "Container listings use a handful of grade terms that aren't always explained clearly, and two containers built the same year can carry very different grades depending on how they were used and stored. Grade — not age — is the better predictor of what you're actually getting, because it describes current structural and cosmetic condition rather than a manufacture date.",
          "The four grades below cover most of what you'll see on a resale market: New/One-Trip, Cargo Worthy, Wind & Water Tight, and Economy. Each one trades off price against condition in a fairly predictable way.",
        ],
      },
      {
        heading: "New / One-Trip: the closest thing to factory-fresh",
        paragraphs: [
          "New / One-Trip units have made a single loaded ocean voyage — typically from the factory (mostly China-built) to a U.S. port — and look close to factory-fresh as a result. They'll have minor handling marks from that one trip, but none of the accumulated dents, rust streaks, or floor wear that come from years of active cargo service.",
          "This is the premium grade, and it's worth it specifically when appearance matters: container-home conversions, offices, retail pop-ups, or any jobsite storage box that's going to sit somewhere visible for years. If the container is going in a back lot where nobody will see it, One-Trip is usually more grade than the job needs.",
        ],
      },
      {
        heading: "Cargo Worthy (CW): built to ship freight again",
        paragraphs: [
          "Cargo Worthy containers pass an inspection confirming they're structurally sound and watertight enough to ship freight again — the same bar international shipping lines hold new cargo to. That inspection checks the walls, floor, roof, and doors for structural integrity: no holes, no significant rust-through, doors that open, close, and seal properly.",
          "CW is the most common grade for active storage and shipping use precisely because it's a verified, third-party-style bar rather than a seller's subjective description. If you need a container that could theoretically go back into ocean freight service — or you just want the reassurance of a real structural standard — this is the grade to ask for by name.",
        ],
      },
      {
        heading: "Wind & Water Tight (WWT): budget-friendly, cosmetically rougher",
        paragraphs: [
          "Wind & Water Tight units keep contents dry — that's the entire bar the name describes — but may have cosmetic dents, surface rust, or general wear that would fail a formal cargo inspection. Structurally usable, just not to the CW standard.",
          "WWT is a solid, budget-friendly choice for static storage where looks and shipping certification don't matter: farm equipment storage, construction site materials, backyard storage where the container simply needs to keep water and pests out.",
        ],
      },
      {
        heading: "Economy: functional, lowest price point",
        paragraphs: [
          "Economy grade covers older or more heavily used units — still functional for basic dry storage, at the lowest price point, but expect visible wear and a shorter remaining service life than the grades above. This is the right call when budget is the primary constraint and the container's job is short-term or low-stakes.",
        ],
      },
      {
        heading: "Matching grade to your project",
        paragraphs: [
          "A rough way to think about it: if the container will be seen by customers or the public, lean toward New/One-Trip. If it needs to move again as cargo, specify Cargo Worthy. If it's parked and just needs to keep contents dry, WWT covers it. If budget is the deciding factor and the use case is low-stakes, Economy is a reasonable trade-off.",
          "If you're not sure which grade fits your use case, our team can walk through it — call the number in the header or reserve a unit and ask before your deposit is finalized.",
        ],
      },
    ],
  },
  {
    slug: "section-179-equipment-deduction",
    title: "Section 179: How Contractors Can Write Off Equipment This Year",
    excerpt:
      "A plain-English overview of the Section 179 deduction and why it matters for contractors and farm operations buying containers or gensets before year-end.",
    date: "2026-04-02",
    dateModified: "2026-07-21",
    tag: "Financing",
    body: [
      {
        heading: "What Section 179 actually does",
        paragraphs: [
          "Section 179 of the IRS tax code lets qualifying businesses deduct the full purchase price of eligible equipment — including shipping containers and generators used for business purposes — in the year they're placed in service, rather than depreciating the cost over several years on a fixed schedule.",
          "The practical difference is timing: normal depreciation spreads a deduction out over the equipment's useful life (sometimes 5–7+ years for this class of asset), while Section 179 lets an eligible business take the whole deduction against this year's income instead. For a profitable year where you need to offset taxable income, that timing difference is the entire appeal.",
        ],
      },
      {
        heading: "Who tends to use it",
        paragraphs: [
          "Contractors and ag operations are typical users of this deduction because both industries regularly buy tangible, business-use equipment outright — a jobsite storage container, a standby generator, a cold-storage unit for produce — rather than leasing it. Section 179 is built around exactly that kind of purchase.",
          "In general, the deduction applies to equipment that's used more than 50% for business purposes and placed in service (meaning ready and available for its intended use, not just purchased) within the tax year you're claiming it.",
        ],
      },
      {
        heading: "Why the year-end timing matters",
        paragraphs: [
          "Because the deduction is tied to the tax year the equipment is placed in service, a purchase made and delivered in December can typically be claimed for that year, while the same purchase delayed into January moves the deduction to the following year's return. If you're trying to offset a specific year's income, that placed-in-service date — not just the purchase date — is what your accountant will care about.",
        ],
      },
      {
        heading: "Rules change — talk to your accountant",
        paragraphs: [
          "Deduction limits, phase-outs, and eligibility rules change year to year and depend on your specific tax situation, total equipment spending, and business structure, so nothing here is tax advice — talk to your accountant about how Section 179 applies to your business before you buy.",
        ],
      },
      {
        heading: "What we can help with",
        paragraphs: [
          "We can't give tax advice, but we can make the paperwork side easy: every unit we sell comes with an itemized invoice your accountant can use to support the deduction, including a clear description and price breakdown for each item on a multi-unit order.",
        ],
      },
    ],
  },
  {
    slug: "reefer-container-buying-guide",
    title: "Reefer Container Buying Guide for Cold Storage",
    excerpt:
      "What to check before buying a refrigerated container for farm, pharmaceutical, or produce cold storage.",
    date: "2026-03-18",
    dateModified: "2026-07-21",
    tag: "Refrigerated",
    body: [
      {
        heading: "How a reefer container is built",
        paragraphs: [
          "Refrigerated containers (reefers) are built around a self-contained refrigeration unit — usually Thermo King or Carrier — mounted to one end of an insulated steel box. Unlike a standard dry container, the walls, floor, and roof are insulated to hold a set temperature range, and the refrigeration unit runs independently off its own power connection rather than relying on ambient conditions.",
        ],
      },
      {
        heading: "Clip-on vs. undermount: what the difference means for you",
        paragraphs: [
          "Mount type matters: clip-on units sit on the outside of the container, bolted to the end wall, and are easier to service or swap out entirely since a technician can access the whole unit without going inside the box. Undermount units sit beneath the floor instead, which frees up a few inches of usable length inside the container — a real advantage if you're maximizing interior storage or pallet count, and it's common on newer over-the-road reefers built for tighter logistics tolerances.",
          "If ease of future servicing matters more than a few inches of interior space, clip-on is the simpler long-term choice. If interior capacity is the priority and you're comfortable with harder-to-access maintenance, undermount is worth the trade-off.",
        ],
      },
      {
        heading: "Questions to ask about maintenance history",
        paragraphs: [
          "For farm and produce cold storage, ask about the unit's temperature range and whether it's been running consistently versus sitting idle. A unit that's been in active cold-chain service usually has a more predictable maintenance history than one that's been parked for years, since regular operation tends to surface (and get) mechanical issues addressed rather than letting them go unnoticed.",
          "It's also worth asking whether the refrigeration unit has had recent service on its compressor and door seals — the two components most likely to need attention on an older unit, and the two that most directly affect how well it holds temperature.",
        ],
      },
      {
        heading: "Pharmaceutical and precision cold-chain use",
        paragraphs: [
          "Pharmaceutical and other precision cold-chain uses should confirm calibration and temperature-logging capability before relying on a unit for regulated storage — not every reefer ships with a logging system installed, and regulated storage typically requires continuous, auditable temperature records rather than just a working thermostat.",
        ],
      },
      {
        heading: "If the refrigeration unit ever needs replacing",
        paragraphs: [
          "Reefer units pair with our Refrigeration Units & Gensets category as a cross-sell — if a container's onboard unit ever needs replacing, that's where to look for a compatible clip-on or undermount replacement rather than replacing the entire container.",
        ],
      },
    ],
  },
  {
    slug: "how-our-reservation-process-works",
    title: "How Our Deposit & Reservation Process Works",
    excerpt:
      "A refundable deposit locks your price for 48–72 hours while we confirm the unit and arrange delivery — here's the full sequence.",
    date: "2026-02-09",
    dateModified: "2026-07-21",
    tag: "How It Works",
    body: [
      {
        heading: "Why we use a deposit-and-reserve model",
        paragraphs: [
          "We use a deposit-and-reserve model rather than an instant checkout, so every order gets a human confirmation step before delivery is arranged. Industrial equipment — containers, tanks, gensets — usually involves site-specific delivery logistics that are worth confirming with a real person before anything ships, which an instant-checkout flow can't do well.",
        ],
      },
      {
        heading: "Step 1: Reserve",
        paragraphs: [
          "A refundable deposit of up to $1,000 (or the item's full price if it's lower) holds your unit and locks the quoted price for 48–72 hours while we confirm availability and arrange delivery. If your order doesn't move forward, the deposit is fully refunded — there's no risk in locking in a price while you finalize details on your end.",
        ],
      },
      {
        heading: "Step 2: We confirm",
        paragraphs: [
          "Our team verifies the unit is available and preps it for transport. This is also when any grade- or condition-specific questions (see our container grades guide) get sorted out before delivery is scheduled.",
        ],
      },
      {
        heading: "Step 3: Delivery is arranged",
        paragraphs: [
          "Freight is scheduled to your site, coordinated around your timeline. Delivery cost isn't included in the listed unit price — it's quoted separately based on your location and the unit's size, since freight rates vary too much by distance and equipment type to list a single flat number honestly.",
        ],
      },
      {
        heading: "Step 4: Delivered",
        paragraphs: [
          "Your unit arrives ready to use. Balance is due before delivery, not at reservation, so the deposit you paid in Step 1 is the only payment required to lock in your price and hold the unit.",
        ],
      },
      {
        heading: "Common questions about the process",
        paragraphs: [
          "Can I cancel after reserving? Yes — if your order doesn't move forward, the deposit is fully refunded.",
          "What if I change my mind after delivery? Returns are accepted within 7 days of delivery. Return shipping and any related costs are the customer's responsibility.",
          "Can this purchase support a Section 179 write-off? Businesses may qualify to deduct the full purchase price in the year it's placed in service under Section 179, rather than depreciating it over several years — see our Section 179 guide for the details, and talk to your accountant about your specific situation.",
        ],
      },
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

// Inverse of GROUP_SPECIFIC_POSTS — the first category a given guide is
// tied to, so the guide can deep-link to that category instead of just
// the generic catalog. Universal posts (deposit process, Section 179)
// have no single relevant category and return undefined on purpose.
export function getPrimaryGroupForPost(slug: string): string | undefined {
  for (const [group, slugs] of Object.entries(GROUP_SPECIFIC_POSTS)) {
    if (slugs.includes(slug)) return group;
  }
  return undefined;
}
