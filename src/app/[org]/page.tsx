'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { Breadcrumb, buildBreadcrumbs, LoadingSkeleton, OrgHeader, RepoList } from '@/components';
import { useOrgRepos, useOrgStats } from '@/hooks';
import type { Skill } from '@/types';

export default function OrgPage(): ReactNode {
  const params = useParams();
  const org = params.org as string;

  const orgStats = useOrgStats(org);
  const orgRepos = useOrgRepos(org);

  const breadcrumbs = buildBreadcrumbs(org);

  // Loading state
  if (orgStats === undefined || orgRepos === undefined) {
    return (
      <div className="py-8 lg:py-12">
        <Breadcrumb segments={breadcrumbs} />
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  // Not found state
  if (orgStats === null || orgRepos.length === 0) {
    return (
      <div className="py-8 lg:py-12">
        <Breadcrumb segments={breadcrumbs} />
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-foreground">Organization Not Found</h1>
          <p className="text-lg text-foreground-muted">
            The organization &quot;{org}&quot; doesn&apos;t exist in our directory.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-foreground/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Cast repos to typed array
  const typedRepos = orgRepos as Array<{
    repo: string;
    skills: Skill[];
    totalInstalls: number;
  }>;

  return (
    <div className="py-8 lg:py-12">
      <Breadcrumb segments={breadcrumbs} />

      <OrgHeader
        name={orgStats.org}
        repoCount={orgStats.repoCount}
        skillCount={orgStats.skillCount}
        totalInstalls={orgStats.totalInstalls}
        githubUrl={orgStats.githubUrl}
      />

      {/* Section header */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
        <span className="text-sm font-medium text-foreground">Repository</span>
        <span className="text-sm font-medium text-foreground">Installs</span>
      </div>

      <RepoList repos={typedRepos} org={org} />
    </div>
  );
}
