'use client';

import type { Skill } from '@/types';

interface SearchResultsProps {
  skills: Skill[];
  selectedIndex: number;
  onSelect: (skill: Skill) => void;
  isLoading?: boolean;
}

/**
 * SearchResults component for displaying search results
 *
 * Features:
 * - Renders list of skill items (name + org)
 * - Highlights selected item for keyboard navigation
 * - Empty state: "No skills found"
 * - Loading state: show loading text
 */
export default function SearchResults({
  skills,
  selectedIndex,
  onSelect,
  isLoading = false,
}: SearchResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        data-testid="search-results"
        className="mt-4 p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg text-center"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"
            style={{ animationDelay: '100ms' }}
          />
          <div
            className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"
            style={{ animationDelay: '200ms' }}
          />
          <span className="ml-2 text-zinc-600 dark:text-zinc-400 font-mono">Loading skills...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (skills.length === 0) {
    return (
      <div
        data-testid="search-results"
        className="mt-4 p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg text-center"
      >
        <p className="text-zinc-500 dark:text-zinc-400 font-mono">No skills found</p>
      </div>
    );
  }

  // Results list
  return (
    <div
      data-testid="search-results"
      className="mt-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden"
    >
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {skills.map((skill, index) => (
          <li
            key={skill._id}
            className={`transition-colors ${
              index === selectedIndex
                ? 'bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(skill)}
              className="w-full text-left px-6 py-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate font-mono">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{skill.org}</p>
                </div>

                {/* Visual indicator for selected */}
                {index === selectedIndex && (
                  <div className="flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-blue-500"
                      aria-hidden="true"
                    >
                      <title>Selected</title>
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
