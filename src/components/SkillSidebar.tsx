'use client';

import type { ReactNode } from 'react';
import { formatCount } from '@/lib/constants';
import type { AgentType, Skill } from '@/types';
import { AgentBreakdown } from './AgentBreakdown';
import { RepoLink } from './RepoLink';
import { StatCard } from './StatCard';

interface SkillSidebarProps {
  skill: Skill;
}

/**
 * SkillSidebar component for skill detail page
 *
 * Features:
 * - Stacked StatCards for metrics
 * - Repository link card
 * - First Seen date
 * - Agent breakdown
 */
export function SkillSidebar({ skill }: SkillSidebarProps): ReactNode {
  // Format the addedAt date
  const firstSeenDate = new Date(skill.addedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <aside className="space-y-4">
      {/* Total Installs */}
      <StatCard title="Total Installs">{formatCount(skill.installs)}</StatCard>

      {/* Repository Link */}
      <div className="bg-background-subtle rounded-lg p-4">
        <div className="text-xs uppercase text-foreground-muted mb-2 tracking-wide">Repository</div>
        <RepoLink url={skill.repoUrl} />
      </div>

      {/* First Seen Date */}
      <StatCard title="First Seen">{firstSeenDate}</StatCard>

      {/* Agent Breakdown */}
      <AgentBreakdown agents={skill.agents as AgentType[]} />
    </aside>
  );
}
