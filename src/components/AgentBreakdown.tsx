'use client';

import type { ReactNode } from 'react';
import type { AgentType } from '@/types';
import { AGENT_DISPLAY } from '@/types';

interface AgentBreakdownProps {
  agents: AgentType[];
}

/**
 * AgentBreakdown component for skill detail sidebar
 *
 * Features:
 * - Lists supported agents with badges
 * - Sorted by display order
 * - Styled badges matching skills.sh
 */
export function AgentBreakdown({ agents }: AgentBreakdownProps): ReactNode {
  // Sort agents by display order
  const sortedAgents = [...agents].sort((a, b) => {
    const orderA = AGENT_DISPLAY[a]?.order ?? 999;
    const orderB = AGENT_DISPLAY[b]?.order ?? 999;
    return orderA - orderB;
  });

  return (
    <div className="bg-background-subtle rounded-lg p-4">
      <div className="text-xs uppercase text-foreground-muted mb-3 tracking-wide">
        Supported Agents
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedAgents.map((agent) => (
          <span
            key={agent}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background rounded-full text-sm text-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted" aria-hidden="true" />
            {AGENT_DISPLAY[agent]?.label ?? agent}
          </span>
        ))}
      </div>
    </div>
  );
}
