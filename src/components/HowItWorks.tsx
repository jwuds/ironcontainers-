const steps = [
  {
    title: "Browse & Reserve",
    body: "Find your unit and reserve it with a small refundable deposit.",
  },
  {
    title: "We Confirm & Prep Your Unit",
    body: "Our team confirms availability and preps the unit for transport.",
  },
  {
    title: "Nationwide Delivery Arranged",
    body: "Freight is scheduled and coordinated straight to your site.",
  },
  {
    title: "Equipment Delivered",
    body: "Your unit arrives, ready to put to work.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl tracking-wide mb-10">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-4 sm:gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rise-in" style={{ animationDelay: `${i * 80}ms` }}>
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-border" />
              )}
              <span className="relative z-10 grid h-10 w-10 place-items-center bg-accent text-accent-ink font-display text-lg clip-corner-sm">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-sm">{step.title}</h3>
              <p className="mt-1.5 text-xs text-text-muted leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
