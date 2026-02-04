'use client';

import { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import type { AgentType, Skill } from '@/types';
import { getInstallCommand } from '@/types';

interface SkillCardProps {
  skill: Skill;
  isSelected?: boolean;
  selectedAgent: AgentType;
  onCopy?: () => void;
}

export function SkillCard({ skill, isSelected = false, selectedAgent, onCopy }: SkillCardProps) {
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
            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-950 dark:ring-blue-800'
            : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600'
        }
      `}
    >
      {/* Header: Name + Org Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base">{skill.name}</h3>
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
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
      <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{skill.description}</p>

      {/* Install Command */}
      <div className="flex items-center gap-2 rounded bg-zinc-100 dark:bg-zinc-800 p-2">
        <code className="flex-1 overflow-x-auto text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
          {installCommand}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className={`
            flex-shrink-0 rounded px-2 py-1 text-xs font-medium
            transition-colors duration-200
            ${
              copied
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
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
              className="inline-flex items-center rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-3 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-500">
              📦
            </span>
            <span className="sr-only">Installs:</span>
            {skill.installs.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-500">
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
