"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="text-background flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold">Error</h1>
        <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
        <p className="mt-2">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground mt-6 inline-block rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-80"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
