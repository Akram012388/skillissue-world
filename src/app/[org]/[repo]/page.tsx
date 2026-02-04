'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  Breadcrumb,
  buildBreadcrumbs,
  LoadingSkeleton,
  RepoLink,
  RepoSkillList,
} from '@/components';
import { useRepoStats, useSkillsByRepo } from '@/hooks';
import { formatCount } from '@/lib/constants';
import type { Skill } from '@/types';

export default function RepoPage(): ReactNode {
  const params = useParams();
  const org = params.org as string;
  const repo = params.repo as string;

  const repoStats = useRepoStats(org, repo);
  const skills = useSkillsByRepo(org, repo);

  const breadcrumbs = buildBreadcrumbs(org, repo);

  // Loading state
  if (repoStats === undefined || skills === undefined) {
    return (
      <div className="py-8 lg:py-12">
        <Breadcrumb segments={breadcrumbs} />
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  // Not found state
  if (repoStats === null || skills.length === 0) {
    return (
      <div className="py-8 lg:py-12">
        <Breadcrumb segments={breadcrumbs} />
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-foreground">Repository Not Found</h1>
          <p className="text-lg text-foreground-muted">
            The repository &quot;{org}/{repo}&quot; doesn&apos;t exist in our directory.
          </p>
          <Link
            href={`/${org}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-foreground/90"
          >
            Back to {org}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <Breadcrumb segments={breadcrumbs} />

      {/* Repo Header */}
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{repo}</h1>
          <p className="text-sm text-foreground-muted">
            {repoStats.skillCount} skill{repoStats.skillCount !== 1 ? 's' : ''} ·{' '}
            {formatCount(repoStats.totalInstalls)} total installs
          </p>
        </div>
        <RepoLink url={repoStats.githubUrl} className="shrink-0" />
      </header>

      {/* Section header */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
        <span className="text-sm font-medium text-foreground">Skill Name</span>
        <span className="text-sm font-medium text-foreground">Installs</span>
      </div>

      <RepoSkillList skills={skills as Skill[]} org={org} repo={repo} />
    </div>
  );
}
