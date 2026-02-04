'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardHint, LoadingSkeleton, SearchBar, SkillCard, Toast } from '@/components';
import {
  useHitPicks,
  useKeyboard,
  useLatestDrops,
  useSearchParams,
  useSearchSkills,
} from '@/hooks';
import type { Skill } from '@/types';

interface HomeContentProps {
  initialQuery?: string;
}

export function HomeContent({ initialQuery: _initialQuery = '' }: HomeContentProps): ReactNode {
  // URL state for search and agent selection
  const { query, setQuery, agent: selectedAgent } = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Data fetching
  const searchResults = useSearchSkills(query);
  const hitPicks = useHitPicks(6);
  const latestDrops = useLatestDrops(6);

  // Determine what to show
  const isSearching = query.trim().length > 0;
  const skills = isSearching ? searchResults : null;
  const isLoading = isSearching ? searchResults === undefined : hitPicks === undefined;

  // Get all displayable skills for keyboard navigation
  const displayedSkills = useMemo<Skill[]>(() => {
    if (isSearching && skills) {
      return skills as Skill[];
    }
    // When not searching, combine hit picks and latest drops for navigation
    const combined: Skill[] = [];
    if (hitPicks) {
      combined.push(...(hitPicks as Skill[]));
    }
    if (latestDrops) {
      combined.push(...(latestDrops as Skill[]));
    }
    return combined;
  }, [isSearching, skills, hitPicks, latestDrops]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, []);

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
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto px-4">
      {/* Search Bar */}
      <SearchBar
        ref={searchRef}
        value={query}
        onChange={setQuery}
        placeholder="Search skills..."
        autoFocus
      />

      {/* Main Content */}
      {isLoading ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : isSearching && skills ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {skills.length} result{skills.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
          {skills.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill._id}
                  skill={skill as Skill}
                  isSelected={index === selectedIndex}
                  selectedAgent={selectedAgent}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                No skills found for &quot;{query}&quot;
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {/* Hit Picks Section */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              🔥 Hit Picks
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hitPicks?.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={skill as Skill}
                  selectedAgent={selectedAgent}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </section>

          {/* Latest Drops Section */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              ✨ Latest Drops
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestDrops?.map((skill) => (
                <SkillCard
                  key={skill._id}
                  skill={skill as Skill}
                  selectedAgent={selectedAgent}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Keyboard Hints */}
      <KeyboardHint hints={keyboardHints} />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
