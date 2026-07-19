"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// All product photography is hotlinked from third-party hosts we don't
// control, so a broken/offline source image is a "when," not "if." This
// swaps a failed load for a clean branded placeholder instead of the
// browser's default broken-image icon.
export default function SafeImage({ alt, className, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`grid place-items-center bg-bg-raised-2 font-mono text-[10px] text-text-faint ${className ?? ""}`}
        style={props.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        IMAGE UNAVAILABLE
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
