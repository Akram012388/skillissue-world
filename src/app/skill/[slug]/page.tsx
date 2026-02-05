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
      <div className="min-h-screen bg-background">
        <main className="max-w-4xl mx-auto py-12 px-4">
          <LoadingSkeleton variant="detail" />
        </main>
      </div>
    );
  }

  // Not found state
  if (skill === null) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <h1 className="text-4xl font-bold text-foreground">Skill Not Found</h1>
            <p className="text-lg text-foreground-muted">
              The skill &quot;{slug}&quot; doesn&apos;t exist in our directory.
            </p>
            <p className="text-sm text-foreground-muted">Maybe it&apos;s a... skill issue? 😏</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground mb-8 transition-colors"
        >
          ← Back to all skills
        </Link>

        {/* Skill Detail */}
        <SkillDetail skill={skill as Skill} selectedAgent={selectedAgent} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-foreground-muted">
          <p>
            <Link href="/" className="text-foreground hover:underline">
              skillissue.world
            </Link>{' '}
            — The no-BS encyclopedia for official agent skills
          </p>
        </div>
      </footer>
    </div>
  );
}
