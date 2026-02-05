'use client';

import type { ReactNode } from 'react';

interface CategoryChip {
  tag: string;
  count: number;
}

interface CategoryChipsProps {
  tags: CategoryChip[];
  activeTag?: string | null;
  onSelect: (tag: string) => void;
  onClear: () => void;
}

export function CategoryChips({
  tags,
  activeTag,
  onSelect,
  onClear,
}: CategoryChipsProps): ReactNode {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" data-testid="category-chips">
      {activeTag && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background-subtle px-3 py-1 text-xs font-medium text-foreground hover:border-border-strong"
        >
          Clear filter
        </button>
      )}
      {tags.map((tag) => {
        const isActive = tag.tag === activeTag;
        return (
          <button
            key={tag.tag}
            type="button"
            onClick={() => onSelect(tag.tag)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background-subtle text-foreground-muted hover:border-border-strong'
            }`}
          >
            <span>{tag.tag}</span>
            <span className={isActive ? 'text-background/80' : 'text-foreground-muted'}>
              {tag.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
