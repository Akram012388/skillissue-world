'use client';

import type { ReactNode } from 'react';
import { formatNumber } from '@/lib/constants';

export type LeaderboardTab = 'all-time' | 'trending' | 'hot';

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
  counts?: {
    allTime: number;
    trending: number;
    hot: number;
  };
}

interface TabConfig {
  id: LeaderboardTab;
  label: string;
  countKey: keyof NonNullable<LeaderboardTabsProps['counts']>;
}

const TABS: TabConfig[] = [
  { id: 'all-time', label: 'All Time', countKey: 'allTime' },
  { id: 'trending', label: 'Trending (24h)', countKey: 'trending' },
  { id: 'hot', label: 'Hot', countKey: 'hot' },
];

/**
 * LeaderboardTabs component matching skills.sh design
 *
 * Features:
 * - Three tabs: All Time, Trending (24h), Hot
 * - Active tab: rounded-full with inverted colors
 * - Shows count in parentheses for All Time tab
 * - URL state synced via parent
 */
export function LeaderboardTabs({
  activeTab,
  onTabChange,
  counts,
}: LeaderboardTabsProps): ReactNode {
  return (
    <div className="flex gap-2" role="tablist" aria-label="Leaderboard filters">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts?.[tab.countKey];

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              isActive
                ? 'bg-foreground text-background'
                : 'bg-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.id === 'all-time' && count !== undefined && (
              <span className="ml-1">({formatNumber(count)})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
