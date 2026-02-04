'use client';

import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  children: ReactNode;
}

/**
 * StatCard component for skill detail sidebar
 *
 * Features:
 * - Background: bg-background-subtle rounded-lg p-4
 * - Title: text-xs uppercase text-foreground-muted mb-1
 * - Value: children slot for flexible content
 */
export function StatCard({ title, children }: StatCardProps): ReactNode {
  return (
    <div className="bg-background-subtle rounded-lg p-4">
      <div className="text-xs uppercase text-foreground-muted mb-1 tracking-wide">{title}</div>
      <div className="text-2xl font-mono text-foreground">{children}</div>
    </div>
  );
}
