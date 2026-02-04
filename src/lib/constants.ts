/**
 * Design constants matching skills.sh
 * Used across components for consistent styling
 */

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Container max widths */
export const CONTAINER = {
  maxWidth: '1152px', // max-w-6xl
  padding: '16px',
} as const;

/** Header configuration */
export const HEADER = {
  height: 56,
  zIndex: 50,
} as const;

/** Navigation links */
export const NAV_LINKS = [{ href: '/docs', label: 'Docs' }] as const;

/** Agent configuration for the carousel */
export const SUPPORTED_AGENTS = [
  { id: 'claude-code', name: 'Claude Code', url: 'https://claude.ai/code' },
  { id: 'cursor', name: 'Cursor', url: 'https://cursor.com' },
  { id: 'codex', name: 'Codex', url: 'https://openai.com/codex' },
  { id: 'gemini-cli', name: 'Gemini CLI', url: 'https://ai.google.dev' },
  { id: 'opencode', name: 'OpenCode', url: 'https://github.com' },
  { id: 'antigravity', name: 'Antigravity', url: 'https://antigravity.dev' },
  { id: 'aider', name: 'Aider', url: 'https://aider.chat' },
  { id: 'windsurf', name: 'Windsurf', url: 'https://codeium.com/windsurf' },
  { id: 'amp', name: 'Amp', url: 'https://amp.dev' },
  { id: 'continue', name: 'Continue', url: 'https://continue.dev' },
] as const;

/** Leaderboard sorting options */
export const LEADERBOARD_TABS = [
  { id: 'all-time', label: 'All Time' },
  { id: 'trending', label: 'Trending (24h)' },
  { id: 'hot', label: 'Hot' },
] as const;

/** Format large numbers with K/M suffix */
export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toString();
}

/** Format number with thousands separator */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
