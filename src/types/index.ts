/**
 * Core type definitions for SkillIssue.world
 * Matches Convex schema in convex/schema.ts
 */

/** Supported agent types - Claude Code is the default */
export type AgentType = 'claude-code' | 'codex-cli' | 'cursor' | 'open-code' | 'gemini-cli';

/** Install commands for different agents */
export interface AgentCommands {
  claudeCode: string;
  codexCli?: string;
  cursor?: string;
  openCode?: string;
  geminiCli?: string;
}

/** Category tags for filtering */
export type CategoryTag =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'ai'
  | 'testing'
  | 'security'
  | 'performance'
  | 'documentation'
  | 'utilities';

/** Core skill type matching Convex schema */
export interface Skill {
  _id: string;
  slug: string;
  name: string;
  org: string;
  repo: string;
  description: string;
  longDescription?: string;
  commands: AgentCommands;
  tags: string[];
  agents: AgentType[];
  installs: number;
  stars: number;
  velocity?: number;
  lastUpdated: string;
  addedAt: string;
  repoUrl: string;
  docsUrl?: string;
  featured?: boolean;
  verified: boolean;
}

/** Event tracking for analytics */
export interface SkillEvent {
  _id: string;
  skillSlug: string;
  action: 'copy' | 'repo_click' | 'view';
  agent?: AgentType;
  timestamp: string;
}

/** Search/filter state synced to URL via nuqs */
export interface SearchState {
  query: string;
  agent: AgentType;
  tag?: CategoryTag;
  section?: 'hit-picks' | 'latest' | 'hot';
}

/** Agent display configuration */
export const AGENT_DISPLAY: Record<AgentType, { label: string; order: number }> = {
  'claude-code': { label: 'Claude Code', order: 1 },
  'codex-cli': { label: 'Codex CLI', order: 2 },
  cursor: { label: 'Cursor', order: 3 },
  'open-code': { label: 'Open Code', order: 4 },
  'gemini-cli': { label: 'Gemini CLI', order: 5 },
};

/** Default agent is always Claude Code */
export const DEFAULT_AGENT: AgentType = 'claude-code';

/** Get install command for a skill and agent */
export function getInstallCommand(skill: Skill, agent: AgentType): string {
  const commandMap: Record<AgentType, string | undefined> = {
    'claude-code': skill.commands.claudeCode,
    'codex-cli': skill.commands.codexCli,
    cursor: skill.commands.cursor,
    'open-code': skill.commands.openCode,
    'gemini-cli': skill.commands.geminiCli,
  };

  return commandMap[agent] ?? skill.commands.claudeCode;
}
