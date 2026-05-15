"use client";

import { useState } from "react";

interface Props {
  text?: string;
  lines?: number;
}

export default function BioExpandable({ text = "", lines = 7 }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const approxChar = lines * 80;
  const isLong = text.length > approxChar;
  const preview = isLong ? text.slice(0, approxChar).trim() + "…" : text;

  return (
    <div className="max-w-3xl">
      <p className="text-muted-foreground leading-relaxed">
        {expanded ? text : preview}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((s) => !s)}
          className="text-primary-text cursor-pointer text-sm font-semibold underline"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
