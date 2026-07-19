"use client";

import { useState } from "react";

export default function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 480;

  return (
    <div>
      <p
        className={`text-sm text-text-muted whitespace-pre-line leading-relaxed ${
          isLong && !expanded ? "line-clamp-6" : ""
        }`}
      >
        {text}
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
