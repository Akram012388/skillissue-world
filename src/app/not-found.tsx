import Link from 'next/link';
import type { ReactNode } from 'react';

export default function NotFound(): ReactNode {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <main className="flex flex-col items-center justify-center gap-8 p-8 text-center">
        {/* 404 Big Text */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-8xl font-bold text-zinc-200 dark:text-zinc-800">404</span>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Page Not Found</h1>
        </div>

        {/* Playful message */}
        <div className="flex flex-col gap-2 max-w-md">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Looks like you&apos;ve encountered a...
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">skill issue 😏</p>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist. Maybe try searching for what you
          need?
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            ← Go Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Search Skills
          </Link>
        </div>
      </main>
    </div>
  );
}
