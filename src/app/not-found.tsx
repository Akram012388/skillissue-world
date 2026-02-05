import Link from 'next/link';
import type { ReactNode } from 'react';

export default function NotFound(): ReactNode {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <main className="flex flex-col items-center justify-center gap-8 p-8 text-center">
        {/* 404 Big Text */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-8xl font-bold text-foreground-muted">404</span>
          <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
        </div>

        {/* Playful message */}
        <div className="flex flex-col gap-2 max-w-md">
          <p className="text-lg text-foreground-muted">Looks like you&apos;ve encountered a...</p>
          <p className="text-2xl font-bold text-foreground">skill issue 😏</p>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground-muted max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist. Maybe try searching for what you
          need?
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            ← Go Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background-subtle"
          >
            Search Skills
          </Link>
        </div>
      </main>
    </div>
  );
}
