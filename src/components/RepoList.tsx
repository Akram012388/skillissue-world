'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { formatCount } from '@/lib/constants';
import type { Skill } from '@/types';

interface RepoData {
  repo: string;
  skills: Skill[];
  totalInstalls: number;
}

interface RepoListProps {
  repos: RepoData[];
  org: string;
}

interface RepoRowProps {
  repoData: RepoData;
  onClick: () => void;
}

/**
 * RepoRow component - individual row in the organization repo list
 */
function RepoRow({ repoData, onClick }: RepoRowProps): ReactNode {
  const { repo, skills, totalInstalls } = repoData;
  const skillNames = skills
    .slice(0, 3)
    .map((s) => s.name)
    .join(', ');
  const moreCount = skills.length - 3;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-start justify-between gap-4 py-4 px-4 -mx-4 rounded-lg cursor-pointer transition-colors hover:bg-background-subtle w-full text-left"
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-lg text-foreground group-hover:text-foreground transition-colors">
          {repo}
        </h3>
        <p className="text-sm text-foreground-muted mt-1">
          {skills.length} skill{skills.length !== 1 ? 's' : ''}: {skillNames}
          {moreCount > 0 && <span>, +{moreCount} more</span>}
        </p>
      </div>
      <div className="text-right tabular-nums text-foreground-muted shrink-0">
        {formatCount(totalInstalls)}
      </div>
    </button>
  );
}

/**
 * RepoList component matching skills.sh design
 *
 * Features:
 * - Lists repositories for an organization
 * - Each row: repo name (bold), skill count + skill names preview, total installs
 * - Clickable rows navigate to /[org]/[repo]
 * - Hover state with bg-background-subtle
 */
export function RepoList({ repos, org }: RepoListProps): ReactNode {
  const router = useRouter();

  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted">No repositories found for this organization</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {repos.map((repoData) => (
        <RepoRow
          key={repoData.repo}
          repoData={repoData}
          onClick={() => router.push(`/${org}/${repoData.repo}`)}
        />
      ))}
    </div>
  );
}
