'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { Breadcrumb, buildBreadcrumbs, LoadingSkeleton, SkillDetail } from '@/components';
import { useSkillByPath } from '@/hooks';
import type { Skill } from '@/types';
import { DEFAULT_AGENT } from '@/types';

export default function SkillPage(): ReactNode {
  const params = useParams();
  const org = params.org as string;
  const repo = params.repo as string;
  const skillSlug = params.skill as string;

  const selectedAgent = DEFAULT_AGENT;
  const skill = useSkillByPath(org, repo, skillSlug);
  const breadcrumbs = buildBreadcrumbs(org, repo, skillSlug);

  // Loading state
  if (skill === undefined) {
    return (
      <div className="py-8 lg:py-12">
        <Breadcrumb segments={breadcrumbs} />
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  // Not found state
  if (skill === null) {
    return (
      <div className="py-8 lg:py-12">
        <Breadcrumb segments={breadcrumbs} />
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-foreground">Skill Not Found</h1>
          <p className="text-lg text-foreground-muted">
            The skill &quot;{skillSlug}&quot; doesn&apos;t exist in {org}/{repo}.
          </p>
          <Link
            href={`/${org}/${repo}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-foreground/90"
          >
            Back to {repo}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <Breadcrumb segments={breadcrumbs} />
      <SkillDetail skill={skill as Skill} selectedAgent={selectedAgent} />
    </div>
  );
}
