"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-4 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Could not load palette
        </h1>
        <p className="text-sm opacity-80">
          Expected `palette.md` in the project root (or one level above).
        </p>
      </div>

      <pre className="overflow-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">
        {error.message}
      </pre>

      <div>
        <button
          type="button"
          className="rounded-xl border border-black/15 bg-black/5 px-4 py-2 text-sm font-medium hover:bg-black/10"
          onClick={() => reset()}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
