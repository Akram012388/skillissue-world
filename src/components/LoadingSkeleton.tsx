'use client';

type SkeletonVariant = 'card' | 'list' | 'detail';

interface LoadingSkeletonProps {
  variant: SkeletonVariant;
  count?: number;
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 space-y-4 animate-pulse">
      <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
      </div>
      <div className="h-20 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700 py-4 space-y-2 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
      <div className="space-y-4">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-4/6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-24 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
      </div>
    </div>
  );
}

export function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
              <CardSkeleton key={`card-skeleton-${i}`} />
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="space-y-0">
            {Array.from({ length: count }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items never reorder
              <ListItemSkeleton key={`list-skeleton-${i}`} />
            ))}
          </div>
        );
      case 'detail':
        return <DetailSkeleton />;
      default:
        return null;
    }
  };

  return (
    <output data-testid="loading-skeleton" aria-busy="true" aria-label="Loading content">
      {renderSkeleton()}
    </output>
  );
}
