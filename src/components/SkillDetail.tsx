'use client';

import { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import type { AgentType, Skill } from '@/types';
import { AGENT_DISPLAY, getInstallCommand } from '@/types';

interface SkillDetailProps {
  skill: Skill;
  selectedAgent: AgentType;
}

export function SkillDetail({ skill, selectedAgent }: SkillDetailProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<AgentType>(selectedAgent);

  const lastUpdatedText = formatRelativeTime(skill.lastUpdated);

  const installCommand = getInstallCommand(skill, activeTab);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Sort supported agents by their display order
  const sortedAgents = skill.agents.sort((a, b) => AGENT_DISPLAY[a].order - AGENT_DISPLAY[b].order);

  return (
    <div data-testid="skill-detail" className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-8 dark:border-zinc-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{skill.name}</h1>
              {skill.verified && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  title="Verified skill"
                >
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              By <span className="font-semibold">{skill.org}</span>
            </p>
          </div>
        </div>

        {/* Main Description */}
        <div className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {skill.longDescription || skill.description}
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3">
          {skill.repoUrl && (
            <a
              href={skill.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              <span>📦</span> Repository
            </a>
          )}
          {skill.docsUrl && (
            <a
              href={skill.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <span>📚</span> Documentation
            </a>
          )}
        </div>
      </div>

      {/* Install Commands by Agent */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Installation</h2>

        {/* Agent Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-700">
          {sortedAgents.map((agent) => (
            <button
              type="button"
              key={agent}
              onClick={() => setActiveTab(agent)}
              className={`
                px-4 py-2 text-sm font-medium transition-all border-b-2
                ${
                  activeTab === agent
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }
              `}
              aria-label={`Select ${AGENT_DISPLAY[agent].label} install command`}
              aria-pressed={activeTab === agent}
            >
              {AGENT_DISPLAY[agent].label}
            </button>
          ))}
        </div>

        {/* Command Display */}
        <div className="flex flex-col gap-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
            {AGENT_DISPLAY[activeTab].label} Install Command
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 overflow-x-auto text-sm font-mono text-zinc-900 dark:text-zinc-100 py-2 px-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-300 dark:border-zinc-600 whitespace-nowrap">
              {installCommand}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className={`
                flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium
                transition-all duration-200 whitespace-nowrap
                ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100'
                }
              `}
              title="Copy install command"
              aria-label="Copy install command"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Supported Agents List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Supported Agents</h3>
        <div className="flex flex-wrap gap-2">
          {sortedAgents.map((agent) => (
            <span
              key={agent}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
            >
              <span className="text-xs">●</span>
              {AGENT_DISPLAY[agent].label}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
            Installs
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {skill.installs.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
            Stars
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {skill.stars.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
            Velocity
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {skill.velocity ? skill.velocity.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-6 text-sm text-zinc-600 dark:text-zinc-400">
        <span>Last updated {lastUpdatedText}</span>
        <span className="text-xs">ID: {skill._id}</span>
      </div>
    </div>
  );
}
