'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { NAV_LINKS } from '@/lib/constants';

/**
 * Header component matching skills.sh exactly
 * Sticky header with logo, brand name, and navigation
 */

interface HeaderProps {
  className?: string;
}

function SkillsLogo(): ReactNode {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
      aria-hidden="true"
    >
      <path d="M10 0L20 17.32H0L10 0Z" fill="currentColor" />
    </svg>
  );
}

export function Header({ className = '' }: HeaderProps): ReactNode {
  return (
    <header className={`sticky top-0 z-50 bg-background border-b border-border ${className}`}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-foreground-muted transition-colors"
            aria-label="Skills home"
          >
            <SkillsLogo />
          </Link>

          <span className="text-foreground-muted select-none" aria-hidden="true">
            |
          </span>

          <Link
            href="/"
            className="text-sm font-medium text-foreground hover:text-foreground-muted transition-colors"
          >
            Skills
          </Link>
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
