"use client";

import * as React from "react";
import { withAlpha } from "@/lib/color";

export type TabOption<T extends string> = {
  value: T;
  label: string;
};

type TabsProps<T extends string> = {
  label: string;
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  tone: string;
};

export function Tabs<T extends string>({
  label,
  options,
  value,
  onChange,
  tone,
}: TabsProps<T>) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium tracking-wide opacity-70">
        {label}
      </div>
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex w-fit flex-wrap gap-1 rounded-2xl border bg-[var(--tab-bg)] p-1"
        style={
          {
            "--tab-border": withAlpha(tone, 0.16),
            "--tab-bg": withAlpha(tone, 0.06),
            "--tab-bg-hover": withAlpha(tone, 0.09),
            "--tab-bg-selected": withAlpha(tone, 0.12),
            "--tab-fg": tone,
            "--tab-fg-muted": withAlpha(tone, 0.8),
            borderColor: "var(--tab-border)",
          } as React.CSSProperties
        }
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();

          const delta = e.key === "ArrowLeft" ? -1 : 1;
          const next =
            (selectedIndex + delta + options.length) % options.length;
          onChange(options[next]!.value);

          const buttons = (e.currentTarget as HTMLElement).querySelectorAll(
            'button[role="tab"]',
          );
          (buttons[next] as HTMLButtonElement | undefined)?.focus();
        }}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              role="tab"
              type="button"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className={[
                "relative rounded-xl px-3 py-1.5 text-sm font-medium transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-0",
                selected
                  ? "bg-[var(--tab-bg-selected)] text-[color:var(--tab-fg)]"
                  : "text-[color:var(--tab-fg-muted)] hover:bg-[var(--tab-bg-hover)] hover:text-[color:var(--tab-fg)]",
              ].join(" ")}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
