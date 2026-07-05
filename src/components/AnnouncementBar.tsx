import { SITE } from "@/lib/site";

const items = [
  {
    label: "Nationwide Delivery",
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
    label: "Financing Available",
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
];

export default function AnnouncementBar() {
  return (
    <div className="bg-bg-raised border-b border-border-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-text-muted">
        {items.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-accent" aria-hidden="true">
              {item.icon}
            </svg>
            {item.label}
          </span>
        ))}
        <a
          href={`tel:${SITE.phone}`}
          className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              d="M4 4.5c0-.6.4-1 1-1h2.4c.5 0 .9.3 1 .8l.8 3a1 1 0 0 1-.3 1L7.4 9.8a12 12 0 0 0 5.8 5.8l1.5-1.5a1 1 0 0 1 1-.3l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1h-1C9.4 19 4 13.6 4 6.5v-1Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          Call Now: {SITE.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
