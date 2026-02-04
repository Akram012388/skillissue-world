'use client';

import type { ReactNode } from 'react';
import type { AgentType, Skill } from '@/types';
import { getInstallCommand } from '@/types';
import { InstallCommand } from './InstallCommand';
import { SkillSidebar } from './SkillSidebar';

interface SkillDetailProps {
  skill: Skill;
  selectedAgent: AgentType;
}

/**
 * SkillDetail component matching skills.sh design
 *
 * Features:
 * - 2-column grid layout (1fr 280px) on desktop
 * - Stacked layout on mobile (below lg breakpoint)
 * - Main content: skill name, description, install command, content
 * - Sidebar: StatCards with metrics
 */
export function SkillDetail({ skill, selectedAgent }: SkillDetailProps): ReactNode {
  const installCommand = getInstallCommand(skill, selectedAgent);

  return (
    <div data-testid="skill-detail" className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      {/* Main Content (Left Column) */}
      <div className="min-w-0">
        {/* Skill Name */}
        <h1 className="text-4xl font-bold text-foreground mb-4">{skill.name}</h1>

        {/* Description */}
        <p className="text-xl text-foreground-muted mb-8">
          {skill.longDescription || skill.description}
        </p>

        {/* Install Command Section */}
        <div className="mb-8">
          <h2 className="text-xs uppercase text-foreground-muted mb-3 tracking-wide">
            Install Command
          </h2>
          <InstallCommand command={installCommand} />
        </div>

        {/* SKILL.md Content (if available) */}
        {skill.longDescription && skill.longDescription !== skill.description && (
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xs uppercase text-foreground-muted mb-3 tracking-wide">About</h2>
            <div className="text-foreground-muted leading-relaxed whitespace-pre-wrap">
              {skill.longDescription}
            </div>
          </div>
        )}

        {/* Tags */}
        {skill.tags.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs uppercase text-foreground-muted mb-3 tracking-wide">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-background-subtle rounded-full text-sm text-foreground-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar (Right Column) */}
      <SkillSidebar skill={skill} />
    </div>
  );
}
