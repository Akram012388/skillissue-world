'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { LoadingSkeleton, SkillDetail } from '@/components';
import { useSkill } from '@/hooks';
import type { Skill } from '@/types';
import { DEFAULT_AGENT } from '@/types';

export default function SkillPage(): ReactNode {
  const params = useParams();
  const slug = params.slug as string;
  const selectedAgent = DEFAULT_AGENT;

  const skill = useSkill(slug);

  // Loading state
  if (skill === undefined) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <main className="max-w-4xl mx-auto py-12 px-4">
          <LoadingSkeleton variant="detail" />
        </main>
      </div>
    );
  }

  // Not found state
  if (skill === null) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <main className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Skill Not Found</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              The skill &quot;{slug}&quot; doesn&apos;t exist in our directory.
            </p>
            <p className="text-sm text-zinc-500">Maybe it&apos;s a... skill issue? 😏</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          ← Back to all skills
        </Link>

        {/* Skill Detail */}
        <SkillDetail skill={skill as Skill} selectedAgent={selectedAgent} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            <Link href="/" className="text-zinc-700 dark:text-zinc-300 hover:underline">
              skillissue.world
            </Link>{' '}
            — The no-BS encyclopedia for official agent skills
          </p>
        </div>
      </footer>
    </div>
  );
}
