"use client";

import { useState } from "react";

export default function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 480;
  const shown = expanded || !isLong ? text : text.slice(0, 480).trimEnd() + "…";

  return (
    <div>
      <p className="text-sm text-text-muted whitespace-pre-line leading-relaxed">
        {shown}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 font-mono text-xs uppercase tracking-widest text-accent hover:text-accent-hover transition-colors cursor-pointer"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
