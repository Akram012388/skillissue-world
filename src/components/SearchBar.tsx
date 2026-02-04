'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * SearchBar component with immediate visual feedback
 *
 * Features:
 * - Large centered input with monospace font
 * - Local state for immediate typing feedback
 * - Syncs with URL state via nuqs (which handles throttling)
 * - Clear button (X) when has value
 * - "Press / to search" hint when empty
 * - Focus ring styling
 * - Escape key clears and blurs
 * - forwardRef for focus control
 */
const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, placeholder = 'Search skills...', autoFocus = false }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    // Sync local state with external value (e.g., when URL changes)
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Focus on mount if autoFocus is enabled (programmatic focus for accessibility)
    useEffect(() => {
      if (autoFocus) {
        internalRef.current?.focus();
      }
    }, [autoFocus]);

    // Handle input changes - immediate local update, then notify parent (nuqs handles throttling)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(newValue);
    };

    // Handle clear button
    const handleClear = () => {
      setLocalValue('');
      onChange('');
      internalRef.current?.focus();
    };

    // Handle escape key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setLocalValue('');
        onChange('');
        internalRef.current?.blur();
      }
    };

    // Note: Global "/" key handling is done in useKeyboard hook

    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="relative">
          <input
            ref={(node) => {
              internalRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="text"
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            data-testid="search-bar"
            className="w-full px-6 py-4 text-lg font-mono bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors placeholder-zinc-400 dark:placeholder-zinc-500 dark:text-zinc-100"
          />

          {/* Hint text when empty */}
          {!localValue && !isFocused && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400 dark:text-zinc-500 pointer-events-none">
              Press{' '}
              <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-semibold">
                /
              </kbd>{' '}
              to search
            </div>
          )}

          {/* Clear button when has value */}
          {localValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <title>Clear search</title>
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
