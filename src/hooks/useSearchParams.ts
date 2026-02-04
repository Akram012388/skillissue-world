'use client';

import { parseAsString, useQueryState } from 'nuqs';
import type { AgentType } from '@/types';
import { DEFAULT_AGENT } from '@/types';

/**
 * URL state management for search and filtering
 * Uses nuqs for type-safe URL params that sync with React state
 *
 * URL format: /?q=search&agent=claude-code&tag=frontend
 */
export function useSearchParams() {
  // Search query - /?q=something
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      shallow: false,
      throttleMs: 150,
    }),
  );

  // Selected agent - /?agent=claude-code
  const [agent, setAgent] = useQueryState(
    'agent',
    parseAsString.withDefault(DEFAULT_AGENT).withOptions({
      shallow: false,
    }),
  );

  // Filter by tag - /?tag=frontend
  const [tag, setTag] = useQueryState(
    'tag',
    parseAsString.withOptions({
      shallow: false,
    }),
  );

  // Clear all search params
  const clearAll = () => {
    setQuery('');
    setAgent(DEFAULT_AGENT);
    setTag(null);
  };

  return {
    // Search
    query,
    setQuery,
    // Agent selection
    agent: agent as AgentType,
    setAgent,
    // Tag filtering
    tag,
    setTag,
    // Utilities
    clearAll,
  };
}
