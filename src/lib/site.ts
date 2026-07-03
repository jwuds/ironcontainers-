export const SITE = {
  name: "Container One Depot",
  domain: "containeronedepot.com",
  url: "https://containeronedepot.com",
  tagline: "Containers, refrigeration & industrial gear",
  initial: "C",
  description:
    "Shipping containers, refrigerated units, gensets, propane tanks, and trailers for sale with nationwide delivery. Request a quote or reserve online.",

  // Contact details surfaced in the footer and in structured data (JSON-LD).
  // TODO: replace the phone number and street address with the real business
  // details so the LocalBusiness schema and footer show accurate information.
  contact: {
    email: "sales@containeronedepot.com",
    phone: "+1-800-000-0000",
    phoneDisplay: "(800) 000-0000",
    hours: "Mon–Fri, 8am–6pm",
    address: {
      street: "",
      city: "",
      region: "",
      postalCode: "",
      country: "US",
    },
  },
} as const;
