import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { LoadingSkeleton } from '@/components';
import { HomeContent } from '@/components/HomeContent';

export default function Home(): ReactNode {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="flex flex-col items-center py-12">
        {/* Header */}
        <header className="flex flex-col items-center gap-4 mb-12 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            skillissue.world
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-md">
            Search. Copy. Go.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            The no-BS encyclopedia for official agent skills
          </p>
        </header>

        {/* Main Content */}
        <Suspense fallback={<LoadingSkeleton variant="card" count={6} />}>
          <HomeContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            Only official skills from verified orgs.{' '}
            <a
              href="https://github.com/CodeAkram/skillissue-world"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Contribute on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
