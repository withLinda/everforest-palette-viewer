"use client";

import * as React from "react";
import { readableTextColor, withAlpha } from "@/lib/color";

type ColorSwatchProps = {
  hex: string;
  onCopy: (hex: string) => void;
  copied?: boolean;
  variant?: "square" | "compact";
};

export function ColorSwatch({
  hex,
  onCopy,
  copied,
  variant = "square",
}: ColorSwatchProps) {
  const textColor = readableTextColor(hex);
  const aspectClass = variant === "compact" ? "aspect-[3/2]" : "aspect-square";

  return (
    <button
      type="button"
      className={[
        "group relative w-full overflow-hidden rounded-2xl",
        "transition-transform duration-200 ease-out motion-reduce:transition-none",
        "hover:-translate-y-0.5 active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70",
      ].join(" ")}
      style={{
        backgroundColor: hex,
        color: textColor,
        boxShadow: `inset 0 0 0 1px ${withAlpha(textColor, 0.18)}`,
      }}
      aria-label={`Copy ${hex}`}
      onClick={() => onCopy(hex)}
    >
      <div
        className={[
          "flex flex-col items-start justify-between",
          aspectClass,
          variant === "compact" ? "p-2.5" : "p-3",
        ].join(" ")}
      >
        <div
          className={[
            "text-[11px] font-semibold tracking-wide",
            copied ? "opacity-100" : "opacity-70",
          ].join(" ")}
        >
          {copied ? "Copied" : "Click to copy"}
        </div>
        <div className="flex w-full items-end justify-between gap-2">
          <div className="text-sm font-semibold tracking-tight">{hex}</div>
          <div
            className={[
              "text-[11px] font-medium tracking-wide",
              "opacity-0 transition-opacity duration-150",
              "group-hover:opacity-80 group-focus-visible:opacity-80",
            ].join(" ")}
          >
            Copy
          </div>
        </div>
      </div>
    </button>
  );
}
