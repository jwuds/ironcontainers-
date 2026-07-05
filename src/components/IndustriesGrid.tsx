const industries: { name: string; icon: React.ReactNode }[] = [
  {
    name: "Construction",
    icon: (
      <path
        d="M3 20h18M5 20V11l4-2v3l4-2v3l4-2v9M9 20v-4h3v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Agriculture",
    icon: (
      <path
        d="M12 21c-4-2-7-5.5-7-10a7 7 0 0 1 14 0c0 4.5-3 8-7 10Zm0-5V6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Oil & Gas",
    icon: (
      <path
        d="M12 3c2 3 5 6.5 5 10a5 5 0 0 1-10 0c0-1.6.8-3 1.7-4.2M12 3c-.6 1.7-1 3-1 4.3a1 1 0 0 0 2 0c0-1-.3-2.3-1-4.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Warehousing",
    icon: (
      <path
        d="M3 10 12 4l9 6v10H3V10Zm4 10v-6h10v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Events",
    icon: (
      <path
        d="M3 20 12 4l9 16H3Zm9-10v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Government",
    icon: (
      <path
        d="M4 10h16M5 10v9M9 10v9M15 10v9M19 10v9M3 20h18M12 3l8 4H4l8-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Manufacturing",
    icon: (
      <path
        d="m3 20 2-8 5 2 2-6 5 3 2-4 2 13H3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function IndustriesGrid() {
  return (
    <section className="border-t border-border bg-bg-raised/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl tracking-wide mb-8">
          Industries we serve
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {industries.map((item, i) => (
            <div
              key={item.name}
              className="rise-in flex flex-col items-center gap-2 border border-border-soft bg-bg py-6 px-3 text-center"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" aria-hidden="true">
                {item.icon}
              </svg>
              <span className="text-xs font-medium text-text-muted">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
