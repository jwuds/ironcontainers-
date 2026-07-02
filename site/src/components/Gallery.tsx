"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-4/3 grid place-items-center bg-bg-raised-2 border border-border-soft font-mono text-text-faint text-sm">
        NO IMAGE AVAILABLE
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden bg-bg-raised-2 border border-border-soft">
        <Image
          key={active}
          src={images[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
        <span className="absolute bottom-2 right-2 font-mono text-[10px] bg-bg/80 border border-border px-1.5 py-0.5 text-text-muted">
          {active + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {images.slice(0, 12).map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border transition-colors cursor-pointer ${
                i === active
                  ? "border-accent"
                  : "border-border-soft hover:border-border"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
