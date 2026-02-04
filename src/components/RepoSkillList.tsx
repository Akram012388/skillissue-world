'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { formatCount } from '@/lib/constants';
import type { Skill } from '@/types';

interface RepoSkillListProps {
  skills: Skill[];
  org: string;
  repo: string;
}

interface SkillRowProps {
  skill: Skill;
  onClick: () => void;
}

/**
 * SkillRow component - individual row in the repo skill list
 */
function SkillRow({ skill, onClick }: SkillRowProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-start justify-between gap-4 py-4 px-4 -mx-4 rounded-lg cursor-pointer transition-colors hover:bg-background-subtle w-full text-left"
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-lg text-foreground group-hover:text-foreground transition-colors">
          {skill.name}
        </h3>
        <p className="text-sm text-foreground-muted line-clamp-2 mt-1">{skill.description}</p>
      </div>
      <div className="text-right tabular-nums text-foreground-muted shrink-0">
        {formatCount(skill.installs)}
      </div>
    </button>
  );
}

/**
 * RepoSkillList component matching skills.sh design
 *
 * Features:
 * - Lists skills in a repository
 * - Each row: skill name, description (2-line clamp), installs
 * - Clickable rows navigate to skill detail
 * - Hover state with bg-background-subtle
 */
export function RepoSkillList({ skills, org, repo }: RepoSkillListProps): ReactNode {
  const router = useRouter();

  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-muted">No skills found in this repository</p>
      </div>
    );
  }

  // Sort skills by installs (highest first)
  const sortedSkills = [...skills].sort((a, b) => b.installs - a.installs);

  return (
    <div className="divide-y divide-border">
      {sortedSkills.map((skill) => (
        <SkillRow
          key={skill._id}
          skill={skill}
          onClick={() => router.push(`/${org}/${repo}/${skill.slug}`)}
        />
      ))}
    </div>
  );
}
