"use client";

import * as React from "react";
import type { Contrast, EverforestPalette, Variant } from "@/lib/palette";
import { copyToClipboard } from "@/lib/clipboard";
import { withAlpha } from "@/lib/color";
import { ColorSwatch } from "@/components/ColorSwatch";
import { Tabs } from "@/components/Tabs";
import { Toast } from "@/components/Toast";

type PaletteViewerProps = {
  palette: EverforestPalette;
};

const VARIANT_TABS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
] as const;

const CONTRAST_TABS = [
  { value: "hard", label: "Hard" },
  { value: "medium", label: "Medium" },
  { value: "soft", label: "Soft" },
] as const;

export function PaletteViewer({ palette }: PaletteViewerProps) {
  const [variant, setVariant] = React.useState<Variant>("dark");
  const [contrast, setContrast] = React.useState<Contrast>("medium");

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [lastCopiedHex, setLastCopiedHex] = React.useState<string | null>(null);
  const toastTimerRef = React.useRef<number | null>(null);

  const variantPalette = palette[variant];
  const backgroundRows = variantPalette.palette1[contrast].rows;
  const fg =
    variantPalette.palette2.default[0] ??
    (variant === "dark" ? "#D3C6AA" : "#5C6A72");
  const bg =
    backgroundRows[0]?.[0] ??
    (variant === "dark" ? "#232A2E" : "#FDF6E3");

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  async function handleCopy(hex: string) {
    const ok = await copyToClipboard(hex);
    setLastCopiedHex(hex);

    setToastMessage(ok ? `Copied ${hex}` : `Could not copy ${hex}`);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 1600);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: bg,
        color: fg,
      }}
    >
      <div
        className="min-h-screen"
        style={{
          backgroundImage: `radial-gradient(800px circle at 20% 0%, ${withAlpha(fg, 0.08)}, transparent 60%), radial-gradient(900px circle at 80% 20%, ${withAlpha(fg, 0.06)}, transparent 55%)`,
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
          <header className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Everforest palette viewer
              </h1>
              <p className="max-w-2xl text-pretty text-sm opacity-80 sm:text-base">
                Choose a variant and contrast, then click any swatch to copy its
                HEX.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Tabs
                label="Variant"
                options={VARIANT_TABS}
                value={variant}
                tone={fg}
                onChange={(v) => {
                  setVariant(v);
                  setLastCopiedHex(null);
                }}
              />
              <Tabs
                label="Contrast"
                options={CONTRAST_TABS}
                value={contrast}
                tone={fg}
                onChange={(v) => {
                  setContrast(v);
                  setLastCopiedHex(null);
                }}
              />
            </div>
          </header>

          <main className="flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight opacity-90">
                  Background
                </h2>
                <div className="text-xs font-medium tracking-wide opacity-70">
                  palette1 · {contrast}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {backgroundRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {row.map((hex, index) => (
                      <ColorSwatch
                        key={`${hex}-${rowIndex}-${index}`}
                        hex={hex}
                        onCopy={handleCopy}
                        copied={lastCopiedHex === hex}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight opacity-90">
                  Foreground
                </h2>
                <div className="text-xs font-medium tracking-wide opacity-70">
                  palette2
                </div>
              </div>

              <div className="grid gap-6">
                <ForegroundGroup
                  title="Default"
                  colors={variantPalette.palette2.default}
                  onCopy={handleCopy}
                  lastCopiedHex={lastCopiedHex}
                />
                <ForegroundGroup
                  title="Accents"
                  colors={variantPalette.palette2.accents}
                  onCopy={handleCopy}
                  lastCopiedHex={lastCopiedHex}
                />
                <ForegroundGroup
                  title="Greys"
                  colors={variantPalette.palette2.greys}
                  onCopy={handleCopy}
                  lastCopiedHex={lastCopiedHex}
                />
                <ForegroundGroup
                  title="Statusline"
                  colors={variantPalette.palette2.statusline}
                  onCopy={handleCopy}
                  lastCopiedHex={lastCopiedHex}
                />
              </div>
            </section>
          </main>
        </div>

        {toastMessage ? <Toast message={toastMessage} bg={bg} fg={fg} /> : null}
      </div>
    </div>
  );
}

function ForegroundGroup({
  title,
  colors,
  onCopy,
  lastCopiedHex,
}: {
  title: string;
  colors: string[];
  onCopy: (hex: string) => void;
  lastCopiedHex: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-medium tracking-wide opacity-70">
        {title}
      </div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(colors.length, 7)}, minmax(0, 1fr))`,
        }}
      >
        {colors.map((hex, index) => (
          <ColorSwatch
            key={`${hex}-${index}`}
            hex={hex}
            onCopy={onCopy}
            copied={lastCopiedHex === hex}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
