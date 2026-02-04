'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Breadcrumb component matching skills.sh navigation pattern
 * Pattern: skills / [org] / [repo] / [skill-name]
 */

export interface BreadcrumbSegment {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

export function Breadcrumb({ segments, className = '' }: BreadcrumbProps): ReactNode {
  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className={`text-sm text-foreground-muted mb-6 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-foreground-muted select-none" aria-hidden="true">
                /
              </span>
            )}
            {index === segments.length - 1 ? (
              // Last segment: current page, not a link
              <span className="text-foreground" aria-current="page">
                {segment.label}
              </span>
            ) : (
              // Intermediate segment: clickable link
              <Link href={segment.href} className="hover:text-foreground transition-colors">
                {segment.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Helper to build breadcrumb segments from route params
 */
export function buildBreadcrumbs(org?: string, repo?: string, skill?: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [{ label: 'skills', href: '/' }];

  if (org) {
    segments.push({ label: org, href: `/${org}` });
  }

  if (org && repo) {
    segments.push({ label: repo, href: `/${org}/${repo}` });
  }

  if (org && repo && skill) {
    segments.push({ label: skill, href: `/${org}/${repo}/${skill}` });
  }

  return segments;
}
