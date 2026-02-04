'use client';

import { AGENT_DISPLAY, type AgentType, type Skill } from '@/types';

interface AgentToggleProps {
  skill: Skill;
  selectedAgent: AgentType;
  onSelect: (agent: AgentType) => void;
}

export function AgentToggle({ skill, selectedAgent, onSelect }: AgentToggleProps) {
  // Get supported agents and sort by AGENT_DISPLAY order
  const supportedAgents = skill.agents.sort(
    (a, b) => AGENT_DISPLAY[a].order - AGENT_DISPLAY[b].order,
  );

  // Ensure Claude Code is first if supported
  if (supportedAgents.length === 0) {
    return null;
  }

  const groupName = `agent-toggle-${skill._id}`;

  return (
    <fieldset className="flex flex-wrap gap-2 border-0 p-0 m-0" data-testid="agent-toggle">
      <legend className="sr-only">Select agent</legend>
      {supportedAgents.map((agent) => {
        const isSelected = agent === selectedAgent;
        const displayInfo = AGENT_DISPLAY[agent];
        const inputId = `${groupName}-${agent}`;

        return (
          <label
            key={agent}
            htmlFor={inputId}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            <input
              type="radio"
              id={inputId}
              name={groupName}
              value={agent}
              checked={isSelected}
              onChange={() => onSelect(agent)}
              className="sr-only"
              aria-label={`Select ${displayInfo.label}`}
            />
            {displayInfo.label}
          </label>
        );
      })}
    </fieldset>
  );
}
