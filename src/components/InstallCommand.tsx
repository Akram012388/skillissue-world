'use client';

import type { ReactNode } from 'react';
import { CopyButton } from './CopyButton';

interface InstallCommandProps {
  command: string;
  onCopied?: () => void;
  className?: string;
}

/**
 * InstallCommand component matching skills.sh design
 *
 * Features:
 * - Translucent background (bg-background-subtle/80)
 * - Monospace font
 * - $ prefix in muted color
 * - CopyButton on the right
 */
export function InstallCommand({
  command,
  onCopied,
  className = '',
}: InstallCommandProps): ReactNode {
  return (
    <div
      className={`flex items-center gap-3 bg-background-subtle/80 rounded-md px-4 py-3 font-mono text-sm ${className}`}
    >
      <span className="text-foreground-muted select-none" aria-hidden="true">
        $
      </span>
      <code className="flex-1 text-foreground overflow-x-auto whitespace-nowrap">{command}</code>
      <CopyButton text={command} onCopied={onCopied} size="sm" />
    </div>
  );
}
