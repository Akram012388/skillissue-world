'use client';

import { useMutation, useQuery } from 'convex/react';
import type { LeaderboardTab } from '@/components';
import type { AgentType } from '@/types';
import { api } from '../../convex/_generated/api';

/**
 * Hook to fetch all skills with optional limit
 */
export function useSkills(limit?: number) {
  return useQuery(api.skills.list, { limit });
}

/**
 * Hook to fetch a single skill by slug
 */
export function useSkill(slug: string) {
  return useQuery(api.skills.getBySlug, { slug });
}

/**
 * Hook to search skills by query
 */
export function useSearchSkills(query: string) {
  return useQuery(api.skills.search, { query });
}

/**
 * Hook to fetch top skills by install count
 * "Hit Picks" section
 */
export function useHitPicks(limit?: number) {
  return useQuery(api.skills.hitPicks, { limit });
}

/**
 * Hook to fetch most recently updated skills
 * "Latest Drops" section
 */
export function useLatestDrops(limit?: number) {
  return useQuery(api.skills.latestDrops, { limit });
}

/**
 * Hook to fetch leaderboard data based on active tab
 */
export function useLeaderboard(tab: LeaderboardTab, limit?: number) {
  const allTime = useQuery(api.skills.leaderboardAllTime, { limit });
  const trending = useQuery(api.skills.leaderboardTrending, { limit });
  const hot = useQuery(api.skills.leaderboardHot, { limit });

  switch (tab) {
    case 'all-time':
      return allTime;
    case 'trending':
      return trending;
    case 'hot':
      return hot;
  }
}

/**
 * Hook to get total skill count
 */
export function useSkillCount() {
  return useQuery(api.skills.getCount, {});
}

/**
 * Hook to track user events (copy, repo click, view)
 */
export function useTrackEvent() {
  const trackEvent = useMutation(api.skills.trackEvent);

  return {
    trackCopy: (skillSlug: string, agent?: AgentType) =>
      trackEvent({ skillSlug, action: 'copy', agent }),
    trackRepoClick: (skillSlug: string) => trackEvent({ skillSlug, action: 'repo_click' }),
    trackView: (skillSlug: string) => trackEvent({ skillSlug, action: 'view' }),
  };
}
