'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CategoryChips,
  KeyboardHint,
  LoadingSkeleton,
  SearchBar,
  SkillCard,
  Toast,
} from '@/components';
import {
  useHitPicks,
  useHotSpots,
  useKeyboard,
  useLatestDrops,
  useSearchParams,
  useSearchSkills,
  useSkills,
} from '@/hooks';
import type { Skill } from '@/types';

interface HomeContentProps {
  initialQuery?: string;
}

const SECTION_LIMIT = 8;

export function HomeContent({ initialQuery: _initialQuery = '' }: HomeContentProps): ReactNode {
  // URL state for search and agent selection
  const { query, setQuery, agent: selectedAgent, setAgent, tag, setTag } = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Data fetching
  const searchResults = useSearchSkills(query, tag);
  const hitPicks = useHitPicks(SECTION_LIMIT);
  const latestDrops = useLatestDrops(SECTION_LIMIT);
  const hotSpots = useHotSpots(SECTION_LIMIT);
  const allSkills = useSkills();

  const hasQuery = query.trim().length > 0;
  const isFiltering = hasQuery || Boolean(tag);
  const filterKey = `${query}|${tag ?? ''}|${isFiltering ? '1' : '0'}`;
  const lastFilterKeyRef = useRef(filterKey);

  const keyboardSkills = useMemo<Skill[]>(
    () => (isFiltering ? ((searchResults ?? []) as Skill[]) : ((hitPicks ?? []) as Skill[])),
    [isFiltering, searchResults, hitPicks],
  );

  // Reset selection when filters change or list shrinks
  useEffect(() => {
    if (lastFilterKeyRef.current !== filterKey) {
      lastFilterKeyRef.current = filterKey;
      setSelectedIndex(0);
    }
  }, [filterKey]);

  useEffect(() => {
    if (selectedIndex >= keyboardSkills.length) {
      setSelectedIndex(0);
    }
  }, [keyboardSkills.length, selectedIndex]);

  // Tag counts for categories
  const tagCounts = useMemo(() => {
    if (!allSkills) {
      return [];
    }
    const map = new Map<string, number>();
    for (const skill of allSkills as Skill[]) {
      for (const skillTag of skill.tags) {
        map.set(skillTag, (map.get(skillTag) ?? 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([tagName, count]) => ({ tag: tagName, count }))
      .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.tag.localeCompare(b.tag)));
  }, [allSkills]);

  const searchTagCounts = useMemo(() => {
    if (!hasQuery) {
      return tagCounts;
    }
    if (!tag) {
      return [];
    }
    return tagCounts.filter((tagCount) => tagCount.tag === tag);
  }, [hasQuery, tagCounts, tag]);

  const resultLabel = useMemo(() => {
    const parts: string[] = [];
    if (query.trim()) {
      parts.push(`"${query}"`);
    }
    if (tag) {
      parts.push(`tag: ${tag}`);
    }
    return parts.join(' · ');
  }, [query, tag]);

  const isLoading = isFiltering ? searchResults === undefined : hitPicks === undefined;

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
    setTag(null);
  }, [setQuery, setTag]);

  // Initialize keyboard shortcuts
  useKeyboard({
    skills: keyboardSkills,
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
      {isFiltering ? (
        // Search Results View
        <div className="flex flex-col gap-4">
          <CategoryChips
            tags={searchTagCounts}
            activeTag={tag}
            onSelect={(selectedTag) => {
              setTag(selectedTag);
              setQuery('');
              setSelectedIndex(0);
            }}
            onClear={() => {
              setTag(null);
              setSelectedIndex(0);
            }}
          />
          {isLoading ? (
            <LoadingSkeleton variant="card" count={6} />
          ) : (
            <>
              <p className="text-sm text-foreground-muted">
                {keyboardSkills.length} result{keyboardSkills.length !== 1 ? 's' : ''} for{' '}
                {resultLabel || 'all skills'}
              </p>
              {keyboardSkills.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {keyboardSkills.map((skill, index) => (
                    <SkillCard
                      key={skill._id}
                      skill={skill}
                      isSelected={index === selectedIndex}
                      selectedAgent={selectedAgent}
                      onSelectAgent={setAgent}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-foreground-muted">No skills found</p>
                  <p className="text-sm text-foreground-muted mt-2">Try a different search term</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Default Sections View
        <div className="flex flex-col gap-10">
          {/* Hit Picks */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-foreground-muted">Hit Picks</h2>
              {hitPicks && (
                <span className="text-xs text-foreground-muted">{hitPicks.length} skills</span>
              )}
            </div>
            {hitPicks === undefined ? (
              <LoadingSkeleton variant="card" count={6} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {(hitPicks as Skill[]).map((skill, index) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    isSelected={index === selectedIndex}
                    selectedAgent={selectedAgent}
                    onSelectAgent={setAgent}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Latest Drops */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-foreground-muted">Latest Drops</h2>
              {latestDrops && (
                <span className="text-xs text-foreground-muted">{latestDrops.length} skills</span>
              )}
            </div>
            {latestDrops === undefined ? (
              <LoadingSkeleton variant="card" count={6} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {(latestDrops as Skill[]).map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    selectedAgent={selectedAgent}
                    onSelectAgent={setAgent}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Hot Spots */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-foreground-muted">Hot Spots</h2>
              {hotSpots && (
                <span className="text-xs text-foreground-muted">{hotSpots.length} skills</span>
              )}
            </div>
            {hotSpots === undefined ? (
              <LoadingSkeleton variant="card" count={6} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {(hotSpots as Skill[]).map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    selectedAgent={selectedAgent}
                    onSelectAgent={setAgent}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Categories */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-foreground-muted">Categories</h2>
            </div>
            <CategoryChips
              tags={tagCounts}
              activeTag={tag}
              onSelect={(selectedTag) => {
                setTag(selectedTag);
                setQuery('');
                setSelectedIndex(0);
              }}
              onClear={() => {
                setTag(null);
                setSelectedIndex(0);
              }}
            />
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
