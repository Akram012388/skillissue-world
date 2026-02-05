'use client';

import { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import type { AgentType, Skill } from '@/types';
import { getInstallCommand } from '@/types';
import { AgentToggle } from './AgentToggle';

interface SkillCardProps {
  skill: Skill;
  isSelected?: boolean;
  selectedAgent: AgentType;
  onCopy?: () => void;
  onSelectAgent?: (agent: AgentType) => void;
}

export function SkillCard({
  skill,
  isSelected = false,
  selectedAgent,
  onCopy,
  onSelectAgent,
}: SkillCardProps) {
  const [copied, setCopied] = useState(false);

  const installCommand = getInstallCommand(skill, selectedAgent);
  const lastUpdatedText = formatRelativeTime(skill.lastUpdated);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      data-testid="skill-card"
      className={`
        group relative flex flex-col gap-3 rounded-lg border p-4
        transition-all duration-200
        ${
          isSelected
            ? 'border-ring bg-background-subtle ring-2 ring-ring/20'
            : 'border-border bg-background hover:border-border-strong hover:shadow-sm'
        }
      `}
    >
      {/* Header: Name + Org Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-semibold text-foreground text-base">{skill.name}</h3>
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-background-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground-muted">
            {skill.org}
            {skill.verified && (
              <span className="ml-1" title="Verified">
                ✓
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-sm text-foreground-muted">{skill.description}</p>

      {/* Agent Toggle */}
      {skill.agents.length > 1 && onSelectAgent && (
        <AgentToggle skill={skill} selectedAgent={selectedAgent} onSelect={onSelectAgent} />
      )}

      {/* Install Command */}
      <div className="flex items-center gap-2 rounded bg-background-subtle border border-border p-2">
        <code className="flex-1 overflow-x-auto text-xs font-mono text-foreground whitespace-nowrap">
          {installCommand}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className={`
            flex-shrink-0 rounded px-2 py-1 text-xs font-medium border
            transition-colors duration-200
            ${
              copied
                ? 'bg-success-100 text-success-700 border-success-200'
                : 'bg-background text-foreground-muted hover:text-foreground hover:bg-background-subtle border-border'
            }
          `}
          title="Copy install command"
          aria-label="Copy install command"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-background-subtle border border-border px-2 py-0.5 text-xs font-medium text-foreground-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-muted">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="text-foreground-muted">
              📦
            </span>
            <span className="sr-only">Installs:</span>
            {skill.installs.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="text-foreground-muted">
              ⭐
            </span>
            <span className="sr-only">Stars:</span>
            {skill.stars.toLocaleString()}
          </span>
        </div>
        <span className="text-right">
          <span className="sr-only">Last updated:</span>
          {lastUpdatedText}
        </span>
      </div>
    </div>
  );
}
