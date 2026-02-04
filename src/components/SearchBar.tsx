'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Debounce hook for search input
 * @param callback Function to call after debounce
 * @param delay Debounce delay in milliseconds
 */
function useDebounce(callback: (value: string) => void, delay: number): (value: string) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay],
  );
}

/**
 * SearchBar component with debounced input
 *
 * Features:
 * - Large centered input with monospace font
 * - Debounced onChange (150ms)
 * - Clear button (X) when has value
 * - "Press / to search" hint when empty
 * - Focus ring styling
 * - Escape key clears and blurs
 * - forwardRef for focus control
 */
const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, placeholder = 'Search skills...', autoFocus = false }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const debouncedOnChange = useDebounce(onChange, 150);

    // Focus on mount if autoFocus is enabled (programmatic focus for accessibility)
    useEffect(() => {
      if (autoFocus) {
        internalRef.current?.focus();
      }
    }, [autoFocus]);

    // Handle local state changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedOnChange(e.target.value);
    };

    // Handle clear button
    const handleClear = () => {
      onChange('');
      internalRef.current?.focus();
    };

    // Handle escape key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
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
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            data-testid="search-bar"
            className="w-full px-6 py-4 text-lg font-mono bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors placeholder-gray-400"
          />

          {/* Hint text when empty */}
          {!value && !isFocused && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">/</kbd> to
              search
            </div>
          )}

          {/* Clear button when has value */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
