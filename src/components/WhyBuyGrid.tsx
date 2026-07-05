const items: { label: string; body: string; icon: React.ReactNode }[] = [
  {
    label: "Nationwide Shipping",
    body: "Freight coordinated to your site, coast to coast.",
    icon: (
      <path
        d="M2 7h11v8H2V7Zm11 3h4l3 3v2h-7v-5ZM5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Commercial-Grade Equipment",
    body: "Built and sourced for jobsite and industrial use.",
    icon: (
      <path
        d="M3 20h18M6 20V9l6-4 6 4v11M10 20v-6h4v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Financing Options",
    body: "Flexible terms available for qualifying buyers.",
    icon: (
      <path
        d="M12 3v18M7 7.5c0-1.9 2-3 5-3s5 1.1 5 2.6c0 3.4-10 1.6-10 5 0 1.6 2 2.9 5 2.9s5-1.1 5-2.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Quality-Inspected Inventory",
    body: "Every unit is photographed and documented before it's listed.",
    icon: (
      <path
        d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Zm-3 9 2 2 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Direct Line to a Real Person",
    body: "Call and talk to someone who knows the inventory.",
    icon: (
      <path
        d="M4 4.5c0-.6.4-1 1-1h2.4c.5 0 .9.3 1 .8l.8 3a1 1 0 0 1-.3 1L7.4 9.8a12 12 0 0 0 5.8 5.8l1.5-1.5a1 1 0 0 1 1-.3l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1h-1C9.4 19 4 13.6 4 6.5v-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function WhyBuyGrid() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl tracking-wide mb-8">
          Why buy from Container One Depot
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="rise-in group bg-bg-raised border border-border-soft p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-accent mb-3 transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              >
                {item.icon}
              </svg>
              <h3 className="font-semibold text-sm leading-snug">{item.label}</h3>
              <p className="mt-1.5 text-xs text-text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
