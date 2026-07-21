import Image from "next/image";
import partners from "@/data/partners.json";

function LogoTile({
  partner,
  compact,
}: {
  partner: (typeof partners)[number];
  compact: boolean;
}) {
  return (
    <div
      title={partner.name}
      className={
        "clip-corner-sm relative shrink-0 bg-[#f3f1e7] border border-border-soft p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10" +
        (compact ? " h-12 w-28 sm:h-14 sm:w-32" : " h-16 w-36 sm:h-20 sm:w-44")
      }
    >
      <Image
        src={partner.src}
        alt={partner.name}
        fill
        sizes="(max-width: 640px) 8rem, 11rem"
        className="object-contain"
      />
    </div>
  );
}

export default function PartnerLogos({ compact = false }: { compact?: boolean }) {
  const track = [...partners, ...partners];

  return (
    <div className={compact ? "" : "mx-auto max-w-7xl px-4 sm:px-6"}>
      {!compact && (
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl sm:text-4xl tracking-wide">
            Shipping lines we source from
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-text-faint">
            {partners.length} carriers
          </span>
        </div>
      )}
      {compact && (
        <p className="font-mono text-xs uppercase tracking-widest text-text-faint mb-4">
          Shipping lines we source from
        </p>
      )}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className={"marquee-track flex w-max" + (compact ? " gap-2" : " gap-3 sm:gap-4")}>
          {track.map((p, i) => (
            <LogoTile key={`${p.slug}-${i}`} partner={p} compact={compact} />
          ))}
        </div>
      </div>
    </div>
  );
}
