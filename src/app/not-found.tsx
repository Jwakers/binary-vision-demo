import { ROUTES } from "@/constants";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-background flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground mt-2">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href={ROUTES.HOME}
          className="bg-primary text-primary-foreground mt-6 inline-block rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-80"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
