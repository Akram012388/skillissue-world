'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardHint,
  type LeaderboardTab,
  LeaderboardTable,
  LeaderboardTabs,
  LoadingSkeleton,
  SearchBar,
  SkillCard,
  Toast,
} from '@/components';
import {
  useKeyboard,
  useLeaderboard,
  useSearchParams,
  useSearchSkills,
  useSkillCount,
} from '@/hooks';
import type { Skill } from '@/types';

interface HomeContentProps {
  initialQuery?: string;
}

export function HomeContent({ initialQuery: _initialQuery = '' }: HomeContentProps): ReactNode {
  // URL state for search and agent selection
  const { query, setQuery, agent: selectedAgent } = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('all-time');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Data fetching
  const searchResults = useSearchSkills(query);
  const leaderboardData = useLeaderboard(activeTab, 50);
  const skillCount = useSkillCount();

  // Determine what to show
  const isSearching = query.trim().length > 0;
  const skills = isSearching ? searchResults : leaderboardData;
  const isLoading = skills === undefined;

  // Get all displayable skills for keyboard navigation
  const displayedSkills = useMemo<Skill[]>(() => {
    if (!skills) {
      return [];
    }
    return skills as Skill[];
  }, [skills]);

  // Show toast helper
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
    },
    [],
  );

  // Handle copy event from skill cards
  const handleCopy = useCallback(() => {
    showToast('Copied to clipboard!', 'success');
  }, [showToast]);

  // Handle clear from keyboard
  const handleClear = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  // Initialize keyboard shortcuts
  useKeyboard({
    skills: displayedSkills,
    selectedIndex,
    setSelectedIndex,
    selectedAgent,
    searchRef,
    onCopy: handleCopy,
    onClear: handleClear,
  });

  // Keyboard hints
  const keyboardHints = [
    { key: '/', action: 'Search' },
    { key: 'c', action: 'Copy' },
    { key: 'g', action: 'Go to repo' },
    { key: '↑↓', action: 'Navigate' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Search Bar */}
      <SearchBar
        ref={searchRef}
        value={query}
        onChange={setQuery}
        placeholder="Search skills..."
        autoFocus
      />

      {/* Main Content */}
      {isSearching ? (
        // Search Results View
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <LoadingSkeleton variant="card" count={6} />
          ) : (
            <>
              <p className="text-sm text-foreground-muted">
                {displayedSkills.length} result{displayedSkills.length !== 1 ? 's' : ''} for &quot;
                {query}&quot;
              </p>
              {displayedSkills.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {displayedSkills.map((skill, index) => (
                    <SkillCard
                      key={skill._id}
                      skill={skill}
                      isSelected={index === selectedIndex}
                      selectedAgent={selectedAgent}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-foreground-muted">
                    No skills found for &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-foreground-muted mt-2">Try a different search term</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Leaderboard View
        <div className="flex flex-col gap-6">
          {/* Leaderboard Tabs */}
          <LeaderboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={
              skillCount !== undefined
                ? {
                    allTime: skillCount,
                    trending: skillCount,
                    hot: skillCount,
                  }
                : undefined
            }
          />

          {/* Leaderboard Table */}
          {isLoading ? (
            <LoadingSkeleton variant="list" count={10} />
          ) : (
            <LeaderboardTable
              skills={displayedSkills}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          )}
        </div>
      )}

      {/* Keyboard Hints */}
      <KeyboardHint hints={keyboardHints} />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
