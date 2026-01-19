"use client";

import * as React from "react";
import { withAlpha } from "@/lib/color";

type ToastProps = {
  message: string;
  bg: string;
  fg: string;
};

export function Toast({ message, bg, fg }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div
        className="pointer-events-auto rounded-2xl border px-4 py-2 text-sm shadow-xl backdrop-blur"
        style={{
          backgroundColor: withAlpha(bg, 0.75),
          borderColor: withAlpha(fg, 0.14),
          color: fg,
        }}
      >
        {message}
      </div>
      <div className="sr-only" aria-live="polite">
        {message}
      </div>
    </div>
  );
}
