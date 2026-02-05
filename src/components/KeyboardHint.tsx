'use client';

import { useEffect, useState } from 'react';

interface KeyboardHintItem {
  key: string;
  action: string;
}

interface KeyboardHintProps {
  hints: KeyboardHintItem[];
}

export function KeyboardHint({ hints }: KeyboardHintProps) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setOpacity(0.5);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setOpacity(1);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      data-testid="keyboard-hint"
      className="hidden md:flex fixed bottom-4 left-4 gap-4 text-xs text-foreground-muted transition-opacity duration-300"
      style={{ opacity }}
    >
      {hints.map((hint) => (
        <div key={hint.key} className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-background-subtle rounded border border-border font-mono">
            {hint.key}
          </kbd>
          <span>{hint.action}</span>
        </div>
      ))}
    </div>
  );
}
