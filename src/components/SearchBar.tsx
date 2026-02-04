'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * SearchBar component matching skills.sh design
 *
 * Features:
 * - Search icon on the left
 * - Keyboard hint "/" badge on the right
 * - Full width with 48px height
 * - Design system colors (bg-background-subtle, border-border)
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

    return (
      <div className="relative w-full">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-4 pointer-events-none text-foreground-muted">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

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
            className="w-full h-12 pl-12 pr-14 text-base bg-background-subtle border border-border rounded-lg focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-colors placeholder:text-foreground-muted text-foreground"
          />

          {/* Keyboard hint or clear button */}
          <div className="absolute right-4 flex items-center">
            {localValue ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="p-1 text-foreground-muted hover:text-foreground transition-colors rounded"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            ) : (
              !isFocused && (
                <kbd className="px-2 py-1 text-xs font-mono text-foreground-muted bg-background-subtle border border-border rounded">
                  /
                </kbd>
              )
            )}
          </div>
        </div>
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
