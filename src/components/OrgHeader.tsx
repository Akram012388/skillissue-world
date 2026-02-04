'use client';

import type { ReactNode } from 'react';
import { formatCount } from '@/lib/constants';
import { RepoLink } from './RepoLink';

interface OrgHeaderProps {
  name: string;
  repoCount: number;
  skillCount: number;
  totalInstalls: number;
  githubUrl: string;
}

/**
 * OrgHeader component matching skills.sh design
 *
 * Features:
 * - Org name as title (text-3xl font-bold)
 * - Stats line: X repos · Y skills · Z total installs
 * - GitHub link button on the right
 */
export function OrgHeader({
  name,
  repoCount,
  skillCount,
  totalInstalls,
  githubUrl,
}: OrgHeaderProps): ReactNode {
  return (
    <header className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{name}</h1>
        <p className="text-sm text-foreground-muted">
          {repoCount} repo{repoCount !== 1 ? 's' : ''} · {skillCount} skill
          {skillCount !== 1 ? 's' : ''} · {formatCount(totalInstalls)} total installs
        </p>
      </div>
      <RepoLink url={githubUrl} className="shrink-0" />
    </header>
  );
}
