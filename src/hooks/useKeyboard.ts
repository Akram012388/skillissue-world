'use client';

import { useCallback, useEffect } from 'react';
import type { AgentType, Skill } from '@/types';
import { getInstallCommand } from '@/types';

interface UseKeyboardOptions {
  skills: Skill[];
  selectedIndex: number;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  selectedAgent: AgentType;
  searchRef: React.RefObject<HTMLInputElement | null>;
  onCopy?: () => void;
  onClear?: () => void;
}

interface UseKeyboardReturn {
  handleKeyDown: (e: KeyboardEvent) => void;
}

/**
 * Global keyboard shortcuts hook
 *
 * Global shortcuts:
 * '/' → focus search
 * 'Escape' → clear search, blur
 *
 * Skill-context shortcuts (when skill selected):
 * 'c' → copy command
 * 'g' → open repo
 * '↑' → previous skill
 * '↓' → next skill
 * 'Enter' → navigate to skill
 */
export function useKeyboard({
  skills,
  selectedIndex,
  setSelectedIndex,
  selectedAgent,
  searchRef,
  onCopy,
  onClear,
}: UseKeyboardOptions): UseKeyboardReturn {
  const isTyping = useCallback((): boolean => {
    const activeElement = document.activeElement;
    if (!activeElement) {
      return false;
    }

    const tagName = activeElement.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
      return true;
    }
    if ((activeElement as HTMLElement).isContentEditable) {
      return true;
    }

    return false;
  }, []);

  const focusSearch = useCallback(() => {
    searchRef.current?.focus();
  }, [searchRef]);

  const blurSearch = useCallback(() => {
    searchRef.current?.blur();
  }, [searchRef]);

  const copyCommand = useCallback(async () => {
    const skill = skills[selectedIndex];
    if (!skill) {
      return;
    }

    const command = getInstallCommand(skill, selectedAgent);
    try {
      await navigator.clipboard.writeText(command);
      onCopy?.();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [skills, selectedIndex, selectedAgent, onCopy]);

  const openRepo = useCallback(() => {
    const skill = skills[selectedIndex];
    if (!skill) {
      return;
    }

    window.open(skill.repoUrl, '_blank', 'noopener,noreferrer');
  }, [skills, selectedIndex]);

  const navigateToSkill = useCallback(() => {
    const skill = skills[selectedIndex];
    if (!skill) {
      return;
    }

    window.location.href = `/skill/${skill.slug}`;
  }, [skills, selectedIndex]);

  const navigateUp = useCallback(() => {
    if (skills.length === 0) {
      return;
    }
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : skills.length - 1));
  }, [skills.length, setSelectedIndex]);

  const navigateDown = useCallback(() => {
    if (skills.length === 0) {
      return;
    }
    setSelectedIndex((prev) => (prev < skills.length - 1 ? prev + 1 : 0));
  }, [skills.length, setSelectedIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const typing = isTyping();

      // Global shortcuts that work even when typing
      if (e.key === 'Escape') {
        e.preventDefault();
        blurSearch();
        onClear?.();
        return;
      }

      // '/' focuses search unless already in an input
      if (e.key === '/' && !typing) {
        e.preventDefault();
        focusSearch();
        return;
      }

      // Skip other shortcuts when typing
      if (typing) {
        return;
      }

      // Skill-context shortcuts
      switch (e.key) {
        case 'c':
          e.preventDefault();
          copyCommand();
          break;
        case 'g':
          e.preventDefault();
          openRepo();
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateDown();
          break;
        case 'Enter':
          e.preventDefault();
          navigateToSkill();
          break;
      }
    },
    [
      isTyping,
      blurSearch,
      onClear,
      focusSearch,
      copyCommand,
      openRepo,
      navigateUp,
      navigateDown,
      navigateToSkill,
    ],
  );

  // Attach global keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { handleKeyDown };
}
